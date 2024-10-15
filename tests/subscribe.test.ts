import { z } from 'zod'
import { EventController } from '../src'

describe('EventController Subscriptions', () => {
  const schema = z.object({ name: z.string() })
  let controller: EventController<typeof schema>

  beforeEach(() => {
    controller = new EventController(schema, 'testEvent')
  })

  test('should subscribe to an event', () => {
    const listener = jest.fn()
    controller.subscribe(listener)
    expect(controller['eventListener']).toBeDefined()
  })

  test('should unsubscribe from an event', () => {
    const listener = jest.fn()
    controller.subscribe(listener)
    controller.unsubscribe()
    expect(controller['eventListener']).toBeUndefined()
  })

  test('should allow resubscribing after unsubscribing', () => {
    const listener1 = jest.fn()
    const listener2 = jest.fn()
    controller.subscribe(listener1)
    controller.unsubscribe()
    controller.subscribe(listener2)
    expect(controller['eventListener']).toBeDefined()
  })

  test('should not throw error when unsubscribing without active subscription', () => {
    expect(() => controller.unsubscribe()).not.toThrow()
  })
})
