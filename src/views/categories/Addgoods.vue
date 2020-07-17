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
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsruleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price" type='number'>
              <el-input v-model="addGoodsruleForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight" type='number'>
              <el-input v-model="addGoodsruleForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number" type='number'>
              <el-input v-model="addGoodsruleForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品内容" prop="goods_introduce">
              <el-input v-model="addGoodsruleForm.goods_introduce"></el-input>
            </el-form-item>

            
           <el-form-item label="商品分类" prop="goods_cat">
              <el-input v-model="addGoodsruleForm.goods_cat"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 字符串类型
      activeindex: "0",
      addGoodsruleForm: {
        goods_name: "",
        goods_cat: "1,2,3",
        goods_price: 0,
        goods_weight: 0,
        goods_number:0,
        goods_introduce:'',
        pics:{},
        attrs:[]

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
      },
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {},
};
</script>
<style scoped>
.el-steps {
  margin: 15px 0;
}
</style>
