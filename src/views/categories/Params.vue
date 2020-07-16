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
              <template slot-scope="scope">
                <el-tag
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="item.attr_id"
                  @close="removeTags(index, scope.row)"
                  >{{ item }}</el-tag
                >

                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >添加标签</el-button
                >
              </template>
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
             <template slot-scope="scope">
                <el-tag
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="item.attr_id"
                  @close="removeTags(index, scope.row)"
                  >{{ item }}</el-tag
                >

                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >添加标签</el-button
                >
              </template>
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
      inputVisible: false,
      inputValue: "",
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
        this.$message.error("父级列表获取失败");

        return;
      }
      this.paramsLists = res.data;
      //  console.log(this.paramsLists);
    },
    // 级联选择框发生改变时触发的事件
    handleParamsChange() {
      // console.log(this.paramsSelectedKeys);

      if (this.paramsSelectedKeys.length === 3) {
        // 获取商品对应的参数数据
        this.getCatesParams();
      } else {
        this.$message.warning('低于三级不能进行相关操作')
        this.paramsSelectedKeys = [];
        this.manyParams = [];
        this.onlyParams = [];

      }
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
      // 将attr_vals字符串转换为数组
      // 做一下判断，如果item.attr_vals为空的话就返回一个空数组
      // 遍历res.data中的每一项
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        // 给每一项添加inputVisible和inputValue属性
        item.inputVisible = false;
        item.inputValue = "";
      });
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
      // console.log(res.data);
    },
    addParamsDialog() {
      this.addDialogVisible = true;
      this.addManyInfo.attr_name = "";
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
      const result = await this.$confirm("确定要删除这项参数吗？", "提示", {
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

    // 点击添加标签
    showInput(row) {
      row.inputVisible = true;
      // $nextTick():页面上的元素被重新渲染之后，才会执行回调函数中的代码
      this.$nextTick((_) => {
        // 获得input元素并且执行focus()
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    async handleInputConfirm(row) {
      // 检查input输入框有没有输入内容
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false;
        row.inputValue = "";
        return;
      }
      row.inputVisible = false;
      row.attr_vals.push(row.inputValue);
      row.inputVisible = false;
      row.inputValue = "";
      this.submitTags(row);
    },
    // 将row.attr_vals数据发给数据库
    async submitTags(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.paramsId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          // 要将数组转换成以空格分隔的字符串
          attr_vals: row.attr_vals.join(" "),
        }
      );
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
        return;
      }
    },
    // 删除Tag标签
    removeTags(i, row) {
      // 删除数组元素
      row.attr_vals.splice(i, 1);
      // 提交至数据库
      this.submitTags(row);
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
.el-tag {
  margin: 0 15px 15px 0;
}
.input-new-tag {
  width: 100px;
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
