import Vue from 'vue'
// 导入element-ui各组件
import { 
    Button, 
    FormItem,
    Form,
    Input,
    Message,
    Container,
    Header,
    Aside,
    Main,
    Footer,
    Menu,
    Submenu,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Pagination

} from 'element-ui'

Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Pagination)

Message.install = function (Vue, options) {
    Vue.prototype.$message = Message
    // vue其他的实例就可以引用这个$message方法
  }
  Vue.use(Message )//消息提示
//  引入组件的时候自动调用Vue.use()方法，Message对象又会自动调用install这个方法
// 把这个Message对象放在vue的原型的上。

// 或者直接挂载到vue上
Vue.prototype.$message = Message;