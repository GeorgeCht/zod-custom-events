import { z } from 'zod'
import { EventController } from '../src'

describe('EventController Refinement', () => {
  const schema = z.object({ value: z.number() })
  let controller: EventController<typeof schema>

  beforeEach(() => {
    controller = new EventController(schema, 'testEvent')
  })

  afterEach(() => {
    controller.unsubscribe()
    controller.update({})
  })

  test('should apply refinement condition', async () => {
    controller.refine((payload) => payload.value > 0)
    const listener = jest.fn()
    controller.subscribe(listener)
    await controller.dispatch({ value: 10 })
    await controller.dispatch({ value: -5 })
    expect(listener).toHaveBeenCalledTimes(1)
  })

  test('should execute refinement callback when condition is not met', async () => {
    const callback = jest.fn()
    controller.refine((payload) => payload.value > 0, callback)
    await controller.dispatch({ value: -5 })
    expect(callback).toHaveBeenCalled()
  })
})
