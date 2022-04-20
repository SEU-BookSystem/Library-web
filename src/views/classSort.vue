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
                  @click.native="goToSearch"
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
      <el-container style="margin: 0% 5%">
        <el-container>
          <el-aside width="18%">
            <el-row class="rowStyle1">
              <el-col class="colStyle" @click.native="showAll"
                ><p>全部商品分类</p></el-col
              >
            </el-row>
            <el-menu>
              <div v-for="item in categoryList" :key="item.main_id">
                <div style="background-color: #f9f9f9;">
                <el-menu-item
                  style="
                    color: rgb(250, 128, 114);
                    font-weight: 1000;
                    font-size: 20px;
                    border-left:solid 1px #e6e6e6;
                  "
                  :index="item.main_id"
                  @click.native="getOne(item.main_id)"
                  >{{ item.main_name }}
                </el-menu-item>
                </div>
                <div
                  v-for="littleitem in item.second_category"
                  :key="littleitem.second_id"
                >
                  <el-menu-item
                    style="color: rgb(233, 150, 122); font-weight: 1000;border-left:solid 1px #e6e6e6;"
                    :index="littleitem.second_id"
                    @click.native="getTwo(littleitem.second_id)"
                    >{{ littleitem.second_name }}
                  </el-menu-item>
                </div>
              </div>
            </el-menu>
            <el-menu
              class="el-menu-vertical-demo"
              :default-active="activeIndex2"
            >
            <div style="background-color: #f9f9f9;">
              <el-menu-item>
                <span
                  slot="title"
                  style="
                    color: rgb(250, 128, 114);
                    font-weight: 1000;
                    font-size: 20px;
                    border-left:solid 1px #e6e6e6;
                  "
                  >按出版时间分</span
                >
              </el-menu-item>
            </div>
              <el-menu-item
                index="2021"
                @click.native="getThree('2021')"
                style="color: rgb(233, 150, 122); font-weight: 1000;border-left:solid 1px #e6e6e6;"
                >2021年出版</el-menu-item
              >
              <el-menu-item
                index="2020"
                @click.native="getThree('2020')"
                style="color: rgb(233, 150, 122); font-weight: 1000;border-left:solid 1px #e6e6e6;"
                >2020年出版</el-menu-item
              >
              <el-menu-item
                index="2019"
                @click.native="getThree('2019')"
                style="color: rgb(233, 150, 122); font-weight: 1000;border-left:solid 1px #e6e6e6;"
                >2019年出版</el-menu-item
              >
              <el-menu-item
                index="2018"
                @click.native="getFour('2018')"
                style="color: rgb(233, 150, 122); font-weight: 1000;border-left:solid 1px #e6e6e6;border-bottom:solid 1px #e6e6e6;"
                >2018年及以前出版</el-menu-item
              >
            </el-menu>
          </el-aside>
          <el-main>
            <el-row class="rowStyle" type="flex">
              <el-col :span="6" v-for="book in displayList" :key="book.id">
                <el-card style="width: 90%; margin: 5%" @click.native="goToBookInfo(book.id)" class="card">
                  <el-container>
                    <el-header
                      style="
                        width: 100%;
                        height: 200px;
                        align-items: center;
                        margin-top: 10px;
                      "
                    >
                      <el-image
                        class="imgStyle5"
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
                        padding-bottom: 10px;
                      "
                    >
                      <el-link
                        :underline="false"
                        class="book-name"
                        @click="goToBookInfo(book.id)"
                        :title="book.book_name"
                        >{{ book.book_name |ellipsis }}</el-link
                      >
                      <p style="color: rgb(128, 192, 192); margin: 0%" :title="book.author">
                        {{ book.author |ellipsis }}
                      </p>
                      <p style="color: red; font-weight: 1000; margin: 0%">
                        ￥{{ book.price }}
                      </p>
                    </el-main>
                  </el-container>
                </el-card>
              </el-col>
            </el-row>
            <el-pagination
              :current-page="currentPage"
              @current-change="handleCurrentChange"
              :total="bookcount"
              :page-size="20"
              layout="prev, pager, next, jumper"
            >
            </el-pagination>
          </el-main>
        </el-container>
      </el-container>
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
      goodsNum: "",
      activeIndex1: "",
      activeIndex2: "",
      activeIndex3: "",
      activeIndex4: "",
      currentPage: 1,
      isLoading: false,
      input: "",
      categoryList: [
        {
          book_num: 0,
          main_name: "",
          main_id: "",
          second_category: [{ book_num: "", second_name: "", second_id: "" }],
        },
      ],
      displayList: [],
      bookcount: 0,
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
    goToSearch() {
      this.$store.commit("gobalSearchText", this.input);
      this.$router.push("/searchBook");
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
    showAll() {
      this.$router.push("/#reloaded");
    },
    //实现分页
    handleCurrentChange(val) {
      this.currentPage = val;
      if (this.activeIndex1 != "") {
        this.getMainClassBook(this.activeIndex1);
      } else if (this.activeIndex2 != "") {
        this.getSecondClassBook(this.activeIndex2);
      } else if (this.activeIndex3 != "") {
        this.getYearBook(this.activeIndex3);
      } else this.getYearBeforeBook(this.activeIndex4);
    },
    goToBookInfo(id) {
      this.$router.push(`/bookInfo/${id}`);
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
    //点各导航栏都要会第一页
    getOne(id) {
      this.currentPage = 1;
      this.getMainClassBook(id);
    },
    getTwo(id) {
      this.currentPage = 1;
      this.getSecondClassBook(id);
    },
    getThree(id) {
      this.currentPage = 1;
      this.getYearBook(id);
    },
    getFour(id) {
      this.currentPage = 1;
      this.getYearBeforeBook(id);
    },
    //通过index传来的参数进行一级分类筛选
    getMainClassBook(id) {
      this.activeIndex1 = id;
      this.activeIndex2 = "";
      this.activeIndex3 = "";
      this.activeIndex4 = "";
      axios({
        url: this.$store.state.yuming + "/book/getPage",
        method: "GET",
        params: {
          page_num: this.currentPage,
          book_num: 20,
          style: 1,
          main_category_id: id,
          second_category_id: "",
          year: "",
          year_before: "",
          year_after: "",
          shop_id: "",
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.displayList = data;
          } else {
            this.$message.error("获取图书信息失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
      //获取书的总数
      axios({
        url: this.$store.state.yuming + "/book/getPageCount",
        method: "GET",
        params: {
          main_category_id: id,
          second_category_id: "",
          year: "",
          year_before: "",
          year_after: "",
          shop_id: "",
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
    //通过index传来的参数进行二级分类筛选
    getSecondClassBook(id) {
      this.activeIndex1 = "";
      this.activeIndex2 = id;
      this.activeIndex3 = "";
      this.activeIndex4 = "";
      axios({
        url: this.$store.state.yuming + "/book/getPage",
        method: "GET",
        params: {
          page_num: this.currentPage,
          book_num: 20,
          style: 1,
          main_category_id: "",
          second_category_id: id,
          year: "",
          year_before: "",
          year_after: "",
          shop_id: "",
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.displayList = data;
          } else {
            this.$message.error("获取图书信息失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
      //获取书的总数
      axios({
        url: this.$store.state.yuming + "/book/getPageCount",
        method: "GET",
        params: {
          main_category_id: "",
          second_category_id: id,
          year: "",
          year_before: "",
          year_after: "",
          shop_id: "",
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
    //通过index传来的参数进行某一年份筛选
    getYearBook(year) {
      this.activeIndex1 = "";
      this.activeIndex2 = "";
      this.activeIndex3 = year;
      this.activeIndex4 = "";
      axios({
        url: this.$store.state.yuming + "/book/getPage",
        method: "GET",
        params: {
          page_num: this.currentPage,
          book_num: 20,
          style: 1,
          main_category_id: "",
          second_category_id: "",
          year: year,
          year_before: "",
          year_after: "",
          shop_id: "",
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.displayList = data;
          } else {
            this.$message.error("获取图书信息失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
      //获取书的总数
      axios({
        url: this.$store.state.yuming + "/book/getPageCount",
        method: "GET",
        params: {
          main_category_id: "",
          second_category_id: "",
          year: year,
          year_before: "",
          year_after: "",
          shop_id: "",
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
    getYearBeforeBook(year) {
      this.activeIndex1 = "";
      this.activeIndex2 = "";
      this.activeIndex3 = "";
      this.activeIndex4 = year;
      axios({
        url: this.$store.state.yuming + "/book/getPage",
        method: "GET",
        params: {
          page_num: this.currentPage,
          book_num: 20,
          style: 1,
          main_category_id: "",
          second_category_id: "",
          year: "",
          year_before: year,
          year_after: "",
          shop_id: "",
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.displayList = data;
          } else {
            this.$message.error("获取图书信息失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
      //获取书的总数
      axios({
        url: this.$store.state.yuming + "/book/getPageCount",
        method: "GET",
        params: {
          main_category_id: "",
          second_category_id: "",
          year: "",
          year_before: year,
          year_after: "",
          shop_id: "",
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
    var query = this.$route.query;
    if (query) {
      if (query.activeIndexMain != "") {
        var temp = query.activeIndexMain;
        this.activeIndex2 = temp;
        this.getMainClassBook(this.activeIndex2);
      } else if (query.activeIndexSecond != "") {
        temp = query.activeIndexSecond;
        this.activeIndex2 = temp;
        this.getSecondClassBook(this.activeIndex2);
      } else if (query.year != "") {
        temp = query.year;
        this.activeIndex2 = temp;
        this.getYearBook(this.activeIndex2);
      } else {
        temp = query.year_before;
        this.activeIndex2 = temp;
        this.getYearBeforeBook(this.activeIndex2);
      }
    }
    this.isLoading = true;
    if (this.$store.state.token) {
      await this.getGoodsNum();
    }
    await this.getAllCategory();
    this.isLoading = false;
  },
};
</script>

<style acoped>
.el-pagination {
  text-align: center;
}
.book-name {
  font-size: 100%;
}
.imgStyle5 {
  margin-left: 10%;
  width: 80%;
  height: 200px;
  cursor: pointer;
}
.rowStyle {
  display: flex;
  flex-wrap: wrap;
}
.rowStyle1 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
}
.colStyle {
  text-align: center;
  justify-content: center;
  align-items: center;
  font-weight: 1000;
  width: 100%;
  color: white;
  cursor: pointer;
  background-color: rgb(205, 92, 92);
  height: 60px;
}
.menu-item {
  color: rgb(188, 143, 143);
  font-weight: 1000;
}
.imgStyle2 {
  width: 100%;
  height: 100%;
}
.carouselStyle {
  border-radius: 10px;
}
.cStyle {
  height: 400px;
  position: relative;
  left: 20px;
  padding: 0px;
}
.tscStyle {
  height: 100%;
}

.el-menu-item.is-active {
  background-color: rgb(231, 241, 252) !important;
}
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
.card:hover{
  box-shadow: 0 0 2px 6px #F3F3F3;
}
</style>