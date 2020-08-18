import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/reset.css'
import './assets/css/common.css'
import axios from 'axios'
import moment from 'moment'
import TreeTable from 'vue-table-with-tree-grid'
// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import echarts from 'echarts'
import _ from 'lodash'
// 在全局中引用
// Add nprogress.js and nprogress.css to your project.
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置请求的根路径
axios.defaults.baseURL = `http://127.0.0.1:8888/api/private/v1/`
// 挂载到vue上，vue所有的组件就可以用$http这个方法

// 在调用axios之前，通过axios请求拦截器添加token

axios.interceptors.request.use((config) => {
  // 在request拦截器中展示进度条 Nprogress.start()
  //  console.log(config)
  // config包含header这个子对象,
  // 给这个子对象添加一个Authorization字段，存储令牌
  Nprogress.start();
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config);
  return config
})
// 在response拦截器中，隐藏进度条Nprogress.done()
axios.interceptors.response.use(config => {
  Nprogress.done();
  return config
})

Vue.config.productionTip = false
Vue.prototype.$http = axios;
// 安装在vue原型上
 Vue.prototype.$echarts = echarts;
 Vue.prototype.$_ = _;


// 使用echart图表步骤：
// 1. 装包npm install echarts --save
// 2. 引入包（在main.js全局引入或者在分组件中按需引入）
// 3. 创建一个函数用来绘制图表，并放在vue的mouted函数下去执行。因为mouted函数是DOM元素已经初始化完毕了
// 4. myChart.setOption(option)，其中的option表示是配置项和数据

// 时间过滤器
Vue.filter("dateString", function (value, format) {
  return moment.unix(parseInt(value)).format(format || "YYYY-MM-DD");
  // 自己传的参数format有的话，自定义的格式优先，没有的话，就是函数里面的格式优先
});
Vue.use(VueQuillEditor, /* { default global options } */ )
// 注册组件
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')