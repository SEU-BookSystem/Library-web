<template>
  <div v-loading="isLoading">
    <div class="header">
      <div class="logo3">
        <img width="250px" src="../../assets/jwbc.png" />
      </div>
      <div class="title">店铺管理</div>
    </div>
    <div style="margin: 2% 10%">
      <el-page-header @back="goToManage" content="订单管理"></el-page-header>
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
                您可以在本页面进行订单管理，包括: 查看订单详情 确认订单 取消订单
              </p>
            </el-main>
          </el-container>
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
            >取消订单</el-button
          ><el-button
            type="text"
            @click.native="goToFirst(2)"
            :class="{ btn_active: flag === 2 }"
            id="Button2"
            >未付款</el-button
          ><el-button
            type="text"
            @click.native="goToFirst(3)"
            :class="{ btn_active: flag === 3 }"
            id="Button3"
            >未发货</el-button
          ><el-button
            type="text"
            @click.native="goToFirst(4)"
            :class="{ btn_active: flag === 4 }"
            id="Button4"
            >已发货</el-button
          ><el-button
            type="text"
            @click.native="goToFirst(5)"
            :class="{ btn_active: flag === 5 }"
            id="Button5"
            >已收货</el-button
          ><el-button
            type="text"
            @click.native="goToFirst(6)"
            :class="{ btn_active: flag === 6 }"
            id="Button6"
            >已评价</el-button
          ></el-row
        >
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
            label="日期"
            prop="create_time"
            width="200"
            :formatter="dateFormat"
            >
          </el-table-column>
          <el-table-column label="用户名" width="200">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column
            label="总价"
            width="200"
            prop="total"
          >
            <template slot-scope="scope">￥{{ scope.row.total }}</template>
          </el-table-column>
          <el-table-column
            label="订单状态"
            width="200"
            prop="status"
          >
            <template slot-scope="scope"
              ><span v-if="scope.row.status == 1">取消订单</span
              ><span v-if="scope.row.status == 2">未付款</span>
              <span v-if="scope.row.status == 3">未发货</span>
              <span v-if="scope.row.status == 4">已发货</span>
              <span v-if="scope.row.status == 5">已收货</span>
              <span v-if="scope.row.status == 6">已评价</span></template
            >
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope"
              ><el-button
                type="text"
                style="font-size: 15px"
                @click.native="handleInfo(scope.row.order_id)"
                >查看详情</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <el-button
                type="text"
                style="font-size: 15px"
                @click="handleConfirm(scope.row.order_id)"
                :disabled="
                  scope.row.status == 1 ||
                  scope.row.status == 2 ||
                  scope.row.status == 4 ||
                  scope.row.status == 5 ||
                  scope.row.status == 6
                "
                >确认订单</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <el-button
                type="text"
                style="font-size: 15px"
                @click="handleRefuse(scope.row.order_id)"
                :disabled="
                  scope.row.status == 1 ||
                  scope.row.status == 4 ||
                  scope.row.status == 5 ||
                  scope.row.status == 6
                "
                >取消订单</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-row style="text-align: center">
          <el-pagination
            :current-page="currentPage"
            @current-change="handleCurrentChange"
            :total="ordercount"
            layout="prev, pager, next, jumper"
          >
          </el-pagination>
        </el-row>
      </el-card>
    </div>
    <div style="margin: 0% 10% 3%">
      <el-button @click="batchConfirm" style="margin-left: 78%" type="primary"
        >批量确认订单</el-button
      >
      <el-button @click="batchRefuse" type="warning">批量取消订单</el-button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import qs from "qs";
