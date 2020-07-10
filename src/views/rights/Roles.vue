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
        <el-col >
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
     <el-table
    ref="singleTable"
    :data="rolesLists"
    highlight-current-row
    style="width: 100%">
    <el-table-column
      width="60"
      type="expand" >
      <template slot-scope="scope">
        <!-- el-row：行 el-col：列，有几行是由scope.row.children来看的，有几个就渲染几行-->
       <el-row :gutter="10" v-for="(item1,index1) in scope.row.children" :key="item1.id" :class="['bdbottom',index1==0?'bdtop':'']"> 
          <!--第一列数据  -->
         <el-col :span="4">
           <el-tag closable>
            {{item1.authName}}
          </el-tag>
          <i class="el-icon-caret-right"></i>
         </el-col>
         <!-- 第二列外层包裹框 -->
         <el-col :span="20">
           <el-row :gutter="10" v-for="(item2,index2) in item1.children" :key="item2.id" :class="[index2==0?'':'bdtop']">
             <!-- 第二列数据 -->
             <el-col :span="5">
               <el-tag  closable type="success">
                 {{item2.authName}}
               </el-tag>
               <i class="el-icon-caret-right"></i>
             </el-col>
             <!-- 第三列数据 -->
             <el-col :span="15">
               <el-tag closable type='danger' v-for="(item3) in item2.children" :key='item3.id' class="tagdanger">
                 {{item3.authName}}
               </el-tag>
             </el-col>
           </el-row>          
        </el-col>  
       </el-row>
       <!-- {{scope.row.children}} -->
      </template>
      
    </el-table-column>
    <el-table-column
      type="index"
      width="60">
    </el-table-column>
    <el-table-column
      property="roleName"
      label="角色名称"
      width="280">
    </el-table-column>
    <el-table-column
      property="roleDesc"
      label="角色描述"
      width="280">
    </el-table-column>
    <el-table-column  
      label="操作"
      >
      <template slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" size="mini" @click='editRoles(scope.row.id)'>编辑</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
      </template>
      
    </el-table-column>
  </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesLists: [],
    };
  },
  created() {
    this.getRolesLists();
  },
  components: {},

  computed: {},

  mounted() {},

  methods: {
    async getRolesLists() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
        return;
      }
      this.rolesLists = res.data;
      console.log(this.rolesLists);
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
.el-tag{
  margin: 6px 0;
}
.tagdanger{
  margin-right: 10px;
  
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
</style>
