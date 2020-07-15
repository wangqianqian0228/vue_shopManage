<!-- 商品参数 -->
<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <p class="cascader-box">
        <span>选择商品分类:</span>
        <el-cascader
          v-model="paramsSelectedKeys"
          :options="paramsLists"
          :props="paramsProps"
          @change="handleParamsChange"
        ></el-cascader>
      </p>

      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisplay"
            @click="addParamsDialog"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyParams" style="width: 100%">
            <el-table-column type="expand" width="50" align="center">
            </el-table-column>
            <el-table-column
              type="index"
              width="50"
              align="center"
              label="序号"
            >
            </el-table-column>
            <el-table-column align="center" prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editDialogVisible(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteDialogVisible(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only"
          ><el-button
            type="primary"
            size="mini"
            :disabled="isDisplay"
            @click="addParamsDialog"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyParams" style="width: 100%">
            <el-table-column type="expand" width="50" align="center">
            </el-table-column>
            <el-table-column
              type="index"
              width="50"
              align="center"
              label="序号"
            >
            </el-table-column>
            <el-table-column align="center" prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editDialogVisible(scope.row)"
                  >编辑</el-button
                >
                <el-button type="danger" icon="el-icon-delete" size="mini"
                @click="deleteDialogVisible(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 动态添加参数对话框 -->
    <!-- 共用一套对话框，动态显示参数，放在计算属性里面即可，点击提交数据的时候，也就是attr_sel的数据会不一样，tab栏切换获取数据的时候，顺便切换赋值一下即可 -->
    <el-dialog
      :title="'添加' + isTitle"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="resetParamsDialog"
    >
      <el-form
        :model="addManyInfo"
        :rules="addManyrules"
        ref="ManyruleForm"
        label-width="100px"
      >
        <el-form-item :label="isTitle + '名称'" prop="attr_name">
          <el-input v-model="addManyInfo.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamsSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
      :title="'编辑' + isTitle"
      :visible.sync="editDialog"
      width="50%"
      @close="resetParamsDialog"
    >
      <el-form
        :model="addManyInfo"
        :rules="addManyrules"
        ref="ManyruleForm"
        label-width="100px"
      >
        <el-form-item :label="isTitle + '名称'">
          <el-input v-model="addManyInfo.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editParamsSubmit">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 存放被选中时的id集合
      paramsSelectedKeys: [],
      // 父级数据
      paramsLists: [],
      // 级联选择框的配置选项
      paramsProps: {
        expandTrigger: "hover",
        //  选定的值
        value: "cat_id",
        //  看到的名字
        label: "cat_name",
        //  父子节点之间的关系
        children: "children",
      },
      activeName: "many",
      manyParams: [],
      onlyParams: [],
      // 添加分类对话框
      addDialogVisible: false,
      editDialog: false,
      // 请求体
      addManyInfo: {
        attr_name: "",
        attr_sel: "",
      },
      // 请求体中的数据规则
      addManyrules: {
        attr_name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      // 属性id
      attributeId: "",
    };
  },
  created() {
    this.getParentLists();
  },
  components: {},

  computed: {
    // disabled有禁用和不禁用选项，所以可以用计算属性的方法，将其结果返回true或者false
    isDisplay() {
      if (this.paramsSelectedKeys.length === 0) {
        return true;
      } else {
        return false;
      }
    },
    // 得到级联选择器的三级分类的id值
    paramsId() {
      if (this.paramsSelectedKeys.length === 3) {
        return this.paramsSelectedKeys[2];
      }
      return null;
    },
    // 对话框显示的标题
    isTitle() {
      return this.activeName == "many" ? "参数" : "属性";
    },
  },

  mounted() {},

  methods: {
    async getParentLists() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 3 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("父级列表获取失败");
      }
      this.paramsLists = res.data;
      //  console.log(this.paramsLists);
    },
    // 级联选择框发生改变时触发的事件
    handleParamsChange() {
      // console.log(this.paramsSelectedKeys);
      // 获取商品对应的参数数据
      this.getCatesParams();
    },
    // Tabs栏发生改变触发的事件,也会触发getCatesParams函数
    handleTabsClick() {
      //  console.log(this.activeName);
      this.getCatesParams();
    },
    // 获取动态或静态数据
    async getCatesParams() {
      // console.log(this.paramsId);
      const { data: res } = await this.$http.get(
        `categories/${this.paramsId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      if (this.activeName == "many") {
        // 存储动态数据
        this.manyParams = res.data;
        // console.log(this.manyParams);
        this.addManyInfo.attr_sel = "many";
      } else {
        // 存储静态数据
        this.onlyParams = res.data;
        // console.log(this.onlyParams);
        this.addManyInfo.attr_sel = "only";
      }
    },
    addParamsDialog() {
      this.addDialogVisible = true;
      this.addManyInfo.attr_name=''

    },
    // 关闭对话框重置表单
    resetParamsDialog() {
      this.$refs.ManyruleForm.resetFields();
    },
    // 提交增加参数表单
    addParamsSubmit() {
      // 先进行表单的预验证
      this.$refs.ManyruleForm.validate(async (value) => {
        if (!value) return;
        // 提交post提交数据请求
        const { data: res } = await this.$http.post(
          `categories/${this.paramsId}/attributes`,
          this.addManyInfo
        );
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }
        this.$message.success("创建分类成功");
        this.getCatesParams();
        this.addDialogVisible = false;

      });
    },
    // 打开编辑对话框
    editDialogVisible(roles) {
      this.editDialog = true;
      // 得到属性id
      this.attributeId = roles.attr_id;
      this.addManyInfo.attr_name = roles.attr_name;
    },
    // 编辑提交
    editParamsSubmit() {
      this.$refs.ManyruleForm.validate(async (value) => {
        if (!value) return;
        // 提交编辑请求
        const { data: res } = await this.$http.put(
          `categories/${this.paramsId}/attributes/${this.attributeId}`,
          this.addManyInfo
        );
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        this.$message.success("更改成功");
        this.getCatesParams();
        this.editDialog = false;
      });
    },
    // 删除提交,id接收属性id
    async deleteDialogVisible(id) {
      const result =await this.$confirm("确定要删除这项参数吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (result !== "confirm") {
        return this.$message.info("已取消删除");
      }
      // 执行删除
      const { data: res } = await this.$http.delete(
        `categories/${this.paramsId}/attributes/${id}`
      );
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
        return;
      }
      this.$message.success(res.meta.msg);
      this.getCatesParams();
    },
  },
};
</script>
<style scoped>
.cascader-box {
  margin: 10px 0;
}
.cascader-box span {
  margin-right: 10px;
}
</style>
