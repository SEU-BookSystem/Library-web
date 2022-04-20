<template>
  <div v-loading="isLoading">
    <div class="header">
      <div class="logo">
        <img height="70px" style="margin: 20px 0" src="../assets/jwbc.png" />
      </div>
      <el-page-header
        @back="gotoOrder"
        content="评价"
        style="display: flex; justify-content: center; align-items: center"
      ></el-page-header>
    </div>
    <el-row style="margin: 20px 15%">
      <el-card>
        <div>
          <div class="books">
            <el-row>
              <el-col :span="24">
                <el-row
                  style="margin: 10px"
                  v-for="(books, idx) in bookList.books"
                  :key="idx"
                >
                  <el-col :span="4">
                    <img :src="books.book_image_b" style="height: 150px" />
                  </el-col>
                  <el-col :span="20">
                    <div style="margin-right: 30px" class="book-name">
                      {{ books.book_name }}
                    </div>
                    <div class="book-detail" style="margin-top: 15px">
                      作者：{{ books.author }}
                    </div>
                    <div class="book-detail">出版社：{{ books.press }}</div>
                    <div style="margin: 20px 0px" class="book-total">
                      ￥{{ books.book_total_price }}
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
          <el-divider></el-divider>
          <el-form
            ref="remarkList"
            :model="remarkList"
            label-width="100px"
            :rules="remarkRules"
          >
            <el-form-item label="总体评分：" prop="rate">
              <div style="margin-top: 10px">
                <el-rate v-model="remarkList.rate" :colors="colors" show-text>
                </el-rate>
              </div>
            </el-form-item>
            <el-form-item label="详细评价：">
              <el-input
                type="textarea"
                maxlength="100"
                show-word-limit
                clearable
                style="width: 500px"
                rows="5"
                v-model="remarkList.description"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="remarkBook">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      isLoading: false,
      id: "",
      bookId: this.$route.params.bookId,
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
      remarkRules: {
        rate: [
          { required: true, message: "请对此次订单评分", trigger: "blur" },
        ],
      },
      bookList: {
        books: [
          {
            book_img_b: "",
            book_name: "",
            author: "",
            press: "",
            book_total_book: 0,
          },
        ],
      },
      remarkList: {
        rate: "",
        description: "",
      },
    };
  },
  methods: {
    gotoOrder() {
      this.id = 1;
      this.$router.push("/userOrder/" + this.id);
    },
    //获取书本信息
    getBookInfo() {
      axios({
        url: this.$store.state.yuming + "/order/getBookByID",
        method: "GET",
        params: {
          order_book_id: this.bookId,
        },
      }).then((res) => {
        if (res.data.code == 200) {
          this.bookList = res.data.data;
        } else {
          this.$message.error("获取商品信息失败，请重试");
        }
      });
    },
    remarkBook() {
      if (this.remarkList.rate == 0) {
        this.$message({
          message: "请对此次订单评分",
          type: "warning",
        });
      } else {
        axios({
          url: this.$store.state.yuming + "/order/remark",
          method: "POST",
          params: {
            order_book_id: this.bookId,
            rate: this.remarkList.rate,
            remark: this.remarkList.description,
          },
        }).then((res) => {
          if (res.data.code == 200) {
            this.remarkList.rate = "";
            this.remarkList.description = "";
          } else {
            this.$message.error("评价失败，请重试");
          }
        });
      }
    },
  },
  async created() {
    this.isLoading = true;
    await this.getBookInfo();
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
  font-size: 18px;
}
.book-detail {
  font-size: 15px;
  color: grey;
}
.books {
  background: rgb(255, 255, 255);
  color: #303133;
  /*border:1px solid rgb(201, 201, 201);*/
}
.book-total {
  color: rgb(221, 98, 98);
}
</style>