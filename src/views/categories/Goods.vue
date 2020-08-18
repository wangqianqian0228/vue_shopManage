<!-- 商品列表 -->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div slot="header" class="clearfix">
        <el-row :gutter="30">
          <el-col :span="14"
            ><div>
              <el-input
                placeholder="请输入用户名"
                v-model="queryInfo.query"
                clearable
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="searchGoodsList"
                ></el-button>
              </el-input></div
          ></el-col>
          <el-col :span="10"
            ><div>
              <el-button
                type="primary"
                @click="addgoodsRouter"
                class="el-btn-add"
                >添加商品</el-button
              >
            </div></el-col
          >
        </el-row>
      </div>

      <!-- 列表区域 -->
      <el-table :data="goodsLists" style="width: 100%">
        <el-table-column
          type="index"
          align="center"
          label="序号"
        ></el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          width="450"
          class="text-over-ellipsis"
        >
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格（元）"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column label="创建时间" width="150" align="center">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateString }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit"
              >编辑
            </el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteGoods(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addGoodsVisible: false,
      goodsLists: [],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
    };
  },
  created() {
    // 获取商品列表数据
    this.getGoodsLists();
  },
  components: {},

  computed: {},

  mounted() {},

  methods: {
    // 搜索获取商品列表
    async getGoodsLists() {
      const { data: res } = await this.$http.get(`goods`, {
        params: this.queryInfo,
      });
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败");
      }
      this.goodsLists = res.data.goods;
      this.total = res.data.total;
    },
    // 搜素商品列表
    searchGoodsList() {
      this.getGoodsLists();
    },
    // 监听分页大小改变
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getGoodsLists();
    },
    // 监听当前页发生改变
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getGoodsLists();
    },
    // 删除商品
    async deleteGoods(row) {
      const result = await this.$confirm("确定要删除该商品吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (result !== "confirm") {
        return this.$message.info("已取消操作");
      }
      // 点击确定发送删除请求
      const { data: res } = await this.$http.delete(`goods/${row.goods_id}`);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.$message.success(res.meta.msg);
      this.getGoodsLists();
    },
    // 点击切换路由
    addgoodsRouter() {
      this.$router.push('/home/addgoods')
    }
  },
};
</script>
<style scoped>
.el-table >>> .cell {
  white-space: nowrap;
}
</style>
