<!-- 主页面组件:是有权限的，只有在登陆的情况下，
也就是token存在的情况下，才会被访问 -->

<template>
  <div>
    <el-button type="info" @click="loginOut">退出</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
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
  },
};
</script>
<style scoped></style>
