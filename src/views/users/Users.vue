<!-- 用户列表-->
<template>
  <div class="user-box">
    getRightsLists

    <!-- 卡片 -->
    <!-- el-row和el-col可以更好地做页面的分栏效果 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row :gutter="30">
          <el-col :span="14"
            ><div class="grid-content bg-purple">
              <el-input
                placeholder="请输入用户名"
                v-model="queryInfo.query"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="getUserList"
                ></el-button>
                <!-- 只要点击了这个搜索按钮，就去执行getUserList这个函数，这个时候input输入框已经与queryInfo.query进行了双向数据绑定 -->
              </el-input>
            </div></el-col
          >
          <el-col :span="10"
            ><div>
              <el-button type="primary" @click="dialogFormVisible = true"
                >添加用户</el-button
              >
            </div></el-col
          >
        </el-row>
      </div>

      <!-- 列表区域 -->
      <el-table :data="userLists" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <!-- 添加索引列 -->
        <el-table-column prop="id" label="ID" width="120"> </el-table-column>

        <el-table-column prop="username" label="用户名" width="120">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" width="120">
        </el-table-column>

        <el-table-column prop="email" label="邮箱" width="200">
        </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column label="创建日期">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateString }}
            <!-- {{scope.row}} -->
          </template>

          <!-- 作用域插槽 :不是直接插入数据，而是对数据进行相关处理的时候
          将通过 scope.row.字段名 来获取相对应的属性值，会覆盖prop对应的值-->

          <!-- 在相应的el-table-column下面插入一个 template，其中
          参数scope是一个对象，来接收当前作用域的数据，scope.row可以输出相应的这一列的信息（对象）
          { "id": 500, "role_name": "超级管理员", "username": "admin", "create_time": 1486720211, "mobile": "12345678", "email": "adsfad@qq.com", "mg_state": true }
          -->
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- {{scope.row.mg_state}} -->
            <!-- change函数什么时候触发？
            switch 状态发生变化时的回调函数 -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="changeState(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edituser(scope.row.id)"
              >编辑
              </el-button>
            <el-button
              type="text"
              size="small"
              @click="deleteUser(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
        <!--  // 根据这个pagesize来分页1 2 3 4  -->
      </el-pagination>
    </el-card>
    <!-- 后一次添加的用户信息 -->
    <el-dialog
      title="添加的用户信息"
      :visible.sync="dialogFormVisible"
      @close="resetAdduser"
    >
      <el-form
        :model="addForm"
        ref="addruleFormRef"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="用户名" label-width="70px" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="70px" prop="password">
          <el-input v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="70px" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
       <!--  <el-form-item label="角色" label-width="70px" prop="role">
          <el-input v-model="addForm.role" autocomplete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="手机号" label-width="70px" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑时候的对话框 -->
    <el-dialog
      title="编辑用户信息"
      :visible.sync="editDialogVisible"
      @close="editFormClosed"
      center
    >
      <el-form
        :model="editForm"
        ref="editruleFormRef"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="用户名" label-width="70px">
          <el-input
            v-model="editForm.username"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="70px" prop="email">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="70px" prop="mobile">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSafe">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      const regemail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if (regemail.test(value)) {
        // 验证传入的值value是否合法
        return callback();
      }
      callback(new Error("请输入正确的邮箱"));
    };
    // 验证手机号的规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/;
      // 验证传入的值value是否合法
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入正确的手机号"));
    };
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        // 查询实现原理：input输入框中的数据与query进行双向数据绑定，然后点击搜索按钮再去后台获取数据。
        query: "",
        // 当前的页数
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 5,
        // 根据这个pagesize来分页1 2 3 4
      },
      dialogTableVisible: false,
      dialogFormVisible: false,
      editDialogVisible: false,
      userLists: [],
      total: 0,
      dialogVisible: false,
      addVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
        mg_state: true,
      },
      editForm: {},
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" },
        ],
        /* role: [{ message: "请输入用户角色", trigger: "blur" }], */
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { validator: checkEmail, trigger: "blur" },
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
        ],
        mobile: [
          { validator: checkMobile, trigger: "blur" },
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getUserList();
  },
  components: {},

  computed: {},

  mounted() {},

  methods: {
    // 对接后台接口，可以先打印看一下具体得到的对象里面有哪些字段，
    // 有哪些是自己要用的。按需解构
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      //   console.log(res.data);
      if (res.meta.status !== 200) {
        return this.$message.error(`${res.meta.msg}`);
      }
      this.userLists = res.data.users;
      //   console.log(this.userLists);
      //   总共有多少条数据
      this.total = res.data.total;
    },
    // 监听页面每页显示多少条的改变的函数
    handleSizeChange(val) {
      //   console.log(`每页 ${val} 条`);
      // 每页显示多少条数据
      this.queryInfo.pagesize = val;
      //   再去发送请求数据
      this.getUserList();
    },
    // 监听当前页码值改变的函数
    handleCurrentChange(val) {
      //   console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getUserList();
    },
    async changeState(newState) {
      // console.log(newState);
      // 这一行的数据的具体信息
      // { "id": 500, "role_name": "超级管理员", "username": "admin", "create_time": 1486720211, "mobile": "12345678", "email": "adsfad@qq.com", "mg_state": true }

      // 运用put方法直接修改了后台数据库的数据
      const { data: res } = await this.$http.put(
        `users/${newState.id}/state/${newState.mg_state}`
      );
      if (res.meta.status !== 200) {
        // 修改失败，则把状态改回来
        newState.mg_state = !newState.mg_state;
        return this.$message.error(res.meta.msg);
      }
      this.$message.success(res.meta.msg);
    },

    resetAdduser() {
      // 相当于重置表单内容:实现原理是将表单对象的内容恢复成初始数据。
      this.$refs.addruleFormRef.resetFields();
    },
    // 添加用户之前先进性预校验
    // 实现表单的预验证
    
    addUser() {
      let obj = { ...this.addForm };
      // console.log(obj);

      // 对话框关闭了，就会调用@close=resetAdduser,从而清空表单数据
      // 所以在关闭对话框之前，可以把数据先存起来

      this.$refs.addruleFormRef.validate(async (value) => {
        if (!value) {
          this.$message.error("用户信息填写失败，请重新填写");
          return;
          //  不实现添加用户逻辑
        }
        //  发起添加用户请求
        // console.log(this.addForm);
        let obj = { ...this.addForm };
        // 把表单数据存起来
        const { data: res } = await this.$http.post("users", obj);
        // console.log(res);
        if (res.meta.status !== 201) {
          this.$message.error(res.meta.msg);
        }
        this.dialogFormVisible = false;
        this.$message.success(res.meta.msg);
        this.getUserList();
      });
    },

    // 根据id查询用户的信息，把数据存储起来，供编辑使用。
    async edituser(id) {
      this.editDialogVisible = true;
      // console.log(id);
      // 根据id来调后台数据
      const { data: res } = await this.$http.get(`users/${id}`);
      // console.log(res);
      // email: "adsfad@qq.com" id: 500 mobile: "12345678" rid: 0 username: "admin"
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      // 把数据存起来
      this.editForm = res.data;
      // console.log(this.editForm);
    },

    // 监听表单关闭时候的事件，将表单数据恢复成初始数据。
    editFormClosed() {
      this.$refs.editruleFormRef.resetFields();
    },

    // 提交表单数据，并发起预验证
    editSafe() {
      let editobj = { ...this.editForm };
      // console.log(editobj);
      this.$refs.editruleFormRef.validate(async (value) => {
        // console.log(value);
        if (!value) {
          this.$message.error("保存用户失败");
          return;
        }
        const { data: res } = await this.$http.put(
          `users/${editobj.id}`,
          editobj
        );
        console.log(res);
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
          return;
        }
        this.$message.success("保存成功");
      });

      this.editDialogVisible = false;
      this.getUserList();
    },

    // 点击删除数据
    async deleteUser(id) {
      // 引入$confirm这个方法，在element.js中挂载到vue上面。
      const res = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          // showCancelButton: true,
          // showConfirmButton:false,
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          type: "warning",
        }
      ).catch((err) => err);
      // 用catch函数来捕获这个函数中所发生的错误信息，并把错误信息发送出去，也就是传递给了这里的res，所以await this.$confirm()的结果，要不就是字符串confirm,要不就是字符串cancle,可以用这个值来做接下来的操作。
      if (res !== "confirm") {
        this.$message.info("已取消删除操作");
        return;
      }
      const { data: result } = await this.$http.delete(`users/${id}`);
      if (result.meta.status !== 200) {
        this.$message.error(result.meta.msg);
      }
      this.$message.success(result.meta.msg);
      this.getUserList();
    },
  },
};
</script>
<style scoped>
.el-card {
  margin-top: 15px;
}

.el-table >>> td,
.el-table >>> th {
  text-align: center;
}
.el-table >>> thead {
  color: black;
  font-weight: bold;
}
.el-pagination {
  margin-top: 20px;
}
.user-box >>> .el-card__body {
  padding-top: 0;
}
/* .el-card >>> .el-table_1_column_9  {
  padding-right: 0;
} */
.el-card >>> .el-button--small {
  margin-right: -6px;
}
</style>
