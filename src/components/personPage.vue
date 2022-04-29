<template>
  <div v-loading="isLoading">
    <div class="header">
      <div class="logo">
        <img height="70px" style="margin: 20px 0" src="../assets/wads.png" />
      </div>
      <el-page-header
        @back="gotoIndex"
        content="个人主页"
        style="display: flex; justify-content: center; align-items: center"
      ></el-page-header>
    </div>
    <div class="tab">
      <el-tabs v-model="activeName" :tab-position="tabPosition">
        <el-tab-pane label="首页" name="first">
          <div
            style="display: flex; justify-content: center; align-items: center"
          >
            <el-form
              ref="personInfo"
              :model="personInfo"
              label-width="100px"
              label-position="left"
            >
              <el-row style="margin-top: 30px">
                <el-col>
                  <el-form-item label="姓名：" prop="name">
                    <span>{{ personInfo.name }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="性别：" prop="gentle">
                    <span>{{ personInfo.gentle }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="年龄：" prop="shopper_name">
                    <span>{{ personInfo.age }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="身份证号：" prop="shopper_name">
                    <span>{{ personInfo.age }}</span>
                  </el-form-item>
                </el-col> </el-row
              ><el-row>
                <el-col>
                  <el-form-item label="手机号：" prop="shopper_name">
                    <span>{{ personInfo.age }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item>
                    <el-button type="text" @click="changePassword = true"
                      >点击修改我的密码</el-button
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
                :rules="passwordRules"
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
        <el-tab-pane label="我的收藏" name="second">
          <div v-if="hasCollected == false">
            <el-row>
              <el-col :offset="9">
                <img
                  src="../assets/empty_grey.png"
                  style="height: 220px; margin: 50px"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :offset="10">
                <p style="color: grey">您还没有收藏任何书籍哦~</p>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="我的预约" name="third">
         <div v-if="hasOrdered == false">
            <el-row>
              <el-col :offset="9">
                <img
                  src="../assets/empty_grey.png"
                  style="height: 220px; margin: 50px"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :offset="10">
                <p style="color: grey">您还没有预约任何书籍哦~</p>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="我的借阅" name="fourth">
          <div v-if="hasBorrowed == true">
          </div> 
          <div v-if="hasBorrowed == false">
            <el-row>
              <el-col :offset="9">
                <img
                  src="../assets/empty_grey.png"
                  style="height: 220px; margin: 50px"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :offset="10">
                <p style="color: grey">您还没有借阅任何书籍哦~</p>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane name="fifth" label="我的借阅历史">
          <div v-if="hasBorrowedHistory == true">
          </div> 
          <div v-if="hasBorrowedHistory == false">
            <el-row>
              <el-col :offset="9">
                <img
                  src="../assets/empty_grey.png"
                  style="height: 220px; margin: 50px"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :offset="10">
                <p style="color: grey">您的借阅历史为空~</p>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane name="sixth" label="我的违规记录">
          <div v-if="hasViolated == true">
          </div> 
          <div v-if="hasViolated == false">
            <el-row>
              <el-col :offset="9">
                <img
                  src="../assets/empty_grey.png"
                  style="height: 220px; margin: 50px"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :offset="10">
                <p style="color: grey">您还没有任何违规记录哦~</p>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane name="seventh">
          <span slot="label"
            >消息<el-badge :value="1" class="message" type="primary" :max="99">
            </el-badge>
          </span>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Message } from "element-ui";
export default {
  components: {
  },
  data() {
    return {
      //tab方向
       tabPosition: 'left',
      hasBorrowed: false,
      hasCollected:false,
      hasOrdered:false,
      hasBorrowHistory:false,
      hasViolated:false,
      imgUrl: require("../assets/avatar.jpg"),
      orderId: "",
      isLoading: false,
      //修改密码
      changePassword: false,
      //收货地址loading
      addressLoading: false,
      activeName: "first",
      //是否上传了头像
      hasShopAvatar: false,
      userInfo: {
        username: "",
        name: "",
        password: "",
        checkOrignPass: "",
        newpass: "",
        checkpass: "",
      },
      //申请店铺
      applypersonInfo: {
        img: "",
        shopper_name: "",
        shop_name: "",
        apply_reason: "",
      },
      //店铺信息
      personInfo: {
        apply_status: "",
        shopper_name: "",
        shop_name: "",
        avatar_b: "",
        rate: "",
      },
      //店铺申请历史信息
      applyHistory: [
        {
          avatar_b: "",
          shop_name: "",
          shopper_name: "",
          apply_reason: "",
          apply_status: "",
          pass_status: "",
          exist_status: "",
          check_opinion: "",
        },
      ],
      //收货地址
      //我的收货地址
      editInfoVisible: false,
      addInfoVisible: false,
      delAddressVisible: false,
      delAddressId: "",
      newAddress: {
        name: "",
        phone: "",
        address: "",
      },
      editMyAddress: {
        id: "",
        name: "",
        phone: "",
        address: "",
      },
      myAddressList: [
        {
          id: "",
          name: "",
          phone: "",
          address: "",
          status: "",
        },
      ],
      //评分
      value: 0,
      dialogVisible: false,
      newAddressRules: {
        phone: [
          { required: true, message: "电话号码不得为空", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请输入电话号码"));
              } else if (!/^1\d{10}$/.test(value)) {
                callback(new Error("请输入正确的11位手机号码"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        name: [
          { required: true, message: "姓名不得为空", trigger: "blur" },
          { max: 10, message: "姓名不得超过十个字", trigger: "blur" },
        ],
        address: [
          { required: true, message: "地址不得为空", trigger: "blur" },
          { max: 50, message: "地址不得超过五十个字", trigger: "blur" },
        ],
      },
      applyRules: {
        img: [{ required: true, message: "店铺头像不得为空", trigger: "blur" }],
        shopper_name: [
          { required: true, message: "店主名不得为空", trigger: "blur" },
        ],
        shop_name: [
          { required: true, message: "店铺名不得为空", trigger: "blur" },
        ],
        apply_reason: [
          { required: true, message: "申请理由不得为空", trigger: "blur" },
          { max: 100, message: "申请理由不得超过100个字", trigger: "blur" },
        ],
      },
      passwordRules: {
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
      formdata: new FormData(),
    };
  },
  computed: {
    hasUsername() {
      return this.$store.state.username;
    },
  },
  methods: {
    //返回首页
    gotoIndex() {
      this.$router.push("/#reloaded");
    },
    //跳转资料修改页面
    // gotoChange() {
    //   this.$router.push("/change");
    // },
    gotoShopManager() {
      this.$router.push("/shopManage");
    },
    //跳转收货地址页面
    gotoAddress() {
      this.activeName = "second";
    },
    //跳转全部页面
    gotoAllOrder() {
      this.id = 1;
      this.$router.push("/userOrder/" + this.id);
    },
    //跳转待付款
    gotoDaifukuan() {
      this.id = 2;
      this.$router.push("/userOrder/" + this.id);
    },
    //跳转待发货
    gotoDaifahuo() {
      this.id = 3;
      this.$router.push("/userOrder/" + this.id);
    },
    //跳转待收货页面
    gotoDaishouhuo() {
      this.id = 4;
      this.$router.push("/userOrder/" + this.id);
    },
    //跳转全部页面
    gotoDaipingjia() {
      this.id = 5;
      this.$router.push("/userOrder/" + this.id);
    },
    //跳转退款页面
    gotoTuikuan() {
      this.id = 6;
      this.$router.push("/userOrder/" + this.id);
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
    //获取用户的收货地址
    getUserAddress() {
      axios({
        url: this.$store.state.yuming + "/user/address/getAll",
        method: "GET",
      }).then((res) => {
        if (res.data.code == 200) {
          this.myAddressList = res.data.data;
        } else {
          this.$message.error("获取收货地址，请重试");
        }
      });
    },
    //清空newAddress
    clearNewAddress() {
      this.newAddress.name = "";
      this.newAddress.address = "";
      this.newAddress.phone = "";
      this.addInfoVisible = true;
    },
    //新增收货地址
    addNewAddress() {
      this.addInfoVisible = false;
      axios({
        url: this.$store.state.yuming + "/user/address/add",
        method: "POST",
        params: {
          address: this.newAddress.address,
          phone: this.newAddress.phone,
          name: this.newAddress.name,
        },
      }).then((res) => {
        if (res.data.code == 200) {
          this.addressLoading = true;
          this.getUserAddress();
          this.addressLoading = false;
          this.$message({
            message: "新增成功",
            type: "success",
          });
        } else {
          this.$message.error("新增失败，请重试");
        }
      });
    },
    //编辑收货地址
    eidtAddress(e) {
      this.editInfoVisible = true;
      this.editMyAddress.id = e.id;
      this.editMyAddress.name = e.name;
      this.editMyAddress.phone = e.phone;
      this.editMyAddress.address = e.address;
    },
    //确认编辑收货地址
    confirmChangeAddress() {
      this.editInfoVisible = false;
      axios({
        url: this.$store.state.yuming + "/user/address/update",
        method: "POST",
        params: {
          addressId: this.editMyAddress.id,
          address: this.editMyAddress.address,
          name: this.editMyAddress.name,
          phone: this.editMyAddress.phone,
        },
      }).then((res) => {
        if (res.data.code == 200) {
          this.addressLoading = true;
          this.getUserAddress();
          this.addressLoading = false;
          this.$message({
            message: "编辑成功",
            type: "success",
          });
        } else {
          this.$message.error("编辑失败，请重试");
        }
      });
    },
    //预备删除地址
    editDelAddress(e) {
      this.delAddressId = e.id;
      this.delAddressVisible = true;
    },
    //确认删除地址
    confirmDelAddress() {
      this.delAddressVisible = false;
      axios({
        url: this.$store.state.yuming + "/user/address/delete",
        method: "DELETE",
        params: {
          addressId: this.delAddressId,
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.addressLoading = true;
            this.getUserAddress();
            this.addressLoading = false;
            this.$message({
              message: "删除成功",
              type: "success",
            });
          } else {
            this.$message.error("删除失败,请重试");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //设置默认地址
    setDefaultAddress(e) {
      axios({
        url: this.$store.state.yuming + "/user/address/setDefault",
        method: "POST",
        params: {
          addressId: e.id,
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.addressLoading = true;
            this.getUserAddress();
            this.addressLoading = false;
          } else {
            this.$message.error("设置默认地址失败,请重试");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //确认申请成为商家
    confirmApply() {
      if (this.hasShopAvatar == false) {
        this.$message.error("必须上传店铺头像哦~");
        this.applypersonInfo.img = "";
        this.applypersonInfo.shopper_name = "";
        this.applypersonInfo.shop_name = "";
        this.applypersonInfo.apply_reason = "";
      } else {
        this.formdata.append("shopper_name", this.applypersonInfo.shopper_name);
        this.formdata.append("shop_name", this.applypersonInfo.shop_name);
        this.formdata.append("apply_reason", this.applypersonInfo.apply_reason);
        axios({
          url: this.$store.state.yuming + "/registerShop",
          method: "POST",
          data: this.formdata,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }).then((res) => {
          if (res.data.code == 200) {
            this.$message({
              message: "申请成功",
              type: "success",
            });
            this.applypersonInfo.img = "";
            this.applypersonInfo.shopper_name = "";
            this.applypersonInfo.shop_name = "";
            this.applypersonInfo.apply_reason = "";
          } else {
            this.$message.error("申请失败，请重试");
          }
        });
      }
    },
    //获取申请店铺历史信息
    getApplyHistory() {
      axios({
        url: this.$store.state.yuming + "/user/getAllShop",
        method: "GET",
        params: {
          username: this.hasUsername,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.applyHistory = data;
            this.hasBorrowHistory = true;
          } else if (code == "3") {
            this.hasBorrowHistory = false;
          } else {
            this.$message.error("获取店铺申请历史信息失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //获取用户信息
    getUserInfo() {
      axios({
        url: this.$store.state.yuming + "/user/getByUsername",
        method: "GET",
        params: {
          username: this.hasUsername,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.userInfo = data;
            this.$store.commit("role", data.identity);
          } else {
            this.$message.error("获取用户信息失败");
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
    //获取店铺信息
    getpersonInfo() {
      axios({
        url: this.$store.state.yuming + "/shop/getPassed",
        method: "GET",
        params: {
          username: this.hasUsername,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.personInfo = data;
            this.value = this.personInfo.rate;
          } else if (code == "17") {
            this.$message("已有店铺申请正在审核");
          } else {
            if (code != "3") {
              this.$message.error("获取店铺状态失败,请刷新");
            }
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    async isLoadShop() {
      if (this.$store.state.role == 1) {
        await this.getpersonInfo();
      }
    },
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
      this.formdata.append("img", file);
      this.hasShopAvatar = true;
      // 获取上传图片的本地URL，用于上传前的本地预览
      this.applypersonInfo.img = window.URL.createObjectURL(file);
      this.$refs.myCropper.close();
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
      if (
        type == "JPG" ||
        type == "JPEG" ||
        type == "PNG" ||
        type == "jpg" ||
        type == "png" ||
        type == "jpge"
      ) {
        if (!isLt6M) {
          this.$message.error("上传头像图片大小不能超过 6MB!");
        } else {
          this.handleCrop(file);
        }
      } else {
        this.$message.error("上传头像图片只能是 JPG、JPEG或PNG 格式!");
      }
    },
  },
  async created() {
    this.isLoading = true;
    await this.getUserInfo();
    await this.isLoadShop();
    if (this.$store.state.role == 0) {
      await this.getApplyHistory();
    }
    await this.getUserAddress();
    this.isLoading = false;
  },
};
</script>

<style  scoped>
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
  width: 600px;
  height: 450px;
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
.img-min {
  width: 50px;
  height: 50px;
}
.img-max {
  width: 200px;
  height: 200px;
}
.addressCard {
  width: 300px;
  height: 250px;
  margin: 20px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 18px;
}
.cccard {
  margin: 10px 20px;
  width: 200px;
  height: 150px;
  background-color: rgb(61, 103, 138);
}
.noCard {
  margin: 10px 20px;
  width: 200px;
  height: 150px;
}
.message {
  margin-top: 5px;
}
</style>