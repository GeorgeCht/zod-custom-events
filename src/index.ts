/**
 * @module
 *
 * Type safe, framework agnostic, Zod based, custom events extension library.
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
export * from './core'
export type { Middleware } from './middleware'
