import type { ZodError, ZodSchema } from 'zod'
import type { Middleware, Pipeline } from './middleware'

import { createPipeline } from './middleware'

/**
 * A type-safe extension of the built-in {@link CustomEvent}, with a strongly typed `detail` property.
 *
 * Extends the {@link CustomEvent} interface with a `detail` property of type `T`.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/CustomEvent/detail)
 */
export interface TypedCustomEvent<T> extends CustomEvent<T> {
  readonly detail: T
}

/**
 * Context object for event payload.
 */
interface EventPayloadContext<T> {
  payload: EventPayload<T>
}

/**
 * Context object for error handling.
 */
interface ErrorContext {
  error: ZodError
}

/**
 * Inferred type of the event payload based on the Zod schema.
 */
type EventPayload<T> = T extends ZodSchema<infer U> ? U : never

/**
 * Options for initializing {@link EventController} for a single event.
 */
export interface EventControllerOptions<T extends ZodSchema> {
  /** The element to bind the event to. Defaults to `window`. */
  element?: HTMLElement | Window
  /** Error handler for validation errors. */
  onError?: (ctx: ErrorContext) => void
  /** Callback function called before dispatching the event. */
  onDispatch?: (ctx: EventPayloadContext<T>) => void
  /** Callback function called when the event listener is added. */
  onSubscribe?: () => void
  /** Callback function called when the event listener is removed. */
  onUnsubscribe?: () => void
}

/**
 * A type-safe event controller for a single Zod schema validated event.
 *
 * Supports adding, emitting, and removing the event listener, as well as middleware for event processing.
 */
export class EventController<T extends ZodSchema> {
  private element: HTMLElement | Window | typeof globalThis
  private pipeline: Pipeline<EventPayload<T>>

  private condition?: (payload: EventPayload<T>) => boolean
  private conditionCallback?: (ctx: EventPayloadContext<T>) => void
  private eventListener?: (event: TypedCustomEvent<EventPayload<T>>) => void

  private onError?: (ctx: ErrorContext) => void
  private onDispatch?: (ctx: EventPayloadContext<T>) => void
  private onSubscribe?: () => void
  private onUnsubscribe?: () => void

  /**
   * Creates a new {@link EventController} instance.
   *
   * @param schema - The Zod schema for validating the event payload.
   * @param eventName - The name of the custom event.
   * @param options - Configuration options for the {@link EventController}.
   *
   * @example
   * ```ts
   * import { z } from "zod";
   * import { EventController } from "zod-custom-events";
   *
   * const schema = z.object({
   *   name: z.string(),
   * });
   *
   * const controller = new EventController(schema, "myEvent", {
   *   onError: ({ error }) => console.error("Validation error:", error),
   *   onDispatch: ({ payload }) => console.log("Dispatching event with payload:", payload),
   * });
   * ```
   */
  constructor(
    private schema: T,
    private eventName: string,
    options: EventControllerOptions<T> = {},
  ) {
    this.pipeline = createPipeline()
    this.element = options.element || window
    this.onError = options.onError
    this.onDispatch = options.onDispatch
    this.onSubscribe = options.onSubscribe
    this.onUnsubscribe = options.onUnsubscribe
  }

  /**
   * Adds an event listener for the event.
   *
   * @param listener - The function to be called when the event is triggered.
   * @param options - Optional parameters for the event listener.
   *
   * @example
   * ```ts
   * controller.subscribe((event) => {
   *   console.log("Received user event:", event.detail);
   * });
   * ```
   */
  subscribe(
    listener: (event: TypedCustomEvent<EventPayload<T>>) => void,
    options?: AddEventListenerOptions,
  ): void {
    const eventListener = (event: Event) =>
      listener(event as TypedCustomEvent<EventPayload<T>>)

    this.onSubscribe?.()
    this.element.addEventListener(this.eventName, eventListener, options)
    this.eventListener = eventListener
  }

  /**
   * Removes the previously registered event listener for the event.
   *
   * @param options - Optional parameters to match the event listener.
   *
   * @example
   * ```ts
   * controller.unsubscribe();
   * ```
   */
  unsubscribe(options?: EventListenerOptions): void {
    if (this.eventListener) {
      this.element.removeEventListener(
        this.eventName,
        this.eventListener as EventListenerOrEventListenerObject,
        options,
      )

      this.onUnsubscribe?.()
      this.eventListener = undefined
    }
  }

  /**
   * Dispatches the event, validating its payload using the Zod schema and applying middleware.
   *
   * @param payload - The data associated with the event.
   * @param eventInitDict - Optional parameters for initializing the event.
   * @throws {Error} If the payload is invalid and no onError callback is provided.
   *
   * @example
   * ```ts
   * controller.dispatch({
   *   id: 1,
   *   name: "John Doe",
   * });
   * ```
   */
  async dispatch(
    payload: EventPayload<T>,
    eventInitDict: CustomEventInit<EventPayload<T>> = {},
  ): Promise<void> {
    const validation = this.schema.safeParse(payload)

    if (!validation.success) {
      if (this.onError) {
        this.onError({ error: validation.error })
      } else {
        throw new Error(validation.error.message)
      }
      return
    }

    if (this.condition && !this.condition(payload)) {
      if (this.conditionCallback) {
        this.conditionCallback({ payload })
      }
      return
    }

    const ctx: EventPayloadContext<T> = { payload }

    await this.pipeline.execute(ctx)

    this.onDispatch?.(ctx)

    const event = new CustomEvent<typeof payload>(this.eventName, {
      detail: payload,
      bubbles: eventInitDict.bubbles ?? false,
      cancelable: eventInitDict.cancelable,
    })

    this.element.dispatchEvent(event)
  }

  /**
   * Sets a condition for the event, allowing control over whether the event is dispatched.
   *
   * @param condition - A function that takes the event payload as input and returns a boolean.
   * @param callback - An optional callback function to be called when the condition is not met.
   *
   * @example
   * ```ts
   * controller.refine(
   *   (payload) => payload.id > 0,
   *   (ctx) => {
   *     const { payload } = ctx;
   *     console.log("Invalid user ID:", payload.id)
   *   }
   * );
   * ```
   */
  refine(
    condition: (payload: EventPayload<T>) => boolean,
    callback?: (ctx: EventPayloadContext<T>) => void,
  ): void {
    this.condition = condition
    this.conditionCallback = callback
  }

  /**
   * Updates the {@link EventController} options.
   *
   * @param options - New configuration options for the EventController.
   *
   * @example
   * ```ts
   * const controller = new EventController(schema, "myEvent");
   *
   * // Later in the code
   * controller.update({
   *   onError: ({ error }) => console.warn("New error handler:", error),
   *   onDispatch: ({ payload }) => console.log("New dispatch handler:", payload),
   * });
   * ```
   */
  update(options: Partial<EventControllerOptions<T>>): void {
    Object.assign(this, options)
  }

  /**
   * Adds a middleware function to the event processing pipeline.
   *
   * Must call the `next()` function.
   *
   * @param middleware - A function that processes the event context and calls the next middleware.
   *
   * @example
   * ```ts
   * controller.use(async (ctx, next) => {
   *   console.log("Processing user event:", ctx.payload);
   *   await next();
   *   console.log("User event processed");
   * });
   * ```
   */
  use(middleware: Middleware<EventPayload<T>>): void {
    this.pipeline.push(middleware)
  }
}
