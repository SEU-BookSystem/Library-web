<template>
  <div class="home" v-loading="isLoading">
    <div class="content">
      <div class="header">
        <img height="70px" style="margin:20px 0" src="../../assets/jwbc.png" />
        <div class="title">后台管理</div>
      </div>
      <div style="margin: 10px 0"><el-page-header @back="gotoAdmin" content="用户管理"></el-page-header></div>
       <div>
        <el-card class="box-card1">
          <el-container>
            <el-aside width="35px"><div class="verticalBar2"></div></el-aside>
            <el-main>
          <div style="font-size: 15px padding: 18px 0">
            在此处，您可以查看、查找、编辑、注销用户信息。
          </div>
            </el-main>
          </el-container>
        </el-card>
      </div>
      <div class="box2">
        <el-card class="box-card1">
          <el-form label-width="120px">
            <el-form-item label="用户昵称搜索：">
              <el-input
              v-model="searchText"
              placeholder="输入用户昵称模糊搜索"
              ></el-input>
            </el-form-item>
          </el-form>
          <el-table
          v-loading="userDataLoading"
          :data="userList.filter((data) => {return data.name.includes(searchText);})"
          style="width: 100%"
          :default-sort = "{prop: 'create_time', order: 'descending'}">
            <template slot="empty">
              <img src="../../assets/empty_grey.png" style="height:100px;margin-top:30px">
              <p style="margin-top:0px">暂无用户</p>
            </template>
            <el-table-column type="expand">
               <template slot-scope="scope">
                  <el-form label-position="left" inline class="demo-table-expand">
                    <!--
                    <el-form-item label="用户头像">
                      <el-popover placement="right" title="" trigger="hover">
                        <img class="img-max" :src="scope.row.avatar_b"/>
                        <img class="img-min" slot="reference" :src="scope.row.avatar_s" :alt="scope.row.avatar_s" style="max-height: 50px;max-width: 130px">
                      </el-popover>
                    </el-form-item>
                    -->
                    <el-form-item label="注册时间"><span>{{scope.row.create_time}}</span></el-form-item>
                    <el-form-item label="绑定邮箱"><span>{{scope.row.username}}</span></el-form-item>
                  </el-form>
               </template>
            </el-table-column>
            <el-table-column prop="update_time" label="更新时间" sortable></el-table-column>
            <el-table-column label="用户头像">
              <template slot-scope="scope">
                <el-popover placement="right" title="" trigger="hover">
                  <img class="img-max" :src="scope.row.avatar_b"/>
                  <img class="img-min" slot="reference" :src="scope.row.avatar_s" :alt="scope.row.avatar_s" style="max-height: 50px;max-width: 130px">
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="用户昵称"></el-table-column>
            <!--<el-table-column prop="username" label="绑定邮箱"></el-table-column>-->
            <el-table-column prop="status" label="用户状态"
            :filters="[
              { text: '未激活', value: 0 },
              { text: '普通用户', value: 1 },
              { text: '商家', value: 2 },
            ]"
            :filter-method="filterState">
              <template slot-scope="scope">
                <span v-if="scope.row.status==0">未激活</span>
                <span v-if="scope.row.status==1">普通用户</span>
                <span v-if="scope.row.status==2">商家</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="user.user_id=scope.row.id;
                user.email=scope.row.username;user.name=scope.row.name;
                user.img=scope.row.avatar_b;user.password=scope.row.password;
                email=scope.row.username;EditVisible=true;">编辑</el-button>
                <el-button size="mini" type="text" @click="deleteUser(scope.row.username)">注销</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>
     <el-dialog title="用户信息" :visible.sync="EditVisible" center width="440px">
        <div class="my_prompt">提示：您正在编辑邮箱为{{email}}的用户的店铺信息。</div>
              <el-form ref="user"
              :model="user"
              label-width="80px"
              :rules="rules">
                <el-form-item label="用户头像" prop="img">
                  <el-upload 
                  class="avatar-uploader"
                  ref="upload"
                  action="http://47.94.131.208:8888"
                  :show-file-list="false"
                  :on-change="changePhotoFile"
                  :on-success="handleAvatarSuccess"
                  :auto-upload="false"
                  :name="user.img">
                    <img :src="user.img" class="avatar" />
                  </el-upload>
                  <my-cropper
                  ref="myCropper"
                  @getFile="getFile"
                  @upAgain="upAgain"
                  ></my-cropper>
                </el-form-item>
                <el-form-item label="用户昵称" prop="name">
                  <el-input v-model="user.name" autocomplete="off" maxlength="10" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="用户密码" prop="password">
                  <el-input v-model="user.password" autocomplete="off" show-password></el-input>
                </el-form-item>
                <el-form-item label="绑定邮箱" prop="email">
                  <el-input v-model="user.email" autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="EditVisible = false;formdata=''">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
              </div>
            </el-dialog>
  </div>
</template>

