<template>
  <div v-loading="isLoading">
    <div class="bbb"></div>
    <div class="header">
      <div class="hasRole ? search2 :search2">
        <el-input
          placeholder="给孩子的第一本编程书籍"
          v-model="input"
          style="width: 500px"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click.native="goToSearch"
          >
          </el-button>
        </el-input>
      </div>
      <div v-if="hasRole">
        <el-row class="shopping">
          <el-col :span="10">
            <el-badge :value="goodsNum" class="shopping">
              <el-button
                size="meduim"
                icon="el-icon-shopping-cart-2"
                @click="gotoShopCar"
                >我的购物车</el-button
              >
            </el-badge>
          </el-col>
          <el-col :span="4" class="pageperson">
            <el-button
              size="meduim"
              class="pageperson"
              icon="el-icon-s-custom"
              @click="gotoPersonPage"
              >个人主页</el-button
            >
          </el-col>
          <el-col @click.native="loginOut" style="margin-left: 30px">
            <i class="iconfont-tuichu" style="font-size: 20px" />
          </el-col>
        </el-row>
      </div>
      <div v-else>
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
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      isLoading: false,
      input: "",
      goodsNum: "",
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
      this.$router.push("/shopping");
    },
    loginOut() {
      this.isLoading = true;
      this.$store.commit("clearCache");
      sessionStorage.removeItem("token");
      this.isLoading = false;
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
  },
  async created() {
    this.isLoading = true;
    if (this.$store.state.token) {
      await this.getGoodsNum();
    }
    this.isLoading = false;
  },
};
</script>

<style>
.bbb {
  background: url("../assets/3.jpg") no-repeat;
  background-position: center;
  height: 20%;
  width: 100%;
  background-size: cover;
  position: absolute;
  z-index: -1;
}
.header {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-left: 10%;
  margin-right: 10%;
  height: 20%;
}
.search {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
  margin-left: 500px;
}
.search2 {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
  margin-left: 350px;
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
</style>
