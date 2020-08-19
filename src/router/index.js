import Vue from 'vue'
import VueRouter from 'vue-router'
// 按需加载路由
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/Login.vue')
// import Login from '../views/Login.vue'
// import Home from '../views/Home.vue'
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/Home.vue')
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/Welcome.vue')
// import Welcome from '../views/Welcome.vue'
// import User from '../views/users/Users.vue'
const User = () => import(/* webpackChunkName: "User" */ '../views/users/Users.vue')
const Rights = () => import(/* webpackChunkName: "Rights_Roles" */ '../views/rights/Rights.vue')
const Roles = () => import(/* webpackChunkName: "Rights_Roles" */ '../views/rights/Roles.vue')
const Categories = () => import(/* webpackChunkName: "Categories-Params-Goods-Addgoods" */ '../views/categories/Categories.vue')
const Params = () => import(/* webpackChunkName: "Categories_Params_Goods_Addgoods" */ '../views/categories/Params.vue')
const Goods = () => import(/* webpackChunkName: "Categories_Params_Goods_Addgoods" */ '../views/categories/Goods.vue')
const Addgoods = () => import(/* webpackChunkName: "Categories_Params_Goods_Addgoods" */ '../views/categories/Addgoods.vue')
const Order = () => import(/* webpackChunkName: "Order" */ '../views/orders/Order.vue')
const Report = () => import(/* webpackChunkName: "Order" */ '../views/report/Report.vue')

// import Rights from '../views/rights/Rights.vue'
// import Roles from '../views/rights/Roles.vue'
// import Categories from '../views/categories/Categories.vue'
// import Params from '../views/categories/Params.vue'

// import Goods from '../views/categories/Goods.vue'
// import Addgoods from '../views/categories/Addgoods.vue'
// import Order from '../views/orders/Order.vue'
// import Report from '../views/report/Report.vue'

Vue.use(VueRouter)
// const originalPush = VueRouter.prototype.push
//    VueRouter.prototype.push = function push(location) {
//    return originalPush.call(this, location).catch(err => err)
// }
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
      // 路由重定向
      component: Home,
      children: [{
        path: '/welcome',
        component: Welcome
      }, {
        path: '/users',
        component: User
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/goods',
        component: Goods
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/addgoods',
        component: Addgoods
      },
      {
        path: '/orders',
        component: Order
      },
      {
        path: '/reports',
        component: Report
      }


    ]
    }
  ]
})
// 挂载路由守航
router.beforeEach((to, from, next) => {
  // console.log(to)
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