<template>
  <div class="aM-home">
    <div class="aM-content">
      <div class="aM-header">
        <img height="70px" style="margin:20px 0" src="../../assets/wads.png" />
        <div class="aM-title">后台管理</div>
      </div>
      <div>
        <el-card class="aM-box-card1">
          <el-container>
            <el-aside width="35px"><div class="verticalBar"></div></el-aside>
            <el-main>
              <div class="aM-box3">
            <h2>欢迎您，管理员</h2>
            <el-button type="text" @click.native="loginOut">退出登录</el-button>
          </div>
          <div class="aM-item" style="font-size: 15px">
            在此处，您可以选择使用 违规管理、借阅管理、书籍管理、读者管理功能。
          </div>
            </el-main>
          </el-container>
        </el-card>
      </div>
            <div>
        <el-card class="aM-box-card1" style="background-color: #3d678a;height:60px">
          <el-row style="color: white">
            <el-col style="text-align:center">
              <el-row style="font-size: 20px;margin:2px"></el-row>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <div class="aM-box2">
        <el-button type="text" @click="gotoViolate">
        <el-card class="aM-box-card2">
          <i class="icon-xitongquanxian" style="font-size: 50px; margin: 50px"/>
          <div class="aM-text aM-item">
            违规管理
          </div>
          <i style="color: #909399">处理违规行为。</i>
        </el-card>
        </el-button>
        <el-button type="text" @click="gotoOrder">
        <el-card class="aM-box-card2">
          <i class="icon-piciguanli" style="font-size: 50px; margin: 50px"/>
          <div class="aM-text aM-item">
            借阅管理
          </div>
          <i style="color: #909399">查看、查找、添加、编辑、删除读者信息。</i>
        </el-card>
        </el-button>
      </div>
      <div class="aM-box2">
        <el-button type="text" @click="gotoBook">
        <el-card class="aM-box-card2">
          <i class="icon-wenxianliutong" style="font-size: 50px; margin: 50px"/>
          <div class="aM-text aM-item">
            书籍管理
          </div>
          <i style="color: #909399">查看、查找、添加、编辑、删除书籍信息。</i>
        </el-card>
        </el-button>
        <el-button type="text" @click="gotoUser">
        <el-card class="aM-box-card2">
          <i class="icon-duzheguanli" style="font-size: 50px; margin: 50px"/>
          <div class="aM-text aM-item">
            读者管理
          </div>
          <i style="color: #909399">查看、查找、添加、编辑、注销读者信息。</i>
        </el-card>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  computed: {},
  methods:{
    gotoHome() {
      this.$router.push("/#reloaded");
    },
    gotoViolate() {
      this.$router.push("/manageViolate");
    },
    gotoBook() {
      this.$router.push("/manageBook");
    },
    gotoUser() {
      this.$router.push("/manageUser");
    },
    gotoOrder() {
      this.$router.push("/manageOrder");
    },
    gotoDataVisual() {
      this.$router.push("/dataVisual");
    },
    loginOut() {
      this.isLoading = true;
      this.$store.commit("clearCache");
      sessionStorage.removeItem("token");
      this.isLoading = false;
      this.gotoHome();
    },
  },
};
</script>

<style scoped>
.aM-home {
  display: flex;
  justify-content: center;
}

.aM-content{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.aM-header{
  display: flex;
  justify-content: space-between;
  margin: 20px;
}

.aM-title{
  font-size: 35px;
  padding: 30px 10px;
}

.aM-text {
  font-size: 20px;
}

.aM-item {
  padding: 18px 0;
}

.aM-box2{
  display: flex;
  justify-content: center;
}

.aM-box-card1 {
  width: 900px;
  margin: 5px 20px;
  height: 207px;
}

.aM-box-card2 {
  width: 435px;
  margin: 10px;
  height: 160px;
}

.aM-box3{
  display: flex;
  justify-content: space-between;
}

.verticalBar {
  width: 4px;
  height: 100px;
  background: #3d678a;
  display: inline-block;
  margin-top: 35px;
  vertical-align: top;
  margin-right: 0px;
  margin-left: 30px;
  border-radius: 20%;
}

</style>