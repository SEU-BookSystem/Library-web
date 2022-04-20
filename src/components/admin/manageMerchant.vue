<template>
  <div v-loading="isLoading" class="home">
    <div class="content">
      <div class="header">
        <img height="70px" style="margin:20px 0" src="../../assets/jwbc.png" />
        <div class="title">后台管理</div>
      </div>
      <div style="margin: 10px 0"><el-page-header @back="gotoAdmin" content="商家管理"></el-page-header></div>
       <div>
        <el-card class="box-card1">
          <el-container>
            <el-aside width="35px"><div class="verticalBar2"></div></el-aside>
            <el-main>
          <div style="font-size: 15px padding: 18px 0">
            在此处，您可以处理用户成为商家的申请。
          </div>
            </el-main>
          </el-container>
        </el-card>
      </div>
      <div>
        <el-card class="box-card1">
          <el-row v-loading="dataLoading">
            <el-col :span="8" style="text-align:center">
              <el-row><h2>{{nonCheckShopNum}}</h2></el-row><el-row><span>待审核</span></el-row>
            </el-col>
            <el-col :span="8" style="text-align:center">
              <el-row><h2>{{checkShopNum}}</h2></el-row><el-row><span>已审核</span></el-row>
            </el-col>
            <el-col :span="8" style="text-align:center">
              <el-row><h2>{{passShopNum}}</h2></el-row><el-row><span>商家数</span></el-row>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <div class="box2">
        <el-card class="box-card1">
           <el-tabs v-model="activeName" v-loading="dataLoading">
    <el-tab-pane label="待审核申请" name="first">
      <el-table :data="checkList" style="width: 100%"
      :default-sort = "{prop: 'create_time', order: 'descending'}">
      <template slot="empty">
        <img src="../../assets/empty_grey.png" style="height:100px;margin-top:30px">
        <p style="margin-top:0px">暂无待审核申请</p>
      </template>
      <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="店铺封面">
                <el-popover
                placement="right"
                title=""
                trigger="hover">
                  <img class="img-max" :src="scope.row.avatar_b"/>
                  <img class="img-min" slot="reference" :src="scope.row.avatar_s" :alt="scope.row.avatar_s" style="max-height: 50px;max-width: 130px">
                </el-popover>
              </el-form-item>
              <el-form-item label="店铺名称"><span>{{scope.row.shop_name}}</span></el-form-item>
              <el-form-item label="绑定邮箱"><span>{{scope.row.username}}</span></el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="申请时间" sortable></el-table-column>
        <el-table-column prop="shopper_name" label="申请人"></el-table-column>
        <el-table-column prop="apply_reason" label="申请理由"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="checkShop(scope.row.username, 1, passString)">通过</el-button>
            <el-button size="mini" type="text" @click="refuseShop.username=scope.row.username;
            OpinionVisible = true">拒绝</el-button>
            <el-dialog title="审核意见" :visible.sync="OpinionVisible" center>
              <div style=“color:grey”>提示：您正在审核邮箱为{{refuseShop.username}}的用户的申请。</div>
              <el-form label-width="0" :rules="rules">
                <el-form-item prop="check_opinion">
                  <el-input v-model="refuseShop.check_opinion" maxlength="30" show-word-limit placeholder="请输入审核意见"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="OpinionVisible = false">取 消</el-button>
                <el-button type="primary" @click="checkShop(refuseShop.username, 2, refuseShop.check_opinion);OpinionVisible = false">确 定</el-button>
              </div>
            </el-dialog>
            <!--
            <el-popover placement="left" width="400px" trigger="click">
              <el-row>
                <el-col :span="18"><el-input v-model="scope.row.check_opinion" maxlength="30" show-word-limit placeholder="请输入审核意见"></el-input></el-col>
                <el-col :span="6"><el-button type="danger" @click="checkShop(scope.row.username, 2, scope.row.check_opinion)">确认</el-button></el-col>
              </el-row>
              <el-button size="mini" type="text" slot="reference">拒绝</el-button>
            </el-popover>
            -->
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="审核历史" name="third">
      <el-table :data="checkedList" style="width: 100%"
      :default-sort = "{prop: 'create_time', order: 'descending'}">
      <template slot="empty">
        <img src="../../assets/empty_grey.png" style="height:100px;margin-top:30px">
        <p style="margin-top:0px">暂无申请历史</p>
      </template>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="店铺封面">
                <el-popover
                placement="right"
                title=""
                trigger="hover">
                  <img class="img-max" :src="scope.row.avatar_b"/>
                  <img class="img-min" slot="reference" :src="scope.row.avatar_s" :alt="scope.row.avatar_s" style="max-height: 50px;max-width: 130px">
                </el-popover>
              </el-form-item>
              <el-form-item label="店铺名称"><span>{{scope.row.shop_name}}</span></el-form-item>
              <el-form-item label="绑定邮箱"><span>{{scope.row.username}}</span></el-form-item>
              <el-form-item label="申请理由"><span>{{scope.row.apply_reason}}</span></el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="审核时间" sortable></el-table-column>
        <el-table-column prop="shopper_name" label="申请人"></el-table-column>
        <el-table-column prop="pass_status" label="审核结果"
         :filters="[
              { text: '无效', value: -1 },
              { text: '通过', value: 1 },
              { text: '拒绝', value: 2 },
            ]"
            :filter-method="filterState">
          <template slot-scope="scope">
            <span v-if="scope.row.pass_status==-1">无效</span>
            <span v-if="scope.row.pass_status==1">通过</span>
            <span v-if="scope.row.pass_status==2">拒绝</span>
          </template>
        </el-table-column>
        <el-table-column prop="check_opinion" label="审核意见"></el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="现有商家" name="second">
      <el-form label-width="120px">
          <el-form-item label="店铺名称搜索：">
            <el-input
              v-model="searchText"
              placeholder="输入店铺名称模糊搜索"
            ></el-input>
          </el-form-item>
        </el-form>
      <el-table
      :data="shopList.filter((data) => {return data.shop_name.includes(searchText);})"
      style="width: 100%"
      :default-sort = "{prop: 'update_time', order: 'descending'}">
      <template slot="empty">
        <img src="../../assets/empty_grey.png" style="height:100px;margin-top:30px">
        <p style="margin-top:0px">暂无商家</p>
      </template>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="开店时间"><span>{{scope.row.create_time}}</span></el-form-item>
              <el-form-item label="绑定邮箱"><span>{{scope.row.username}}</span></el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="update_time" label="更新时间" sortable></el-table-column>
        <el-table-column prop="shopper_name" label="店主姓名"></el-table-column>
        <el-table-column label="店铺头像">
          <template slot-scope="scope">
            <el-popover
            placement="right"
            title=""
            trigger="hover">
              <img class="img-max" :src="scope.row.avatar_b"/>
              <img class="img-min" slot="reference" :src="scope.row.avatar_s" :alt="scope.row.avatar_s" style="max-height: 50px;max-width: 130px">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="shop_name" label="店铺名称">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text"
            @click="editShop.username=scope.row.username;
            editShop.shop_name=scope.row.shop_name;
            editShop.shopper_name=scope.row.shopper_name;
            editShop.img=scope.row.avatar_b;
            EditVisible = true">编辑</el-button>
            <el-dialog title="店铺信息" :visible.sync="EditVisible" center width="440px">
              <div class="my_prompt">提示：您正在编辑邮箱为{{editShop.username}}的用户的店铺信息。</div>
              <el-form ref="editShop"
              :model="editShop"
              label-width="80px"
              :rules="rules">
                <el-form-item label="店铺封面" prop="img">
                  <el-upload 
                  class="avatar-uploader"
                  ref="upload"
                  action="http://47.94.131.208:8888"
                  :show-file-list="false"
                  :on-change="changePhotoFile"
                  :on-success="handleAvatarSuccess"
                  :auto-upload="false"
                  :name="editShop.img">
                    <img :src="editShop.img" class="avatar" />
                  </el-upload>
                  <my-cropper
                  ref="myCropper"
                  @getFile="getFile"
                  @upAgain="upAgain"
                  ></my-cropper>
                </el-form-item>
                <el-form-item label="店铺名称" prop="shop_name">
                  <el-input v-model="editShop.shop_name" autocomplete="off" maxlength="10" show-word-limit class="editInput"></el-input>
                </el-form-item>
                <el-form-item label="店主姓名" prop="shopper_name">
                  <el-input v-model="editShop.shopper_name" autocomplete="off" maxlength="10" show-word-limit class="editInput"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="EditVisible = false;formdata=''">取 消</el-button>
                <el-button type="primary" @click="editShopData">确 定</el-button>
              </div>
            </el-dialog>
            <el-button size="mini" type="text" style="margin-left:10px" @click="logoutShop(scope.row.username)">注销</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
        </el-card>
      </div>
    </div>
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
      dataLoading: false,
      //模糊搜索
      searchText: "",
      //选择table
      activeName: 'first',
      //待审核
      checkList: [
        /*{
          create_time: "2021-07-14 18:31:30",//申请时间
          username: "示例",//申请人
          avatar_s: require("../../assets/kuku.png"),//店铺封面
          avatar_b: require("../../assets/kuku.png"),//店铺封面大图
          shop_name: "示例",//店铺名称
          shopper_name: "示例",//真实姓名
          apply_reason: "示例",//申请理由
          check_opinion: "",//审核意见
        },*/
      ],
      refuseShop: {
        username: "示例",//申请人
        check_opinion: "",//审核意见
      },
      checkedList: [
        /*{
          create_time: "2021-07-14 18:31:30",//审核时间
          username: "aaa",//申请人
          avatar_s: require("../../assets/kuku.png"),//店铺封面
          avatar_b: require("../../assets/kuku.png"),//店铺封面大图
          shop_name: "ccc",//店铺名称
          shopper_name: "aaa",//真实姓名
          apply_reason: "ddd",//申请理由
          pass_status: "审核通过(已注销)",//店铺状态
          check_opinion: "",//审核意见
        },*/
      ],
      shopList: [
        /*{
          update_time: "2021-07-14 18:31:30",//过审开店时间
          create_time: "2021-07-14 18:31:30",//信息更新时间
          username: "aaa",//店主
          shopper_name: "bbb",//真实姓名
          avatar_s: require("../../assets/kuku.png"),//店铺封面
          avatar_b: require("../../assets/kuku.png"),//店铺封面大图
          shop_name: "ccc",//店铺名称
        },*/
      ],
      editShop:{
        username: "aaa",//店主
        shopper_name: "bbb",//真实姓名
        img: require("../../assets/kuku.png"),//店铺封面大图
        shop_name: "ccc",//店铺名称
      },
      imgUrl: "",
      formdata: new FormData(),
      rules: {
        check_opinion: [
          { required: true, message: "审核意见不得为空", trigger: "blur" },
        ],
        shopper_name: [
          { required: true, message: "店主姓名不得为空", trigger: "blur" },
        ],
        shop_name: [
          { required: true, message: "店铺名称不得为空", trigger: "blur" },
        ],
      },
      search: "",
      nonCheckShopNum: 0,
      checkShopNum: 0,
      passShopNum: 0,
      EditVisible: false,
      OpinionVisible: false,
      username: "",
      passString: "通过",
    };
  },
  computed: {},
  methods:{
    //回到管理员主页
    gotoAdmin() {
      this.$router.push("/adminManage");
    },
    //筛选审核结果
    filterState(value, row, column) {
      const property = column["property"];
      return row[property] === value;
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
      this.editShop.img=window.URL.createObjectURL(file);
      this.$refs.myCropper.close();
    },
    //头像上传成功之后的方法,进行回调
    handleAvatarSuccess(res) {
      if (res.code === 0) {
        this.editShop.img = res.img;
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
    //获取未审核的店铺数量
    getNonCheckShopNum() {
      axios({
        url: this.$store.state.yuming+"/admin/getNonCheckShopNum",
        method: "GET",
        params: {},
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.nonCheckShopNum = data;
          } else {
            this.$message.error("获取信息失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //获取已审核的申请数量
    getCheckShopNum() {
      axios({
        url: this.$store.state.yuming+"/admin/getCheckShopNum",
        method: "GET",
        params: {},
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.checkShopNum = data;
          } else {
            this.$message.error("获取信息失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //获取现有店铺数量
    getPassShopNum() {
      axios({
        url: this.$store.state.yuming+"/admin/getPassShopNum",
        method: "GET",
        params: {},
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.passShopNum = data;
          } else {
            this.$message.error("获取信息失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //获取未审核店铺
    getNonCheckShop() {
      axios({
        url: this.$store.state.yuming+"/admin/getNonCheckShop",
        method: "GET",
        params: {},
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.checkList = data;
          } else if (code == "3") {
            this.checkList = [];
          } else {
            this.$message.error("获取未审核店铺失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //获取审核店铺
    getCheckShop() {
      axios({
        url: this.$store.state.yuming+"/admin/getCheckShop",
        method: "GET",
        params: {},
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.checkedList = data;
          } else if (code == "3") {
            this.checkedList = [];
          } else {
            this.$message.error("获取审核历史失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //获取现有店铺
    getPassShop() {
      axios({
        url: this.$store.state.yuming+"/admin/getPassShop",
        method: "GET",
        params: {},
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.shopList = data;
          } else if (code == "3") {
            this.shopList = [];
          } else {
            this.$message.error("获取现有商家失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //重新加载店铺数据
    reloadData() {
      this.dataLoading = true;
      this.getNonCheckShopNum();
      this.getCheckShopNum();
      this.getPassShopNum();
      this.getNonCheckShop();
      this.getCheckShop();
      this.getPassShop();
      this.dataLoading = false;
    },
    //审核店铺
    checkShop(name, status, opinion) {
      axios({
        url: this.$store.state.yuming+"/admin/checkShop",
        method: "POST",
        params: {
          username: name,
          pass_status: status,
          check_opinion: opinion,
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.reloadData();
            this.$message({
              type: "success",
              message: "处理成功",
        });
          } else {
            this.$message.error("处理失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //编辑店铺信息
    editShopData() {
      this.updateAvatar();
      this.updateShop();
      this.formdata="";
      this.EditVisible = false;
      this.reloadData();
    },
    updateAvatar() {
      this.formdata.append("username", this.editShop.username);
      axios({
        url: this.$store.state.yuming+"/shop/updateAvatar",
        method: "POST",
        data: this.formdata,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          if (res.data.code == 200) {
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
    updateShop() {
      axios({
        url: this.$store.state.yuming+"/admin/updateShop",
        method: "POST",
        params: {
          username: this.editShop.username,
          shopper_name: this.editShop.shopper_name,
          shop_name: this.editShop.shop_name,
        }
      })
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "编辑信息成功",
        });
          } else {
            this.$message.error("编辑信息失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //注销店铺
    logoutShop(name) {
      axios({
        url: this.$store.state.yuming+"/shop/logoutShop",
        method: "DELETE",
        params: {
          username: name,
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.reloadData();
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
      await this.getNonCheckShopNum();
      await this.getCheckShopNum();
      await this.getPassShopNum();
      await this.getNonCheckShop();
      await this.getCheckShop();
      await this.getPassShop();
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

  .editInput{
    width: 300px;
    margin-right: 140px;
  }

  .my_prompt{
    color: grey;
    margin-bottom: 20px;
  }
</style>