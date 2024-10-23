import { z } from 'zod'
import { EventController } from '../src'

describe('EventController Event Dispatching', () => {
  const schema = z.object({ name: z.string() })
  let controller: EventController<typeof schema>

  beforeEach(() => {
    controller = new EventController(schema, 'testEvent')
  })

  test('should dispatch an event with valid payload', async () => {
    const listener = jest.fn()
    controller.subscribe(listener)
    await controller.dispatch({ name: 'Test' })
    expect(listener).toHaveBeenCalledWith(expect.any(CustomEvent))
  })

  test('should not dispatch an event with invalid payload', async () => {
    const listener = jest.fn()
    controller.subscribe(listener)
    await expect(controller.dispatch({ name: 123 } as any)).rejects.toThrow()
    expect(listener).not.toHaveBeenCalled()
  })

  test('should dispatch event with bubbling', async () => {
    const listener = jest.fn()
    controller.subscribe(listener)
    await controller.dispatch({ name: 'Test' }, { bubbles: true })
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ bubbles: true }),
    )
  })

  test('should dispatch event with cancellation', async () => {
    const listener = jest.fn()
    controller.subscribe(listener)
    await controller.dispatch({ name: 'Test' }, { cancelable: true })
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: true }),
    )
  })
})
