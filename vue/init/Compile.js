import {Watcher} from "../observer";

/**
 */
export class Compile {
  constructor(el, vue) {
    // console.log(el)
    this.$el = document.querySelector(el); // #app
    this.$vue = vue;
    this.nameArray = [];
    
    if (this.$el) {
      let $fragment = this.node2fragment(this.$el)
      this.compile($fragment)
      this.$el.appendChild($fragment);
    }
  }
  
  node2fragment(el) {
    let fragment = document.createDocumentFragment();
    let child;
    while ((child = el.firstChild)) {
      fragment.appendChild(child)
    }
    return fragment;
  }
  
  /**
   * 处理大括号, 进行赋值, 并监听
   */
  compile(node) {
    let self = this;
    let regexEmptyStart = /^\s+$/;
    node.childNodes.forEach(node => {
      let type = node.nodeType;
      let textContent = node.textContent;
      let childNodes = node.childNodes;
      
      if (regexEmptyStart.test(textContent)) { // 遇全空字符串, 直接返回. 继续处理下一个
        // console.log(node, node.textContent)
        return;
      }
      
      if (type === 1) {
        self.compileElement(node)
      }
      if (type === 3) {
        self.compileText(node)
      }
      if (childNodes && childNodes.length > 0) {
        self.compile(node); // 有子元素, 并且个数大于0, 递归处理
      }
    })
  }
  
  /**
   * 处理 v-指令
   */
  compileElement(node) {
    let self = this;
    let attributes = node.attributes;
    if (attributes.length === 0) {
      return; // 如果attributes个数为0, 那么直接返回不做任何处理
    }
    
    if (attributes && attributes.length > 0) {
      // console.log(node.tagName.toLowerCase(), node)
      Object.keys(attributes).forEach(index => {
        // console.log(index)
        let attr = attributes[index]; // 解构
        let attrName = attr.name; // 属性名
        let attrValue = attr.value; // 表达式
        
        if (attrName.startsWith('v-')) { // 以 v- 开头 ?
          // console.log(value)
          let typeOfDirective = attrName.substring(2); // 指令-类型
          // console.log(typeOfDirective)
          switch (typeOfDirective) {
            case 'model':
              console.log('检测到model指令')
              // 三步走：
              // 1 初始化 input 输入框的值
              // 2 Watcher监听 data对象的属性值更新 同时 更新 input 输入框 的值
              // 3 input事件监听 获取input输入框的值 更新 data对象的属性值
              
              node.value = self.getVueValue(self.$vue, attrValue);
              new Watcher(self.$vue, attrValue, function (newValue) {
                node.value = newValue;
              }); // 改变 vm.message 时, 输入框也要改变
              node.addEventListener('input', function (e){
                let newValue = e.target.value;
                console.log(`newValue`)
                console.log(newValue)
                self.setVueValue(self.$vue, attrValue, newValue)
              })
              
              // 移除属性 v-model=""
              node.removeAttribute('v-model')
              break
            case 'for':
              
              break
            case 'if':
              
              break
          }
        }
      })
    }
  }
  
  getVueValue(vue, expression) {
    const keys = expression.split('.');
    let obj = vue;
    keys.forEach(key => {
      obj = obj[key]
    })
    return obj;
  }
  setVueValue(vue, expression, value) {
    const keys = expression.split('.');
    let obj = vue;
    keys.forEach((key,index) => {
      if (index < keys.length - 1){
        obj = obj[key]
      }else {
        obj[key] = value;
      }
    })
  }
  
  compileText(node) {
    let self = this;
    let regexHave = /\{\{([\w\s]*)\}\}/; // 如果文本内容不包括 {{}}, 那么不做处理
    let textContent = node.textContent;
    if (regexHave.test(textContent) === false) {
      return;
    }
    
    // console.log(textContent)
    let regexMustache = /([\w\s]*)[\{\{]*([\w\s]*)[\}\}]*/g
    
    if (regexMustache.test(textContent)) {
      let matchArray = textContent.match(regexMustache);
      // console.log(matchArray)
      
      let regexSplit = /([\w\s]*)\{\{([\w\s]*)\}\}/
      
      self.updateTextContent(matchArray, regexSplit, self, node);
      
      // 2监听
      self.nameArray.forEach(name => {
        new Watcher(self.$vue, name, function (value) {
          console.log(value, '新value')
          self.updateTextContent(matchArray, regexSplit, self, node);
          
        })
      })
    }
  }
  
  updateTextContent(matchArray, regexSplit, self, node) {
    let mergeString = ''
    for (let i = 0; i < matchArray.length; i++) {
      let matchOne = matchArray[i]
      // console.log(matchOne)
      if (regexSplit.test(matchOne)) {
        let match = matchOne.match(regexSplit);
        let beforeName = match[1]
        let name = match[2]
        self.nameArray.push(name)
        let value = self.$vue[name]
        
        // console.log(beforeName, name, value)
        let result = beforeName + value;
        // console.log(result)
        mergeString += result;
      } else {
        mergeString += matchOne;
      }
      
    }
    node.textContent = mergeString; // 1解析 {{}}
    // return mergeString;
  }
}





















