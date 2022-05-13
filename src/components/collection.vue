<template>
  <div v-loading="isLoading">
    <!--header-->
    <div class="header">
      <div class="logo">
        <img height="70px" style="margin: 20px 0" src="../assets/wads.png" />
      </div>
      <div class="title" style="margin-right: 250px">
        <el-page-header @back="goback" content="我的收藏"></el-page-header>
      </div>
      <div style="width: 550px"></div>
    </div>
    <!--content-->
    <div style="margin: 0 10%" v-if="isCollectionListEmpty == true">
      <el-row
        ><el-col :offset="9"
          ><img
            src="../assets/empty_grey.png"
            style="height: 220px; margin: 50px" /></el-col
      ></el-row>
      <el-row
        ><el-col :offset="11"
          ><p style="margin-left: 0px; color: grey">
            您的收藏空空如也~
          </p></el-col
        ></el-row
      >
      <el-row
        ><el-col :offset="10"
          ><span style="margin-left: 35px; color: grey">您可以 </span
          ><el-button @click="gotoHome">回首页逛逛</el-button></el-col
        ></el-row
      >
    </div>
    <div style="margin: 0 10%">
      <div v-if="isCollectionListEmpty == false">
        <header>
          <el-card class="collection-header-card">
            <el-row>
              <el-col
                :span="1"
                class="collection-table-item"
                style="margin-left: 10px"
              >
                <el-checkbox
                  v-model="checkAll"
                  class="myRedCheckBox"
                  @change="collection_check_all"
                ></el-checkbox>
              </el-col>
              <el-col :span="2" class="collection-table-item">索书号</el-col>
              <el-col :span="13" class="collection-table-item">书籍信息</el-col>
              <el-col :span="1" :offset="4" class="collection-table-item"
                >操作</el-col
              >
            </el-row>
          </el-card>
        </header>
        <div class="collection-table-container">
          <div>
            <el-card style="margin: 20px 0">
              <div class="collection-books">
                <el-row
                  v-for="(books, idx) in bookList"
                  :key="idx"
                  style="margin: 10px"
                >
                  <el-col :span="1">
                    <el-checkbox
                      style="margin: 25px 0"
                      v-model="books.check_one"
                      class="myRedCheckBox"
                    ></el-checkbox>
                  </el-col>
                  <el-col
                    :span="2"
                    style="margin: 25px 0"
                    class="collection-table-item"
                  >
                    <div>{{ books.reference_num }}</div>
                  </el-col>
                  <el-col :span="2">
                    <img
                      @click="goToBookInfo(books.reference_num)"
                      :src="changeUrl(books.image)"
                      style="height: 70px"
                    />
                  </el-col>
                  <el-col :span="11">
                    <div
                      style="margin-right: 30px"
                      class="collection-book"
                      @click="goToBookInfo(books.reference_num)"
                    >
                      {{ books.book_name }}
                    </div>
                    <div class="book-detail">作者：{{ books.author }}</div>
                    <div class="book-detail">出版社：{{ books.publisher }}</div>
                  </el-col>
                  <el-col :span="1" :offset="4">
                    <el-popconfirm
                      confirm-button-text="确认"
                      cancel-button-text="取消"
                      confirm-button-type="text"
                      @confirm="orderBook(books.reference_num)"
                      title="您确认要预约此书吗？"
                    >
                      <el-button
                        slot="reference"
                        type="text"
                        class="table-button"
                        style="margin: 15px 0px"
                        >预约</el-button
                      >
                    </el-popconfirm>
                  </el-col>
                  <el-col :span="2">
                    <el-popconfirm
                      confirm-button-text="确认"
                      cancel-button-text="取消"
                      confirm-button-type="text"
                      icon="el-icon-info"
                      icon-color="rgb(221, 68, 65)"
                      @confirm="delBook(books.collection_id)"
                      title="您确认要删除该收藏吗？"
                    >
                      <el-button
                        slot="reference"
                        type="text"
                        class="table-button"
                        style="margin: 15px 0px"
                        >删除</el-button
                      >
                    </el-popconfirm>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </div>
        </div>
        <footer>
          <el-card>
            <el-row>
              <el-col
                :span="1"
                style="margin-left: 10px"
                class="collection-table-footer-item"
              >
                <el-checkbox
                  v-model="checkAll"
                  class="myRedCheckBox"
                  @change="check_all"
                ></el-checkbox>
              </el-col>
              <el-col :span="11" class="collection-table-footer-item"
                >全选</el-col
              >
              <el-col :span="6" class="collection-table-footer-item"
                >已选<span style="color: rgb(221, 68, 65)">
                  {{ totalNumber }} </span
                >本书籍</el-col
              >
              <el-col
                :span="2"
                class="collection-table-footer-item"
                style="margin: 12px"
              >
                <el-button
                  size="medium"
                  class="table-button"
                  @click="multiOrderBook"
                  >批量预约</el-button
                >
              </el-col>
              <el-col
                :span="2"
                class="collection-table-footer-item"
                style="margin: 12px"
              >
                <el-button
                  type="danger"
                  plain
                  size="medium"
                  class="table-button"
                  @click="multiDelBook"
                  >批量删除</el-button
                >
              </el-col>
            </el-row>
          </el-card>
        </footer>
      </div>
    </div>
  </div>
