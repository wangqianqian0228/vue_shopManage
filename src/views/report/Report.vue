<!-- 数据统计 -->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="total" style="height:500px"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
import _ from 'lodash'

export default {
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },

  components: {},

  // 元素的DOM元素已经渲染完毕
  mounted() {
    this.drline();
  },

  methods: {
    async drline() {
      var myChart = echarts.init(document.getElementById("total"));
      // 向后台发送请求
      const { data: res } = await this.$http.get("reports/type/1");
      if(res.meta.status!==200){
        return this.$message.error('请求数据失败');
      }
      // 将要合并的数据用lodash中的方法与后台返回的数据进行合并。
    //  console.log(res.data);
     res.data= _.merge(res.data,this.options);
    //  console.log(res.data);
      myChart.setOption(res.data);
    },
  },
};
</script>
<style scoped></style>
