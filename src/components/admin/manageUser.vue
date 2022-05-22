<template>
  <div class="home" v-loading="isLoading">
    <div class="content">
      <div class="header">
        <img height="70px" style="margin:20px 0" src="../../assets/wads.png" />
        <div class="title">后台管理</div>
      </div>
      <div style="margin: 10px 0"><el-page-header @back="gotoAdmin" content="读者管理"></el-page-header></div>
       <div>
        <el-card class="box-card1">
          <el-container>
            <el-aside width="35px"><div class="verticalBar2"></div></el-aside>
            <el-main>
          <div style="font-size: 15px padding: 18px 0">
            在此处，您可以查看、查找、添加、编辑、注销读者信息。
          </div>
            </el-main>
          </el-container>
        </el-card>
      </div>
      <div class="box2">
        <el-card class="box-card1">
          <el-col :span="18">
          <el-form>
            <el-form-item>
              <el-input
              v-model="searchText"
              placeholder="输入关键词模糊搜索"
              ></el-input>
            </el-form-item>
          </el-form>
          </el-col>
          <el-col :span="3"><div style="margin: 0 20px"><el-button round @click="searchUser()">搜索</el-button></div></el-col>
          <el-col :span="3"><div style="margin: 0 10px"><el-button round @click="clearNewUser()">添加</el-button></div></el-col>
          <el-table
          v-loading="userDataLoading"
          :data="userList"
          style="width: 100%"
          :default-sort = "{prop: 'create_time', order: 'descending'}">
            <template slot="empty">
              <img src="../../assets/empty_grey.png" style="height:100px;margin-top:30px">
              <p style="margin-top:0px">暂无读者</p>
            </template>
            <el-table-column type="expand">
               <template slot-scope="scope">
                  <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="性别"><span>{{scope.row.gender}}</span></el-form-item>
                    <el-form-item label="年龄"><span>{{scope.row.age}}</span></el-form-item>
                    <el-form-item label="身份证号"><span>{{scope.row.id_card}}</span></el-form-item>
                    <el-form-item label="注册时间"><span>{{scope.row.create_time}}</span></el-form-item>
                    <el-form-item label="上次访问"><span>{{scope.row.access_time}}</span></el-form-item>
                  </el-form>
               </template>
            </el-table-column>
            <el-table-column prop="update_time" label="更新时间" sortable></el-table-column>
            <el-table-column prop="name" label="读者姓名"></el-table-column>
            <el-table-column prop="username" label="电话号码"></el-table-column>
            <el-table-column prop="status" label="读者状态"
            :filters="[
              { text: '正常', value: 0 },
              { text: '违规', value: 1 },
            ]"
            :filter-method="filterState">
              <template slot-scope="scope">
                <span v-if="scope.row.status==0">正常</span>
                <span v-if="scope.row.status==1">违规</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="user.name=scope.row.name;
                user.gender=scope.row.gender;
                user.age=scope.row.age;
                user.id_card=scope.row.id_card;
                user.password=scope.row.password;
                phone=scope.row.username;
                EditVisible=true;">编辑</el-button>
                <el-button size="mini" type="text" @click="deleteUser(scope.row.username)">注销</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
          :current-page="page_num"
          @current-change="handleCurrentChange"
          :page-count="page_count"
          layout="prev, pager, next, jumper">
          </el-pagination>
        </el-card>
      </div>
    </div>
     <el-dialog title="编辑读者信息" :visible.sync="EditVisible" center width="440px">
        <div class="my_prompt">提示：您正在编辑电话号码为{{phone}}的读者的信息。</div>
              <el-form ref="user"
              :model="user"
              label-width="80px"
              :rules="rules">
                <el-form-item label="读者姓名" prop="name">
                  <el-input v-model="user.name" autocomplete="off" maxlength="10" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input v-model="user.password" autocomplete="off" show-password></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                  <el-select v-model="user.gender" placeholder="请选择性别">
                    <el-option label="男" value="男"></el-option>
                    <el-option label="女" value="女"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                  <el-input v-model="user.age" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" prop="id_card">
                  <el-input v-model="user.id_card" autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="EditVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
              </div>
            </el-dialog>
            <el-dialog title="添加读者信息" :visible.sync="AddVisible" center width="440px">
              <el-form ref="user"
              :model="user"
              label-width="80px"
              :rules="rules">
                <el-form-item label="读者姓名" prop="name">
                  <el-input v-model="user.name" autocomplete="off" maxlength="10" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input v-model="user.password" autocomplete="off" show-password></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                  <el-select v-model="user.gender" placeholder="请选择性别">
                    <el-option label="男" value="男"></el-option>
                    <el-option label="女" value="女"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                  <el-input v-model="user.age" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" prop="id_card">
                  <el-input v-model="user.id_card" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话号码" prop="phone">
                  <el-input v-model="user.phone" autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="AddVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
              </div>
            </el-dialog>
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
      //loading
      isLoading: false,
      userDataLoading: false,
      //模糊搜索
      searchText: "",
      page_num: 1,
      each_num: 10,
      page_count: 0,
      //编辑或添加读者信息
      EditVisible: false,
      AddVisible: false,
      phone: "",
      user: {
        name: "",
        gender: "",
        age: "",
        phone: "",
        id_card: "",
        password: "",
      },
      rules: {
        id_card: [
          { required: true, message: "身份证号不得为空", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("身份证号不能为空"));
              }
              if (!/(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
                callback(new Error("身份证长度或格式错误"));
              }
              //身份证城市
              var aCity = {
                11: "北京",
                12: "天津",
                13: "河北",
                14: "山西",
                15: "内蒙古",
                21: "辽宁",
                22: "吉林",
                23: "黑龙江",
                31: "上海",
                32: "江苏",
                33: "浙江",
                34: "安徽",
                35: "福建",
                36: "江西",
                37: "山东",
                41: "河南",
                42: "湖北",
                43: "湖南",
                44: "广东",
                45: "广西",
                46: "海南",
                50: "重庆",
                51: "四川",
                52: "贵州",
                53: "云南",
                54: "西藏",
                61: "陕西",
                62: "甘肃",
                63: "青海",
                64: "宁夏",
                65: "新疆",
                71: "台湾",
                81: "香港",
                82: "澳门",
                91: "国外"
              };
              if (!aCity[parseInt(value.substr(0, 2))]) {
                callback(new Error("身份证地区非法"));
              }
              // 出生日期验证
              var sBirthday = (
                value.substr(6, 4) +
                "-" +
                Number(value.substr(10, 2)) +
                "-" +
                Number(value.substr(12, 2))
              ).replace(/-/g, "/"),
              d = new Date(sBirthday);
              if (
              sBirthday !=
              d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate()
              ) {
                callback(new Error("身份证上的出生日期非法"));
              }

              // 身份证号码校验
              var sum = 0,
              weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
              codes = "10X98765432";
              for (var i = 0; i < value.length - 1; i++) {
                sum += value[i] * weights[i];
              }
              var last = codes[sum % 11]; //计算出来的最后一位身份证号码
              if (value[value.length - 1] != last) {
                callback(new Error("身份证号非法"));
              }
              callback();
            },
            trigger: "blur",
          },
        ],
        name: [
          { required: true, message: "读者名称不得为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不得为空", trigger: "blur" },
        ],
        gender: [
          { required: true, message: "性别不得为空", trigger: "blur" },
        ],
        age: [
          { required: true, message: "年龄不得为空", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "电话号码不得为空", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (!(/^1[34578]\d{9}$/.test(value))) {
                callback(new Error('请输入正确的手机号码!'));
              }
              callback();
            },
            trigger: "blur",
          },
        ],
      },
      userList:[//用户列表
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
      //this.updateAvatar();
      //this.formdata = "";
      this.EditVisible = false;
    },
    //添加用户信息
    //清空、初始化数据并打开对话框
    clearNewUser() {
      this.user.name = "";
      this.user.password = "";
      this.user.gender = "";
      this.user.age = "";
      this.user.id_card = "";
      this.user.phone = "";
      this.AddVisible = true;
    },
    //添加用户信息
    addUser() {
      this.registerUser();
      //this.updateAvatar();
      //this.formdata = "";
      this.AddVisible = false;
    },
    registerUser() {
      axios({
        url: this.$store.state.yuming+"/admin/register",
        method: "POST",
        params: {
          phone: this.user.phone,
          password: this.user.password,
          name: this.user.name,
          gender: this.user.gender,
          age: this.user.age,
          id_card: this.user.id_card,
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.reloadUserData();
            this.$message({
              type: "success",
              message: "添加用户信息成功",
        });
          } else {
            this.$message.error("添加用户信息失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //编辑用户信息
    updateUser() {
      axios({
        url: this.$store.state.yuming+"/updateUser",
        method: "POST",
        params: {
          password: this.user.password,
          name: this.user.name,
          gender: this.user.gender,
          age: this.user.age,
          id_card: this.user.id_card,
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
    //模糊搜索分页
    handleCurrentChange(val) {
      this.page_num = val;
      this.getAllUser();
    },
    //获取所有读者
    getAllUser() {
      axios({
        url: this.$store.state.yuming+"/admin/user/fuzzyQuery",
        method: "GET",
        params: {
          page_num: this.page_num,
          each_num: this.each_num,
          queryWhat: '0',
          content: this.searchText,
        },
      })
        .then((res) => {
          const { code, data, page_count } = res.data;
          if (code == "200") {
            this.userList = data;
            this.page_count = page_count;
          } else if (code == "3") {
            this.userList = [];
          } else {
            this.$message.error("获取所有读者失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //模糊查询读者
    searchUser() {
      this.page_num = 1;
      this.reloadUserData();
    },
    //注销用户
    deleteUser(u) {
      axios({
        url: this.$store.state.yuming+"/admin/deleteUser",
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