</template>





<script>
import axios from "axios";
import { Message } from "element-ui";
import qs from "qs";
export default {
  components: {},
  data() {
    return {
      //当前页面
      page: 0,
      //loading
      isLoading: false,
      //购物车图书
      isCollectionListEmpty: false,
      bookList: [
        {
          reference_num: "",
          book_name: "",
          author: "",
          publisher: "",
          image: "",
          collection_id: "",
          check_one: false,
        },
      ],
      checkAll: false,
      totalNum: 0,
    };
  },
  computed: {
    // 总数
    totalNumber() {
      var number_total = 0;
      this.bookList.forEach((book) => {
        if (book.check_one == true) number_total = number_total + 1;
      });
      return number_total;
    },
  },
  methods: {
    //豆瓣图片加载
    changeUrl(_url) {
      if (_url !== undefined) {
        let _u = _url.substring(7); //_u:提取http://后面的部分
        return "https://images.weserv.nl/?url=" + _u;
      }
    },
    //回到主页
    gotoHome() {
      this.$router.push("/#reloaded");
    },
    //返回上一页
    goback() {
      this.$router.go(-1);
    },
    goToBookInfo(reference_num) {
      this.$router.push(`/bookInfo/${reference_num}`);
    },
    check_all() {
      this.bookList.forEach((book) => {
        book.check_one = this.checkAll;
      });
    },

    getAll() {
      axios({
        url: this.$store.state.yuming + "/collection/getByUser",
        method: "GET",
        params: {},
      })
        .then((res) => {
          const { code, data, num } = res.data;
          if (code == "200") {
            this.bookList = data;
            if (num == 0) {
              this.isCollectionListEmpty = true;
            }
          } else {
            this.$message.error("获取收藏夹信息失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //单本预约
    orderBook(id) {
      axios({
        url: this.$store.state.yuming + "/collection/addReserve",
        method: "POST",
        params: {
          reference_nums: id,
          username: this.$store.state.username,
        },
      })
        .then((res) => {
          const { code} = res.data;
          if (code == "200") {
            this.$message({
              message: "预约成功！",
              type: "success",
            });
          } else if (code == "26") {
            this.$message.error("借阅和预约书籍数量已达到最大值！");
          } else if (code == "25") {
            this.$message({
              dangerouslyUseHTMLString: true,
              message: "书籍{{data}}",
            });
          } else {
            this.$message.error("预约失败，请重试");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //批量预约
    multiOrderBook() {
      var multiOrderBookId = [];
      this.bookList.forEach((book) => {
        if (book.check_one == true) {
          multiOrderBookId.push(book.reference_num);
        }
      });
      axios({
        url: this.$store.state.yuming + "/collection/addReserve",
        method: "POST",
        params: {
          reference_nums: multiOrderBookId,
          username: this.$store.state.username,
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { indices: false });
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.$message({
              message: "批量预约成功",
              type: "success",
            });
          } else if (code == "26") {
            this.$message.error("借阅和预约书籍数量已达到最大值！");
          } else {
            this.$message.error("批量预约失败,请重试");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    delBook(id) {
      axios({
        url: this.$store.state.yuming + "/collection/delete",
        method: "DELETE",
        params: {
          collection_id: id,
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.isLoading = true;
            this.getAll();
            this.isLoading = false;
            this.$message({
              message: "删除成功",
              type: "success",
            });
          } else {
            this.$message.error("删除失败,请重试");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //批量删除收藏
    multiDelBook() {
      var multiDelBookId = [];
      this.bookList.forEach((book) => {
        if (book.check_one == true) {
          multiDelBookId.push(book.collection_id);
        }
      });
      axios({
        url: this.$store.state.yuming + "/collection/multiDelete",
        method: "DELETE",
        params: {
          collection_ids: multiDelBookId,
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { indices: false });
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.$message({
              message: "批量删除成功",
              type: "success",
            });
            this.isLoading = true;
            this.getAll();
            this.isLoading = false;
          } else {
            this.$message.error("删除失败,请重试");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
  },
  async created() {
    this.isLoading = true;
    await this.getAll();
    this.isLoading = false;
  },
};
</script>
<style>
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
.title {
  color: #303133;
  text-align: center;
  font-size: 30px;
  width: 200px;
}
.orderFinish {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.collection-table-container {
  margin: 20px 0;
}
.collection-table-item {
  font-size: 13px;
}
.collection-table-action {
  font-size: 13px;
}
.collection-table-footer-item {
  margin: 20px 0;
  font-size: 13px;
}

.collection-book {
  font-size: 13px;
}
.book-detail {
  font-size: 13px;
  color: grey;
}

.collection-books {
  background: rgb(255, 255, 255);
  color: #303133;
  /*border:1px solid rgb(201, 201, 201);*/
}

/* 设置带边框的checkbox，选中后边框的颜色 */
.myRedCheckBox.is-bordered.is-checked {
  border-color: rgb(221, 68, 65);
}

/* 设置选中后的文字颜色 */
.myRedCheckBox .el-checkbox__input.is-checked + .el-checkbox__label {
  color: rgb(221, 68, 65);
}

/* 设置选中后对勾框的边框和背景颜色 */
.myRedCheckBox .el-checkbox__input.is-checked .el-checkbox__inner,
.myRedCheckBox .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  border-color: rgb(221, 68, 65);
  background-color: rgb(221, 68, 65);
}

/* 设置checkbox获得焦点后，对勾框的边框颜色 */
.myRedCheckBox .el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: rgb(221, 68, 65);
}

/* 设置鼠标经过对勾框，对勾框边框的颜色 */
.myRedCheckBox .el-checkbox__inner:hover {
  border-color: rgb(221, 68, 65);
}

.table-unitprice {
  font-size: 15px;
}
.table-price {
  font-size: 15px;
  color: rgb(221, 68, 65);
}
.table-totalprice {
  font-size: 20px;
  color: rgb(221, 68, 65);
}

.table-button {
  font-size: 13px;
  color: black;
}

.collection-header-card {
  height: 57px;
}

.el-button--goon.is-active,
.el-button--goon:active {
  background: #20b2aa;
  border-color: #20b2aa;
  color: #fff;
}

.el-button--goon:focus,
.el-button--goon:hover {
  background: #48d1cc;
  border-color: #48d1cc;
  color: #fff;
}

.el-button--goon {
  color: #fff;
  background-color: #20b2aa;
  border-color: #20b2aa;
}
</style>