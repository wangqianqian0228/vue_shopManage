<!-- 添加商品组件 -->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- :active为索引，数字类型 -->
      <el-steps :space="200" :active="activeindex - 0" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- el-tabs和el-tab-pane只能为上下嵌套关系，中间不能掺杂其他标签 -->
      <el-form
        :model="addGoodsruleForm"
        :rules="addGoodsRules"
        ref="addGoodsRules"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="activeindex"
          :before-leave="beforeChangeTabs"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsruleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price" type="number">
              <el-input v-model="addGoodsruleForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight" type="number">
              <el-input v-model="addGoodsruleForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number" type="number">
              <el-input v-model="addGoodsruleForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品内容" prop="goods_introduce">
              <el-input v-model="addGoodsruleForm.goods_introduce"></el-input>
            </el-form-item>
            <!-- prop用来做校验规则的 -->
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="selectedKeys"
                :options="parentsLists"
                :props="cateCascaderProps"
                @change="handleChange"
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 复选框是放在form里面的，所以要创建form-item -->
            <el-form-item
              v-for="item in manyCatesData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <!-- 复选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="choose"
                  v-for="(choose, index) in item.attr_vals"
                  :key="index"
                  @change="consoleArr"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 遍历渲染表单item -->
            <el-form-item
              v-for="item in onlyCatesData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 上传图片功能 -->
            <!-- action:表示图片要上传至后台API的地址, -->
            <!-- list-type：上传的图片的展示类型 -->
            <!-- 注意：el-upload组件没有调用axios请求，故就没有token，需要手动添加headers设置上传的请求头部，属性值为一个对象 -->
            <!-- 上传成功表示服务器已经存储了这张图片，接下来把图片在服务器上的路径放到请求体中。on-success文件上传成功时的钩子 -->
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 预览对话框 -->
    <el-dialog
      title="图片预览"
      center=""
      :visible.sync="previewVisible"
      width="50%"
      >
      <img :src="previewUrl" alt="" class="preview-pic">
      
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 字符串类型，tabs选中的下标
      activeindex: "0",
      addGoodsruleForm: {
        goods_name: "",
        // 商品所属的分类数组
        goods_cat: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_introduce: "",
        pics: [],
        attrs: [],
      },
      addGoodsRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请输入商品分类", trigger: "blur" },
        ],
      },
      selectedKeys: [],
      parentsLists: [],
      cateCascaderProps: {
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
      // 动态列表数据
      manyCatesData: [],
      // 静态列表数据
      onlyCatesData: [],
      // 图片上传至后台地址，放在upload/文件夹下
      uploadUrl: `http://127.0.0.1:8888/api/private/v1/upload/`,
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      previewVisible:false,
      previewUrl:''
    };
  },
  created() {
    this.getcateLists();
  },
  components: {},

  computed: {
    // 分类id，返回最后一项
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2];
      }
    },
  },

  mounted() {},

  methods: {
    // 运用于级联选择框，提供数据
    async getcateLists() {
      const { data: res } = await this.$http.get(`categories`);
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取选择列表失败");
      }
      this.parentsLists = res.data;
    },
    // 级联选项发生改变时触发
    handleChange() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = [];
      } else {
        this.addGoodsruleForm.goods_cat = this.selectedKeys.join(",");
      }
    },
    //  切换表单之前要干的事
    beforeChangeTabs(activeName, oldActiveName) {
      // beforeChangeTabs和beforeChangeTabs()传的形参值不一样，前者以内置的值进行传递，后者传递的为undefined
      // 若函数的返回值为false，则不切换tab，为true则切换
      // console.log(`即将离开的标签页的名字是：${oldActiveName}`,`即将去往的标签页的名字是：${activeName}`);
      // 返回的值为el-tab-pane中绑定的name值
      // oldActiveName==0 这个条件为什么要满足？
      if (oldActiveName == 0 && this.selectedKeys.length !== 3) {
        this.$message.error("请选择三级商品分类");
        return false;
      }
    },
    // 点击tab栏的时候触发,即使不切换，点击了都会触发，所以，如何判断切换到了该tab栏？
    async tabClicked() {
      // 如何判断切换到了该tab栏？
      if (this.activeindex == 1) {
        this.getmanyParamsList();
      } else if (this.activeindex == 2) {
        this.getonlyParamsList();
      }
    },
    // 复选框发生改变时触发的函数
    consoleArr() {
      // console.log(this.manyCatesData);
    },
    // 获取动态参数列表
    async getmanyParamsList() {
      // 请求发送动态参数列表,这里的id为最后一项
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: "many" },
        }
      );
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取动态参数列表失败！");
      }
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
      });
      this.manyCatesData = res.data;
    },
    // 获取静态参数列表
    async getonlyParamsList() {
      // 请求发送动态参数列表,这里的id为最后一项
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: "only" },
        }
      );
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取静态参数列表失败！");
      }
      this.onlyCatesData = res.data;
      console.log(this.onlyCatesData);
    },
    // 处理图片预览效果
    handlePreview(file) {
      // 对话框显示
      this.previewVisible = true;
      this.previewUrl = file.response.data.url;
      console.log(file);
    },
    // 移除图片的操作,file接收移除图片的信息
    handleRemove(file) {
      // 1. 获取将要删除的图片的临时路径
      // 2. 在pics数组中，找到这个图片对应的索引
      // 3. 运用splice()方法，删除该数组元素。
      // console.log(file);
      const filePath = file.response.data.tmp_path;
      // console.log(filePath);
      // console.log(this.addGoodsruleForm.pics[0].pic);
     
      const picIndex = this.addGoodsruleForm.pics.findIndex((item) => 
       item.pic == filePath);
      //  单行箭头函数不用写return和大括号
      this.addGoodsruleForm.pics.splice(picIndex,1);
    },
    // 上传成功时的钩子函数,response表示上传成功后台返回的数据
    handleSuccess(response) {
      // console.log(response);
      // {data: {…}, meta: {…}}
      // data: {tmp_path: "tmp_uploads\b312651e5661da828fedc430c63256a1.jpg", url: "http://127.0.0.1:8888/tmp_uploads\b312651e5661da828fedc430c63256a1.jpg"}
      // meta: {msg: "上传成功", status: 200}
      // 1. 每上传一次就创建一个变量来存储后台路径
      // 2. 把该数据追加到pics这个数组中去，成功一次追加一次
      const picinfo = { pic: response.data.tmp_path };
      this.addGoodsruleForm.pics.push(picinfo);
      console.log(this.addGoodsruleForm);
    },
  },
};
</script>
<style scoped>
.el-steps {
  margin: 15px 0;
}
.preview-pic{
  width: 100%;
}
</style>
