<template>
  <div v-loading="isLoading">
    <div>
      <div class="header">
        <el-row>
          <el-col :span="6">
            <div class="logo">
              <img
                height="70px"
                style="margin: 20px 0"
                src="../assets/jwbc.png"
              />
            </div>
          </el-col>
          <el-col :span="12">
            <div class="hasRole ? search1 : search2">
              <el-input
                placeholder="给孩子的第一本编程书籍"
                v-model="input"
                style="width: 500px"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click.native="searchBook"
                  style="
                    display: block;
                    background-color: rgb(205, 92, 92);
                    color: white;
                  "
                >
                </el-button>
              </el-input>
            </div>
          </el-col>
          <el-col :span="6" v-if="hasRole">
            <div style="margin-left: 20px">
              <el-row class="shopping">
                <el-col :span="10">
                  <el-badge
                    :max="99"
                    :value="goodsNum"
                    style="
                      display: flex;
                      justify-content: center;
                      align-items: center;
                    "
                  >
                    <el-button
                      style="
                        margin-right: 30px;
                        display: block;
                        background-color: rgb(205, 92, 92);
                        color: white;
                      "
                      size="meduim"
                      icon="el-icon-shopping-cart-2"
                      @click.native="gotoShopCar"
                      >我的购物车</el-button
                    >
                  </el-badge>
                </el-col>
                <el-col :span="10" class="pageperson">
                  <el-button
                    style="margin-left: 30px"
                    size="meduim"
                    class="pageperson"
                    icon="el-icon-s-custom"
                    @click="gotoPersonPage"
                    >个人主页</el-button
                  >
                </el-col>
                <el-col @click.native="loginOut" style="margin-left: 10px">
                  <i class="iconfont-tuichu" style="font-size: 20px" />
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="6" v-else>
            <div style="margin-left: 150px">
              <el-row class="hasNoRole">
                <el-col>
                  <el-button size="meduim" @click="gotoSign">注册</el-button>
                </el-col>
                <el-col style="margin: 20px 0">
                  <el-button size="meduim" class="pageperson" @click="gotoLogin"
                    >登陆</el-button
                  >
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div>
      <div>
        <el-container style="margin: 0% 5%">
          <el-header style="padding: 0; height: 100%">
            <el-row class="rowStyle1">
              <el-col class="colStyle3" @click.native="goToIndex"
                >全部商品分类</el-col
              >
              <el-col>
                <el-menu
                  :default-active="activeIndex1"
                  class="el-menu-demo"
                  mode="horizontal"
                >
                  <el-menu-item
                    v-for="item in categoryList"
                    :key="item.main_id"
                    style="color: rgb(250, 128, 114); font-weight: 1000"
                    :index="item.main_id"
                    @click.native="getMainClassBook(item.main_id)"
                    >{{ item.main_name }}</el-menu-item
                  >
                </el-menu>
              </el-col>
            </el-row>
            <el-row style="margin: 3% 0%">
              <el-col :span="3">
                <el-button
                  type="text"
                  @click.native="goToFirst(0)"
                  :class="{ btn_active: flag === 0 }"
                  id="Button0"
                  >全部相关图书</el-button
                >
              </el-col>
              <el-col :span="3">
                <el-button
                  type="text"
                  @click.native="goToFirst(1)"
                  :class="{ btn_active: flag === 1 }"
                  id="Button1"
                  >书名相关图书</el-button
                >
              </el-col>
              <el-col :span="3">
                <el-button
                  type="text"
                  @click.native="goToFirst(2)"
                  :class="{ btn_active: flag === 2 }"
                  id="Button2"
                  >作者相关图书</el-button
                >
              </el-col>
              <el-col :span="3">
                <el-button
                  type="text"
                  @click.native="goToFirst(3)"
                  :class="{ btn_active: flag === 3 }"
                  id="Button3"
                  >出版社相关图书</el-button
                >
              </el-col>
              <el-col :span="3">
                <el-button
                  type="text"
                  @click.native="goToFirst(4)"
                  :class="{ btn_active: flag === 4 }"
                  id="Button4"
                  >图书简介相关图书</el-button
                >
              </el-col>
            </el-row></el-header
          ><el-main
            v-if="this.displayList.length == 0"
            style="text-align: center"
          >
            <img
              style="width: 200px; height: 200px"
              src="../assets/empty_grey.png"
            />
            <p>未找到相关的书籍</p>
          </el-main>
          <el-main v-if="this.displayList.length != 0">
            <el-row class="rowStyle3" type="flex">
              <el-col :span="6" v-for="book in displayList" :key="book.id">
                <el-card style="width: 90%; margin: 5%" @click.native="goToBookInfo(book.id)" class="card">
                  <el-container>
                    <el-header
                      style="
                        width: 100%;
                        height: 200px;
                        align-items: center;
                        margin-top: 20px;
                      "
                    >
                      <el-image
                        class="imgStyle3"
                        :src="book.image_b"
                        @click.native="goToBookInfo(book.id)"
                      >
                      </el-image>
                    </el-header>
                    <el-main
                      style="
                        color: black;
                        padding-top: 0;
                        text-align: center;
                        padding-bottom: 5px;
                      "
                    >
                      <el-link
                        :underline="false"
                        class="book-name"
                        @click="goToBookInfo(book.id)"
                        :title="book.book_name"
                        >{{ book.book_name | ellipsis }}</el-link
                      >
                      <p style="color: rgb(128, 192, 192); margin: 0%" :title="book.author"> 
                        {{ book.author | ellipsis }}
                      </p>
                      <p style="color: red; font-weight: 1000; margin: 0%">
                        ￥{{ book.price }}
                      </p>
                      <el-button
                        type="text"
                        @click.native="addShoppingTrolley(book.id)"
                        >加入购物车
                      </el-button>
                    </el-main>
                  </el-container>
                </el-card>
              </el-col>
            </el-row>
            <el-pagination
              :current-page="currentPage"
              @current-change="handleCurrentChange"
              :total="this.bookcount"
              :page-size="20"
              layout="prev, pager, next, jumper"
            >
            </el-pagination>
          </el-main>
        </el-container>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Message } from "element-ui";
