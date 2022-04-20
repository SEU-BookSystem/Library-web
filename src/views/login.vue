<template>
  <div>
    <div class="header">
      <div class="logo">
        <img width="250px" src="../assets/jwbc.png" />
      </div>
    </div>
    <div>
      <div class="login"></div>
      <div
        style="display: flex; justify-content: flex-end; align-items: center"
      >
        <el-card shadow="always" class="loginCard">
          <div>
            <h2 class="login-title">教我编程图书商城</h2>
            <el-form :model="form" status-icon :rules="rules" ref="form">
              <el-form-item prop="username">
                <el-row class="inputContent">
                  <el-col :span="2">
                    <i class="el-icon-user" style="font-size: 20px" />
                  </el-col>
                  <el-col :span="10">
                    <el-input
                      class="Myinput"
                      v-model="form.username"
                      placeholder="邮箱"
                      clearable
                    >
                    </el-input>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item prop="password">
                <el-row class="inputContent">
                  <el-col :span="2">
                    <i class="el-icon-unlock" style="font-size: 20px" />
                  </el-col>
                  <el-col :span="10">
                    <el-input
                     class="Myinput"
                      v-model="form.password"
                      placeholder="密码"
                      type="password"
                      clearable
                    >
                    </el-input>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item>
                <el-row class="inputContent">
                  <el-col :offset="2">
                    <el-button
                      type="primary"
                      @click="onSubmit"
                      style="
                        width: 75%;
                        margin-top: 10px;
                        margin-left: 20px;
                        margin-right: 10px;
                      "
                      >登录
                    </el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>


<script>
//接口示例，引入axios
import axios from "axios";
export default {


  components: {},
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "邮箱格式不正确！",
            trigger: "blur",
            type: "email",
          },
        ],
      },
    };
  },
  mounted(){
    
  },
  computed:{
  },
  methods: {
    //接口示例函数
    onSubmit() {
      axios({
        url: this.$store.state.yuming+"/login",
        method: "POST",
        params: {
          username: this.form.username,
          password: this.form.password,
        },
      })
        .then((res) => {
          const { code} = res.data;
          //code=='200'表示登录成功，进行本地存储和store存储 并进行跳转。
          //else 弹出错误提示
          if (code == "200") {
            sessionStorage.setItem("token",res.data.token);
            this.$store.commit("token", res.data.token);
            this.$store.commit("username", this.form.username);
            this.$store.commit("role", res.data.identity);
            this.$store.commit("roleHasLoad", true);
            //localStorage.setItem("token", token);
            //如果是由需要鉴权的页面跳转到登录页面 则redirect= this.$route.query.redirect，如果是直接点击登录跳转到登录页面，则redirect= '/'
            if (this.$route.query.redirect) {
              let redirect = this.$route.query.redirect;
              this.$message({
                message: "登陆成功",
                type: "success",
              });
              this.$router.push(redirect);
            } else {
              this.$message({
                message: "登陆成功",
                type: "success",
              });
              if (res.data.identity != 2) {
                this.$router.push("/");
              } else {
                this.$router.push("/adminManage");
              }
            }
          } else {
            this.$message({
              message: "登陆失败",
              type: "danger",
            });
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
  },
};
</script>

<style acoped>
.login-form {
  width: 500px;
  margin: auto; /* 上下间距160px，左右自动居中*/
  background-color: rgb(255, 255, 255); /* 透明背景色 */
  padding: 30px;
}
.login {
  background: url("../assets/login.jpg") no-repeat;
  background-position: center;
  height: 70%;
  width: 100%;
  background-size: cover;
  position: absolute;
  z-index: -1;
}
/* 标题 */
.login-title {
  color: #303133;
  text-align: center;
}
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-left: 5%;
  margin-right: 5%;
}
.logo {
  display: flex;
  justify-content: center;
  margin: 20px;
}
.Myinput {
  width: 250px;
  margin: 10px 20px;
}
.inputContent {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin-left: 10%;
}
.loginCard {
  margin: 5% 7%;
  width: 400px;
  height: 350px;
}
.submit {
  display: flex;
  justify-content: center;
  align-items: center;
}

</style> 