<script>
import MyCropper from "../cropper.vue";
import axios from "axios";
import { Message } from "element-ui";
export default {
  components: {
    MyCropper,
  },
  data() {
    return {
      //loading
      isLoading: false,
      userDataLoading: false,
      //模糊搜索
      searchText: "",
      //编辑用户信息
      formdata: new FormData(),
      EditVisible: false,
      email: "",
      user: {
        img: "",
        user_id: "",
        email: "",
        password: "",
        name: "",
      },
      rules: {
        email: [
          { required: true, message: "绑定邮箱不得为空", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请输入绑定邮箱'));
              } else {
                if (value !== '') { 
                  var reg=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                  if(!reg.test(value)){
                  callback(new Error('请输入正确的邮箱'));
                  }
                }
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        name: [
          { required: true, message: "用户昵称不得为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不得为空", trigger: "blur" },
        ],
      },
      userList:[//用户列表
      /*
        {
          create_time: "2021-07-15 18:31:30",//注册时间
          update_time: "2021-07-15 18:31:30",//更新时间
          name: "A",//用户昵称
          username: "xxxxxx@qq.com",//绑定邮箱
          status: 1,//激活状态 0.未激活 1.已激活 -> 1.普通用户 2.商家
          identity: 0,//身份0.普通用户 1.商家 2.管理员
          avatar_b: require("../../assets/kuku.png"),//头像
          avatar_s: require("../../assets/kuku.png"),//头像
          password: "",//密码
        },
        */
      ],
    };
  },
  computed: {},
  methods:{
    //回到管理员主页
    gotoAdmin() {
      this.$router.push("/adminManage");
    },
    //筛选用户状态
    filterState(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    //重新加载用户信息
    reloadUserData() {
      this.userDataLoading = true;
      this.getAllUser();
      this.userDataLoading = false;
    },
    //编辑用户信息
    editUser() {
      this.updateUser();
      this.updateAvatar();
      this.formdata = "";
      this.EditVisible = false;
      //刷新
      this.userDataLoading = true;
      this.getAllUser();
      this.userDataLoading = false;
    },
    //编辑头像
    updateAvatar() {
      this.formdata.append("user_id", this.user.user_id);
      axios({
        url: this.$store.state.yuming+"/admin/updateAvatar",
        method: "POST",
        data: this.formdata,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.$message({
              type: "success",
              message: "编辑头像成功",
        });
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //上传图片触发
    handleCrop(file) {
      this.$nextTick(() => {
        this.$refs.myCropper.open(file.raw || file);
      });
    },
    //点击弹框重新时触发
    upAgain() {
      this.$refs["upload"].$refs["upload-inner"].handleClick();
    },
    getFile(file) {
      this.formdata.append("img", file);
      //获取上传图片的本地URL，用于上传前的本地预览
      this.user.img=window.URL.createObjectURL(file);
      this.$refs.myCropper.close();
    },
    //头像上传成功之后的方法,进行回调
    handleAvatarSuccess(res) {
      if (res.code === 0) {
        this.user.img = res.img;
        // this.handleCrop(file);
      } else {
        this.$message.error("上传出错");
      }
    },
    //提取文件后缀名
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
    //编辑除头像以外的信息
    updateUser() {
      axios({
        url: this.$store.state.yuming+"/admin/updateUser",
        method: "POST",
        params: {
          user_id: this.user.user_id,
          email: this.user.email,
          password: this.user.password,
          name: this.user.name,
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.$message({
              type: "success",
              message: "编辑用户信息成功",
        });
          } else {
            this.$message.error("编辑用户信息失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //获取所有用户
    getAllUser() {
      axios({
        url: this.$store.state.yuming+"/admin/getAllUser",
        method: "GET",
        params: {},
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.userList = data;
            this.userList.forEach(user => {
              if(user.identity==1) {
                user.status = 2;
              }
            });
          } else if (code == "3") {
            this.userList = [];
          } else {
            this.$message.error("获取所有用户失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //注销用户
    deleteUser(u) {
      axios({
        url: this.$store.state.yuming+"/deleteUser",
        method: "DELETE",
        params: {
          username: u,
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.reloadUserData();
            this.$message({
              type: "success",
              message: "注销成功",
        });
          } else {
            this.$message.error("注销失败");
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
    await this.getAllUser();
    this.isLoading = false;
  },
};
</script>

<style>
.home {
  display: flex;
  justify-content: center;
}

.content{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.header{
  display: flex;
  justify-content: space-between;
  margin: 20px;
}

.title{
  font-size: 35px;
  padding: 30px 10px;
}

.text {
  font-size: 20px;
}

.item {
  padding: 18px 0;
}

.box2{
  display: flex;
  justify-content: center;
}

.box-card1 {
  width: 900px;
  margin: 20px;
}

.verticalBar2 {
  width: 4px;
  height: 50px;
  background: #3d678a;
  display: inline-block;
  margin-top: 8px;
  vertical-align: top;
  margin-right: 0px;
  margin-left: 30px;
  border-radius: 20%;
}

  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

.img-min{
  width: 50px;
  height: 50px;
}
.img-max{
  width: 200px;
  height: 200px;
}

  .my_prompt{
    color: grey;
    margin-bottom: 20px;
  }

   .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    margin-right: 500px;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>