import moment from "moment";
export default {
  data() {
    return {
      flag:0,
      currentPage: 1,
      ordercount: 0,
      isLoading: false,
      dataLoading: false,
      tableData: [
        {
          shop_id: "",
          total: "",
          send_time: "",
          books: [
            {
              book_image_b: "",
              book_name: "",
              number: 0,
              update_time: "",
              rate: 0,
              return_time: "",
              price: 0,
              book_image_s: "",
              press: "",
              order_book_id: "",
              transport_status: 0,
              author: "",
              remark_status: 0,
              book_id: "",
              repertory: 0,
              volume: 0,
              return_status: 0,
              remark_time: "",
              order_id: "",
              book_total_price: "",
              remark: "",
              exchange_address_id: "",
            },
          ],
          name: "",
          create_time: "",
          firm_time: "",
          shop_name: "",
          order_id: "",
          username: "",
          status: "",
        },
      ],
      multipleSelection: [],
      Order_Ids: [],
    };
  },
  methods: {
    goToManage() {
      this.$router.push("/shopManage#reloaded");
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleInfo(order_id) {
      this.$router.push(`/orderInfo/${order_id}`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.filterStatus(this.flag);
    },
    //时间格式化
    dateFormat(row, column) {
      var date = row[column.property];
      return moment(date).format("YYYY-MM-DD");
    },
    //获取这个店铺的所有订单
    getOrder() {
      axios({
        url: this.$store.state.yuming + "/getOrder",
        method: "GET",
        params: {
          page_num: this.currentPage,
          order_num: 10,
          status: 0,
          identity: 1,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.tableData = data;
          } else {
            this.$message.error("获取订单失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
      //获取订单数
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
          } else {
            this.$message.error("获取订单数目失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    //确认订单，相当于发货
    handleConfirm(id) {
      this.$confirm("是否确认订单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          axios({
            url: this.$store.state.yuming + "/shop/sendOrder",
            method: "POST",
            params: {
              order_id: id,
            },
          })
            .then((res) => {
              const { code } = res.data;
              if (code == "200") {
                this.dataLoading = true;
                this.filterStatus(this.flag);
                this.dataLoading = false;
                this.$message.success("确认订单成功");
              } else {
                this.$message.error("确认订单失败，请刷新");
              }
            })
            .catch(() => {
              this.$message.error("出现错误，请稍后再试");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已放弃确认订单",
          });
        });
    },
    //取消订单
    handleRefuse(id) {
      this.$confirm("是否取消订单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          axios({
            url: this.$store.state.yuming + "/order/cancel",
            method: "POST",
            params: {
              order_id: id,
            },
          })
            .then((res) => {
              const { code } = res.data;
              if (code == "200") {
                this.dataLoading = true;
                this.filterStatus(this.flag);
                this.dataLoading = false;
                this.$message.success("取消订单成功");
              } else {
                this.$message.error("取消订单失败，请刷新");
              }
            })
            .catch(() => {
              this.$message.error("出现错误，请稍后再试");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已放弃取消订单",
          });
        });
    },
    //不同订单状态筛选
    goToFirst(value) {
      this.currentPage = 1;
      this.filterStatus(value);
    },
    filterStatus(value) {
      this.flag = value;
      document.getElementById("Button" + value).blur();
      axios({
        url: this.$store.state.yuming + "/getOrder",
        method: "GET",
        params: {
          page_num: this.currentPage,
          order_num: 10,
          status: value,
          identity: 1,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.tableData = data;
          } else {
            this.$message.error("获取订单失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
      //获取订单数
      axios({
        url: this.$store.state.yuming + "/getOrderNum",
        method: "GET",
        params: {
          status: value,
          identity: 1,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.ordercount = data;
          } else {
            this.$message.error("获取订单数目失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    //批量确认订单
    batchConfirm() {
      this.$confirm("是否批量确认订单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          for (let i = 0; i < this.multipleSelection.length; i++) {
            this.Order_Ids.push(this.multipleSelection[i].order_id);
          }
          axios({
            url: this.$store.state.yuming + "/shop/batSendOrder",
            method: "POST",
            params: {
              Order_Ids: this.Order_Ids,
            },
            paramsSerializer: (params) => {
              return qs.stringify(params, { indices: false });
            },
          })
            .then((res) => {
              const { code } = res.data;
              if (code == "200") {
                this.dataLoading = true;
                this.filterStatus(this.flag);
                this.dataLoading = false;
                this.$message.success("批量确认订单成功");
                this.Order_Ids = [];
              } else {
                this.$message.error("批量确认订单失败，请刷新");
                this.Order_Ids = [];
              }
            })
            .catch(() => {
              this.$message.error("出现错误，请稍后再试");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已放弃批量确认订单",
          });
        });
    },
    //批量取消订单
    batchRefuse() {
      this.$confirm("是否批量取消订单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          for (let i = 0; i < this.multipleSelection.length; i++) {
            this.Order_Ids.push(this.multipleSelection[i].order_id);
          }
          axios({
            url: this.$store.state.yuming + "/order/batCancel",
            method: "POST",
            params: {
              Order_Ids: this.Order_Ids,
            },
            paramsSerializer: (params) => {
              return qs.stringify(params, { indices: false });
            },
          })
            .then((res) => {
              const { code } = res.data;
              if (code == "200") {
                this.dataLoading = true;
                this.filterStatus(this.flag);
                this.dataLoading = false;
                this.$message.success("批量取消订单成功");
                this.Order_Ids = [];
              } else {
                this.$message.error("批量取消订单失败，请刷新");
                this.Order_Ids = [];
              }
            })
            .catch(() => {
              this.$message.error("出现错误，请稍后再试");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已放弃批量取消订单",
          });
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
.el-table .warning-row {
  background: oldlace;
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
