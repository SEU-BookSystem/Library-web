<template>
  <div class="home" v-loading="isLoading">
    <div class="content">
      <div class="header">
        <img height="70px" style="margin:20px 0" src="../../assets/jwbc.png" />
        <div class="title">后台管理</div>
      </div>
      <div style="margin: 10px 0"><el-page-header @back="gotoAdmin" content="违规管理"></el-page-header></div>
             <div>
        <el-card class="box-card1">
          <el-container>
            <el-aside width="35px"><div class="verticalBar2"></div></el-aside>
            <el-main>
          <div style="font-size: 15px padding: 18px 0">
            在此处，您可以处理违规行为。
          </div>
            </el-main>
          </el-container>
        </el-card>
      </div>
            <div>
        <el-card class="box-card1">
          <el-row v-loading="dataLoading">
            <el-col :span="12" style="text-align:center">
              <el-row><h2>{{illegalNum}}</h2></el-row><el-row><span>正在违规</span></el-row>
            </el-col>
              <el-col :span="12" style="text-align:center">
              <el-row><h2>{{illegaledNum}}</h2></el-row><el-row><span>历史违规</span></el-row>
            </el-col>
          </el-row>
        </el-card>
      </div>
            <div class="box2">
        <el-card class="box-card1">
          <template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="正在违规" name="first">
          <el-col :span="21">
          <el-form>
            <el-form-item>
              <el-input
              v-model="searchText"
              placeholder="输入关键词模糊搜索"
              ></el-input>
            </el-form-item>
          </el-form>
          </el-col>
          <el-col :span="3"><div style="margin: 0 20px"><el-button round @click="searchIllegal()">搜索</el-button></div></el-col>
          <el-table
          v-loading="dataLoading"
          :data="illegalList"
          style="width: 100%"
          :default-sort = "{prop: 'create_time', order: 'descending'}">
            <template slot="empty">
              <img src="../../assets/empty_grey.png" style="height:100px;margin-top:30px">
              <p style="margin-top:0px">暂无正在违规记录</p>
            </template>
            <el-table-column prop="update_time" label="更新时间"></el-table-column>
            <el-table-column prop="username" label="读者电话"></el-table-column>
            <el-table-column prop="bar_code" label="书籍条码号"></el-table-column>
            <el-table-column prop="status" label="违规状态">
              <template slot-scope="scope">
                <div v-if="scope.row.status==1">逾期</div>
                <div v-if="scope.row.status==2">损坏</div>
                <div v-if="scope.row.status==3">丢失</div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="tempPunish.username=scope.row.username;
                tempPunish.bar_code=scope.row.bar_code;
                tempPunish.status=scope.row.status;
                tempPunish.money='';
                tempPunish.detail='';
                tempPunish.punish_id=scope.row.punish_id;
                handlePunishVisible=true;">处理</el-button>
                <el-button size="mini" type="text" @click="deletePunish(scope.row.punish_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
           <el-dialog title="处理违规记录" :visible.sync="handlePunishVisible" center width="440px">
        <el-form ref="tempPunish"
        :model="tempPunish"
        label-width="80px"
        :rules="rules">
          <el-form-item label="读者电话" prop="username">
            {{tempPunish.username}}
          </el-form-item>
          <el-form-item label="书籍条码" prop="bar_code">
            {{tempPunish.bar_code}}
          </el-form-item>
          <el-form-item label="违规状态" prop="status">
              <div v-if="tempPunish.status==1">逾期</div>
              <div v-if="tempPunish.status==2">损坏</div>
              <div v-if="tempPunish.status==3">丢失</div>
          </el-form-item>
          <el-form-item label="罚款金额" prop="money">
            <el-input v-model="tempPunish.money" autocomplete="off" class="editInput"></el-input>
          </el-form-item>
          <el-form-item label="处理说明" prop="detail">
            <el-input v-model="tempPunish.detail" type="textarea" autocomplete="off" class="editInput"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handlePunishVisible = false">取 消</el-button>
          <el-button type="primary" @click="updatePunish();handlePunishVisible = false">确 定</el-button>
        </div>
      </el-dialog>
          <el-row style="text-align: center">
        <el-pagination
        :current-page="page_num"
        @current-change="handleCurrentChange"
        :page-count="page_count"
        layout="prev, pager, next, jumper">
        </el-pagination>
        </el-row>
        </el-tab-pane>
<!--





----------------------------------------------------分割线----------------------------------------------------





