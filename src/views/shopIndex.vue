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
        <el-header style="padding: 0">
          <el-row class="rowStyle1">
            <el-col class="colStyle" @click.native="showAll"
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
                  @click.native="getClassBook(item.main_id)"
                  >{{ item.main_name }}</el-menu-item
                >
              </el-menu>
            </el-col>
          </el-row>
        </el-header>
        <el-container>
          <el-aside width="18%" align="center">
            <img class="avatar" :src="this.shop.avatar_b" />
            <p>{{ this.shop.shop_name }}</p>
            <el-rate
              v-model="this.rate"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}"
            >
            </el-rate>
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
                        class="imgStyle"
                        :src="book.image_b"
                        @click.native="goToBookInfo(book.id)"
                      >
                      </el-image>
                    </el-header>
                    <el-main
                      style="
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
                        >{{ book.book_name | ellipsis }}</el-link
                      >
                      <p style="color: gray; margin: 0%" :title="book.author">
                        {{ book.author | ellipsis }}
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
              :page-size="16"
              @current-change="handleCurrentChange"
              layout="prev, pager, next, jumper"
              :total="bookcount"
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
      isLoading: false,
      activeIndex1: "",
      activeIndex2: "",
      goodsNum: "",
      currentPage: 1,
      bookcount: 1,
      shop_id: this.$route.params.shop_id,
      input: "",
      categoryList: [
        {
          book_num: 0,
          main_name: "",
          main_id: "",
          second_category: [{ book_num: "", second_name: "", second_id: "" }],
        },
      ],
      shop: {
        avatar_b: "",
        shop_name: "",
      },
      rate:5,
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
    //展示这家店的所有书
    showAll() {
      this.activeIndex1 = " ";
      this.activeIndex2 = " ";
      axios({
        url: this.$store.state.yuming + "/book/getPage",
        method: "GET",
        params: {
          page_num: this.currentPage,
          book_num: 16,
          style: 1,
          main_category_id: "",
          second_category_id: "",
          year: "",
          year_before: "",
          year_after: "",
          shop_id: this.shop_id,
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
      axios({
        url: this.$store.state.yuming + "/book/getPageCount",
        method: "GET",
        params: {
          main_category_id: "",
          second_category_id: "",
          year: "",
          year_before: "",
          year_after: "",
          shop_id: this.shop_id,
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
    //每次点导航栏能够将当前页改为1
    getClassBook(id) {
      this.currentPage = 1;
      this.getMainClassBook(id);
    },
    //根据类型显示这家店的书
    getMainClassBook(id) {
      this.activeIndex1 = id;
      axios({
        url: this.$store.state.yuming + "/book/getPage",
        method: "GET",
        params: {
          page_num: this.currentPage,
          book_num: 16,
          style: 1,
          main_category_id: id,
          second_category_id: "",
          year: "",
          year_before: "",
          year_after: "",
          shop_id: this.shop_id,
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
      axios({
        url: this.$store.state.yuming + "/book/getPageCount",
        method: "GET",
        params: {
          main_category_id: id,
          second_category_id: "",
          year: "",
          year_before: "",
          year_after: "",
          shop_id: this.shop_id,
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
    handleCurrentChange(val) {
      this.currentPage = val;
      if (this.activeIndex1 == " ") {
        this.showAll();
      } else this.getMainClassBook(this.activeIndex1);
    },
    handleSelect1() {
      this.activeIndex2 = " ";
    },
    handleSelect2() {
      this.activeIndex1 = " ";
    },
    //加入图书详情页
    goToBookInfo(id) {
      this.$router.push(`/bookInfo/${id}`);
    },
    //进行搜索
    goToSearch() {
      this.$store.commit("gobalSearchText", this.input);
      this.$router.push("/searchBook");
    },
    //获取店铺信息
    getShopInfo() {
      axios({
        url: this.$store.state.yuming + "/user/public/getShopById",
        method: "GET",
        params: {
          shop_id: this.shop_id,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.shop = data;
          } else {
            this.$message.error("获取店铺信息失败,请刷新");
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
            this.$message.error("获取购物车失败,请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    //获取评分
    getRate(){
      axios({
        url: this.$store.state.yuming + "/shop/rate",
        method: "GET",
        params: {shop_id:this.shop_id,}
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.rate = data;
          } else {
            this.$message.error("获取用户评价数量失败,请刷新");
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
    await this.getShopInfo();
    await this.getRate();
    await this.showAll();
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
.imgStyle {
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
  background-color: rgb(205, 92, 92);
}
.colStyle {
  text-align: center;
  font-weight: 1000;
  width: 21.93%;
  color: white;
  cursor: pointer;
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
.avatar {
  width: 178px;
  height: 178px;
  border-radius: 50%;
  margin-top: 100px;
}
.el-menu-item.is-active {
  background-color: rgb(231, 241, 252) !important;
}
.card:hover{
  box-shadow: 0 0 2px 6px #F3F3F3;
}
</style>