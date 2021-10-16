let uid = 0

export class Dep {
  static target;
  
  constructor() {
    this.id = uid++
    this.subs = []
  }
  
  addSub(sub) {
    this.subs.push(sub)
  }
  
  depend() {
    // console.log('depend')
    if (Dep.target && this.subs.indexOf(Dep.target) === -1) {
      this.addSub(Dep.target)
    }
    // console.log(this.subs)
  }
  
  notify() {
    // console.log('notify', this.subs.length)
    let watchers = this.subs.slice();
    // watchers.forEach(watch => watch.update())
    for (let i = 0; i < watchers.length; i++) {
      let watcher = watchers[i]
      watcher.update()
      // console.log('watcher update')
    }
  }
}