/* @flow */

import {
  tip,
  toArray,
  hyphenate,
  formatComponentName,
  invokeWithErrorHandling
} from '../util/index'
import { updateListeners } from '../vdom/helpers/index'

export function initEvents (vm: Component) {
  // 在实例上添加一个_events对象，存放自定义事件
  vm._events = Object.create(null)
  // 用于判断该实例是否存在HookEvent事件
  vm._hasHookEvent = false
  // init parent attached events
  const listeners = vm.$options._parentListeners //组件上绑定的自定义事件
  if (listeners) {
    updateComponentListeners(vm, listeners)
  }
}

let target: any

// 添加事件，调用$on，添加到_events中
function add (event, fn) {
  target.$on(event, fn)
}

// 移除事件，调用$off，从_events中移除
function remove (event, fn) {
  target.$off(event, fn)
}

// 创建执行一次的事件
function createOnceHandler (event, fn) {
  const _target = target
  return function onceHandler () {
    const res = fn.apply(null, arguments) //执行该事件
    if (res !== null) {
      // 执行完后调用$off从_events移除
      _target.$off(event, onceHandler)
    }
  }
}

// 创建组件上的自定义事件
export function updateComponentListeners (
  vm: Component,
  listeners: Object,
  oldListeners: ?Object
) {
  target = vm
  // 调用updateListeners，添加事件到标签上
  updateListeners(listeners, oldListeners || {}, add, remove, createOnceHandler, vm)
  target = undefined
}

export function eventsMixin (Vue: Class<Component>) {
  // 用于判断是否是自定义hook事件
  const hookRE = /^hook:/
  /*
    $on使用方法，
    this.$on("xxx",()=>{})
    this.$on(["xxx","xxx"],()=>{})
    $on将自定义事件添加到_events对象中
  */
  Vue.prototype.$on = function (event: string | Array<string>, fn: Function): Component {
    const vm: Component = this
    // 如果是数组
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        // 递归调用$on
        vm.$on(event[i], fn)
      }
    } else {
      /*
        _events存放实例的自定义事件，格式如下
        vm._event = { 
          "自定义事件名": [fn1, ...], 
          ... 
        }
        如果_events存在该自定义事件，则直接将回调函数push进去
        如果_events不存在该自定义事件，则创建一个新数组，将回调函数push进去
      */
      (vm._events[event] || (vm._events[event] = [])).push(fn)
      // 如果该自定义事件已hook:开头，则将实例的_hasHookEvent置为true
      if (hookRE.test(event)) {
        vm._hasHookEvent = true
      }
    }
    return vm
  }

  // $once绑定的自定义事件，只触发一次就清除了该回调
  Vue.prototype.$once = function (event: string, fn: Function): Component {
    const vm: Component = this
    // 传入的回调进行一层包装，执行完该函数，会使用$off进行该包装函数
    function on () {
      // 使用$off移除该包装函数
      vm.$off(event, on)
      // 调用传入的回调
      fn.apply(vm, arguments)
    }
    // 将传入的回调，添加到on上面，
    // 用户使用$off移除时，指定的回调肯定与传入的fn是同一个回调，
    // 但是fn与包装的回调不相等，所以需要将fn添加到包装回调上面，$off移除时用来进行判断
    on.fn = fn 
    // 使用$on来绑定该包装回调
    vm.$on(event, on)
    return vm
  }

  /*
    $off用法
    1.如果没有提供参数，则移除所有的事件监听器；
    2.如果只提供了事件，则移除该事件所有的监听器；
    3.如果同时提供了事件与回调，则只移除这个回调的监听器。
  */
  Vue.prototype.$off = function (event?: string | Array<string>, fn?: Function): Component {
    const vm: Component = this
    // all
    if (!arguments.length) {
      // 1.没有传参树，清空_events对象
      vm._events = Object.create(null)
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      // 如果是数组，递归调用$off
      for (let i = 0, l = event.length; i < l; i++) {
        vm.$off(event[i], fn)
      }
      return vm
    }
    // specific event
    const cbs = vm._events[event]
    // 如果想要移除的自定义事件不存在_event对象中，直接返回
    if (!cbs) {
      return vm
    }
    if (!fn) {
      // 2.如果没有传递回调函数作为第二个参数
      // 清空该事件的回调
      vm._events[event] = null
      return vm
    }
    // specific handler
    let cb
    let i = cbs.length
    // 遍历该事件的所有回调
    while (i--) {
      cb = cbs[i]
      // 3.如果该回调与传入的回调相等，则移除该回调
      // cb.fn === fn是用来判断$once绑定的回调
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1)
        break
      }
    }
    return vm
  }

  Vue.prototype.$emit = function (event: string): Component {
    const vm: Component = this
    if (process.env.NODE_ENV !== 'production') {
      // 将传入的事件名转为小写
      const lowerCaseEvent = event.toLowerCase()
      // 转为小写后与之前不相等，且存在于_events中
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        // 报一个提示，因为，HTML 属性不区分大小写，所以最好不要使用小驼峰形式的事件名，
        // 而应该使用连字符形式的事件名
        tip(
          `Event "${lowerCaseEvent}" is emitted in component ` +
          `${formatComponentName(vm)} but the handler is registered for "${event}". ` +
          `Note that HTML attributes are case-insensitive and you cannot use ` +
          `v-on to listen to camelCase events when using in-DOM templates. ` +
          `You should probably use "${hyphenate(event)}" instead of "${event}".`
        )
      }
    }
    // 拿到对应的所有回调
    let cbs = vm._events[event]
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs
      // 拿到除事件名的所有参数
      const args = toArray(arguments, 1)
      const info = `event handler for "${event}"`
      for (let i = 0, l = cbs.length; i < l; i++) {
        // 遍历回调，并执行，进行异常处理
        invokeWithErrorHandling(cbs[i], vm, args, vm, info)
      }
    }
    return vm
  }
}
