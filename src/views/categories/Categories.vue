<!-- 商品分类2 -->
<template>
  <div class="categories-box">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <tree-table
        :data="classLists"
        :columns="columns"
        :show-index="true"
        :expand-type="false"
        :selection-type="false"
        border
        v-loading="loading"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-circle-check"
            v-if="scope.row.cat_deleted === false"
            style="color:green;font-size:17px;"
          ></i>
          <i class="el-icon-circle-close" v-else style="color:red;"></i>
        </template>
        <!-- 标签等级 -->
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level == '0'">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level == '1'"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opration" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editCates(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="delCates(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodsInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="goodsInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addClassifyDialog"
      width="50%"
      center
      @close="resetCateForm"
    >
      <el-form
        :model="addCateInfo"
        :rules="caterules"
        ref="cateruleForm"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateInfo.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options:指定数据源 props：用来指定配置对象-->
          <!-- v-model的值应该为一数组，比如选中 大家电/电视，用数组进行存储 -->
          <!-- change-on-select:可任选一级 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentsLists"
            :props="cascaderProps"
            :change-on-select="true"
            :clearable="true"
            @change="handleCateChange"
            size="medium"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addClassifyDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCateForm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑分类"
      center
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form
        :model="editCatesForm"
        :rules="editCatesrules"
        ref="editCatesruleForm"
        label-width="100px"
      >
        <el-form-item label="分类ID">
          <el-input v-model="editCatesForm.cat_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCatesForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      classLists: [],
      loading: true,
      goodsInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      addClassifyDialog: false,
      editDialogVisible: false,
      editCatesForm: {
        cat_name: "",
        cat_id: "",
      },
      editCatesrules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      // 总的数据条数
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
          width: "170px",
        },
        {
          label: "是否有效",
          prop: "",
          width: "170px",
          // 表示将当前列定义为模板列
          type: "template",
          // 当前这一列使用的模板名称
          template: "isok",
        },
        {
          label: "排序",
          width: "170px",
          type: "template",
          // 当前这一列使用的模板名称
          template: "sort",
        },
        {
          label: "操作",
          type: "template",
          // 当前这一列使用的模板名称
          template: "opration",
        },
      ],
      addCateInfo: {
        // 添加的分类的名称
        cat_name: "",
        // 父级分类的id
        cat_pid: 0,
        // 分类等级，默认添加的分类为1级分类
        cat_level: 0,
      },
      caterules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      // 父级数据
      parentsLists: [],
      // 被选中的id存储在这里
      selectedId: "",
      cascaderProps: {
        expandTrigger: "hover",
        //  选定的值
        value: "cat_id",
        //  看到的名字
        label: "cat_name",
        //  父子节点之间的关系
        children: "children",
        //  父子节点取消选中关联，从而达到选择任意一级选项的目的
        checkStrictl: true,
      },
      selectedKeys: [],
    };
  },
  created() {
    this.getClassLists();
  },
  components: {},

  computed: {},

  mounted() {},

  methods: {
    async getClassLists() {
      const { data: res } = await this.$http.get("categories", {
        params: this.goodsInfo,
      });
      if (res.meta.status !== 200) {
        this.$message.error("获取商品列表失败");
        this.loading = false;
        return;
      }
      // console.log(res);
      this.classLists = res.data.result;
      // console.log(this.classLists);
      this.total = res.data.total;
      this.loading = false;
    },
    // 监听显示大小发生改变
    handleSizeChange(newSize) {
      this.goodsInfo.pagesize = newSize;
      // 重新刷新列表
      this.getClassLists();
    },
    //监听当前页面发生改变时
    handleCurrentChange(newPages) {
      this.goodsInfo.pagenum = newPages;
      // 重新刷新列表
      this.getClassLists();
    },
    // 添加分类对话框
    addCateDialog() {
      this.getParentLists();
      this.addClassifyDialog = true;
    },
    // 获取父级分类的数据，2级,type表示到几级
    async getParentLists() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("父级列表获取失败");
      }
      this.parentsLists = res.data;
      console.log(this.parentsLists);
    },
    // 选择项发生变化，触发这个函数
    // handleParentChange() {
    //    console.log(this.selectedKeys);
    // }
    // 关闭对话框重置表单,表单里面的内容都要进行重置
    resetCateForm() {
      this.$refs.cateruleForm.resetFields();
      // console.log(this.selectedKeys);
      this.selectedKeys = [];
      this.addCateInfo.cat_pid = 0;
      this.addCateInfo.cat_level = 0;
    },
    // 提交确定按钮
    // handleCateChange:只要级联选择器发生变化,就会触发
    handleCateChange() {
      // 选中的id
      // console.log(this.selectedKeys);
      if (this.selectedKeys.length > 0) {
        // 相当于有父级分类
        // 最后一项为该添加的分类的父级
        // 等级为该数组的长度
        this.addCateInfo.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        this.addCateInfo.cat_level = this.selectedKeys.length;
      } else {
        this.addCateInfo.cat_pid = 0;
        this.addCateInfo.cat_level = 0;
      }
      // console.log(this.addCateInfo);
    },
    // 点击确定按钮
    async addCateForm() {
      // 进行预校验
      this.$refs.cateruleForm.validate(async (value) => {
        if (!value) {
          return;
        }
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateInfo
        );
        // console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }
        this.$message.success("创建分类成功");
        this.getClassLists();
        this.addClassifyDialog = false;
      });
    },
    // 编辑操作
    editCates(cates) {
      this.editDialogVisible = true;
      //  console.log(cates);
      this.editCatesForm.cat_id = cates.cat_id;
      this.editCatesForm.cat_name = cates.cat_name;
    },
    async editSubmit() {
      // console.log(this.editCatesForm.cat_id);
      // console.log(this.editCatesForm.cat_name);
      const { data: res } = await this.$http.put(
        `categories/${this.editCatesForm.cat_id}`,
        {
          cat_name: this.editCatesForm.cat_name,
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.$message.success("编辑成功");
      this.getClassLists();
      this.editDialogVisible = false;
    },
    async delCates(id) {
      const result = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (result !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete(`categories/${id}`);
      console.log(res);
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
        return;
      }
      this.$message.success(res.meta.msg);
      this.getClassLists();
    },
  },
};
</script>
<style scoped>

.el-row {
  margin-bottom: 15px;
}
.tree-table >>> td,
.tree-table >>> th {
  text-align: center;
}

.el-pagination {
  margin-top: 20px;
}
.el-card >>> .zk-table__cell-inner {
  text-align: center;
}
.el-cascader {
  width: 100%;
}
</style>
