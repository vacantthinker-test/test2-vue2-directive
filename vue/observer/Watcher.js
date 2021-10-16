import {Dep} from "./Dep";

let uid = 0

export class Watcher {
  constructor(target, expression, callback) {
    // console.log('Watcher constructor called');
    this.id = uid++;
    this.target = target;
    this.getter = parsePath(expression);
    this.callback = callback;
    this.originalValue = this.get();
  }
  
  update() {
    // console.log('update called')
    const newValue = this.get();
    const oldValue = this.originalValue;
    if (newValue !== oldValue) {
      this.originalValue = newValue;
      this.callback.call(this.target, newValue, oldValue)
    }
  }
  
  get() {
    // console.log('Watcher this')
    // console.log(this)
    Dep.target = this;
    let value;
    try {
      value = this.getter(this.target)
      // console.log(`value ${value}`)
    } catch (e) {
      console.log(e)
    } finally {
      Dep.target = null;
    }
    
    return value;
  }
}

function parsePath(expression) {
  const segments = expression.split('.')
  return function (obj) {
    segments.forEach(key => {
      if (!obj) return;
      
      obj = obj[key]
    })
    // console.log('obj')
    // console.log(obj)
    return obj;
  };
}