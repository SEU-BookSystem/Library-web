<template>
  <div v-loading="isLoading">
    <div class="header2">
      <div class="logo2">
        <img width="250px" src="../../assets/jwbc.png" />
      </div>
    </div>
    <div style="margin: 0% 5%">
      <el-form ref="tableData" :model="tableData" label-width="110px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="订单日期：">
              <span>{{ tableData.books[0].return_time }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名称：" prop="name">
              <span>{{ tableData.name }}</span></el-form-item
            >
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="申请理由：" prop="return_reason">
              <span>{{ tableData.books[0].return_reason }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请详情：" prop="return_detail">
              <span>{{ tableData.books[0].return_detail }}</span>
            </el-form-item>
          </el-col></el-row
        >
        <el-form-item label-width="0">
          <el-table :data="tableData.books" border style="width: 100%">
            <el-table-column label="图书图片" width="180">
              <template slot-scope="scope">
                <img :src="scope.row.book_image_b" class="imgStyle" />
              </template>
            </el-table-column>
            <el-table-column label="图书名称" width="180" prop="book_name">
            </el-table-column>
            <el-table-column prop="number" label="图书数量" width="180">
            </el-table-column>
            <el-table-column prop="price" label="图书单价" width="180">
              <template slot-scope="scope">￥{{ scope.row.price }}</template>
            </el-table-column>
            <el-table-column prop="book_total_price" label="总价">
              <template slot-scope="scope">{{
                scope.row.book_total_price
              }}</template></el-table-column
            >
          </el-table>
        </el-form-item>
        <el-form-item align="center" label-width="0">
          <el-button type="primary" @click="returnToM">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      order_book_id: this.$route.params.id,
      tableData: {
        shop_id: "",
        total: "",
        send_time: "",
        books: [
          {
            check_opinion: "",
            book_total_price: "",
            remark: "",
            book_image_b: "",
            book_name: "",
            number: 0,
            update_time: "",
            rate: 0,
            return_time: "",
            price: 0,
            return_image_s: "",
            book_image_s: "",
            press: "",
            order_book_id: "",
            transport_status: 0,
            return_reason: "",
            author: "",
            remark_status: 0,
            book_id: "",
            repertory: "",
            volume: 0,
            return_image_b: "",
            return_detail: "",
            return_status: 0,
            remark_time: "",
            exchange_address_id: "",
            order_id: "",
          },
        ],
        create_time: "",
        name: "",
        firm_time: "",
        shop_name: "",
        order_id: "",
        username: "",
        status: "",
        address_id: "",
      },
      isLoading: false,
    };
  },
  methods: {
    //获取信息
    getData() {
      axios({
        url: this.$store.state.yuming + "/order/getBookByID",
        method: "POST",
        params: {
          order_book_id: this.order_book_id,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.tableData = data;
            window.console.log(this.tableData);
          } else {
            this.$message.error("获取退款订单详细信息失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    returnToM() {
      this.$router.push("/refundM");
    },
  },
  async created() {
    this.isLoading = true;
    await this.getData();
    this.isLoading = false;
  },
};
</script>

<style acoped>
.header2 {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 20px;
  margin-left: 5%;
  margin-right: 5%;
}
.logo2 {
  display: flex;
  justify-content: center;
  margin: 20px;
}
.imgStyle {
  width: 100px;
  height: 130px;
}
</style>