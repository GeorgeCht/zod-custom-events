import { z } from 'zod'
import { EventController } from '../src'

describe('EventController Advanced Scenarios and Edge Cases', () => {
  test('should handle high-frequency event dispatches', async () => {
    const schema = z.object({ value: z.number() })
    const controller = new EventController(schema, 'testEvent')
    const listener = jest.fn()
    controller.subscribe(listener)

    const dispatches = Array.from({ length: 1000 }, (_, i) => ({ value: i }))
    await Promise.all(dispatches.map((payload) => controller.dispatch(payload)))

    expect(listener).toHaveBeenCalledTimes(1000)
  })

  test('should handle concurrent dispatches from multiple controllers', async () => {
    const schema = z.object({ value: z.number() })
    const controller1 = new EventController(schema, 'testEvent1')
    const controller2 = new EventController(schema, 'testEvent2')

    const listener1 = jest.fn()
    const listener2 = jest.fn()

    controller1.subscribe(listener1)
    controller2.subscribe(listener2)

    await Promise.all([
      controller1.dispatch({ value: 1 }),
      controller2.dispatch({ value: 2 }),
      controller1.dispatch({ value: 3 }),
      controller2.dispatch({ value: 4 }),
    ])

    expect(listener1).toHaveBeenCalledTimes(2)
    expect(listener2).toHaveBeenCalledTimes(2)
  })

  test('should handle recursive schema', async () => {
    type TreeNode = { value: number; children?: TreeNode[] }
    const treeSchema: z.ZodType<TreeNode> = z.lazy(() =>
      z.object({
        value: z.number(),
        children: z.array(treeSchema).optional(),
      }),
    )

    const controller = new EventController(treeSchema, 'treeEvent')
    const listener = jest.fn()
    controller.subscribe(listener)

    await controller.dispatch({
      value: 1,
      children: [{ value: 2 }, { value: 3, children: [{ value: 4 }] }],
    })

    expect(listener).toHaveBeenCalled()
  })

  test('should handle error in middleware without breaking the system', async () => {
    const schema = z.object({ value: z.number() })
    const controller = new EventController(schema, 'testEvent')

    controller.use(() => {
      throw new Error('Middleware error')
    })

    const listener = jest.fn()
    controller.subscribe(listener)

    await expect(controller.dispatch({ value: 1 })).rejects.toThrow(
      'Middleware error',
    )
    expect(listener).not.toHaveBeenCalled()
  })

  test('should prevent multiple calls to next() in middleware', async () => {
    const schema = z.object({ value: z.number() })
    const controller = new EventController(schema, 'testEvent')

    controller.use(async (_, next) => {
      await next()
      await expect(next()).rejects.toThrow('next() called multiple times')
    })

    await controller.dispatch({ value: 1 })
  })
})
