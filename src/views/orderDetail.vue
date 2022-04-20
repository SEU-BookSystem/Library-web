<template>
  <div v-loading="isLoading">
    <div class="header">
      <div class="logo">
        <img height="70px" style="margin: 20px 0" src="../assets/jwbc.png" />
      </div>
      <el-page-header
        @back="gotoOrder"
        content="订单详情"
        style="display: flex; justify-content: center; align-items: center"
      ></el-page-header>
    </div>
    <el-row>
      <el-col :offset="3" :span="21">
        <el-steps
          :space="300"
          :active="atWhere"
          finish-status="success"
          align-center
          v-if="cancel == false"
        >
          <el-step
            title="拍下商品"
            :description="
              this.orderDetailList.status >= 3
                ? this.orderDetailList.create_time
                : ''
            "
          ></el-step>
          <el-step
            title="卖家已发货"
            :description="
              this.orderDetailList.status >= 4
                ? this.orderDetailList.send_time
                : ''
            "
          ></el-step>
          <el-step
            title="确认收货"
            :description="
              this.orderDetailList.status >= 5
                ? this.orderDetailList.firm_time
                : ''
            "
          ></el-step>
          <el-step title="评价"></el-step>
        </el-steps>
      </el-col>
      <el-col  :offset="7" :span="17">
        <el-steps
          :space="300"
          :active="atWhere_"
          finish-status="success"
          align-center
          v-if="cancel == true"
        >
          <el-step
            title="拍下商品"
            :description="
              this.orderDetailList.status == 3||this.orderDetailList.status==1
                ? this.orderDetailList.create_time
                : ''
            "
          ></el-step>
          <el-step
            title="买家已取消"
            :description="
              this.orderDetailList.status == 1
                ? this.orderDetailList.books[0].update_time
                : ''
            "
          ></el-step>
        </el-steps>
      </el-col>
    </el-row>
    <div style="margin: 20px 15% 20px 16%">
      <el-card style="margin-bottom: 10px">
        <el-row>
          <el-col :span="4">
            <h3>订单信息</h3>
          </el-col>
          <el-col :span="20" style="margin: 20px 0">
            订单编号：{{ orderDetailList.order_id }}
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row style="margin: 20px 0">
          <el-col :span="2">收货人： </el-col>
          <el-col :span="5">{{ this.addressList.receiver_name }}</el-col>
          <el-col :span="2">电话号码： </el-col>
          <el-col :span="10">{{ this.addressList.phone }}</el-col>
        </el-row>
        <el-row style="margin: 20px 0">
          <el-col :span="2">收货地址： </el-col>
          <el-col :span="22">{{ this.addressList.address }}</el-col>
        </el-row>
      </el-card>
      <el-card>
        <el-row style="margin-bottom: 20px">
          <el-col :span="10" :offset="1" class="table-header-item"
            >商品信息</el-col
          >
          <el-col :span="2" class="table-header-item">单价</el-col>
          <el-col :span="3" class="table-header-item">数量</el-col>
          <el-col :span="3" class="table-header-item">实付款</el-col>
          <el-col
            :span="4"
            class="table-header-item"
            style="display: flex; justify-content: center"
            >交易状态</el-col
          >
        </el-row>
        <div>
          <div class="books">
            <el-row>
              <el-col :span="19">
                <el-row
                  v-for="(books, idx) in orderDetailList.books"
                  :key="idx"
                  style="margin: 10px"
                >
                  <el-col :span="3">
                    <img :src="books.book_image_b" style="height: 70px" />
                  </el-col>
                  <el-col :span="11">
                    <div style="margin-right: 30px" class="book-name">
                      {{ books.book_name }}
                    </div>
                    <div class="book-detail">作者：{{ books.author }}</div>
                    <div class="book-detail">出版社：{{ books.press }}</div>
                  </el-col>
                  <el-col :span="3">
                    <div style="margin: 25px 0">¥{{ books.price }}</div>
                  </el-col>
                  <el-col :span="3">
                    <div style="margin: 25px 0">
                      {{ books.number }}
                    </div>
                  </el-col>
                  <el-col :span="3">
                    <div style="margin: 25px 10px">
                      ￥{{ books.book_total_price }}
                    </div>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="4">
                <el-row style="margin-top: 35px">
                  <el-col
                    class="status-name"
                    v-if="orderDetailList.status == 1"
                    style="display: flex; justify-content: center"
                    >已取消</el-col
                  >
                  <el-col
                    class="status-name"
                    v-if="orderDetailList.status == 2"
                    style="display: flex; justify-content: center"
                    >未付款</el-col
                  >
                  <el-col
                    class="status-name"
                    v-if="orderDetailList.status == 3"
                    style="display: flex; justify-content: center"
                    >买家已付款</el-col
                  >
                  <el-col
                    class="status-name"
                    v-if="orderDetailList.status == 4"
                    style="display: flex; justify-content: center"
                    >卖家已发货</el-col
                  >
                  <el-col
                    class="status-name"
                    v-if="orderDetailList.status == 5"
                    style="display: flex; justify-content: center"
                    >交易成功</el-col
                  >
                  <el-col
                    class="status-name"
                    v-if="orderDetailList.status == 6"
                    style="display: flex; justify-content: center"
                    >待评价</el-col
                  >
                </el-row>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      isLoading: false,
      atWhere: 0,
      atWhere_: 0,
      cancel: false,
      id: "",
      orderId: this.$route.params.orderId,
      addressId: "",
      orderDetailList: {
        address_id: "",
        order_id: "",
        status: "",
        create_time: "",
        send_time: "",
        firm_time: "",
        books: [
          {
            update_time: "",
            book_image_b: "",
            book_name: "",
            author: "",
            press: "",
            price: "",
            number: "",
            book_total_price: "",
          },
        ],
      },
      addressList: {
        receiver_name: "",
        phone: "",
        address: "",
      },
    };
  },
  methods: {
    gotoOrder() {
      this.id = 1;
      this.$router.push("/userOrder/" + this.id);
    },
    getOrderDetails() {
      axios({
        url: this.$store.state.yuming + "/order/getByID",
        method: "GET",
        params: {
          order_id: this.orderId,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.orderDetailList = data;
            this.addressId = this.orderDetailList.address_id;
            this.getAddress();
            if (this.orderDetailList.status == 1) {
              this.atWhere_ = 2;
              this.cancel = true;
            } else if (this.orderDetailList.status == 2) {
              this.atWhere = 0;
            } else if (this.orderDetailList.status == 3) {
              this.atWhere = 1;
            } else if (this.orderDetailList.status == 4) {
              this.atWhere = 2;
            } else {
              this.atWhere = 3;
            }
          } else {
            this.$message.error("获取订单详情失败");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    getAddress() {
      axios({
        url: this.$store.state.yuming + "/address/public/getByID",
        method: "GET",
        params: {
          address_id: this.addressId,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.addressList = data;
          } else {
            this.$message.error("获取订单地址信息失败");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
  },
  async created() {
    this.isLoading = true;
    await this.getOrderDetails();
    this.isLoading = false;
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: 5%;
  margin-right: 5%;
}
.logo {
  display: flex;
  justify-content: center;
  margin: 20px;
}
.shop-name {
  font-size: 16px;
  font-weight: 600;
}
.book-name {
  font-size: 13px;
}
.status-name {
  font-size: 16px;
  color: rgb(221, 98, 98);
  font-weight: 400;
}
.action-name {
  font-size: 15px;
}
.book-detail {
  font-size: 13px;
  color: grey;
}
.books {
  background: rgb(255, 255, 255);
  color: #303133;
  /*border:1px solid rgb(201, 201, 201);*/
}
.header-card {
  height: 60px;
  margin-bottom: 10px;
}
.table-header-item {
  display: flex;
  align-items: center;
  font-size: 15px;
}
.el-divider--horizontal {
  display: block;
  height: 1px;
  width: 100%;
  margin-bottom: 15px;
  margin-top: 0px;
}
</style>