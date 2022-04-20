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
                    @click.native="gotoPersonPage"
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
            <el-col class="colStyle2" @click.native="goBackToIndex"
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
          <el-row style="margin-top: 1%">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item
                @click.native="goBackToIndex"
                style="cursor: pointer"
                >首页</el-breadcrumb-item
              >
              <el-breadcrumb-item
                @click.native="getMainClassBook(book.main_category_id)"
                style="cursor: pointer"
                >{{ book.main_category }}</el-breadcrumb-item
              >
              <el-breadcrumb-item
                @click.native="getSecondClassBook(book.second_category_id)"
                style="cursor: pointer"
                >{{ book.second_category }}</el-breadcrumb-item
              >
              <el-breadcrumb-item>{{ book.book_name }}</el-breadcrumb-item>
            </el-breadcrumb>
          </el-row>
        </el-header>
        <el-container style="margin-top: 3%">
          <el-aside width="25%">
            <img class="imgStyle3" :src="book.image_b" />
          </el-aside>
          <el-main
            ><el-link
              :underline="false"
              @click.native="goToShopIndex(book.shop_id)"
              style="color: #FF7F50;font-size:17px"
              >所属店铺：{{ book.shop_name }}</el-link
            >
            <h2>{{ book.book_name }}</h2>
            <p style="color: gray; margin: 0%">
              {{ book.author }}
              {{ this.dateFormat(book.print_time) }}出版
              {{ book.press }}
            </p>
            <p>
              {{ book.detail }}
            </p>
            <p style="color: red; font-weight: 1000; margin: 0%;font-size:17px">
              价格：￥{{ book.price }}
            </p>
            <p v-if="book.repertory > 0">库存：{{ book.repertory }}</p>
            <p v-if="book.repertory <= 0">库存不足</p>
            <el-row
              :gutter="20"
              type="flex"
              style="padding: 10px 0; margin: 5% 0%"
            >
              <el-col :span="5"
                ><el-input-number v-model="num" :min="1"></el-input-number
              ></el-col>
              <el-col :span="4"
                ><el-button
                  type="primary"
                  class="el-icon-shopping-cart-2"
                  @click.native="addShoppingTrolley"
                  >加入购物车</el-button
                ></el-col
              >
              <el-col :span="4"
                ><el-button type="danger" @click.native="buy"
                  >立即购买</el-button
                ></el-col
              >
            </el-row>
          </el-main>
        </el-container>
        <div style="font-size: 25px">
          <el-divider content-position="left"
            ><span style="font-size: 25px">用户评价</span></el-divider
          >
        </div>
        <el-footer
            v-if="this.evaluationList.length == 0"
            style="text-align: center;height:100%"
          >
            <img
              style="width: 200px; height: 200px"
              src="../assets/empty_grey.png"
            />
            <p>暂无评价</p>
          </el-footer>
        <el-footer style="height:100%" v-if="this.evaluationList.length!=0">
          <div v-for="item in evaluationList" :key="item.userName">
            <el-card style="margin: 20px 0 20px;height:170px">
              <el-container>
                <el-aside style="width: 180px; text-align: center">
                  <el-image class="avatar" :src="item.avatar_s"></el-image>
                  <p>{{ item.name }}</p>
                </el-aside>
                <el-main>
                  <el-rate
                    v-model="item.rate"
                    disabled
                    score-template="{value}"
                  >
                  </el-rate>
                  <p>{{ item.remark }}</p>
                  <p>评论时间：{{ item.remark_time }}</p>
                </el-main>
              </el-container>
            </el-card>
          </div>
        </el-footer>
      </el-container>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
import { Message } from "element-ui";
export default {
  data() {
    return {
      input: "",
      isLoading: false,
      dataLoading: false,
      activeIndex1: "",
      num: 1,
      evaluationList: [],
      goodsNum: "",
      id: this.$route.params.id,
      book: {},
      categoryList: [
        {
          book_num: 0,
          main_name: "",
          main_id: "",
          second_category: [{ book_num: "", second_name: "", second_id: "" }],
        },
      ],
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
    goBackToIndex() {
      this.$router.push("/#reloaded");
    },
    goToShopIndex(e) {
      this.$router.push(`/shopIndex/${e}`);
    },
    //进行搜索
    goToSearch() {
      this.$store.commit("gobalSearchText", this.input);
      this.$router.push("/searchBook");
    },
    //加入购物车
    addShoppingTrolley() {
      this.formdata.append("book_id", this.id);
      this.formdata.append("sum", this.num);
      axios({
        url: this.$store.state.yuming + "/cartitem/addCartItem",
        method: "POST",
        data: this.formdata,
      }).then((res) => {
        if (res.data.code == 200 && this.num <= this.book.repertory) {
          this.$message({
            message: "加入购物车成功",
            type: "success",
          });
          this.dataLoading = true;
          this.getGoodsNum();
          this.dataLoading = false;
          this.num = 1;
          this.formdata=new FormData();
        } else if (this.num > this.book.repertory) {
          this.$message.warning("库存不足");
          this.num = 1;
          this.formdata=new FormData();
        } else {
          this.$message.warning("加入购物车失败");
          this.num = 1;
          this.formdata=new FormData();
        }
      });
    },
    //直接购买
    buy() {
      if (this.$store.state.token != "" && this.num <= this.book.repertory) {
        this.$router.push(`/shopping/${this.id}/${this.num}`);
      } else if (this.$store.state.token == "") {
        this.$message.warning({
          message: "请登录后再购买",
          type: "error",
        });
      } else if (this.num > this.book.repertory) {
        this.$message.warning({
          message: "库存不足",
          type: "error",
        });
      }
    },
    //时间格式化
    dateFormat(date) {
      return moment(date).format("YYYY-MM-DD");
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
    //点击导航栏或者面包屑，进入另一个页面并根据所选的一级分类来获取图书并分页展示
    getMainClassBook(id) {
      this.$router.push({ path: "/classSort", query: { activeIndexMain: id } });
    },
    //点击面包屑，进入另一个页面并根据所选的二级分类来获取图书并分页展示
    getSecondClassBook(id) {
      this.$router.push({
        path: "/classSort",
        query: { activeIndexMain: "", activeIndexSecond: id },
      });
    },
    //获取这本书的详情
    getBookDetail() {
      axios({
        url: this.$store.state.yuming + "/book/getDetail",
        method: "GET",
        params: { book_id: this.id },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.book = data;
          } else {
            this.$message.error("获取图书详情失败,请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    //获取用户评价
    getRemark(){
      axios({
        url: this.$store.state.yuming + "/book/getRemark",
        method: "GET",
        params: { book_id: this.id },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.evaluationList = data;
          } else {
            this.$message.error("获取用户评价失败,请刷新");
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
    this.getBookDetail();
    this.getAllCategory();
    this.getRemark();
    this.isLoading = false;
  },
};
</script>
<style acoped>
.imgStyle3 {
  width:100%;
  height: auto;
  max-height: 440px;
}
.rowStyle1 {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(205, 92, 92);
}
.colStyle2 {
  text-align: center;
  font-weight: 1000;
  width: 21.93%;
  color: white;
  cursor: pointer;
  justify-content: center;
  align-items: center;
}
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
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
</style>
