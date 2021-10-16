import {def} from "./utils";
import {defineArray} from "./defineArray";
import {observe} from "./observe";
import {defineReactive} from "./defineReactive";
import {Dep} from "./Dep";

export class Observer {
  constructor(value) {
    this.dep = new Dep();
    def(value, '__ob__', this, false);
    if (Array.isArray(value)) {
      defineArray(value)
      this.observeArray(value)
    } else {
      this.walk(value);
    }
  }
  
  observeArray(arr) {
    for (let i = 0; i < arr.length; i++) {
      observe(arr[i])
    }
  }
  
  walk(obj) {
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let value = obj[key];
      // console.log(obj, key, value)
      defineReactive(obj, key, value)
    }
  }
}
