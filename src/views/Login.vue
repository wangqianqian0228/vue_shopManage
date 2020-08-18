<!-- 登陆组件 -->
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
export default {
  data() {
    return {
      // 表单的数据绑定对象
      loginForm: {
        username: "admin",
        password: "123456",
      },
      // 表单的验证规则对象
      Loginrules: {
        // 验证用户名规则
        username: [
          { required: true, message: "请输入正确的用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        // 验证密码规则
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
        // const res = this.$http.post('login',this.loginForm)
        const { data: res } = await this.$http.post("login", this.loginForm);
        // console.log(this.$http.post("login", this.loginForm).then(function(value){
        //   console.log(value.data)
        //   // value.data得到真是的数据
        // }))
        // console.log(res);
        // console.log(await this.$http.post("login", this.loginForm))
        const { meta: meta } = res;
        // console.log(meta);
        const mes = meta.msg;
        if (meta.status == 200) {
          // Message({
          //   message: '恭喜你，这是一条成功消息',
          // type: 'success'
          // })
          // this.$message({
          //   message: mes,
          //   type: "success",
          // });
          this._remind(mes)
          // 1. 将登陆之后产生的token，存放在客户端的sessionStorage里面，
          //   1.1 因为token是在当前网站打开期间有效，
          //   1.2 项目中除了登陆接口以外，其余的API接口，必须在登陆之后才能访问。
          // 2. 通过编程式导航，跳转到后台主页，路由地址是/home
          // console.log(res.data);
          // 登录成功会返回一个res.data.token数据，将其存储起来
          window.sessionStorage.setItem('token',res.data.token);
          // window.sessionStorage.setItem('token',res.data.token)
          this.$router.push('/home');
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
