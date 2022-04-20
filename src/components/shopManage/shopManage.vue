<template>
  <div v-loading="isLoading">
    <div class="header">
      <div class="logo4">
        <img width="250px" src="../../assets/jwbc.png" />
      </div>
      <div>
        <el-button
          size="meduim"
          class="pageperson"
          icon="el-icon-s-custom"
          style="position: relative; left: 20px"
          @click="gotoPersonPage"
          >个人主页</el-button
        >
      </div>
    </div>
    <div style="display: flex; justify-content: center">
      <el-row>
        <el-card style="width: 916px; margin: 20px">
          <el-container>
            <el-aside
              style="width: 35px; padding-top: 20px; padding-bottom: 20px"
              ><div class="verticalBar1"></div
            ></el-aside>
            <el-main>
              <span style="font-weight: 1000">欢迎您，亲爱的店家 </span
              ><span
                style="font-weight: 1000; color: #ff623e; font-size: 30px"
                >{{ shopname }}</span
              >
              <p style="font-weight: 1000">
                您可以在本页面使用如下功能: 图书管理 或 订单管理 或 退款管理 或
                信息管理
              </p>
            </el-main>
          </el-container>
        </el-card>
      </el-row>
    </div>
    <div class="box2">
      <el-button type="text">
        <el-card class="box-card2">
          <el-col :span="24" style="text-align: center">
            <p style="margin: 1%">各图书类别数量</p>
            <div>
              <div id="chartBar" class="bar-wrap"></div>
            </div>
          </el-col> </el-card
      ></el-button>
      <el-button type="text">
        <el-card class="box-card2">
          <el-col :span="6" style="text-align: center">
            <p style="margin: 1%">今日新增订单数</p>
            <p style="font-size: 40px">{{ ordercount }}</p>
          </el-col>
          <el-col :span="18" style="text-align: center">
            <p style="margin: 1%">各订单类型所占比例</p>
            <div>
              <div id="chartPie" class="pie-wrap"></div>
            </div>
          </el-col>
        </el-card>
      </el-button>
    </div>
    <div class="box2">
      <el-button type="text" @click.native="goToBookM">
        <el-card class="box-card2">
          <i
            class="iconfont-chuangyexiangmu"
            style="font-size: 50px; margin: 50px"
          />
          <div class="text item">图书管理</div>
          <i style="color: #909399">修改图书信息，新增图书，下架图书。</i>
        </el-card>
      </el-button>
      <el-button type="text" @click="goToOrderM">
        <el-card class="box-card2">
          <i class="iconfont-dingdan" style="font-size: 50px; margin: 50px" />
          <div class="text item">订单管理</div>
          <i style="color: #909399">查看订单详情，确认订单，取消订单。</i>
        </el-card>
      </el-button>
    </div>
    <div class="box2">
      <el-button type="text" @click="goToRefundM">
        <el-card class="box-card2">
          <i class="iconfont-shouhou" style="font-size: 50px; margin: 50px" />
          <div class="text item">退款管理</div>
          <i style="color: #909399">查看退款订单详情，同意退款，拒绝退款。</i>
        </el-card>
      </el-button>
      <el-button type="text" @click="goToShopInfo">
        <el-card class="box-card2">
          <i
            class="iconfont-shangpu-copy"
            style="font-size: 50px; margin: 50px"
          />
          <div class="text item">信息管理</div>
          <i style="color: #909399">查看、修改店铺信息，注销店铺。</i>
        </el-card>
      </el-button>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import axios from "axios";
