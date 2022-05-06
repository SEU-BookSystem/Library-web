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
                src="../assets/wads.png"
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
        <el-header style="padding: 0">
          <!-- <el-row class="rowStyle1">
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
                  :key="item.category_id"
                  style="color: rgb(250, 128, 114); font-weight: 1000"
                  :index="item.category_id"
                  @click.native="getMainClassBook(item.category_id)"
                  >{{ item.catagory_name }}</el-menu-item
                >
              </el-menu>
            </el-col>
          </el-row> -->
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
              <el-breadcrumb-item>{{ book.book_name }}</el-breadcrumb-item>
            </el-breadcrumb>
          </el-row>
        </el-header>
        <el-divider></el-divider>
        <el-container style="margin-top: 1%">
          <el-aside width="20%">
            <img class="imgStyle3" :src="book.image" />
          </el-aside>
          <el-main style="padding: 0px 20px">
            <h2 style="margin: 0px; margin-bottom: 10px">
              {{ book.book_name }}
            </h2>
            <p style="color: gray; margin-top: 8%">
              {{ book.author }}
            </p>
            <p style="color: gray; margin: 10px 0px">
              {{ book.publisher }}
            </p>
            <p style="color: gray; margin: 10px 0px">
              {{ this.dateFormat(book.print_time) }}出版
            </p>
            <p>
              {{ book.detail }}
            </p>
          </el-main>
        </el-container>
        <el-divider content-position="center"><h2>借阅书籍</h2></el-divider>
        <el-table :data="bookList" style="width: 100%">
          <el-table-column prop="bar_code" label="条码号" width="180">
          </el-table-column>
          <el-table-column prop="reference_num" label="索书号" width="180">
          </el-table-column>
          <el-table-column prop="address" label="地址"> </el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <div v-if="scope.row.status == 1">未上架</div>
              <div v-if="scope.row.status == 2">可借</div>
              <div v-if="scope.row.status == 3">已借</div>
              <div v-if="scope.row.status == 4">被预约</div>
            </template></el-table-column
          >
        </el-table>
        <div style="display: flex; justify-content: flex-end; margin: 2%">
          <el-button @click="orderDialog = true" round>我要预约</el-button>
        </div>
        <el-dialog title="预约书籍" :visible.sync="orderDialog" width="30%">
          <span>是否预约书籍《{{ this.book.book_name }}》？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="orderBook">确 定</el-button>
          </span>
        </el-dialog>
      </el-container>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
export default {
  data() {
    return {
      input: "",
      isLoading: false,
      dataLoading: false,
      orderDialog: false,
      borrowDialog: false,
      activeIndex1: "",
      username: "",
      num: 1,
      evaluationList: [],
      goodsNum: "",
      reference_num: this.$route.params.reference_num,
      book: {},
      bookList: [
        {
          bar_code: "",
          reference_num: "",
          address: "",
          status: "",
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
    hasUsername(){
      return this.$store.state.username;
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
    //预约书籍
    orderBook() {
      axios({
        url: this.$store.state.yuming + "/book/addReserve",
        method: "POST",
        params: {
          reference_num: this.reference_num,
          username: this.$store.state.username,
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.$message({
              showClose: true,
              message: "预约成功！",
            });
          } else if (code == "25") {
            this.$message.error("书籍不可预约");
          } else if (code == "26") {
            this.$message.error("借阅数量已达最大值");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    //时间格式化
    dateFormat(date) {
      return moment(date).format("YYYY-MM-DD");
    },
    //点击导航栏或者面包屑，进入另一个页面并根据所选的一级分类来获取图书并分页展示
    getMainClassBook(id) {
      this.$router.push({ path: "/classSort", query: { activeIndexMain: id } });
    },
    //获取这种书的详情
    getBookDetail() {
      axios({
        url: this.$store.state.yuming + "/book/getBookByReferenceNum",
        method: "GET",
        params: { reference_num: this.reference_num },
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
    //获取这本书
    getBookNum() {
      axios({
        url: this.$store.state.yuming + "/book/getBookItemByReferenceNum",
        method: "GET",
        params: { reference_num: this.reference_num },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.bookList = data;
          } else {
            this.$message.error("获取图书本数失败,请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
  },
  async created() {
    this.isLoading = true;
    await this.getBookDetail();
    await this.getBookNum();
    this.isLoading = false;
  },
};
</script>
<style acoped>
.el-header {
  height: 30px !important;
}
.imgStyle3 {
  width: 100%;
  height: auto;
  max-height: 350px;
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
</style>
