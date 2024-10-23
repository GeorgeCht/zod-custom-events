import { z } from 'zod'
import { createPipeline } from '../src/middleware'

import type { Middleware, Pipeline } from '../src/middleware'

describe('Middleware Pipeline', () => {
  const TestSchema = z.object({
    id: z.number(),
    name: z.string(),
  })

  type TestType = z.infer<typeof TestSchema>

  let pipeline: Pipeline<typeof TestSchema>
  let context: { payload: TestType }

  beforeEach(() => {
    pipeline = createPipeline<typeof TestSchema>()
    context = {
      payload: {
        id: 1,
        name: 'Test',
      },
    }
  })

  it('should create a pipeline with push and execute methods', () => {
    expect(pipeline).toHaveProperty('push')
    expect(pipeline).toHaveProperty('execute')
  })

  it('should execute middleware in the correct order', async () => {
    const order: Array<number> = []
    const middleware1: Middleware<typeof TestSchema> = async (_, next) => {
      order.push(1)
      await next()
      order.push(4)
    }
    const middleware2: Middleware<typeof TestSchema> = async (_, next) => {
      order.push(2)
      await next()
      order.push(3)
    }

    pipeline.push(middleware1, middleware2)
    await pipeline.execute(context)

    expect(order).toEqual([1, 2, 3, 4])
  })

  it('should allow adding middleware after creation', async () => {
    const mockMiddleware = jest.fn()
    pipeline.push(mockMiddleware)
    await pipeline.execute(context)
    expect(mockMiddleware).toHaveBeenCalledWith(context, expect.any(Function))
  })

  it('should pass the correct context to middleware', async () => {
    const mockMiddleware = jest.fn()
    pipeline.push(mockMiddleware)
    await pipeline.execute(context)
    expect(mockMiddleware).toHaveBeenCalledWith(context, expect.any(Function))
  })

  it('should allow middleware to modify the context', async () => {
    const modifyingMiddleware: Middleware<typeof TestSchema> = (ctx, next) => {
      ctx.payload.name = 'Modified'
      return next()
    }
    pipeline.push(modifyingMiddleware)
    await pipeline.execute(context)
    expect(context.payload.name).toBe('Modified')
  })

  it('should throw an error if next() is called multiple times', async () => {
    const badMiddleware: Middleware<typeof TestSchema> = async (_, next) => {
      await next()
      await next() // This should throw an error
    }
    pipeline.push(badMiddleware)
    await expect(pipeline.execute(context)).rejects.toThrow(
      'next() called multiple times',
    )
  })

  it('should work with middleware that does not call next()', async () => {
    const terminalMiddleware: Middleware<typeof TestSchema> = () => {
      // This middleware doesn't call next()
    }
    const unreachedMiddleware = jest.fn()
    pipeline.push(terminalMiddleware, unreachedMiddleware)
    await pipeline.execute(context)
    expect(unreachedMiddleware).not.toHaveBeenCalled()
  })
})
