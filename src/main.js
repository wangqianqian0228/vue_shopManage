import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/reset.css'
import './assets/css/common.css'
import axios from 'axios'
import moment from 'moment'
// 配置请求的根路径
axios.defaults.baseURL = `http://127.0.0.1:8888/api/private/v1/`
// 挂载到vue上，vue所有的组件就可以用$http这个方法

// 在调用axios之前，通过axios请求拦截器添加token
axios.interceptors.request.use((config) => {
  //  console.log(config)
  // config包含header这个子对象,
  // 给这个子对象添加一个Authorization字段，存储令牌

  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config);
  return config
})

Vue.prototype.$http = axios;
Vue.config.productionTip = false

// 时间过滤器
Vue.filter("dateString", function (value, format) {
  return moment.unix(parseInt(value)).format(format || "YYYY-MM-DD");
  // 自己传的参数format有的话，自定义的格式优先，没有的话，就是函数里面的格式优先
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')