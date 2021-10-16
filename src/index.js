import {Vue} from "vue";

document.getElementById('app').innerHTML = `
<div>
    <h3>h3 {{message}} zzz {{message}} yyy</h3>
    <input type="text" v-model="message">
    <br>
    <ul>
        <li>A</li>
        <li>B</li>
        <li>C</li>
        
    </ul>
</div>
`

const vm = new Vue({
  el: '#app',
  data: {
    message: 'me',
    a: 10
  },
  watch: {
    message() {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>')
      console.log('message 更新了')
    },
    a(){
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>')
      console.log('update a ')
    }
  }
})
window.vm = vm;
// vm.message = 'new test message'
// console.log(vm.message);
// vm.watch()














