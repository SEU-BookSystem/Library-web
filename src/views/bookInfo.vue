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
            <img class="imgStyle3" :src="changeUrl(book.image)" />
          </el-aside>
          <el-main style="padding: 0px 20px">
            <h2 style="margin: 0px; margin-bottom: 10px">
              {{ book.book_name }}
            </h2>
            <p style="color: gray; margin-top:3%">
              作者：{{ book.author }}
            </p>
            <p style="color: gray; margin: 10px 0px">
              出版社：{{ book.publisher }}
            </p>
            <p style="color: gray; margin: 10px 0px">
             出版时间： {{ this.dateFormat(book.print_time) }}
            </p>
            <p style="color: gray; margin: 10px 0px">
              ISBN：{{ book.isbn}}
            </p>
            <p style="color: red; font-weight: 1000; margin: 0%;font-size:15px">
              价格：{{ book.price }}
            </p>     
            <p>
             简介： {{ book.detail | ellipsis }}
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
          <el-button @click="collectionDialog = true" round>加入收藏</el-button>
          <el-button @click="orderDialog = true" round>我要预约</el-button>
        </div>
        <el-dialog title="预约书籍" :visible.sync="orderDialog" width="30%">
          <span>是否预约书籍《{{ this.book.book_name }}》？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="orderBook">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="收藏书籍"
          :visible.sync="collectionDialog"
          width="30%"
        >
          <span>是否收藏书籍《{{ this.book.book_name }}》？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="collectionBook">确 定</el-button>
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
  filters: {
    //限制文本显示字数,超出部分用...代替
    ellipsis(value) {
      if (!value) return "";
      if (value.length > 300) {
        return value.slice(0, 300) + "..."; //0:下标,从第一个字开始显示,50:显示字数,多余用...代替
      }
      return value;
    },
  },
  data() {
    return {
      input: "",
      isLoading: false,
      dataLoading: false,
      orderDialog: false,
      collectionDialog: false,
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
    hasUsername() {
      return this.$store.state.username;
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
    gotoCollection() {
      this.$router.push("/collection");
    },
    gotoPersonPage() {
      this.$router.push("/person");
    },
    gotoLogin() {
      this.$router.push("/login");
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
              message: "预约成功！",
              type: "success"
            });
            this.orderDialog = false;
          } else if (code == "25") {
            this.$message.error("书籍不可预约");
            this.orderDialog = false;
          } else if (code == "26") {
            this.$message.error("借阅数量已达最大值");
            this.orderDialog = false;
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
          this.orderDialog = false;
        });
    },
    //收藏书籍
    collectionBook() {
      axios({
        url: this.$store.state.yuming + "/collection/add",
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
              message: "收藏成功！",
              type: "success",
            });
            this.collectionDialog = false;
          } else if (code == "19") {
            this.$message.error("书籍已在收藏夹中！");
            this.collectionDialog = false;
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
          this.collectionDialog = false;
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
