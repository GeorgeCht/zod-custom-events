import type { ZodSchema } from 'zod'

/**
 * Inferred type of the event payload based on the Zod schema.
 */
type EventPayload<T> = T extends ZodSchema<infer U> ? U : never

/**
 * Context object for event payload.
 */
interface EventPayloadContext<T> {
  payload: EventPayload<T>
}

/**
 * Next function type for middleware.
 */
type Next = () => Promise<void> | void

/**
 * Middleware function type for event processing.
 */
export type Middleware<T> = (
  context: EventPayloadContext<T>,
  next: Next,
) => Promise<void> | void

/**
 * Pipeline class for middleware processing.
 */
export interface Pipeline<T> {
  push: (...middlewares: Array<Middleware<T>>) => void
  execute: (context: EventPayloadContext<T>) => Promise<void>
}

/**
 * Creates a pipeline for middleware processing.
 *
 * @param middlewares - The middleware functions to be executed in order.
 * @returns A Pipeline instance with push and execute methods.
 * @link https://muniftanjim.dev/blog/basic-middleware-pattern-in-javascript/
 * @link https://github.com/koajs/compose/blob/master/index.js#L31-L47
 */
export function createPipeline<T>(
  ...middlewares: Array<Middleware<T>>
): Pipeline<T> {
  const stack: Array<Middleware<T>> = middlewares

  const push: Pipeline<T>['push'] = (...middlewares) => {
    stack.push(...middlewares)
  }

  const execute: Pipeline<T>['execute'] = async (context) => {
    let prevIndex = -1
    const runner = async (index: number): Promise<void> => {
      if (index === prevIndex) {
        throw new Error('next() called multiple times')
      }
      prevIndex = index
      const middleware = stack[index]
      if (middleware) {
        await middleware(context, () => runner(index + 1))
      }
    }
    await runner(0)
  }

  return { push, execute }
}
