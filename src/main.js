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

/* {
  "id": 30,
  "roleName": "主管",
  "roleDesc": "技术负责人",
  "children": [
    {
      "id": 101,
      "authName": "商品管理",
      "path": "goods",
      "children": [
        {
          "id": 104,
          "authName": "商品列表",
          "path": "goods",
          "children": [
            {
              "id": 116,
              "authName": "商品修改",
              "path": "goods"
            }
          ]
        },

        {
          "id": 115,
          "authName": "分类参数",
          "path": "params",
          "children": [
            {
              "id": 142,
              "authName": "获取参数列表",
              "path": "categories"
            },
            {
              "id": 144,
              "authName": "删除商品参数",
              "path": "categories"
            }
          ]
        },
        {
          "id": 121,
          "authName": "商品分类",
          "path": "categories",
          "children": [
            {
              "id": 122,
              "authName": "添加分类",
              "path": "categories"
            },
            {
              "id": 123,
              "authName": "删除分类",
              "path": "categories"
            },
            {
              "id": 149,
              "authName": "获取分类详情",
              "path": "categories"
            }
          ]
        }
      ]
    },
    {
      "id": 102,
      "authName": "订单管理",
      "path": "orders",
      "children": [
        {
          "id": 107,
          "authName": "订单列表",
          "path": "orders",
          "children": [
            {
              "id": 109,
              "authName": "添加订单",
              "path": "orders"
            }
          ]
        }
      ]
    },
    {
      "id": 103,
      "authName": "权限管理",
      "path": "rights",
      "children": [
        {
          "id": 111,
          "authName": "角色列表",
          "path": "roles",
          "children": [
            {
              "id": 129,
              "authName": "添加角色",
              "path": "roles"
            },
            {
              "id": 130,
              "authName": "删除角色",
              "path": "roles"
            },
            {
              "id": 134,
              "authName": "角色授权",
              "path": "roles"
            },
            {
              "id": 135,
              "authName": "取消角色授权",
              "path": "roles"
            },
            {
              "id": 138,
              "authName": "获取角色列表",
              "path": "roles"
            },
            {
              "id": 139,
              "authName": "获取角色详情",
              "path": "roles"
            },
            {
              "id": 140,
              "authName": "更新角色信息",
              "path": "roles"
            },
            {
              "id": 141,
              "authName": "更新角色权限",
              "path": "roles"
            }
          ]
        },
        {
          "id": 112,
          "authName": "权限列表",
          "path": "rights",
          "children": [
            {
              "id": 147,
              "authName": "查看权限",
              "path": "rights"
            }
          ]
        }
      ]
    },
    {
      "id": 125,
      "authName": "用户管理",
      "path": "users",
      "children": [
        {
          "id": 110,
          "authName": "用户列表",
          "path": "users",
          "children": [
            {
              "id": 131,
              "authName": "添加用户",
              "path": "users"
            },
            {
              "id": 132,
              "authName": "删除用户",
              "path": "users"
            },
            {
              "id": 133,
              "authName": "更新用户",
              "path": "users"
            },
            {
              "id": 136,
              "authName": "获取用户详情",
              "path": "users"
            },
            {
              "id": 137,
              "authName": "分配用户角色",
              "path": "users"
            }
          ]
        }
      ]
    },
    {
      "id": 145,
      "authName": "数据统计",
      "path": "reports",
      "children": [
        {
          "id": 146,
          "authName": "数据报表",
          "path": "reports",
          "children": [
            {
              "id": 148,
              "authName": "查看数据",
              "path": "reports"
            }
          ]
        }
      ]
    }
  ]
} */