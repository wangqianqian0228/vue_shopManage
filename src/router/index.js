import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
      path: '/login',
      component: Login
    }, {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/home',
      component: Home
    }
  ]
})
// 挂载路由守航
router.beforeEach((to, from, next) => {
  // console.log(to.path)
  // to表示将要去往的路径，用to.path()来查看将要访问的路径
  if (to.path == '/login') {
    return next()
    //  直接执行next()函数，并退出函数体，使用return
  }
  const tokenString = window.sessionStorage.getItem('token')
  if (!tokenString) {
    // 强制转换到/login路径
    return next('/login')
  }
  next();
})
// 将路由暴露出去
export default router