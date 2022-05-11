<template>
  <div v-loading="isLoading">
    <div>
      <div class="header">
        <el-row>
          <el-col :span="6">
            <div class="logo">
              <img
                height="70px"
                style="margin: 30px 0"
                src="../assets/wads.png"
              />
            </div>
          </el-col>
          <el-col :span="12">
            <div class="hasRole ? search1 : search2">
              <el-input
                placeholder="给孩子的第一本书籍"
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
              <el-row class="collection">
                <el-col :span="10" :offset="20">
                  <el-button
                    style="
                      margin-right: 30px;
                      display: block;
                      background-color: rgb(205, 92, 92);
                      color: white;
                    "
                    size="meduim"
                    icon="el-icon-star-on"
                    @click.native="gotoCollection"
                    >我的收藏</el-button
                  >
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
                  <i class="icon-tuichu" style="font-size: 20px" />
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="6" v-else>
            <div style="margin-left: 80px">
              <el-row class="hasNoRole">
                <el-col style="margin: 20px 0">
                  <el-button
                    type="text"
                    style="margin-left: 30px"
                    size="meduim"
                    class="loginword"
                    @click="gotoLogin"
                    >亲爱的会员，进行操作前请先登录</el-button
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
                ><p>全部书籍分类</p></el-col
              >
            </el-row>
            <el-menu>
              <el-menu-item
                index="2022"
                @click.native="getMainClassBook(0)"
                style="
                  color: rgb(233, 150, 122);
                  font-weight: 1000;
                  border-left: solid 1px #e6e6e6;
                "
                >社科</el-menu-item
              >
              <el-menu-item
                index="2022"
                @click.native="getMainClassBook(1)"
                style="
                  color: rgb(233, 150, 122);
                  font-weight: 1000;
                  border-left: solid 1px #e6e6e6;
                "
                >文学</el-menu-item
              >
              <el-menu-item
                index="2022"
                @click.native="getMainClassBook(2)"
                style="
                  color: rgb(233, 150, 122);
                  font-weight: 1000;
                  border-left: solid 1px #e6e6e6;
                "
                >自然科学</el-menu-item
              >
              <el-menu-item
                index="2022"
                @click.native="getMainClassBook(3)"
                style="
                  color: rgb(233, 150, 122);
                  font-weight: 1000;
                  border-left: solid 1px #e6e6e6;
                "
                >其他</el-menu-item
              >
              <el-menu-item
                index="2022"
                @click.native="getYearBook('2022')"
                style="
                  color: rgb(233, 150, 122);
                  font-weight: 1000;
                  border-left: solid 1px #e6e6e6;
                "
                >更多分类</el-menu-item
              > </el-menu
            ><el-menu>
              <div style="background-color: #f7f7f7">
                <el-menu-item style="border-left: solid 1px #e6e6e6">
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
                index="2022"
                @click.native="getYearBook('2022','2020')"
                style="
                  color: rgb(233, 150, 122);
                  font-weight: 1000;
                  border-left: solid 1px #e6e6e6;
                "
                >最近3年出版</el-menu-item
              >
              <el-menu-item
                index="2021"
                @click.native="getYearBook('2022','2018')"
                style="
                  color: rgb(233, 150, 122);
                  font-weight: 1000;
                  border-left: solid 1px #e6e6e6;
                "
                >最近5年出版</el-menu-item
              >
              <el-menu-item
                index="2020"
                @click.native="getYearBook('2022','2013')"
                style="
                  color: rgb(233, 150, 122);
                  font-weight: 1000;
                  border-left: solid 1px #e6e6e6;
                "
                >最近10年出版</el-menu-item
              >
              <el-menu-item
                index="2019"
                @click.native="getYearBeforeBook('2012')"
                style="
                  color: rgb(233, 150, 122);
                  font-weight: 1000;
                  border-left: solid 1px #e6e6e6;
                  border-bottom: solid 1px #e6e6e6;
                "
                >2012年及以前出版</el-menu-item
              >
            </el-menu>
          </el-aside>
          <el-main style="padding-top: 0px; height: 100%">
            <el-row style="margin-bottom: 1%">
              <el-col :span="16">
                <el-carousel
                  :interval="5000"
                  arrow="never"
                  height="300px"
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
                  @click.native="goToBookInfo(todaySalesChampion.reference_num)"
                >
                  <el-row style="height: 40px; margin: 0% 5% 5%"
                    ><el-col :span="4"
                      ><i class="icon-guanjum" style="font-size: 40px"></i
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
                        本周借阅冠军
                      </p></el-col
                    >
                  </el-row>
                  <el-row style="height: 170px">
                    <el-image
                      class="tscStyle"
                      :src="changeUrl(this.todaySalesChampion.image)"
                      @click.native="
                        goToBookInfo(todaySalesChampion.reference_num)
                      "
                    ></el-image>
                  </el-row>
                  <el-row style="text-align: center">
                    <el-link
                      :underline="false"
                      class="book-name"
                      style="color: black; margin: 1%"
                      @click="goToBookInfo(todaySalesChampion.reference_num)"
                      :title="this.todaySalesChampion.book_name"
                      >{{
                        this.todaySalesChampion.book_name | ellipsis1
                      }}</el-link
                    >
                    <p
                      style="color: rgb(128, 192, 192); margin: 0%"
                      :title="this.todaySalesChampion.author"
                    >
                      {{ this.todaySalesChampion.author | ellipsis1 }}
                    </p>
                  </el-row>
                </el-card>
              </el-col>
            </el-row>
            <el-row>
              <img src="../assets/xssj.png" style="width: 100%; height: 60px" />
            </el-row>
            <el-row class="rowStyle" type="flex">
              <div
                v-for="book in newBookList"
                :key="book.reference_num"
                style="margin-left: 10px"
              >
                <el-container
                  style="width: 90%; margin: 5%"
                  @click.native="goToBookInfo(book.id)"
                  class="card"
                >
                  <el-header
                    style="
                      width: 100%;
                      height: 150px;
                      align-items: center;
                      margin-top: 20px;
                    "
                  >
                    <el-image
                      class="imgStyle1"
                      :src="changeUrl(book.image)"
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
                  </el-main>
                </el-container>
              </div>
            </el-row>
          </el-main> </el-container
        ><el-footer style="padding: 0px">
          <!-- <el-row style="margin: 0% 0% 0.5%"
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
          </el-row> -->
          <el-divider></el-divider>
          <el-row style="display: flex; align-items: center">
            <el-col :span="5" :offset="1"><h2>好书推荐</h2></el-col>
            <el-col :span="17" style="display: flex; justify-content: flex-end">
              <div @mouseover="choose = 1" style="margin:0px 10px">
                <el-button round @click="choose = 1">图书</el-button>
              </div>
              <div @mouseover="choose = 2" style="margin:0px 10px">
                <el-button round @mouseover="choose = 2" @click="choose = 2"
                  >期刊</el-button
                >
              </div>
              <div @mouseover="choose = 3" style="margin:0px 10px">
                <el-button round @mouseover="choose = 3" @click="choose = 3"
                  >全部</el-button
                >
              </div>
            </el-col>
          </el-row>
          <el-row class="rowStyle" type="flex" v-if="choose == 1">
            <el-col
              :span="4"
              v-for="book in hotBookList"
              :key="book.reference_num"
            >
              <el-container
                style="width: 90%; margin: 5%"
                @click.native="goToBookInfo(book.reference_num)"
                class="card"
              >
                <el-header
                  style="
                    width: 100%;
                    height: 150px;
                    align-items: center;
                    margin-top: 20px;
                  "
                >
                  <el-image
                    class="imgStyle4"
                    :src="changeUrl(book.image)"
                    @click.native="goToBookInfo(book.reference_num)"
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
                    @click="goToBookInfo(book.reference_num)"
                    :title="book.book_name"
                    >{{ book.book_name | ellipsis2 }}</el-link
                  >
                  <p
                    style="color: rgb(128, 192, 192); margin: 0%"
                    :title="book.author"
                  >
                    {{ book.author | ellipsis2 }}
                  </p>
                </el-main>
              </el-container>
            </el-col>
          </el-row>
          <el-row class="rowStyle" type="flex" v-if="choose == 2">
            <el-col
              :span="4"
              v-for="book in hotJournalList"
              :key="book.reference_num"
            >
              <el-container
                style="width: 90%; margin: 5%"
                @click.native="goToBookInfo(book.reference_num)"
                class="card"
              >
                <el-header
                  style="
                    width: 100%;
                    height: 150px;
                    align-items: center;
                    margin-top: 20px;
                  "
                >
                  <el-image
                    class="imgStyle4"
                    :src="changeUrl(book.image)"
                    @click.native="goToBookInfo(book.reference_num)"
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
                    @click="goToBookInfo(book.reference_num)"
                    :title="book.book_name"
                    >{{ book.book_name | ellipsis2 }}</el-link
                  >
                  <p
                    style="color: rgb(128, 192, 192); margin: 0%"
                    :title="book.author"
                  >
                    {{ book.author | ellipsis2 }}
                  </p>
                </el-main>
              </el-container>
            </el-col>
          </el-row>
          <el-row class="rowStyle" type="flex" v-if="choose == 3">
            <el-col
              :span="4"
              v-for="book in hotAllBookList"
              :key="book.reference_num"
            >
              <el-container
                style="width: 90%; margin: 5%"
                @click.native="goToBookInfo(book.reference_num)"
                class="card"
              >
                <el-header
                  style="
                    width: 100%;
                    height: 150px;
                    align-items: center;
                    margin-top: 20px;
                  "
                >
                  <el-image
                    class="imgStyle4"
                    :src="changeUrl(book.image)"
                    @click.native="goToBookInfo(book.reference_num)"
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
                    @click="goToBookInfo(book.reference_num)"
                    :title="book.book_name"
                    >{{ book.book_name | ellipsis2 }}</el-link
                  >
                  <p
                    style="color: rgb(128, 192, 192); margin: 0%"
                    :title="book.author"
                  >
                    {{ book.author | ellipsis2 }}
                  </p>
                </el-main>
              </el-container>
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
      if (value.length > 9) {
        return value.slice(0, 9) + "..."; //0:下标,从第一个字开始显示,15:显示字数,多余用...代替
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
      if (value.length > 6) {
        return value.slice(0, 6) + "..."; //0:下标,从第一个字开始显示,15:显示字数,多余用...代替
      }
      return value;
    },
  },
  data() {
    return {
      choose: 1,
      goodsNum: "",
      activeIndex1: "",
      activeIndex2: "",
      isLoading: false,
      input: "",
      todaySalesChampion: {
        book_num: "",
        author: "",
        image: "",
        reference_num: "",
      },
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
      hotBookList: [],
      hotJournalList: [],
      hotAllBookList: [],
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
    //豆瓣图片加载
    changeUrl(_url) {
      if (_url !== undefined) {
        let _u = _url.substring(7); //_u:提取http://后面的部分
        return "https://images.weserv.nl/?url=" + _u;
      }
    },
    goToSearch() {
      this.$store.commit("gobalSearchText", this.input);
      this.$router.push("/searchBook");
    },
    // gotoSign() {
    //   this.$router.push("/sign");
    // },
    gotoLogin() {
      this.$router.push("/login");
    },
    gotoPersonPage() {
      this.$router.push("/person");
    },
    gotoCollection() {
      this.$router.push("/collection");
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
      // this.displayList = this.Lists.filter(
      //   (item) => item.ClassOne == "网络文学"
      // );
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
    goToBookInfo(reference_num) {
      this.$router.push(`/bookInfo/${reference_num}`);
    },
    //获取今日销量冠军
    getTodaySalesChampion() {
      axios({
        url: this.$store.state.yuming + "/book/getMaxBook",
        method: "GET",
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.todaySalesChampion = data;
          } else {
            this.$message.error("获取本周借阅冠军信息失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    //获取最新上架的书
    getNewBook() {
      axios({
        url: this.$store.state.yuming + "/book/getNewBook",
        method: "GET",
        params: {
          num: 5,
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
    //获取销量最好的6本图书
    getHotBook() {
      axios({
        url: this.$store.state.yuming + "/book/getHotBook",
        method: "GET",
        params: {
          num: 6,
          category: 0,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.hotBookList = data;
          } else {
            this.$message.error("获取最热图书信息失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    //获取销量最好的6本期刊
    getHotJournal() {
      axios({
        url: this.$store.state.yuming + "/book/getHotBook",
        method: "GET",
        params: {
          num: 6,
          category: 1,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.hotJournalList = data;
          } else {
            this.$message.error("获取最热期刊信息失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    //获取销量最好的6本图书
    getHotAllBook() {
      axios({
        url: this.$store.state.yuming + "/book/getHotBook",
        method: "GET",
        params: {
          num: 6,
          category: 2,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.hotAllBookList = data;
          } else {
            this.$message.error("获取全部最热图书信息失败，请刷新");
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
    //通过年份来分页
    getYearBook(endyear,beginyear) {
      this.$router.push({
        path: "classSort",
        query: { activeIndexMain: "", endyear: endyear,beginyear: beginyear},
      });
    },
    getYearBeforeBook(year) {
      this.$router.push({
        path: "classSort",
        query: {
          activeIndexMain: "",
          beforeyear: year,
        },
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
    await this.getTodaySalesChampion();
    await this.getNewBook();
    await this.getHotBook();
    await this.getHotJournal();
    await this.getHotAllBook();
    await this.mounted();
    this.isLoading = false;
  },
};
</script>

<style acoped>
body {
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
  margin-left: 15px;
  width: 80%;
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
  height: 300px;
  padding: 0px;
  text-align: center;
}
.tscStyle {
  height: 100%;
  width: 60%;
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
.collection {
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
.loginword:hover {
  display: flex;
  justify-content: center;
  margin: 22px;
  font-size: 15px;
  color: #409eff;
}
.loginword {
  display: flex;
  justify-content: center;
  margin: 22px;
  font-size: 15px;
  color: rgb(86, 85, 87);
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