-->
    <el-tab-pane label="历史违规" name="second">
        <el-col :span="18">
          <el-form>
            <el-form-item>
              <el-input
              v-model="searchText_ed"
              placeholder="输入关键词模糊搜索"
              ></el-input>
            </el-form-item>
          </el-form>
          </el-col>
          <el-col :span="3"><div style="margin: 0 20px"><el-button round @click="searchIllegal_ed()">搜索</el-button></div></el-col>
          <el-col :span="3"><div style="margin: 0 10px"><el-button round @click="tempPunish.username='';
          tempPunish.bar_code='';
          tempPunish.status='';
          tempPunish.money='';
          tempPunish.detail='';
          addPunishVisible=true;
          ">添加</el-button></div></el-col>
          <el-table
          v-loading="dataLoading"
          :data="illegaledList"
          style="width: 100%"
          :default-sort = "{prop: 'create_time', order: 'descending'}">
            <template slot="empty">
              <img src="../../assets/empty_grey.png" style="height:100px;margin-top:30px">
              <p style="margin-top:0px">暂无历史违规记录</p>
            </template>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="罚款金额"><span>{{scope.row.money}}</span></el-form-item>
                  <el-form-item label="处理说明"><span>{{scope.row.detail}}</span></el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="update_time" label="更新时间"></el-table-column>
            <el-table-column prop="username" label="读者电话"></el-table-column>
            <el-table-column prop="bar_code" label="书籍条码号"></el-table-column>
            <el-table-column prop="status" label="违规状态">
              <template slot-scope="scope">
                <div v-if="scope.row.status==1">逾期</div>
                <div v-if="scope.row.status==2">损坏</div>
                <div v-if="scope.row.status==3">丢失</div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="deletePunish(scope.row.punish_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
           <el-dialog title="添加违规记录" :visible.sync="addPunishVisible" center width="440px">
        <el-form ref="tempPunish"
        :model="tempPunish"
        label-width="80px"
        :rules="rules">
          <el-form-item label="读者电话" prop="username">
            <el-input v-model="tempPunish.username" autocomplete="off" class="editInput"></el-input>
          </el-form-item>
          <el-form-item label="书籍条码" prop="bar_code">
            <el-input v-model="tempPunish.bar_code" autocomplete="off" class="editInput"></el-input>
          </el-form-item>
          <el-form-item label="违规状态" prop="status">
            <el-select v-model="tempPunish.status" placeholder="请选择违规状态">
              <el-option label="逾期" value=1></el-option>
              <el-option label="损坏" value=2></el-option>
              <el-option label="丢失" value=3></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="罚款金额" prop="money">
            <el-input v-model="tempPunish.money" autocomplete="off" class="editInput"></el-input>
          </el-form-item>
          <el-form-item label="处理说明" prop="detail">
            <el-input v-model="tempPunish.detail" type="textarea" autocomplete="off" class="editInput"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addPunishVisible = false">取 消</el-button>
          <el-button type="primary" @click="addPunish();addPunishVisible = false">确 定</el-button>
        </div>
      </el-dialog>
          <el-row style="text-align: center">
        <el-pagination
        :current-page="page_num"
        @current-change="handleCurrentChange_ed"
        :page-count="page_count_ed"
        layout="prev, pager, next, jumper">
        </el-pagination>
        </el-row>
    </el-tab-pane>
  </el-tabs>
          </template>
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
      //loading
      isLoading: false,
      dataLoading: false,
      //对话框Visible
      addPunishVisible: false,
      handlePunishVisible: false,
      //数量
      illegalNum: 0,
      illegaledNum: 0,
      //tab默认页面
      activeName: 'first',
      //模糊搜索
      searchText: "",
      page_num: 1,
      each_num: 10,
      page_count: 0,
      searchText_ed: "",
      page_count_ed: 0,
      //违规记录列表
      illegalList: [],
      illegaledList: [],
      //暂存违规记录
      tempPunish:{
        username: '',
        bar_code: '',
        status: '',
        detail: '',
        money: '',
        punish_id: '',
      },
      rules: {
        class_name: [
          { required: true, message: "分类名称不得为空", trigger: "blur" },
          { max: 5, message: "分类名称不得超过十个字", trigger: "blur" },
        ],
      },
    };
  },
  computed: {},
  methods:{
    //回到管理员主页
    gotoAdmin() {
      this.$router.push("/adminManage");
    },
    //获取正在违规数量
    getIllegalNum() {
      axios({
        url: this.$store.state.yuming+"/admin/getPunishNumByStatus",
        method: "GET",
        params: {
          number: 0,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.illegalNum = data;
          } else {
            this.$message.error("获取正在违规数量失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //获取历史违规数量
    getIllegaledNum() {
      axios({
        url: this.$store.state.yuming+"/admin/getPunishNumByStatus",
        method: "GET",
        params: {
          number: 1,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.illegaledNum = data;
          } else {
            this.$message.error("获取历史违规数量失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //正在违规模糊搜索分页
    handleCurrentChange(val) {
      this.page_num = val;
      this.getAllIllegal();
    },
    //获取所有正在违规
    getAllIllegal() {
      axios({
        url: this.$store.state.yuming+"/admin/punish/fuzzyQuery",
        method: "GET",
        params: {
          page_num: this.page_num,
          each_num: this.each_num,
          queryWhat: 0,
          content: this.searchText,
          is_handle: 0,
        },
      })
        .then((res) => {
          const { code, data, page_count } = res.data;
          if (code == "200") {
            this.illegalList = data;
            this.page_count = page_count;
          } else if (code == "3") {
            this.illegalList = [];
          } else {
            this.$message.error("获取所有正在违规失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //模糊查询正在违规
    searchIllegal() {
      this.page_num = 1;
      this.reloadData();
    },
    //历史违规模糊搜索分页
    handleCurrentChange_ed(val) {
      this.page_num = val;
      this.getAllIllegaled();
    },
    //获取所有历史违规
    getAllIllegaled() {
      axios({
        url: this.$store.state.yuming+"/admin/punish/fuzzyQuery",
        method: "GET",
        params: {
          page_num: this.page_num,
          each_num: this.each_num,
          queryWhat: 0,
          content: this.searchText_ed,
          is_handle: 1,
        },
      })
        .then((res) => {
          const { code, data, page_count } = res.data;
          if (code == "200") {
            this.illegaledList = data;
            this.page_count_ed = page_count;
          } else if (code == "3") {
            this.illegaledList = [];
          } else {
            this.$message.error("获取所有历史违规失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //模糊查询历史违规
    searchIllegal_ed() {
      this.page_num = 1;
      this.reloadData();
    },
    //添加违规记录
    addPunish() {
      axios({
        url: this.$store.state.yuming+"/admin/addPunish",
        method: "POST",
        params: {
          username: this.tempPunish.username,
          bar_code: this.tempPunish.bar_code,
          status: this.tempPunish.status,
          detail: this.tempPunish.detail,
          money: this.tempPunish.money,
        }
      })
        .then((res) => {
          if (res.data.code == 200) {
            this.reloadData();
            this.$message({
              type: "success",
              message: "添加违规记录成功",
        });
          } else {
            this.$message.error("添加违规记录失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //处理违规记录
    updatePunish() {
      axios({
        url: this.$store.state.yuming+"/admin/updatePunish",
        method: "POST",
        params: {
          punish_id: this.tempPunish.punish_id,
          status: this.tempPunish.status,
          detail: this.tempPunish.detail,
          money: this.tempPunish.money,
        }
      })
        .then((res) => {
          if (res.data.code == 200) {
            this.reloadData();
            this.$message({
              type: "success",
              message: "处理违规记录成功",
        });
          } else {
            this.$message.error("处理违规记录失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //删除违规记录
    deletePunish(ID) {
      axios({
        url: this.$store.state.yuming+"/admin/deletePunish",
        method: "DELETE",
        params: {
          punish_id: ID,
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.reloadData();
            this.$message({
              type: "success",
              message: "删除违规记录成功",
        });
          } else {
            this.$message.error("删除违规记录失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //重新加载数据
    reloadData() {
      this.dataLoading = true;
      this.getAllIllegal();
      this.getAllIllegaled();
      this.getIllegalNum();
      this.getIllegaledNum();
      this.dataLoading = false;
    },
  },
  async created() {
    this.isLoading = true;
    await this.getAllIllegal();
    await this.getAllIllegaled();
    await this.getIllegalNum();
    await this.getIllegaledNum();
    this.isLoading = false;
  },
};
</script>

<style scoped>
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

.c-box{
  display: flex;
  justify-content: center;
}

.c-box-card1 {
  width: 900px;
  margin: 20px;
  height: 121px;
}

.c-box-card2 {
  width: 900px;
  margin: 20px;
}

.verticalBar-class {
  width: 4px;
  height: 65px;
  background: #3d678a;
  display: inline-block;
  margin-top: 10px;
  vertical-align: top;
  margin-right: 0px;
  margin-left: 30px;
  border-radius: 20%;
}

.main-class{
  display: flex;
  justify-content: space-between;
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
  width: 100%;
}

</style>