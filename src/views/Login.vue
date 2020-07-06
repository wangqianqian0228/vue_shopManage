<!--  -->
<template>
  <div class="login-container">
    <div class="main">
      <el-form
        class="login-form"
        :model="loginForm"
        :rules="Loginrules"
        ref="ruleForm"
      >
        <el-form-item
          label="用户名"
          class="el-item"
          label-width="80px"
          prop="username"
        >
          <el-input
            v-model="loginForm.username"
            class="el-input"
            prefix-icon="iconfont iconxingmingyonghumingnicheng"
          >
          </el-input>
        </el-form-item>

        <el-form-item
          label="密码"
          class="el-item"
          label-width="80px"
          prop="password"
        >
          <el-input
            class="el-input"
            v-model="loginForm.password"
            prefix-icon="iconfont iconmima"
            type="password"
          ></el-input>
        </el-form-item>

        <el-form-item class="btns">
          <el-button type="primary" @click="preVertify">登录</el-button>
          <el-button type="info" @click="resetInfo">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import {
//     Message

// } from 'element-ui'

export default {
  data() {
    return {
      // 表单的数据绑定对象
      loginForm: {
        username: "",
        password: "",
      },
      // 表单的验证规则对象
      Loginrules: {
        username: [
          { required: true, message: "请输入正确的用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    resetInfo() {
      // 获得表单的引用对象this.$refs.ruleForm
      this.$refs.ruleForm.resetFields();
    },
    preVertify() {
      // 获得表单的引用对象this.$refs.ruleForm
      // 预验证，查看表单的数据是否符合要求
      // 根据验证得到的结果，看是否发送登录的请求
      this.$refs.ruleForm.validate(async (value) => {
        // 这个回调函数是检测完执行，可根据返回的结果，来看看要不要去发登录请求。
        // console.log(value)
        if (!value) return;
        // 在main.js中安装axios包
        const { data: res } = await this.$http.post("login", this.loginForm);
        // console.log(res);
        const { meta: meta } = res;
        // console.log(meta);
        const mes = meta.msg;
        if (meta.status == 200) {
          // Message({
          //   message: '恭喜你，这是一条成功消息',
          // type: 'success'
          // })
          this.$message({
            message: mes,
            type: "success",
          });
        } else {
          this.$message({
            showClose: true,
            message: mes,
            type: "error",
          });
        }
      });
    },
  },
};
</script>
<style scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
  position: relative;
}
.main {
  width: 550px;
  height: 320px;
  border: 1px solid;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 3px;
  position: relative;
}
.btns {
  display: flex;
  justify-content: center;
  margin: 0;
}
.login-form {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
}
.el-input {
  width: 100%;
  /* padding-left: 30px; */
  box-sizing: border-box;
}
.el-item {
  width: 100%;
  padding-right: 20px;
  box-sizing: border-box;
}

.login-container >>> .el-input__icon {
  margin: 0 10px;
}
.login-container >>> .el-input__inner {
  padding-left: 40px;
}
</style>
