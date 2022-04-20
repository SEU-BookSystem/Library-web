<template>
  <div class="home" v-loading="isloading">
    <div class="content">
      <div class="header">
        <img height="70px" style="margin:20px 0" src="../../assets/jwbc.png" />
        <div class="title">后台管理</div>
      </div>
      <div style="margin: 10px 0"><el-page-header @back="gotoAdmin" content="数据可视化"></el-page-header></div>
       <!--
       <div>
        <el-card class="card-big">
          <el-container>
            <el-aside width="35px"><div class="verticalBar2"></div></el-aside>
            <el-main>
          <div style="font-size: 15px padding: 18px 0">
            在此处，您可以查看教我编程图书商城的各种数据。
          </div>
            </el-main>
          </el-container>
        </el-card>
      </div>
      -->
      <div>
        <el-card style="background-color: #3d678a;width: 900px;margin: 20px;">
          <el-row style="color: white">
            <el-col :span="6" style="text-align:center">
              <el-row><h2>124</h2></el-row><el-row><span>新增用户</span></el-row>
            </el-col>
            <el-col :span="6" style="text-align:center">
              <el-row><h2>35</h2></el-row><el-row><span>新增商家</span></el-row>
            </el-col>
            <el-col :span="6" style="text-align:center">
              <el-row><h2>415</h2></el-row><el-row><span>新增图书</span></el-row>
            </el-col>
            <el-col :span="6" style="text-align:center">
              <el-row><h2>229</h2></el-row><el-row><span>新增订单</span></el-row>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <div>
        <el-card class="card-big">
          <div>
            <div id="chartDom" style="width: 100%;height: 400px;"></div>
          </div>
        </el-card>
      </div>
      <div style="display:flex;justify-content:center;">
        <el-card class="card-small"><!--style="background-color: rgb(41,49,56)"-->
          <div>
            <div id="chartPie_book" style="width: 100%;height: 400px;"></div>
          </div>
        </el-card>
        <el-card class="card-small">
          <div>
            <div id="chartPie_order" style="width: 100%;height: 400px;"></div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import axios from "axios";
import { Message } from "element-ui";
export default {
  components: {},
  data() {
    return {
      isloading: false,
      dateList: [],
      classData: [],
      classPie: [],
      tempClass:{
        value: 1000,
        name: "示例",
      },
      orderPie: [],
      tempOrder: 0,
    };
  },
  /*
  mounted() {
    this.drawDomChart();
    this.drawPieChart_book();
    this.drawPieChart_order();
  },
  */
  computed: {},
  methods:{
    //回到管理员主页
    gotoAdmin() {
      this.$router.push("/adminManage");
    },
    //获取当前时间
    getNowDate() {
      var nowDate = new Date();
      var i = 6;
      for(;i>=0;i--) {
        this.dateList.push((nowDate.getMonth()+1) + '/' + (nowDate.getDate()-i));
      }
    },
    //获取不同分类图书数量
    getAll() {
      axios({
        url: this.$store.state.yuming+"/category/getAll",
        method: "GET",
        params: {},
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.classData = data;
          } else if (code == "3") {
            this.classData = [];
          } else {
            this.$message.error("获取分类失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    /*
    //获取classPie
    getClassPie() {
      console.log(this.classData);
      this.classData.forEach(mainClass => {
        this.tempClass.value = mainClass.book_num;
        this.tempClass.name = mainClass.main_name;
        //console.log(this.tempClass);
      });
    },
    */
    //获取各状态订单数量
    getOrderNum(s) {
      axios({
        url: this.$store.state.yuming+"/getOrderNum",
        method: "GET",
        params: {
          identity: 2,
          status: s,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.tempOrder = data;
            this.orderPie.push(this.tempOrder);
          } else if (code == "3") {
            this.tempOrder = 0;
          } else {
            this.$message.error("获取各状态订单数量失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    getOrderPie() {
      for(let i = 1;i <= 6;i++)
      {
        this.getOrderNum(i);
      }
    },
    //近七天新增
    drawDomChart() {
      this.chartDom = echarts.init(
        document.getElementById("chartDom"),
        "macarons"
      );
      this.chartDom.setOption({
        title: {
          text: '近七天新增数据'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['新增用户', '新增商家', '新增图书', '新增订单']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.dateList,
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '新增用户',
            type: 'line',
            stack: '总量',
            data: [98, 83, 55, 87, 126, 100, 124]
          },
          {
            name: '新增商家',
            type: 'line',
            stack: '总量',
            data: [20, 19, 23, 14, 31, 15, 35]
          },
          {
            name: '新增图书',
            type: 'line',
            stack: '总量',
            data: [103, 100, 202, 205, 300, 401, 415]
          },
          {
            name: '新增订单',
            type: 'line',
            stack: '总量',
            data: [208, 125, 104, 106, 255, 130, 229]
          },
        ]
      });
    },
    //各分类图书占比
    drawPieChart_book() {
      this.chartPie_book = echarts.init(
        document.getElementById("chartPie_book"),
        "macarons"
      );
      this.chartPie_book.setOption({
        title: {
          text: '各分类图书数量占比',
          //subtext: '纯属虚构',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: '图书数量',
            type: 'pie',
            radius: '50%',
            data: [
              {value: 95, name: '青春文学'},
              {value: 5649, name: '小说'},
              {value: 134, name: '少儿文学'},
              {value: 136, name: '教育'},
              {value: 991, name: '网络文学'},
              {value: 2282, name: '文艺'},
              {value: 8865, name: '其他'},
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              }
            }
          }
        ]
      });
    },
    //各状态订单数量占比
    drawPieChart_order() {
      this.chartPie_order = echarts.init(
        document.getElementById("chartPie_order"),
        "macarons"
      );
      this.chartPie_order.setOption({
        title: {
          text: '各状态未完成订单数量占比',
          //subtext: '纯属虚构',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: '订单数量',
            type: 'pie',
            radius: '50%',
            data: [
              {value: 25, name: '已取消'},
              {value: 67, name: '未付款'},
              {value: 129, name: '未发货'},
              {value: 346, name: '未收货'},
              {value: 256, name: '已收货'},
              {value: 456, name: '已评价'},
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              }
            }
          }
        ]
      });
    },
  },
  async created() {
    this.isLoading = true;
    await this.getNowDate();
    //await this.getAll();
    await this.getOrderPie();
    this.drawDomChart();
    this.drawPieChart_book();
    this.drawPieChart_order();
    this.isLoading = false;
  },
};
</script>

<style>
.home {
  display: flex;
  justify-content: center;
}

.content{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.header{
  display: flex;
  justify-content: space-between;
  margin: 20px;
}

.title{
  font-size: 35px;
  padding: 30px 10px;
}

.card-big {
  width: 900px;
  margin: 0px 20px;
}

.card-small {
  width: 440px;
  margin: 20px 10px;
}

.verticalBar2 {
  width: 4px;
  height: 50px;
  background: #3d678a;
  display: inline-block;
  margin-top: 8px;
  vertical-align: top;
  margin-right: 0px;
  margin-left: 30px;
  border-radius: 20%;
}

</style>