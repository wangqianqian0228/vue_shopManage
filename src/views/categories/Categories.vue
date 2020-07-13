<!-- 商品分类 -->
<template>
  <div>
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
          <el-button type="primary" @click="addClassifyDialog = true"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table
        ref="singleTable"
        :data="classLists"
        highlight-current-row
        style="width: 100%"
      >
        
        <el-table-column type="index" width="60"> </el-table-column>
        <el-table-column property="roleName" label="分类名称" width="230">
        </el-table-column>
        <el-table-column property="roleDesc" label="是否有效" width="230">
        </el-table-column>
        <el-table-column property="roleDesc" label="排序" width="280">
        </el-table-column>
        <el-table-column label="操作">
          <template >
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
             
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            
              >删除</el-button
            >
            
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      classLists:[],
      goodsInfo:{
        type:[1,2,3],
        pagenum:1,
        pagesize:5
      }
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
    const{data:res}= await this.$http.get('categories',this.goodsInfo);
    if(res.meta.status!==200){
       return this.$message.error('获取商品列表失败')
    }
    this.classLists=res.data;
    }
  }
}

</script>
<style  scoped>
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
</style>