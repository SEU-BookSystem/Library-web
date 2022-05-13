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
                ><p>全部商品分类</p></el-col
              >
            </el-row>
            <el-menu>
              <el-menu-item
                index="2022"
                @click.native="getOne(0)"
                style="
                  color: rgb(233, 150, 122);
                  font-weight: 1000;
                  border-left: solid 1px #e6e6e6;
                "
                >社科</el-menu-item
              >
              <el-menu-item
                index="2022"
                @click.native="getOne(1)"
                style="
                  color: rgb(233, 150, 122);
                  font-weight: 1000;
                  border-left: solid 1px #e6e6e6;
                "
                >文学</el-menu-item
              >
              <el-menu-item
                index="2022"
                @click.native="getOne(2)"
                style="
                  color: rgb(233, 150, 122);
                  font-weight: 1000;
                  border-left: solid 1px #e6e6e6;
                "
                >自然科学</el-menu-item
              >
              <el-menu-item
                index="2022"
                @click.native="getOne(3)"
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
                @click.native="getThree('2022', '2020')"
                style="
                  color: rgb(233, 150, 122);
                  font-weight: 1000;
                  border-left: solid 1px #e6e6e6;
                "
                >最近3年出版</el-menu-item
              >
              <el-menu-item
                index="2021"
                @click.native="getThree('2022', '2018')"
                style="
                  color: rgb(233, 150, 122);
                  font-weight: 1000;
                  border-left: solid 1px #e6e6e6;
                "
                >最近5年出版</el-menu-item
              >
              <el-menu-item
                index="2020"
                @click.native="getThree('2022', '2013')"
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
          <el-main>
            <el-row class="rowStyle" type="flex">
              <el-col
                :span="4"
                v-for="book in displayList"
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
            <el-pagination
              :current-page="currentPage"
              @current-change="handleCurrentChange"
              :page-count="bookcount"
              :page-size="18"
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
      this.$router.push("/#reloaded");
    },
    //实现分页
    handleCurrentChange(val) {
      this.currentPage = val;
      if (this.activeIndex1 != "") {
        this.getMainClassBook(this.activeIndex1);
      } else if (this.activeIndex2 != "" && this.activeIndex3 != "") {
        this.getYearBook(this.activeIndex2, this.activeIndex3);
      } else this.getYearBeforeBook(this.activeIndex4);
    },
    goToBookInfo(id) {
      this.$router.push(`/bookInfo/${id}`);
    },
    //点各导航栏都要会第一页
    getOne(id) {
      this.currentPage = 1;
      this.getMainClassBook(id);
    },
    getThree(end, begin) {
      this.currentPage = 1;
      this.getYearBook(end, begin);
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
        url: this.$store.state.yuming + "/book/getMainPage",
        method: "GET",
        params: {
          page_num: this.currentPage,
          each_num: 18,
          category: id,
        },
      })
        .then((res) => {
          const { code, data, page_count } = res.data;
          if (code == "200") {
            this.displayList = data;
            this.bookcount = page_count;
          } else {
            this.$message.error("获取图书信息失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    //通过index传来的参数进行某一年份筛选
    getYearBook(endyear, beginyear) {
      this.activeIndex1 = "";
      this.activeIndex2 = endyear;
      this.activeIndex3 = beginyear;
      this.activeIndex4 = "";
      axios({
        url: this.$store.state.yuming + "/book/getPageByYear",
        method: "GET",
        params: {
          page_num: this.currentPage,
          each_num: 18,
          year_before: endyear,
          year_after: beginyear,
        },
      })
        .then((res) => {
          const { code, data ,page_count} = res.data;
          if (code == "200") {
            this.displayList = data;
            this.bookcount = page_count
          } else {
            this.$message.error("获取图书信息失败，请刷新");
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
        url: this.$store.state.yuming + "/book/getPageByYear",
        method: "GET",
        params: {
          page_num: this.currentPage,
          each_num: 18,
          year_before: year,
          year_after: "",
        },
      })
        .then((res) => {
          const { code, data, page_count } = res.data;
          if (code == "200") {
            this.displayList = data;
            this.bookcount = page_count;
          } else {
            this.$message.error("获取图书信息失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
  },
  async created() {
    this.isLoading = true;
    var query = this.$route.query;
    if (query) {
      if (query.activeIndexMain != "") {
        var temp = query.activeIndexMain;
        this.activeIndex2 = temp;
        this.getMainClassBook(this.activeIndex2);
      } else if (query.endyear != "" && query.beginyear != "") {
        var temp1 = query.endyear;
        var temp2 = query.beginyear;
        this.activeIndex2 = temp1;
        this.activeIndex3 = temp2;
        this.getYearBook(this.activeIndex2, this.activeIndex3);
      } else {
        temp = query.beforeyear;
        this.activeIndex4 = temp;
        this.getYearBeforeBook(this.activeIndex4);
      }
    }

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
.imgStyle4 {
  margin-left: 15px;
  width: 80%;
  height: 150px;
  cursor: pointer;
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
.el-main {
  padding-top: 0px !important;
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