export default {
  filters: {
    //限制文本显示字数,超出部分用...代替
    ellipsis(value) {
      if (!value) return "";
      if (value.length > 10) {
        return value.slice(0, 10) + "..."; //0:下标,从第一个字开始显示,15:显示字数,多余用...代替
      }
      return value;
    },
  },
  data() {
    return {
      activeIndex1: "",
      goodsNum: "",
      currentPage: 1,
      flag: 0,
      bookcount: 0,
      isLoading: false,
      dataLoading: false,
      input: this.$store.state.gobalSearchText,
      categoryList: [
        {
          book_num: 0,
          main_name: "",
          main_id: "",
          second_category: [{ book_num: "", second_name: "", second_id: "" }],
        },
      ],
      displayList: [],
      formdata: new FormData(),
    };
  },
  computed: {
    hasRole() {
      return this.$store.state.roleHasLoad;
    },
    hasLogin() {
      return this.$store.state.token;
    },
  },
  methods: {
    goToIndex() {
      this.$router.push("/#reloaded");
    },
    goToBookInfo(id) {
      this.$router.push(`/bookInfo/${id}`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.handleClick(this.flag);
    },
    gotoSign() {
      this.$router.push("/sign");
    },
    gotoLogin() {
      this.$router.push("/login");
    },
    gotoShopCar() {
      this.$router.push("/shopping/0/0");
    },
    gotoPersonPage() {
      this.$router.push("/person");
    },
    loginOut() {
      this.isLoading = true;
      this.$store.commit("clearCache");
      sessionStorage.removeItem("token");
      this.isLoading = false;
    },
    getMainClassBook(id) {
      this.$router.push({ path: "/classSort", query: { activeIndexMain: id } });
    },
    //加入购物车
    addShoppingTrolley(id) {
      this.formdata.append("book_id", id);
      this.formdata.append("sum", 1);
      axios({
        url: this.$store.state.yuming + "/cartitem/addCartItem",
        method: "POST",
        data: this.formdata,
      }).then((res) => {
        if (res.data.code == 200) {
          this.$message({
            message: "加入购物车成功",
            type: "success",
          });
          this.dataLoading = true;
          this.getGoodsNum();
          this.dataLoading = false;
          this.formdata=new FormData();
        } else {
          this.$message.error("加入购物车失败，请重试");
          this.formdata=new FormData();
        }
      });
    },
    //每次切换查询方式回到第一页
    goToFirst(val) {
      this.currentPage = 1;
      this.handleClick(val);
    },
    //点击实现本页面的不同搜索方式
    handleClick(val) {
      this.flag = val;
      document.getElementById("Button" + val).blur();
      //获取查到的书的数据
      axios({
        url: this.$store.state.yuming + "/book/fuzzyQuery",
        method: "GET",
        params: {
          page_num: this.currentPage,
          book_num: 20,
          style: 1,
          queryWhat: val,
          content: this.input,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.displayList = data;
          } else {
            this.$message.error("查询图书失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
      //获取这些书的数目
      axios({
        url: this.$store.state.yuming + "/book/fuzzyQueryCount",
        method: "GET",
        params: {
          queryWhat: val,
          content: this.input,
        },
      })
        .then((res) => {
          const { code, count } = res.data;
          if (code == "200") {
            this.bookcount = count;
          } else {
            this.$message.error("获取图书数目失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    getGoodsNum() {
      axios({
        url: this.$store.state.yuming + "/cartitem/getNum",
        method: "GET",
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.goodsNum = data;
          } else {
            this.$message.error("获取店铺状态失败,请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    //图书模糊查询全部相关图书，即其他页面跳转进来的查询
    searchBook() {
      this.$store.commit("gobalSearchText", this.input);
      this.flag = 0;
      axios({
        url: this.$store.state.yuming + "/book/fuzzyQuery",
        method: "GET",
        params: {
          page_num: this.currentPage,
          book_num: 20,
          style: 1,
          queryWhat: 0,
          content: this.input,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.displayList = data;
          } else {
            this.$message.error("查询图书失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
      //获取这些书的数目
      axios({
        url: this.$store.state.yuming + "/book/fuzzyQueryCount",
        method: "GET",
        params: {
          queryWhat: 0,
          content: this.input,
        },
      })
        .then((res) => {
          const { code, count } = res.data;
          if (code == "200") {
            this.bookcount = count;
          } else {
            this.$message.error("获取图书数目失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
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
    if (this.$store.state.token) {
      await this.getGoodsNum();
    }
    await this.getAllCategory();
    this.searchBook();
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
.shopping {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
}
.hasNoRole {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
  margin-left: 50px;
}
.pageperson {
  display: flex;
  justify-content: center;
  margin: 20px;
}
.logo {
  display: flex;
  justify-content: center;
  margin: 20px;
}
.searchButton {
  display: inline-block;
  background-color: rgb(205, 92, 92);
  color: white;
}
.search1 {
  margin: 60px 0 60px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.search2 {
  margin: 60px 0px 60px 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.rowStyle1 {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(205, 92, 92);
}
.colStyle3 {
  text-align: center;
  font-weight: 1000;
  width: 21.93%;
  color: white;
  cursor: pointer;
}
.rowStyle3 {
  display: flex;
  flex-wrap: wrap;
}
.imgStyle3 {
  width: 100%;
  height: 200px;
  cursor: pointer;
}
.el-pagination {
  text-align: center;
}
.el-image {
  display: flex;
}
.book-name {
  font-weight: 1000;
  font-size: 20px;
}

.el-menu-item.is-active {
  background-color: rgb(231, 241, 252) !important;
}
.btn_active {
  color: black;
}
.card:hover{
  box-shadow: 0 0 2px 6px #F3F3F3;
}
</style>
