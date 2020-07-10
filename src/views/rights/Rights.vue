<!-- 权限列表 -->
<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 列表区域 -->
      <el-table :data="rightLists" style="width: 100%" center>
        <el-row>
          <el-col :span="6"
            ><el-table-column  label="权限等级"> 
               <template slot-scope="scope">
                 <!-- {{scope.row.level}} -->
                 <el-tag v-if="scope.row.level=='0'">一级</el-tag>
                 <el-tag type="success" v-else-if="scope.row.level=='1'">二级</el-tag>
                 <el-tag type="warning" v-else>三级</el-tag>
               </template>
              
              </el-table-column
          ></el-col>
          <el-col :span="6"
            ><el-table-column type="index"></el-table-column
          ></el-col>
           <el-col :span="6"
            ><el-table-column prop="authName" label="权限名称">
            </el-table-column
          ></el-col>
          <el-col :span="6"
            ><el-table-column prop="path" label="路径"> </el-table-column
          ></el-col>  
        </el-row>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightLists: [],
    };
  },
  created() {
    // 去后台请求数据
    this.getRightsLists();
  },
  components: {},

  computed: {},

  mounted() {},

  methods: {
    // 获取后台权限数据
    async getRightsLists() {
      const { data: res } = await this.$http.get(`rights/list`);
      // console.log(res);
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
        return;
      }
      // 成功获取的话
      this.rightLists = res.data;
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