import { Message } from "element-ui";
export default {
  data() {
    return {
      isLoading: false,
      ordercount: 0,
      shopname: "",
      shop_id: "",
      //七种图书的本数
      num: [],
      ordernum: [],
      categoryList: [
        {
          book_num: 0,
          main_name: "",
          main_id: "",
          second_category: [{ book_num: "", second_name: "", second_id: "" }],
        },
      ],
    };
  },
  computed: {
    hasUsername() {
      return this.$store.state.username;
    },
  },
  methods: {
    gotoPersonPage() {
      this.$router.push("/person");
    },
    goToBookM() {
      this.$router.push("/bookM");
    },
    goToOrderM() {
      this.$router.push("/orderM");
    },
    goToRefundM() {
      this.$router.push("/refundM");
    },
    goToShopInfo() {
      this.$router.push("/shopInfo");
    },
    //获取所有目录
    getAllCategory() {
      axios({
        url: this.$store.state.yuming + "/category/getAll",
        method: "GET",
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.categoryList = data;
            for (let i = 0; i < 7; i++) this.getBooknums(i);
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    drawBarChart() {
      this.chartBar = echarts.init(
        document.getElementById("chartBar"),
        "macarons"
      );
      this.chartBar.setOption({
        color: function (params) {
          var colorList = [
            "#5470c6",
            "#91cc75",
            "#fac858",
            "#ee6666",
            "#73c0de",
            "#3ba272",
            "#fc8452",
            "#9a60b4",
            "#ea7ccc",
          ];
          return colorList[params.dataIndex];
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
          height: 180,
        },
        xAxis: [
          {
            type: "category",
            data: [
              "青春文学",
              "小说",
              "少儿文学",
              "教育",
              "网络文学",
              "文艺",
              "其他",
            ],
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              //---坐标轴 标签
              interval: 0,
              show: true, //---是否显示
              inside: false, //---是否朝内
              rotate: 0, //---旋转角度
              margin: 5, //---刻度标签与轴线之间的距离
              color: "#6B6B6B",
              //---默认取轴线的颜色
            },
            axisLine: {
              //---坐标轴 轴线
              show: true, //---是否显示
              lineStyle: {
                color: "#F6F6F6",
                width: 5,
                type: "solid",
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              //去掉坐标轴刻线
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ["#F6F6F6"],
                width: 1,
                type: "solid",
              },
            },
            axisLabel: {
              //---坐标轴 标签
              show: true, //---是否显示
              inside: false, //---是否朝内
              rotate: 0, //---旋转角度
              margin: 5, //---刻度标签与轴线之间的距离
              color: "#6B6B6B", //---默认取轴线的颜色
            },
            axisLine: {
              //---坐标轴 轴线
              show: false, //---是否显示
            },
          },
        ],
        series: [
          {
            name: "数量",
            type: "bar",
            data: this.num,
            animationDuration: 2000,
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList = [
                    "#5470c6",
                    "#91cc75",
                    "#fac858",
                    "#ee6666",
                    "#73c0de",
                    "#3ba272",
                    "#fc8452",
                    "#9a60b4",
                    "#ea7ccc",
                  ];
                  return colorList[params.dataIndex];
                },
              },
            },
          },
        ],
      });
    },
    drawPieChart() {
      this.chartPie = echarts.init(
        document.getElementById("chartPie"),
        "macarons"
      );
      this.chartPie.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{b}: <br/>{c}({d}%)",
        },
        legend: {
          right: 20,
          top: "center",
          itemGap: 5, //设置图例的间距
          orient: "vertical",
          data: ["取消订单", "未付款", "未发货", "已发货", "已收货", "已评价"],
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["50%", "80%"],
            center: ["30%", "50%"],
            data: [
              {
                value: this.ordernum[0],
                name: "取消订单",
              },
              {
                value: this.ordernum[1],
                name: "未付款",
              },
              {
                value: this.ordernum[2],
                name: "未发货",
              },
              {
                value: this.ordernum[3],
                name: "已发货",
              },
              {
                value: this.ordernum[4],
                name: "已收货",
              },
              {
                value: this.ordernum[5],
                name: "已评价",
              },
            ],
            animationDuration: 2000,
            label: {
              show: false,
              position: "center",
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
              normal: {
                color: function (params) {
                  var colorList = [
                    "#5470c6",
                    "#91cc75",
                    "#fac858",
                    "#ee6666",
                    "#73c0de",
                    "#3ba272",
                    "#fc8452",
                    "#9a60b4",
                    "#ea7ccc",
                  ];
                  return colorList[params.dataIndex];
                },
              },
            },
          },
        ],
      });
    },
    //获取总订单数
    getOrderCount() {
      axios({
        url: this.$store.state.yuming + "/getOrderNum",
        method: "GET",
        params: {
          status: 0,
          identity: 1,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.ordercount = data;
            for (let i = 1; i < 7; i++) this.getOrderNums(i);
          } else {
            this.$message.error("获取订单数目失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    //获取各类订单的数量
    getOrderNums(val) {
      axios({
        url: this.$store.state.yuming + "/getOrderNum",
        method: "GET",
        params: {
          status: val,
          identity: 1,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.ordernum[val-1] = data;
            this.$nextTick(() => {
              this.drawPieChart();
            });
          } else {
            this.$message.error("获取订单数目失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    //获取各类书的数量
    getBooknums(val) {
      axios({
        url: this.$store.state.yuming + "/book/getPageCount",
        method: "GET",
        params: {
          main_category_id: this.categoryList[val].main_id,
          second_category_id: "",
          year: "",
          year_before: "",
          year_after: "",
          shop_id: this.shop_id,
        },
      })
        .then((res) => {
          const { code, count } = res.data;
          if (code == "200") {
            this.num[val] = count;
            this.drawBarChart();
          } else {
            this.$message.error("获取图书数目失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    getShopInfo() {
      axios({
        url: this.$store.state.yuming + "/shop/getPassed",
        method: "GET",
        params: {
          username: this.hasUsername,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.shopname = data.shop_name;
            this.shop_id = data.id;
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    mounted: function () {
      if (location.href.indexOf("#reloaded") == -1) {
        location.href = location.href + "#reloaded";
        location.reload();
      }
    },
  },
  async created() {
    this.isLoading = true;
    await this.getShopInfo();
    await this.getAllCategory();
    await this.getOrderCount();
    await this.mounted();
    this.isLoading = false;
  },
};
</script>

<style acoped>
.header {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-left: 10%;
  margin-right: 10%;
}
.logo4 {
  display: flex;
  justify-content: center;
  width: 200px;
  margin: 20px 100px;
  position: relative;
  right: 100px;
}
.shopping {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
}
.index {
  display: flex;
  justify-content: center;
  margin: 20px;
}
.el-colStyle {
  display: flex;
  justify-content: center;
}
.el-cardStyle {
  width: 440px;
  margin: 10px;
  display: flex;
  min-height: 100px;
  justify-content: center;
  align-items: center;
  text-align: center;
  vertical-align: middle;
}
.spanStyle {
  font-size: 30px;
}
.verticalBar1 {
  width: 3px;
  height: 100%;
  background: rgb(60, 59, 105);
  display: inline-block;
  vertical-align: top;
  margin-right: 0px;
  margin-left: 30px;
  border-radius: 20%;
}
.bar-wrap {
  width: 100%;
  height: 200px;
}
.pie-wrap {
  width: 100%;
  height: 202.98px;
}
.text {
  font-size: 20px;
}
.item {
  padding: 18px 0;
}
.box2 {
  display: flex;
  justify-content: center;
}
.box-card2 {
  width: 440px;
  margin: 10px;
}
</style>

