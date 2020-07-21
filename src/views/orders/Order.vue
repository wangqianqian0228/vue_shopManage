<!-- 订单管理模块 -->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div slot="header" class="clearfix">
        <el-row :gutter="30">
          <el-col :span="14"
            ><div>
              <el-input
                placeholder="请输入用户名"
                v-model="getOrderInfo.query"
                clearable
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="searchOrdersList"
                ></el-button>
              </el-input></div
          ></el-col>
        </el-row>
      </div>

      <!-- 列表区域 -->
      <el-table :data="ordersList" style="width: 100%">
        <el-table-column
          type="index"
          align="center"
          label="序号"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="order_number"
          label="订单编号"
          align="center"
          width="250"
          class="text-over-ellipsis"
        >
        </el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格（元）"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column label="是否付款" width="100" align="center">
          <template slot-scope="scope">
            <el-tag type="warning" v-if="!parseInt(scope.row.pay_status)"
              >未付款</el-tag
            >
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column label="下单时间" width="150" align="center">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateString }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑订单"
              placement="bottom-start"
            >
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="editdialogVisible = true"
              >
              </el-button>
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="物流详情"
              placement="bottom-start"
            >
              <el-button
                type="success"
                size="mini"
                icon="el-icon-info"
                @click="detaildialog"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="getOrderInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="getOrderInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 编辑对话框显示 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="resetEditForm"
    >
      <el-form
        :model="editOrderForm"
        :rules="editOrderFormrules"
        ref="editOrderFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="editOrderForm.address1">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editOrderForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editdialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 查看物流详情对话框 -->
    <el-dialog title="物流详情" :visible.sync="detaildialogVisible" width="50%">
      <el-timeline >
        <el-timeline-item
          v-for="(activity, index) in detailData"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
// 引入包
import cityData from "./citydata.js";
export default {
  data() {
    return {
      // 定义包
      cityData,
      total: 0,
      getOrderInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
        user_id: "",
        pay_status: "",
        is_send: "",
        order_fapiao_title: "",
        order_fapiao_company: "",
        order_fapiao_content: "",
        consignee_addr: "",
      },
      ordersList: [],
      editdialogVisible: false,
      detaildialogVisible: false,
      editOrderForm: {
        address1: [],
        address2: "",
      },
      editOrderFormrules: {
        address1: [
          { required: true, message: "请输入省市县", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请输入具体地址", trigger: "blur" },
        ],
      },
      detailData:[],
    };
  },
  created() {
    this.getOrderLists();
  },
  components: {},

  computed: {},

  mounted() {},

  methods: {
    //   搜索订单
    searchOrdersList() {},
    //   获取数据
    async getOrderLists() {
      const { data: res } = await this.$http.get("orders", {
        params: this.getOrderInfo,
      });
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单列表失败");
      }
      this.ordersList = res.data.goods;
      this.total = res.data.total;
    },
    // 页数选择发生改变
    handleSizeChange(val) {
      this.getOrderInfo.pagesize = val;
      this.getOrderLists();
    },
    // 当前页发生改变
    handleCurrentChange(val) {
      this.getOrderInfo.pagenum = val;
      this.getOrderLists();
    },
    // 关闭对话框，重置表单
    resetEditForm() {
      this.$refs.editOrderFormRef.resetFields();
    },
    // 点击物流详情对话框显示
    async detaildialog() {
      this.detaildialogVisible = true;
      //   向后台发送请求
      const { data: res } = await this.$http.get(`/kuaidi/1106975712662`);
      if(res.meta.status!==200){
        return this.$message.error('获取订单详情失败');
      }
      this.detailData=res.data;

    },
  },
};
</script>
<style scoped></style>
