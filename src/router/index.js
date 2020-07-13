import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'
import User from '../views/users/Users.vue'
import Rights from '../views/rights/Rights.vue'
import Roles from '../views/rights/Roles.vue'
import Categories from '../views/categories/Categories.vue'
import Params from '../views/categories/Params.vue'
import Goods from '../views/categories/Goods.vue'

Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}
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
      redirect: '/welcome',
      component: Home,
      children: [{
        path: '/welcome',
        component: Welcome
      }, {
        path: '/home/users',
        component: User
      },
      {
        path: '/home/rights',
        component: Rights
      },
      {
        path: '/home/roles',
        component: Roles
      },
      {
        path: '/home/goods',
        component: Goods
      },
      {
        path: '/home/params',
        component: Params
      },
      {
        path: '/home/categories',
        component: Categories
      }
    ]
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