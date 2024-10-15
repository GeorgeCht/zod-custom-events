import { z } from 'zod'
import { EventController } from '../src'

describe('EventController Initialization and Basic Functionality', () => {
  const schema = z.object({ name: z.string() })

  test('should create an EventController with a valid Zod schema', () => {
    const controller = new EventController(schema, 'testEvent')
    expect(controller).toBeInstanceOf(EventController)
  })

  test('default initialized element should be `window`', () => {
    const controller = new EventController(schema, 'testEvent')
    expect(controller['element']).toBe(window)
  })

  test('should create an EventController with custom element', () => {
    const element = document.createElement('div')
    const controller = new EventController(schema, 'testEvent', { element })
    expect(controller['element']).toBe(element)
  })

  test('should update options.onError after initialization', () => {
    const controller = new EventController(schema, 'testEvent')
    const onError = jest.fn()
    controller.update({ onError })
    expect(controller['onError']).toBe(onError)
  })

  test('should update options.onDispatch after initialization', () => {
    const controller = new EventController(schema, 'testEvent')
    const onDispatch = jest.fn()
    controller.update({ onDispatch })
    expect(controller['onDispatch']).toBe(onDispatch)
  })

  test('should update options.onSubscribe after initialization', () => {
    const controller = new EventController(schema, 'testEvent')
    const onSubscribe = jest.fn()
    controller.update({ onSubscribe })
    expect(controller['onSubscribe']).toBe(onSubscribe)
  })

  test('should update options.onUnsubscribe after initialization', () => {
    const controller = new EventController(schema, 'testEvent')
    const onUnsubscribe = jest.fn()
    controller.update({ onUnsubscribe })
    expect(controller['onUnsubscribe']).toBe(onUnsubscribe)
  })
})
