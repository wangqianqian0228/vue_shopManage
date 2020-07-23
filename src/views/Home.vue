<!-- 主页面组件:是有权限的，只有在登陆的情况下，
也就是token存在的情况下，才会被访问 -->

<template>
  <el-container>
    <el-header>
      <div class="logo">
        <router-link to="/home">
          <img src="../assets/imgs/heima.png" alt="" />
          <span>电商后台管理系统</span>
        </router-link>
      </div>
      <el-button type="primary" @click="loginOut" icon="el-icon-switch-button">退出</el-button>
      
    </el-header>
    <el-container>
      <el-aside :width="hideWidth">
        <div class="btn" @click="hideList">|||</div>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409Bff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
        >
        <!-- router设置为true，则二级菜单以 相应的index的值作为 path 进行路由跳转 -->
        <!-- collapse:菜单栏是否折叠 -->
        <!-- collapse-transition：折叠动画是否开启 -->
          <el-submenu
            :index="index + ''"
            v-for="(item, index) in menuList"
            :key="item.id"
          >
            <!-- 因为每一项的 item.id的唯一性，
          可以根据唯一性一一对应的关系，来给i元素设置不同的类名-->
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/home'+'/'+subitem.path + ''"
              v-for="subitem in item.children"
              :key="subitem.id"
              ><i :class="subiconObj[subitem.id]"></i>
              <span>{{ subitem.authName }}</span></el-menu-item
            >
            <!-- 由于subitem.path没有'/'，所以需要自己手动加上 -->
          </el-submenu>
        </el-menu></el-aside
      >
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>

    <el-footer>版权信息</el-footer>
  </el-container>
</template>

<script>

export default {
  data() {
    return {
      menuList: [],
      iconObj: {
        "125": "iconfont icondrxx10",
        "103": "iconfont iconpermission",
        "101": "iconfont iconshangpinguanlix",
        "102": "iconfont icondingdanguanli",
        "145": "iconfont iconkujialeqiyezhan_shujutongji",
      },
      subiconObj: {
        "110": "iconfont iconico- iconcolor",
        "111": "iconfont iconjiaoseliebiao iconcolor",
        "112": "iconfont iconpermissions-list iconcolor",
        "104": "iconfont iconshangpinliebiao iconcolor",
        "115": "iconfont iconfenlei iconcolor",
        "121": "iconfont iconshangpinfenlei iconcolor",
        "107": "iconfont icondingdan- iconcolor",
        "146": "iconfont iconshujubaobiao iconcolor",
      },
      isCollapse: false,
      hideWidth: "200px",
    };
  },
  created() {
    this.getMenu();
  },
  components: {},

  computed: {},

  mounted() {},

  // 退出功能：清空window.sessionStorage，并将路由路径转换为/login
  methods: {
    loginOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenu() {
      // console.log(await this.$http.get("menus"));
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.menuList = res.data;
      // 得到了数据
      // console.log(this.menuList);
    },
    // 点击按钮实现菜单的隐藏与显示
    hideList() {
      this.isCollapse = !this.isCollapse;
      this.hideWidth = this.isCollapse ? "64px" : "200px";
    },
  },
};
</script>
<style scoped>
.el-container {
  height: 100%;
  color: #fff;
}
.el-header,
.el-footer {
  background-color: #373d41;
}

.el-footer {
  height: 40px !important;
  text-align: center;
  line-height: 40px;
}
.el-button{
  padding: 7px;
}
.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.el-header a {
  display: flex;
  align-items: center;
}
.logo {
  display: flex;
  align-items: center;
  font-size: 20px;
}
.logo span {
  margin-left: 20px;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  color: #1296db;
  margin-right: 15px;
}
.iconcolor {
  color: #7dc5eb;
}
.el-menu {
  border-right: 0;
}
.btn {
  background-color: #4a5064;
  line-height: 24px;
  font-size: 8px;
  text-align: center;
  cursor: pointer;
  /* 字与字之间的距离 */
  letter-spacing: 0.2em;
}
</style>
