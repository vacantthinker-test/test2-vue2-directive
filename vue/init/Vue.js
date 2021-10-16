import {Compile} from "./Compile";
import {observe, Watcher} from "../observer";

export class Vue {
  constructor(options) {
    this.$options = options;
    this.$el = options.el;
    
    observe(this.$options.data)
    this._initData(); // 挂载data的属性 至 vue实例上, 即vm.message
    this._initWatch(); // 初始化监听
    
    new Compile(this.$el, this); // 编译 拦截再处理
  }
  
  _initData() {
    let self = this;
    Object.keys(self.$options.data).forEach(key => {
      // self.$options.data[key]; 会导致watcher 不监听
      Object.defineProperty(self, key, {
        get() {
          // 从data中获取值
          // vm.a <-- vm.data.a
          return self.$options.data[key]; // 只能在这里使用, 放在上面就会出错...
        },
        set(newValue) {
          self.$options.data[key] = newValue;
        }
      })
    })
  }
  
  _initWatch() {
    let self = this;
    let $watch = self.$options.watch;
    Object.keys($watch).forEach(key => {
      new Watcher(self, key, $watch[key])
    })
  }
}













