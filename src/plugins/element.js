import Vue from 'vue'
import { 
    Button, 
    FormItem,
    Form,
    Input,
    Message
    

} from 'element-ui'

Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)

Message.install = function (Vue, options) {
    Vue.prototype.$message = Message
    // vue其他的实例就可以引用这个$message方法
  }
  Vue.use(Message )//消息提示
//  引入组件的时候自动调用Vue.use()方法，Message对象又会自动调用install这个方法
// 把这个Message对象放在vue的原型的上。
