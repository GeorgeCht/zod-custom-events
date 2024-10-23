import { z } from 'zod'
import { EventController } from '../src'

describe('EventController Lifecycle Callbacks', () => {
  const schema = z.object({ name: z.string() })

  test('should execute onError callback when dispatching invalid payload', async () => {
    const onError = jest.fn()
    const controller = new EventController(schema, 'testEvent', { onError })
    await controller.dispatch({ name: 123 } as any)
    expect(onError).toHaveBeenCalled()
  })

  test('should execute onDispatch callback before dispatching event', async () => {
    const onDispatch = jest.fn()
    const controller = new EventController(schema, 'testEvent', { onDispatch })
    await controller.dispatch({ name: 'Test' })
    expect(onDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: { name: 'Test' },
      }),
    )
  })

  test('should execute onSubscribe callback when subscribing', () => {
    const onSubscribe = jest.fn()
    const controller = new EventController(schema, 'testEvent', { onSubscribe })
    controller.subscribe(() => {})
    expect(onSubscribe).toHaveBeenCalled()
  })

  test('should execute onUnsubscribe callback when unsubscribing', () => {
    const onUnsubscribe = jest.fn()
    const controller = new EventController(schema, 'testEvent', {
      onUnsubscribe,
    })
    controller.subscribe(() => {})
    controller.unsubscribe()
    expect(onUnsubscribe).toHaveBeenCalled()
  })
})
