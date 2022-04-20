<template>
  <div v-loading="isLoading">
    <div class="header">
      <div class="logo">
        <img height="70px" style="margin: 20px 0" src="../assets/jwbc.png" />
      </div>
      <el-page-header
        @back="gotoPerson"
        content="资料修改"
        style="display: flex; justify-content: center; align-items: center"
      ></el-page-header>
    </div>
    <div class="tab">
      <el-tabs v-model="activeName">
        <el-tab-pane label="账户设置" name="first">
          <div
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: 10px;
            "
          >
            <el-form ref="userInfo" :model="userInfo" label-width="80px">
              <el-row style="margin-top: 20px">
                <el-col>
                  <el-form-item label="用户头像" prop="avatar_s">
                    <el-upload
                      class="avatar-uploader"
                      ref="upload"
                      action="http://47.94.131.208:8888"
                      :show-file-list="false"
                      :on-change="changePhotoFile" 
                      :auto-upload="false"
                      :name="this.userInfo.avatar_b"
                    >
                      <img
                        v-if="this.userInfo.avatar_b"
                        :src="this.userInfo.avatar_b"
                        class="avatar"
                      />
                      <img v-else src="../assets/avatar.jpg" class="avatar" />
                      <div class="avatar-uploader-icon">
                        <i
                          class="el-icon-warning-outline"
                          style="margin-right: 5px; color: #909399"
                        ></i>
                        <i style="color: #909399">点击头像进行修改</i>
                      </div>
                    </el-upload>
                    <my-cropper
                      ref="myCropper"
                      @getFile="getFile"
                      @upAgain="upAgain"
                    ></my-cropper>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="用户昵称" prop="name">
                    <el-input v-model="userInfo.name"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="绑定邮箱" prop="username">
                    <span>{{ userInfo.username }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item>
                    <i
                      class="el-icon-warning-outline"
                      style="margin-right: 5px; color: #909399"
                    ></i>
                    <i style="color: #909399"
                      >邮箱一旦绑定不得更改，如有需要请联系管理员</i
                    >
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="margin-bottom: 0px">
                <el-col>
                  <el-form-item prop="password">
                    <el-button type="text" @click="changePassword = true"
                      >修改密码</el-button
                    >
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item>
                    <el-button type="primary" @click="confirmChange"
                      >确认修改</el-button
                    >
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <el-dialog title="修改密码" :visible.sync="changePassword">
              <el-form
                ref="userInfo"
                :model="userInfo"
                label-width="100px"
                :rules="rules"
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  flex-wrap: wrap;
                "
              >
                <el-row>
                  <el-form-item label="原密码" prop="checkOrignPass">
                    <el-input
                      v-model="userInfo.checkOrignPass"
                      type="password"
                      placeholder="请输入原密码"
                      style="width: 400px"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="新密码" prop="newpass">
                    <el-input
                      v-model="userInfo.newpass"
                      placeholder="请输入新密码"
                      prop="newpass"
                      type="password"
                      style="width: 400px"
                      clearable
                    >
                    </el-input>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="确认新密码" prop="checkpass">
                    <el-input
                      v-model="userInfo.checkpass"
                      placeholder="请确认新密码"
                      prop="checkpass"
                      type="password"
                      clearable
                      style="width: 400px"
                    >
                    </el-input>
                  </el-form-item>
                </el-row>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="changePassword = false">取 消</el-button>
                <el-button type="primary" @click="confirmPass">确 定</el-button>
              </div>
            </el-dialog>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import MyCropper from "./cropper.vue";
import axios from "axios";
import { Message } from "element-ui";
export default {
  components: {
    MyCropper,
  },
  data() {
    return {
      changePassword: false,
      isLoading: false,
      activeName: "first",
      userInfo: {
        avatar_b: "",
        avatar_s: "",
        username: "",
        name: "",
        password: "",
        checkOrignPass: "",
        newpass: "",
        checkpass: "",
      },
      rules: {
        newpass: [
          { required: true, message: "新密码不得为空", trigger: "blur" },
          { min: 3, message: "密码不得低于3位", trigger: "blur" },
        ],
        checkOrignPass: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请输入原密码"));
              } else if (value !== this.userInfo.password) {
                callback(new Error("原密码不正确"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        checkpass: [
          { required: true, message: "确认密码", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请再次输入密码"));
              } else if (value !== this.userInfo.newpass) {
                callback(new Error("两次输入密码不一致"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {},
  methods: {
    //返回首页
    gotoPerson() {
      this.$router.push("/person");
    },
    //修改密码
    confirmPass() {
      this.changePassword = false;
      this.userInfo.password = this.userInfo.newpass;
      var formData = new FormData();
      formData.append("password", this.userInfo.password);
      formData.append("name", this.userInfo.name);
      axios({
        url: this.$store.state.yuming + "/updateUser",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((res) => {
        if (res.data.code == 200) {
          this.$message({
              message: "修改密码成功",
              type: "success",
            });
        } else {
          this.$message.error("修改密码失败");
        }
      });
    },
    //确认修改个人信息
    confirmChange() {
      var formData = new FormData();
      formData.append("password", this.userInfo.password);
      formData.append("name", this.userInfo.name);
      axios({
        url: this.$store.state.yuming + "/updateUser",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((res) => {
        if (res.data.code == 200) {
          this.$message({
              message: "修改个人信息成功",
              type: "success",
            });
        } else {
          this.$message.error("修改个人信息失败");
        }
      });
    },
    //裁剪
    //上传图片触发
    handleCrop(file) {
      this.$nextTick(() => {
        this.$refs.myCropper.open(file.raw || file);
      });
    },
    // 点击弹框重新时触发
    upAgain() {
      this.$refs["upload"].$refs["upload-inner"].handleClick();
    },
    getFile(file) {
      var formData = new FormData();
      formData.append("img", file);
      axios({
        url: this.$store.state.yuming + "/updateAvatar",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((res) => {
        if (res.data.code == 200) {
          this.getUserInfo();
          this.$refs.myCropper.close();
        } else {
          this.$message.error("上传出错");
        }
      });
      // this.$refs.upload.submit();
    },
     // 提取文件后缀名
    getSuffix(str) {
      const fileExtension = str.substring(str.lastIndexOf(".") + 1);
      return fileExtension;
    },
    //上传图片时会被调用
    changePhotoFile(file) {
       let type = this.getSuffix(file.name);
      const isLt6M = file.size / 1024 / 1024 < 6;
      if (type == "JPG" || type == "JPEG" || type == "PNG"|| type == "jpg" || type == "png"|| type == "jpge") {
        if (!isLt6M) {
          this.$message.error("上传头像图片大小不能超过 6MB!");
        } else {
          this.handleCrop(file);
        }
      } else {
        this.$message.error("上传头像图片只能是 JPG、JPEG或PNG 格式!");
      }
    },
    //获取用户信息
    getUserInfo() {
      axios({
        url: this.$store.state.yuming + "/user/getByUsername",
        method: "GET",
        params: {
          username: this.$store.state.username,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          //code=='0'表示登录成功，进行本地存储和store存储 并进行跳转。
          //else 弹出错误提示
          if (code == "200") {
            this.userInfo = data;
          } else {
            this.$message({
              message: "获取用户信息失败",
              type: "danger",
            });
            this.$router.push("/#reloaded");
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
    await this.getUserInfo();
    this.isLoading = false;
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: 5%;
  margin-right: 5%;
}
.tab {
  margin-left: 5%;
  margin-right: 5%;
}
.logo {
  display: flex;
  justify-content: center;
  margin: 20px;
}
.title {
  color: #303133;
  text-align: center;
  font-size: 30px;
}
.personCard {
  margin: 20px 5%;
}
.vertical {
  display: inline-block;
  width: 1px;
  height: 18em;
  margin: 0 8px;
  vertical-align: middle;
  position: relative;
}
.up {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
}
.personDetail {
  width: 500px;
  height: 400px;
}
.all {
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}
.bbb {
  background: url("../assets/3.jpg") no-repeat;
  background-position: center;
  height: 20%;
  width: 100%;
  background-size: cover;
  position: absolute;
}
.header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 20%;
}
.logo {
  display: flex;
  justify-content: center;
  margin: 20px;
}
</style>