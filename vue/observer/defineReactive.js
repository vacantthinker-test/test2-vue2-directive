import {observe} from "./observe";
import {Dep} from "./Dep";

export function defineReactive(obj, key, val) {
  const dep = new Dep();
  
  let childOb = observe(val);
  Object.defineProperty(obj, key, {
    get() {
      // console.log('getter: ' + key);
      // console.log(val)
      dep.depend();
      if (childOb) {
        childOb.dep.depend();
      }
      return val;
    },
    set(newValue) {
      // console.log('setter: ' + key + '')
      // console.log(newValue)
      if (newValue === val) return;
      
      val = newValue;
      childOb = observe(val);
      dep.notify();
    }
  })
}