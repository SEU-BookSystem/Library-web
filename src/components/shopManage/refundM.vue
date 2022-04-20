<template>
  <div v-loading="isLoading">
    <div class="header">
      <div class="logo3">
        <img width="250px" src="../../assets/jwbc.png" />
      </div>
      <div class="title">店铺管理</div>
    </div>
    <div style="margin: 2% 10%">
      <el-page-header @back="goToManage" content="退款管理"></el-page-header>
    </div>
    <div style="margin: 2% 10%">
      <el-row style="margin: 0% 0% 5%">
        <el-card>
          <el-container>
            <el-aside
              style="width: 35px; padding-top: 10px; padding-bottom: 20px"
              ><div class="verticalBar1"></div
            ></el-aside>
            <el-main>
              <span style="font-weight: 1000">欢迎您，亲爱的店家 </span>
              <p style="font-weight: 1000">
                您可以在本页面进行退款管理，包括: 查看订单详情 同意退款 拒绝退款
              </p>
            </el-main>
          </el-container>
        </el-card>
      </el-row>
    </div>
    <div style="margin: 3% 10% 0%">
      <el-row style="margin: 0% 0% 5%">
        <el-card>
          <el-col :span="8">
            <p style="text-align: center">今日新增退款订单数</p>
            <p
              style="
                font-size: 40px;
                height: 160px;
                line-height: 160px;
                display: block;
                text-align: center;
              "
            >
              {{ newRefundOrder }}
            </p>
          </el-col>
          <el-col :span="16" style="text-align: center">
            <p>各订单类型所占比例</p>
            <div>
              <div id="chartPie" class="pie-wrap1"></div>
            </div>
          </el-col>
        </el-card>
      </el-row>
    </div>
    <div style="margin: 1.5% 10%">
      <el-card>
        <el-row
          ><span>选择查看的订单状态：</span
          ><el-button
            type="text"
            @click.native="goToFirst(0)"
            :class="{ btn_active: flag === 0 }"
            id="Button0"
            >全部</el-button
          ><el-button
            type="text"
            @click.native="goToFirst(1)"
            :class="{ btn_active: flag === 1 }"
            id="Button1"
            >申请退款中</el-button
          ><el-button
            type="text"
            @click.native="goToFirst(2)"
            :class="{ btn_active: flag === 2 }"
            id="Button2"
            >同意退款</el-button
          ><el-button
            type="text"
            @click.native="goToFirst(3)"
            :class="{ btn_active: flag === 3 }"
            id="Button3"
            >拒绝退款</el-button
          ><el-button
            type="text"
            @click.native="goToFirst(4)"
            :class="{ btn_active: flag === 4 }"
            id="Button4"
            >申请换货中</el-button
          ><el-button
            type="text"
            @click.native="goToFirst(5)"
            :class="{ btn_active: flag === 5 }"
            id="Button5"
            >同意换货</el-button
          ><el-button
            type="text"
            @click.native="goToFirst(6)"
            :class="{ btn_active: flag === 6 }"
            id="Button6"
            >拒绝换货</el-button
          >
          <el-button
            type="text"
            @click.native="goToFirst(7)"
            :class="{ btn_active: flag === 7 }"
            id="Button7"
            >申请退货退款中</el-button
          ><el-button
            type="text"
            @click.native="goToFirst(8)"
            :class="{ btn_active: flag === 8 }"
            id="Button8"
            >同意退货退款</el-button
          >
          <el-button
            type="text"
            @click.native="goToFirst(9)"
            :class="{ btn_active: flag === 9 }"
            id="Button9"
            >拒绝退货退款</el-button
          >
        </el-row>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          v-loading="dataLoading"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column
            prop="return_time"
            label="日期"
            width="150"
            :formatter="dateFormat"
          >
          </el-table-column>
          <el-table-column label="用户名" width="150">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column label="总价" width="150" prop="book_price">
            <template slot-scope="scope">￥{{ scope.row.book_price }}</template>
          </el-table-column>
          <el-table-column label="理由" width="200" prop="return_reason">
          </el-table-column>
          <el-table-column label="订单状态" width="180" prop="state">
            <template slot-scope="scope"
              ><span v-if="scope.row.return_status == 1">申请退款中</span>
              <span v-if="scope.row.return_status == 2">同意退款</span>
              <span v-if="scope.row.return_status == 3">拒绝退款</span>
              <span v-if="scope.row.return_status == 4">申请换货中</span>
              <span v-if="scope.row.return_status == 5">同意换货</span>
              <span v-if="scope.row.return_status == 6">拒绝换货</span
              ><span v-if="scope.row.return_status == 7">申请退货退款中</span
              ><span v-if="scope.row.return_status == 8">同意退货退款</span
              ><span v-if="scope.row.return_status == 9"
                >拒绝退货退款</span
              ></template
            >
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope"
              ><el-button
                type="text"
                style="font-size: 15px"
                @click="handleInfo(scope.row.id)"
                >查看详情</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <el-button
                type="text"
                style="font-size: 15px"
                @click="handleConfirm(scope.row.return_status, scope.row.id)"
                :disabled="
                  scope.row.return_status == 2 ||
                  scope.row.return_status == 3 ||
                  scope.row.return_status == 5 ||
                  scope.row.return_status == 6 ||
                  scope.row.return_status == 8 ||
                  scope.row.return_status == 9
                "
                >同意</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <el-button
                type="text"
                style="font-size: 15px"
                @click="handleRefuse(scope.row.return_status, scope.row.id)"
                :disabled="
                  scope.row.return_status == 2 ||
                  scope.row.return_status == 3 ||
                  scope.row.return_status == 5 ||
                  scope.row.return_status == 6 ||
                  scope.row.return_status == 8 ||
                  scope.row.return_status == 9
                "
                >拒绝</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-row style="text-align: center">
          <el-pagination
            :current-page="currentPage"
            @current-change="handleCurrentChange"
            :total="count"
            layout="prev, pager, next, jumper"
          >
          </el-pagination>
        </el-row>
      </el-card>
    </div>
    <div style="margin: 0% 10% 3%">
      <el-button @click="batchConfirm" style="margin-left: 92%" type="primary"
        >批量同意</el-button
      >
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import axios from "axios";
import qs from "qs";
import moment from "moment";
export default {
  data() {
    return {
      isLoading: false,
      dataLoading: false,
      newRefundOrder: 0,
      num: [],
      currentPage: 1,
      count: 0,
      flag: 0,
      reason: "",
      multipleSelection: [],
      Order_Book_Ids: [],
      tableData: [],
    };
  },
  methods: {
    goToManage() {
      this.$router.push("/shopManage#reloaded");
    },
    handleInfo(id) {
      this.$router.push(`/refundInfo/${id}`);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getReback(this.flag);
    },
    //时间格式化
    dateFormat(row, column) {
      var date = row[column.property];
      return moment(date).format("YYYY-MM-DD");
    },
    //获取初始数据
    getOrder() {
      axios({
        url: this.$store.state.yuming + "/order/reback",
        method: "POST",
        params: {
          status: 0,
          page_num: this.currentPage,
          order_num: 10,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.tableData = data;
          } else {
            this.$message.error("获取退款订单失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
      //获取数量
      axios({
        url: this.$store.state.yuming + "/order/rebackCount",
        method: "POST",
        params: {
          status: 0,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.count = data;
            this.newRefundOrder = data;
            for (let i = 1; i <= 9; i++) this.getNum(i);
          } else {
            this.$message.error("获取退款订单失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    //获取各种状态的个数
    getNum(val) {
      axios({
        url: this.$store.state.yuming + "/order/rebackCount",
        method: "POST",
        params: {
          status: val,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.num[val - 1] = data;
            this.$nextTick(() => {
              this.drawPieChart();
            });
          } else {
            this.$message.error("获取退款订单个数失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    //获取数据
    goToFirst(val) {
      this.currentPage = 1;
      this.getReback(val);
    },
    getReback(val) {
      this.flag = val;
      document.getElementById("Button" + val).blur();
      axios({
        url: this.$store.state.yuming + "/order/reback",
        method: "POST",
        params: {
          status: val,
          page_num: this.currentPage,
          order_num: 10,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.tableData = data;
          } else {
            this.$message.error("获取退款订单失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
      axios({
        url: this.$store.state.yuming + "/order/rebackCount",
        method: "POST",
        params: {
          status: val,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.count = data;
          } else {
            this.$message.error("获取退款订单个数失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    //根据不同的状态来同意退款，换货，还是退货退款
    handleConfirm(status, id) {
      if (status == 1) {
        this.$confirm("是否同意退款?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          axios({
            url: this.$store.state.yuming + "/shop/returnPass",
            method: "POST",
            params: {
              order_book_id: id,
            },
          })
            .then((res) => {
              const { code } = res.data;
              if (code == "200") {
                this.dataLoading = true;
                this.getReback(this.flag);
                this.dataLoading = false;
                this.$message.success("同意退款成功");
              } else {
                this.$message.error("同意退款失败，请刷新");
              }
            })
            .catch(() => {
              this.$message.error("出现错误，请稍后再试");
            });
        });
      } else if (status == 4) {
        this.$confirm("是否同意换货?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          axios({
            url: this.$store.state.yuming + "/shop/exchangePass",
            method: "POST",
            params: {
              order_book_id: id,
            },
          })
            .then((res) => {
              const { code } = res.data;
              if (code == "200") {
                this.dataLoading = true;
                this.getReback(this.flag);
                this.dataLoading = false;
                this.$message.success("同意换货成功");
              } else {
                this.$message.error("同意换货失败，请刷新");
              }
            })
            .catch(() => {
              this.$message.error("出现错误，请稍后再试");
            });
        });
      } else if (status == 7) {
        this.$confirm("是否同意退货退款?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          axios({
            url: this.$store.state.yuming + "/shop/returnAllPass",
            method: "POST",
            params: {
              order_book_id: id,
            },
          })
            .then((res) => {
              const { code } = res.data;
              if (code == "200") {
                this.dataLoading = true;
                this.getReback(this.flag);
                this.dataLoading = false;
                this.$message.success("同意退货退款成功");
              } else {
                this.$message.error("同意退货退款失败，请刷新");
              }
            })
            .catch(() => {
              this.$message.error("出现错误，请稍后再试");
            });
        });
      }
    },
    handleRefuse(status, id) {
      if (status == 1) {
        this.$prompt("请输入拒绝退款的理由", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          input: this.reason,
          type: "warning",
        })
          .then(({ value }) => {
            axios({
              url: this.$store.state.yuming + "/shop/returnFail",
              method: "POST",
              params: {
                order_book_id: id,
                check_opinion: value,
              },
            })
              .then((res) => {
                const { code } = res.data;
                if (code == "200") {
                  this.dataLoading = true;
                  this.getReback(this.flag);
                  this.dataLoading = false;
                  this.$message.success("拒绝退款成功");
                  this.reason = "";
                } else {
                  this.$message.error("拒绝退款失败，请刷新");
                  this.reason = "";
                }
              })
              .catch(() => {
                this.$message.error("出现错误，请稍后再试");
                this.reason = "";
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已放弃拒绝退款",
            });
          });
      } else if (status == 4) {
        this.$prompt("请输入拒绝换货的理由", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          input: this.reason,
          type: "warning",
        })
          .then(({ value }) => {
            axios({
              url: this.$store.state.yuming + "/shop/exchangeFail",
              method: "POST",
              params: {
                order_book_id: id,
                check_opinion: value,
              },
            })
              .then((res) => {
                const { code } = res.data;
                if (code == "200") {
                  this.dataLoading = true;
                  this.getReback(this.flag);
                  this.dataLoading = false;
                  this.$message.success("拒绝换货成功");
                  this.reason = "";
                } else {
                  this.$message.error("拒绝换货失败，请刷新");
                  this.reason = "";
                }
              })
              .catch(() => {
                this.$message.error("出现错误，请稍后再试");
                this.reason = "";
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已放弃拒绝换货",
            });
          });
      } else if (status == 7) {
        this.$prompt("请输入拒绝退货退款的理由", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          input: this.reason,
          type: "warning",
        })
          .then(({ value }) => {
            axios({
              url: this.$store.state.yuming + "/shop/returnAllFail",
              method: "POST",
              params: {
                order_book_id: id,
                check_opinion: value,
              },
            })
              .then((res) => {
                const { code } = res.data;
                if (code == "200") {
                  this.dataLoading = true;
                  this.getReback(this.flag);
                  this.dataLoading = false;
                  this.$message.success("拒绝退货退款成功");
                  this.reason = "";
                } else {
                  this.$message.error("拒绝退货退款失败，请刷新");
                  this.reason = "";
                }
              })
              .catch(() => {
                this.$message.error("出现错误，请稍后再试");
                this.reason = "";
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已放弃拒绝退货退款",
            });
          });
      }
    },
    //批量同意退款
    batchConfirm() {
      if (this.multipleSelection[0].status == 1) {
        this.$confirm("是否批量同意退款?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            for (let i = 0; i < this.multipleSelection.length; i++) {
              this.Order_Book_Ids.push(this.multipleSelection[i].id);
            }
            axios({
              url: this.$store.state.yuming + "/shop/batReturnPass",
              method: "POST",
              params: {
                order_book_id: this.Order_Book_Ids,
              },
              paramsSerializer: (params) => {
                return qs.stringify(params, { indices: false });
              },
            })
              .then((res) => {
                const { code } = res.data;
                if (code == "200") {
                  this.dataLoading = true;
                  this.getReback(this.flag);
                  this.dataLoading = false;
                  this.$message.success("批量同意退款成功");
                  this.Order_Book_Ids = [];
                } else {
                  this.$message.error("批量同意退款失败，请刷新");
                  this.Order_Book_Ids = [];
                }
              })
              .catch(() => {
                this.$message.error("出现错误，请稍后再试");
                this.Order_Book_Ids = [];
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已放弃批量同意退款",
            });
          });
      } else if (this.multipleSelection[0].status == 4) {
        this.$confirm("是否批量同意换货?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            for (let i = 0; i < this.multipleSelection.length; i++) {
              this.Order_Book_Ids.push(this.multipleSelection[i].id);
            }
            axios({
              url: this.$store.state.yuming + "/shop/batExchangePass",
              method: "POST",
              params: {
                order_book_id: this.Order_Book_Ids,
              },
              paramsSerializer: (params) => {
                return qs.stringify(params, { indices: false });
              },
            })
              .then((res) => {
                const { code } = res.data;
                if (code == "200") {
                  this.dataLoading = true;
                  this.getReback(this.flag);
                  this.dataLoading = false;
                  this.$message.success("批量同意换货成功");
                  this.Order_Book_Ids = [];
                } else {
                  this.$message.error("批量同意换货失败，请刷新");
                  this.Order_Book_Ids = [];
                }
              })
              .catch(() => {
                this.$message.error("出现错误，请稍后再试");
                this.Order_Book_Ids = [];
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已放弃批量同意换货",
            });
          });
      } else {
        this.$confirm("是否批量同意退货退款?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            for (let i = 0; i < this.multipleSelection.length; i++) {
              this.order_book_ids.push(this.multipleSelection[i].id);
            }
            axios({
              url: this.$store.state.yuming + "/shop/batReturnAllPass",
              method: "POST",
              params: {
                Order_Book_Ids: this.Order_Book_Ids,
              },
              paramsSerializer: (params) => {
                return qs.stringify(params, { indices: false });
              },
            })
              .then((res) => {
                const { code } = res.data;
                if (code == "200") {
                  this.dataLoading = true;
                  this.getReback(this.flag);
                  this.dataLoading = false;
                  this.$message.success("批量同意退货退款成功");
                  this.Order_Book_Ids = [];
                } else {
                  this.$message.error("批量同意退货退款失败，请刷新");
                  this.Order_Book_Ids = [];
                }
              })
              .catch(() => {
                this.$message.error("出现错误，请稍后再试");
                this.Order_Book_Ids = [];
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已放弃批量同意退货退款",
            });
          });
      }
    },
    drawPieChart() {
      this.chartPie = echarts.init(
        document.getElementById("chartPie"),
        "macarons"
      );
      this.chartPie.setOption({
        //显示在上面的文字
        tooltip: {
          trigger: "item",
          // formatter: "{a}<br/>{b}: <br/>{c}({d}%)",  其中 {a}指向name名称（访问来源）
          formatter: "{b}: <br/>{c}({d}%)",
        },
        legend: {
          data: [
            "申请退款中",
            "同意退款",
            "拒绝退款",
            "申请换货中",
            "同意换货",
            "拒绝换货",
            "申请退货退款中",
            "同意退货退款",
            "拒绝退货退款",
          ],
          right: 250,
          top: "center",
          itemGap: 5, //设置图例的间距
          orient: "vertical",
          // 下面注释的代码是控制分类放在哪个地方,需要体验的话，直接把上面的代码注释，把下面的代码解开注释即可
          //   data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"],
          //   left: "center",
          //   top: "bottom",
          //   orient: "horizontal"
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            //圆圈的粗细
            radius: ["50%", "80%"],
            //圆圈的位置
            center: ["40%", "50%"],
            data: [
              {
                value: this.num[0],
                name: "申请退款中",
              },
              {
                value: this.num[1],
                name: "同意退款",
              },
              {
                value: this.num[2],
                name: "拒绝退款",
              },
              {
                value: this.num[3],
                name: "申请换货中",
              },
              {
                value: this.num[4],
                name: "同意换货",
              },
              {
                value: this.num[5],
                name: "拒绝换货",
              },
              {
                value: this.num[6],
                name: "申请退货退款中",
              },
              {
                value: this.num[7],
                name: "同意退货退款",
              },
              {
                value: this.num[8],
                name: "拒绝退货退款",
              },
            ],
            //动画持续时间：2秒
            animationDuration: 2000,
            //控制是否显示指向文字的,默认为true
            label: {
              show: false,
              position: "center",
              //以下代码可以代表指向小文字的
              //   show: true,
              //   formatter: "{b} : {c} ({d}%)",
              //   textStyle: {
              //     color: "#333",
              //     fontSize: 14,
              //   },
            },
            itemStyle: {
              //这里是更添加阴影
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
              //这里是更改颜色
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
  },
  async created() {
    this.isLoading = true;
    await this.getOrder();
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
.logo3 {
  display: flex;
  justify-content: center;
  width: 200px;
  margin: 20px 100px;
  position: relative;
  right: 250px;
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
.pie-wrap1 {
  width: 100%;
  height: 200px;
}
.title {
  font-size: 35px;
  padding: 30px 10px;
  position: relative;
  left: 180px;
}
.btn_active {
  color: black;
}
</style>
