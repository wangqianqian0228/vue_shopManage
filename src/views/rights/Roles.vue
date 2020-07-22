<!-- 角色列表 -->
<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRolesDialog = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table
        ref="singleTable"
        :data="rolesLists"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column width="60" type="expand">
          <template slot-scope="scope">
            <!-- el-row：行 el-col：列，有几行是由scope.row.children来看的，有几个就渲染几行-->
            <el-row
              :gutter="10"
              v-for="(item1, index1) in scope.row.childrens"
              :key="item1.id"
              :class="['bdbottom', 'vcenter', index1 == 0 ? 'bdtop' : '']"
            >
              <!--第一列数据  -->
              <el-col :span="4">
                <el-tag closable @close="removeThirdTag(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 第二列外层包裹框 -->
              <el-col :span="20">
                <el-row
                  :gutter="10"
                  v-for="(item2, index2) in item1.childrens"
                  :key="item2.id"
                  :class="[index2 == 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <!-- 第二列数据 -->
                  <el-col :span="5">
                    <el-tag
                      closable
                      type="success"
                      @close="removeThirdTag(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 第三列数据 -->
                  <el-col :span="15">
                    <el-tag
                      closable
                      type="danger"
                      v-for="item3 in item2.childrens"
                      :key="item3.id"
                      class="tagdanger vleft"
                      @close="removeThirdTag(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{ scope.row }}</pre> -->
          </template>
        </el-table-column>
        <el-table-column type="index" width="60"> </el-table-column>
        <el-table-column property="roleName" label="角色名称" width="280">
        </el-table-column>
        <el-table-column property="roleDesc" label="角色描述" width="280">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRoles(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delRoles(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="setRightsDialogVisible(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加角色信息"
      :visible.sync="addRolesDialog"
      width="30%"
      center
      @close="resetRolesForm">
      <el-form
        :model="roleInfo"
        :rules="rolerules"
        ref="roleruleForm"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleInfo.roleName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加用户对话框结束 -->

    <!-- 编辑角色对话框 -->
    <el-dialog
      title="更改角色信息"
      :visible.sync="aditRolesDialog"
      width="30%"
      center
      @close="resetRolesForm"
    >
      <el-form
        :model="getRoleInfo"
        :rules="rolerules"
        ref="roleruleForm"
        label-width="100px"
      >
        <el-form-item label="角色ID" prop="roleId">
          <el-input v-model="getRoleInfo.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="getRoleInfo.roleName"></el-input>
        </el-form-item>

        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="getRoleInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="aditRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="safeRoles">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框结束 -->

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightsDialog"
      width="50%"
      center
      @close="resetDefkeys"
    >
      <el-tree
        :data="rightsLists"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
        ref="allotRightsref"
      ></el-tree>

      <span slot="footer">
        <el-button @click="setRightsDialog = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框结束 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesLists: [],
      rightsLists: [],
      roleId: "",
      // 存储默认选中的权限的id
      defkeys: [],
      addRolesDialog: false,
      aditRolesDialog: false,
      setRightsDialog: false,
      roleInfo: {
        roleName: "",
        roleDesc: "",
      },
      getRoleInfo: {},
      rolerules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      // 树形控件的属性绑定对象
      defaultProps: {
        // 父子节点通过哪个属性来进行嵌套的
        childrens: "childrens",
        // label：看到的是哪个属性的值
        label: "authName",
      },
    };
  },
  created() {
    this.getRolesLists();
  },
  components: {},

  computed: {},

  mounted() {},

  methods: {
    handleChild (arr) {
      if (arr instanceof Array && arr.length) {
        arr.forEach(item => {
            if (item.children) {
              item.childrens = item.children
              delete item.children
              this.handleChild(item.childrens)
            }
            
        })
       return arr
      } else {
        return
      }
    },
    async getRolesLists() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
        return;
      }
      this.rolesLists = this.handleChild(res.data);

      console.log(this.rolesLists);
    },
    // 添加用户的对话框关闭，就要清空表单数据
    resetRolesForm() {
      this.$refs.roleruleForm.resetFields();
    },
    // 点击确定按钮添加角色
    addRoles() {
      // 预校验数据
      let roleObj = { ...this.roleInfo };
      this.$refs.roleruleForm.validate(async (value) => {
        if (!value) {
          return this.$message.error("用户信息填写失败");
        }
        const { data: res } = await this.$http.post("roles", roleObj);
        /* if (res.meta.status !== 201) {
         return this.$message.error(res.meta.msg);
        } */
        this.$message.success(res.meta.msg);
      });
      this.addRolesDialog = false;
      this.getRolesLists();
    },
    // 编辑角色
    async editRoles(id) {
      // console.log(id);
      this.aditRolesDialog = true;
      //  根据id首先去获取数据
      const { data: res } = await this.$http.get(`roles/${id}`);
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
        return;
      }
      this.getRoleInfo = res.data;
      // console.log(this.getRoleInfo);
    },
    // 保存并提交
    async safeRoles() {
      // 对表单进行预验证
      let roleObj = { ...this.getRoleInfo };
      this.$refs.roleruleForm.validate(async (value) => {
        if (!value) {
          return this.$message.error("角色更改失败");
        }
        const { data: res } = await this.$http.put(
          `roles/${roleObj.roleId}`,
          roleObj
        );
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        this.$message.success("修改角色成功");
      });
      this.aditRolesDialog = false;
      this.getRolesLists();
    },
    // 删除角色
    async delRoles(id) {
      const result = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (result !== "confirm") {
        this.$message.info("已取消操作");
        return;
      }
      const { data: res } = await this.$http.delete(`roles/${id}`);
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
        return;
      }
      this.$message.success(res.meta.msg);
      this.getRolesLists();
    },
    // 删除Tag图标,接收角色id和权力id

    async removeThirdTag(roles, rightsid) {
      const result = await this.$confirm("确定要删除这条权限吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (result !== "confirm") {
        return this.$message.info("已取消操作");
      }
      // console.log(roles,rightsid);
      const { data: res } = await this.$http.delete(
        `roles/${roles.id}/rights/${rightsid}`
      );
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
        return;
      }
      this.$message.success(res.meta.msg);
      // 不用重新执行this.getRolesLists();会刷新table列表，导致页面的完整渲染，降低用户体验
      // 返回的data, 是当前角色下最新的权限数据
      // 重新赋值一遍就可以了
      roles.children = res.data;
    },
    // 分配权限的对话框的显示
    async setRightsDialogVisible(role) {
      this.roleId = role.id;
      const { data: res } = await this.$http.get(`rights/tree`);
      // 树形是一层一层的显示
      // 把数据放在rightsLists上面
      this.rightsLists = res.data;
      // console.log(this.rightsLists);
      // const{data:result}= await this.$http.get(`rights/list`)
      // 列表形是直接显示出所有的数据
      this.getRightsId(role, this.defkeys);
      // console.log(this.defkeys);
      this.setRightsDialog = true;
    },

    // 获取三级权限的id，然后把对应的id追加到数组中，要根据递归的方法
    getRightsId(node, arr) {
      // 该项没有孩子的话，就把对应的id追加给数组，则每一个数组元素都要执行该函数，所以需要用到数组的forEach()方法
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getRightsId(item, arr);
      });
      //  孩子们都执行这个函数，所以里面的参数，为item
    },
    // 关闭对话框后，将defkeys数组设置成空数组，以防止越积越多。
    resetDefkeys() {
      this.defkeys = [];
    },

    // 给角色分配权限并提交给服务器
    async allotRights() {
      const chooseArr = [
        ...this.$refs.allotRightsref.getCheckedKeys(),
        ...this.$refs.allotRightsref.getHalfCheckedKeys(),
      ];
      const idString = chooseArr.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idString }
      );
      if(res.meta.status!==200){
          return this.$message.error(res.meta.msg);
      }
      this.$message.success('权限更改成功！');
      console.log(res);
      this.getRolesLists();
      this.setRightsDialog = false;
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
.el-tag {
  margin: 6px 0;
}
.tagdanger {
  margin-right: 10px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
.vleft {
  float: left;
}
</style>
