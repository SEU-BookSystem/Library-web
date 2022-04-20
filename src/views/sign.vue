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
        <el-card shadow="always" class="Mycard">
          <el-form
            ref="userInfo"
            :rules="rules"
            :model="userInfo"
            label-width="80px"
            label-position="left"
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              flex-wrap: wrap;
            "
          >
            <el-form-item>
              <h2 class="login-title">新用户注册</h2>
            </el-form-item>
            <el-form-item label="昵称" prop="name">
              <el-input class="Myinput" v-model="userInfo.name"> </el-input>
            </el-form-item>
            <el-form-item label="绑定邮箱" prop="username">
              <el-input
              class="Myinput"
                v-model="userInfo.username"
                placeholder="邮箱一旦绑定不得更改"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input class="Myinput" v-model="userInfo.password" type="password"> </el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkpass">
              <el-input class="Myinput" v-model="userInfo.checkpass" type="password">
              </el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="activationCode">
              <el-input v-model="userInfo.activationCode" class="otherInput">
              </el-input>
              <el-button @click="countDown" :disabled="disabled">{{
                content
              }}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="onSign"
                style="
                  width: 250px;
                  margin-top: 10px;
                  margin-left: 20px;
                  margin-right: 10px;
                "
                >注册并登录</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import { Message } from "element-ui";
export default {
  components: {},
  data() {
    return {
      // 获取验证码
      disabled: false,
      interval: undefined,
      totalCount: 0,
      userInfo: {
        name: "",
        username: "",
        password: "",
        checkpass: "",
        activationCode: "",
      },
      rules: {
        name: [{ required: true, message: "昵称不得为空", trigger: "blur" }],
        username: [
          {
            required: true,
            message: "邮箱格式不正确",
            trigger: "blur",
            type: "email",
          },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 3, message: "密码不得低于3位", trigger: "blur" },
        ],
        checkpass: [
          { required: true, message: "确认密码", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请再次输入密码"));
              } else if (value !== this.userInfo.password) {
                callback(new Error("两次输入密码不一致"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        activationCode: [
          { required: true, message: "验证码不得为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    content() {
      return this.totalCount !== 0
        ? `${this.totalCount}秒后获取`
        : "获取验证码";
    },
  },
  methods: {
    //倒计时按钮
    countDown() {
      // 按钮60秒倒计时
      this.disabled = true;
      this.totalCount = 60;
      this.sendActivationCode(); //60秒过倒计时过后才能调用的事件
      this.interval = setInterval(() => {
        this.totalCount--;
        if (this.totalCount === 0) {
          clearInterval(this.interval);
          this.disabled = false;
        }
      }, 1000);
    },
    //发送验证码
    sendActivationCode() {
      axios({
        url: this.$store.state.yuming + "/sendEmail",
        method: "POST",
        params: {
          email: this.userInfo.username,
          password: this.userInfo.password,
          name: this.userInfo.name,
        },
      })
        .then((res) => {
          const { code } = res.data;
          //code=='0'表示登录成功，进行本地存储和store存储 并进行跳转。
          //else 弹出错误提示
          if (code == "200") {
            this.$message({
              message: "验证码发送成功",
              type: "success",
            });
          } else {
            this.$message.error("验证码发送失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    onSign() {
      axios({
        url: this.$store.state.yuming + "/registerUser",
        method: "POST",
        params: {
          email: this.userInfo.username,
          password: this.userInfo.password,
          name: this.userInfo.name,
          activationCode: this.userInfo.activationCode,
        },
      })
        .then((res) => {
          const { code } = res.data;
          //code=='0'表示登录成功，进行本地存储和store存储 并进行跳转。
          //else 弹出错误提示
          if (code == "200") {
            this.$message({
              message: "注册成功",
              type: "success",
            });
            this.$router.push("/login");
          } else {
            this.$message.error("注册失败,请稍后再试");
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
};
</script>

<style acoped>
.login-form {
  width: 500px;
  margin: auto; /* 上下间距160px，左右自动居中*/
  background-color: rgb(255, 255, 255); /* 透明背景色 */
  padding: 30px;
}
/* 标题 */
.login-title {
  color: #303133;
  display: flex;
  justify-content: center;
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
.otherInput {
  width: 140px;
  margin: 10px 20px;
}
.inputContent {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin-left: 10%;
}
.Mycard {
  margin: 1% 3%;
  width: 500px;
  height: 500px;
}
.submit {
  display: flex;
  justify-content: center;
  align-items: center;
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
</style> 