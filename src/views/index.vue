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
                    >登录</el-button
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
              <div v-for="item in categoryList" :key="item.main_id" >
                <div style="background-color: #f7f7f7;">
                <el-menu-item
                  style="
                    color: rgb(250, 128, 114);
                    font-weight: 1000;
                    font-size: 20px;
                    border-left:solid 1px #e6e6e6;
                  "
                  :index="item.main_id"
                  @click.native="getMainClassBook(item.main_id)"
                  ><span
                    style="padding-bottom: 5px; "
                    >{{ item.main_name }}</span
                  >
                </el-menu-item>
                </div>
                <div
                  v-for="littleitem in item.second_category"
                  :key="littleitem.second_id"
                >
                  <el-menu-item
                    style="color: rgb(233, 150, 122); font-weight: 1000;border-left:solid 1px #e6e6e6;"
                    :index="littleitem.second_id"
                    @click.native="getSecondClassBook(littleitem.second_id)"
                    >{{ littleitem.second_name }}
                  </el-menu-item>
                </div>
              </div> </el-menu
            ><el-menu>
              <div style="background-color: #f7f7f7;">
              <el-menu-item style="border-left:solid 1px #e6e6e6;">
                <span
                  slot="title"
                  style="
                    color: rgb(250, 128, 114);
                    font-weight: 1000;
                    font-size: 20px;
                  "
                  >按出版时间分</span
                >
              </el-menu-item>
              </div>
              <el-menu-item
                index="2021"
                @click.native="getYearBook('2021')"
                style="color: rgb(233, 150, 122); font-weight: 1000;border-left:solid 1px #e6e6e6;"
                >2021年出版</el-menu-item
              >
              <el-menu-item
                index="2020"
                @click.native="getYearBook('2020')"
                style="color: rgb(233, 150, 122); font-weight: 1000;border-left:solid 1px #e6e6e6;"
                >2020年出版</el-menu-item
              >
              <el-menu-item
                index="2019"
                @click.native="getYearBook('2019')"
                style="color: rgb(233, 150, 122); font-weight: 1000;border-left:solid 1px #e6e6e6;"
                >2019年出版</el-menu-item
              >
              <el-menu-item
                index="2018"
                @click.native="getYearBeforeBook('2018')"
                style="color: rgb(233, 150, 122); font-weight: 1000;border-left:solid 1px #e6e6e6;border-bottom:solid 1px #e6e6e6;"
                >2018年及以前出版</el-menu-item
              >
            </el-menu>
          </el-aside>
          <el-main style="padding-top: 0px; height: 100%">
            <el-row style="margin-bottom: 1%">
              <el-col :span="16">
                <el-carousel
                  :interval="5000"
                  arrow="never"
                  height="400px"
                  class="carouselStyle"
                >
                  <el-carousel-item v-for="item in photoList" :key="item.Name">
                    <el-image class="imgStyle2" :src="item.Img"></el-image>
                  </el-carousel-item>
                </el-carousel>
              </el-col>
              <el-col :span="1"><span>&emsp;</span></el-col>
              <el-col :span="7">
                <el-card
                  class="cStyle"
                  v-for="item in todaySalesChampion"
                  :key="item.id"
                  @click.native="goToBookInfo(item.id)"
                >
                  <el-row style="height: 40px; margin: 0% 5% 5%"
                    ><el-col :span="4"
                      ><i class="iconfont-guanjun" style="font-size: 40px"></i
                    ></el-col>
                    <el-col :span="14" style="text-align: center; height: 40px"
                      ><p
                        style="
                          font-weight: 1000;
                          margin: 0%;
                          font-size: 20px;
                          height: 40px;
                          line-height: 40px;
                        "
                      >
                        今日销量冠军
                      </p></el-col
                    >
                  </el-row>
                  <el-row style="height: 270px">
                    <el-image
                      class="tscStyle"
                      :src="item.image_b"
                      @click.native="goToBookInfo(item.id)"
                    ></el-image>
                  </el-row>
                  <el-row style="text-align: center">
                    <el-link
                      :underline="false"
                      class="book-name"
                      style="color: black; margin: 1%"
                      @click="goToBookInfo(item.id)"
                      :title="item.book_name"
                      >{{ item.book_name | ellipsis1 }}</el-link
                    >
                    <p
                      style="color: rgb(128, 192, 192); margin: 0%"
                      :title="item.author"
                    >
                      {{ item.author | ellipsis1 }}
                    </p>
                  </el-row>
                </el-card>
              </el-col>
            </el-row>
            <el-row>
              <img src="../assets/xssj.png" style="width: 100%; height: 60px" />
            </el-row>
            <el-row class="rowStyle" type="flex">
              <el-col :span="6" v-for="book in newBookList" :key="book.id">
                <el-card
                  style="width: 90%; margin: 5%"
                  @click.native="goToBookInfo(book.id)"
                  class="card"
                >
                  <el-container>
                    <el-header
                      style="
                        width: 100%;
                        height: 150px;
                        align-items: center;
                        margin-top: 10px;
                      "
                    >
                      <el-image
                        class="imgStyle1"
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
                        >{{ book.book_name | ellipsis0 }}</el-link
                      >
                      <p
                        style="color: rgb(128, 192, 192); margin: 0%"
                        :title="book.author"
                      >
                        {{ book.author | ellipsis0 }}
                      </p>
                      <p style="color: red; font-weight: 1000; margin: 0%">
                        ￥{{ book.price }}
                      </p>
                    </el-main>
                  </el-container>
                </el-card>
              </el-col>
            </el-row>
          </el-main> </el-container
        ><el-footer style="margin: 3% 0% 0.5%; padding: 0px">
          <el-row style="margin: 0% 0% 0.5%"
            ><el-menu
              :default-active="activeIndex1"
              class="el-menu-demo"
              mode="horizontal"
              @select="handleSelect1"
            >
              <el-menu-item
                v-for="item in categoryList"
                :key="item.main_id"
                style="color: rgb(250, 128, 114); font-weight: 1000"
                :index="item.main_id"
                @click.native="getClassOneBook(item.main_id)"
                >{{ item.main_name }}</el-menu-item
              >
            </el-menu>
          </el-row>
          <el-row class="rowStyle" type="flex">
            <el-col :span="4" v-for="book in displayList" :key="book.id">
              <el-card
                style="width: 90%; margin: 5%"
                @click.native="goToBookInfo(book.id)"
                class="card"
              >
                <el-container>
                  <el-header
                    style="
                      width: 100%;
                      height: 150px;
                      align-items: center;
                      margin-top: 10px;
                    "
                  >
                    <el-image
                      class="imgStyle4"
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
                      >{{ book.book_name | ellipsis2 }}</el-link
                    >
                    <p
                      style="color: rgb(128, 192, 192); margin: 0%"
                      :title="book.author"
                    >
                      {{ book.author | ellipsis2 }}
                    </p>
                    <p style="color: red; font-weight: 1000; margin: 0%">
                      ￥{{ book.price }}
                    </p>
                  </el-main>
                </el-container>
              </el-card>
            </el-col>
          </el-row>
        </el-footer>
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
    ellipsis0(value) {
      if (!value) return "";
      if (value.length > 10) {
        return value.slice(0, 10) + "..."; //0:下标,从第一个字开始显示,15:显示字数,多余用...代替
      }
      return value;
    },
    ellipsis1(value) {
      if (!value) return "";
      if (value.length > 25) {
        return value.slice(0, 25) + "..."; //0:下标,从第一个字开始显示,15:显示字数,多余用...代替
      }
      return value;
    },
    ellipsis2(value) {
      if (!value) return "";
      if (value.length > 7) {
        return value.slice(0, 7) + "..."; //0:下标,从第一个字开始显示,15:显示字数,多余用...代替
      }
      return value;
    },
  },
  data() {
    return {
      goodsNum: "",
      activeIndex1: "",
      activeIndex2: "",
      isLoading: false,
      input: "",
      todaySalesChampion: [
        {
          author: "",
          book_name: "",
          image_b: "",
          id: "",
        },
      ],
      categoryList: [
        {
          book_num: 0,
          main_name: "",
          main_id: "",
          second_category: [{ book_num: "", second_name: "", second_id: "" }],
        },
      ],
      photoList: [
        { Img: require("../assets/4.jpg") },
        { Img: require("../assets/photo1.jpg") },
        { Img: require("../assets/photo2.jpg") },
        { Img: require("../assets/photo3.jpg") },
      ],
      newBookList: [],
      displayList: [],
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
    gotoPersonPage() {
      this.$router.push("/person");
    },
    gotoShopCar() {
      this.$router.push("/shopping/0/0");
    },
    loginOut() {
      this.isLoading = true;
      this.$store.commit("clearCache");
      sessionStorage.removeItem("token");
      this.isLoading = false;
    },
    showAll() {
      this.activeIndex1 = "1";
      this.activeIndex2 = " ";
      this.currentPage = 1;
      this.displayList = this.Lists.filter(
        (item) => item.ClassOne == "网络文学"
      );
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    handleSelect1() {
      this.activeIndex2 = " ";
    },
    handleSelect2() {
      this.activeIndex1 = " ";
    },
    goToBookInfo(id) {
      this.$router.push(`/bookInfo/${id}`);
    },
    //获取今日销量冠军
    getTodaySalesChampion() {
      axios({
        url: this.$store.state.yuming + "/book/getPage",
        method: "GET",
        params: {
          page_num: 1,
          book_num: 1,
          style: 1,
          main_category_id: "",
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
            this.todaySalesChampion = data;
          } else {
            this.$message.error("获取新书信息失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    //获取最新上架的12本书（可能会改本数）
    getNewBook() {
      axios({
        url: this.$store.state.yuming + "/book/getPage",
        method: "GET",
        params: {
          page_num: 1,
          book_num: 16,
          style: 2,
          main_category_id: "",
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
            this.newBookList = data;
          } else {
            this.$message.error("获取新书信息失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    //获取某一个一级分类下的销量最好的18本书，在最下方的板块
    getClassOneBook(id) {
      axios({
        url: this.$store.state.yuming + "/book/getPage",
        method: "GET",
        params: {
          page_num: 1,
          book_num: 18,
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
    },
    //点击左侧导航栏，进入另一个页面并根据所选的一级分类来获取图书并分页展示
    getMainClassBook(id) {
      this.$router.push({ path: "/classSort", query: { activeIndexMain: id } });
    },
    //点击左侧导航栏，进入另一个页面并根据所选的二级分类来获取图书并分页展示
    getSecondClassBook(id) {
      this.$router.push({
        path: "/classSort",
        query: { activeIndexMain: "", activeIndexSecond: id },
      });
    },
    //通过年份来分页
    getYearBook(year) {
      this.$router.push({
        path: "classSort",
        query: { activeIndexMain: "", activeIndexSecond: "", year: year },
      });
    },
    getYearBeforeBook(year) {
      this.$router.push({
        path: "classSort",
        query: {
          activeIndexMain: "",
          activeIndexSecond: "",
          year: "",
          year_before: year,
        },
      });
    },
    //获取购物车中商品数量
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
            this.activeIndex1 = data[0].main_id;
            this.getClassOneBook(this.activeIndex1);
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
    if (this.$store.state.token) {
      await this.getGoodsNum();
    }
    await this.getAllCategory();
    await this.getTodaySalesChampion();
    await this.getNewBook();
    await this.mounted();
    this.isLoading = false;
  },
};
</script>

<style acoped>
body{
  background-color: f7f7f7;
}
.el-pagination {
  text-align: center;
}
.book-name {
  font-size: 100%;
  white-space: nowrap;
}
.imgStyle1 {
  width: 100%;
  height: 150px;
  cursor: pointer;
}
.imgStyle4 {
  width: 100%;
  height: 150px;
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
  padding: 0px;
  text-align: center;
}
.tscStyle {
  height: 100%;
  width: 80%;
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
.card:hover {
  box-shadow: 0 0 2px 6px #f3f3f3;
}
</style>