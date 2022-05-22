<template>
  <div class="home" v-loading="isloading">
    <div class="content">
      <div class="header">
        <img height="70px" style="margin:20px 0" src="../../assets/wads.png" />
        <div class="title">后台管理</div>
      </div>
      <div style="margin: 10px 0"><el-page-header @back="gotoAdmin" content="借阅管理"></el-page-header></div>
      <div>
        <el-card class="box-card1">
          <el-container>
            <el-aside width="35px"><div class="verticalBar2"></div></el-aside>
            <el-main>
          <div style="font-size: 15px padding: 18px 0">
            在此处，您可以查看、查找、编辑、删除、添加借阅记录。
          </div>
            </el-main>
          </el-container>
        </el-card>
      </div>
      <div>
        <el-card class="box-card1">
          <el-row v-loading="borrowDataLoading">
            <el-col :span="8" style="text-align:center">
              <el-row><h2>{{bookingNum}}</h2></el-row><el-row><span>正在预约</span></el-row>
            </el-col>
            <el-col :span="8" style="text-align:center">
              <el-row><h2>{{lendNum}}</h2></el-row><el-row><span>正在借阅</span></el-row>
            </el-col>
              <el-col :span="8" style="text-align:center">
              <el-row><h2>{{lendedNum}}</h2></el-row><el-row><span>历史借阅</span></el-row>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <div class="box2">
        <el-card class="box-card1">
          <template>
  <el-tabs v-model="activeName">
<!--





----------------------------------------------------分割线----------------------------------------------------





-->
    <el-tab-pane label="正在预约" name="first">
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
          <el-col :span="3"><div style="margin: 0 20px"><el-button round @click="searchBooking()">搜索</el-button></div></el-col>
          <el-table
          v-loading="borrowDataLoading"
          :data="bookingList"
          style="width: 100%"
          :default-sort = "{prop: 'create_time', order: 'descending'}">
            <template slot="empty">
              <img src="../../assets/empty_grey.png" style="height:100px;margin-top:30px">
              <p style="margin-top:0px">暂无预约记录</p>
            </template>
            <el-table-column prop="update_time" label="预约时间"></el-table-column>
            <el-table-column prop="username" label="读者电话"></el-table-column>
            <el-table-column prop="bar_code" label="书籍条码号"></el-table-column>
            <el-table-column prop="status" label="借阅状态">
              <template slot-scope="scope">
                <div v-if="scope.row.status==1">借阅中</div>
                <div v-if="scope.row.status==2">已逾期</div>
                <div v-if="scope.row.status==3">已归还</div>
                <div v-if="scope.row.status==4">预约中</div>
                <div v-if="scope.row.status==5">预约失败</div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="deleteBorrow(scope.row.lend_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
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
    <el-tab-pane label="正在借阅" name="second">
      <el-col :span="18">
          <el-form>
            <el-form-item>
              <el-input
              v-model="searchText_lend"
              placeholder="输入关键词模糊搜索"
              ></el-input>
            </el-form-item>
          </el-form>
          </el-col>
          <el-col :span="3"><div style="margin: 0 20px"><el-button round @click="searchLend()">搜索</el-button></div></el-col>
          <el-col :span="3"><div style="margin: 0 10px"><el-button round @click="addBorrow()">借书</el-button></div></el-col>
          <el-table
          v-loading="borrowDataLoading"
          :data="lendList"
          style="width: 100%"
          :default-sort = "{prop: 'create_time', order: 'descending'}">
            <template slot="empty">
              <img src="../../assets/empty_grey.png" style="height:100px;margin-top:30px">
              <p style="margin-top:0px">暂无借阅记录</p>
            </template>
            <el-table-column prop="start_time" label="借阅时间" width='180px'></el-table-column>
            <el-table-column prop="end_time" label="预期归还时间" width='180px'></el-table-column>
            <el-table-column prop="username" label="读者电话"></el-table-column>
            <el-table-column prop="bar_code" label="书籍条码号"></el-table-column>
            <el-table-column prop="status" label="借阅状态">
              <template slot-scope="scope">
                <div v-if="scope.row.status==1">借阅中</div>
                <div v-if="scope.row.status==2">已逾期</div>
                <div v-if="scope.row.status==3">已归还</div>
                <div v-if="scope.row.status==4">预约中</div>
                <div v-if="scope.row.status==5">预约失败</div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="text" v-if="scope.row.status==1" @click="setBorrowOvertime(scope.row.username, scope.row.lend_id)">逾期</el-button>
                <el-button size="mini" type="text" @click="lendBook(scope.row.bar_code, scope.row.username)">还书</el-button>
                <el-button size="mini" type="text" @click="deleteBorrow(scope.row.lend_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog title="借书" :visible.sync="addBorrowVisible" center width="440px">
        <el-form ref="newBorrow"
        :model="newBorrow"
        label-width="100px"
        :rules="rules">
          <el-form-item label="读者电话" prop="username">
            <el-input v-model="newBorrow.username" autocomplete="off" class="editInput"></el-input>
          </el-form-item>
            <el-form-item label="书籍条码号" prop="bar_code">
          <el-input v-model="newBorrow.bar_code" autocomplete="off" class="editInput"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addBorrowVisible = false">取 消</el-button>
          <el-button type="primary" @click="borrowBook();addBorrowVisible = false">确 定</el-button>
        </div>
      </el-dialog>
          <el-row style="text-align: center">
        <el-pagination
        :current-page="page_num"
        @current-change="handleCurrentChange_lend"
        :page-count="page_count_lend"
        layout="prev, pager, next, jumper">
        </el-pagination>
        </el-row>
    </el-tab-pane>
<!--





----------------------------------------------------分割线----------------------------------------------------





-->
    <el-tab-pane label="历史借阅" name="third">
            <el-col :span="21">
          <el-form>
            <el-form-item>
              <el-input
              v-model="searchText_lended"
              placeholder="输入关键词模糊搜索"
              ></el-input>
            </el-form-item>
          </el-form>
          </el-col>
          <el-col :span="3"><div style="margin: 0 20px"><el-button round @click="searchLended()">搜索</el-button></div></el-col>
          <el-table
          v-loading="borrowDataLoading"
          :data="lendedList"
          style="width: 100%"
          :default-sort = "{prop: 'create_time', order: 'descending'}">
            <template slot="empty">
              <img src="../../assets/empty_grey.png" style="height:100px;margin-top:30px">
              <p style="margin-top:0px">暂无借阅记录</p>
            </template>
            <el-table-column prop="start_time" label="借阅时间" width='180px'></el-table-column>
            <el-table-column prop="end_time" label="归还时间" width='180px'></el-table-column>
            <el-table-column prop="username" label="读者电话"></el-table-column>
            <el-table-column prop="bar_code" label="书籍条码号"></el-table-column>
            <el-table-column prop="status" label="借阅状态">
              <template slot-scope="scope">
                <div v-if="scope.row.status==1">借阅中</div>
                <div v-if="scope.row.status==2">已逾期</div>
                <div v-if="scope.row.status==3">已归还</div>
                <div v-if="scope.row.status==4">预约中</div>
                <div v-if="scope.row.status==5">预约失败</div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="deleteBorrow(scope.row.lend_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row style="text-align: center">
        <el-pagination
        :current-page="page_num"
        @current-change="handleCurrentChange_lended"
        :page-count="page_count_lended"
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
      isloading: false,
      borrowDataLoading: false,
      //模糊搜索
      searchText: "",
      page_num: 1,
      each_num: 10,
      page_count: 0,
      searchText_lend: "",
      page_count_lend: 0,
      searchText_lended: "",
      page_count_lended: 0,
      //数据
      lendNum: 0,
      lendedNum: 0,
      bookingNum: 0,
      activeName: 'first',
      //预约记录
      bookingList:[],
      lendList: [],
      lendedList: [],
      //借书
      newBorrow:{
        bar_code: '',
        username: '',
      },
      addBorrowVisible: false,
      //rule
      rules: {
        bar_code: [
          { required: true, message: "书籍条码号不得为空", trigger: "blur" },
        ],
        username: [
          { required: true, message: "读者电话不得为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
  },
  methods:{
    //回到管理员主页
    gotoAdmin() {
      this.$router.push("/adminManage");
    },
    //获取预约记录数量
    getBookingNum() {
      axios({
        url: this.$store.state.yuming+"/admin/getBorrowNumByStatus",
        method: "GET",
        params: {
          number: 1,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.bookingNum = data;
          } else {
            this.$message.error("获取正在预约记录数量失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //获取正在借阅记录数量
    getLendNum() {
      axios({
        url: this.$store.state.yuming+"/admin/getBorrowNumByStatus",
        method: "GET",
        params: {
          number: 2,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.lendNum = data;
          } else {
            this.$message.error("获取正在借阅记录数量失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //获取历史借阅记录数量
    getLendedNum() {
      axios({
        url: this.$store.state.yuming+"/admin/getBorrowNumByStatus",
        method: "GET",
        params: {
          number: 3,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.lendedNum = data;
          } else {
            this.$message.error("获取历史借阅记录数量失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //预约记录模糊搜索分页
    handleCurrentChange(val) {
      this.page_num = val;
      this.getAllBooking();
    },
    //获取所有预约记录
    getAllBooking() {
      axios({
        url: this.$store.state.yuming+"/admin/borrow/fuzzyQuery",
        method: "GET",
        params: {
          page_num: this.page_num,
          each_num: this.each_num,
          queryWhat: '0',
          content: this.searchText,
          borrow_reserve: '0',
          is_history: '0',
        },
      })
        .then((res) => {
          const { code, data, page_count } = res.data;
          if (code == "200") {
            this.bookingList = data;
            this.page_count = page_count;
          } else if (code == "3") {
            this.bookingList = [];
          } else {
            this.$message.error("获取所有预约记录失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //模糊查询预约记录
    searchBooking() {
      this.page_num = 1;
      this.reloadBorrowData();
    },
    //正在借阅模糊搜索分页
    handleCurrentChange_lend(val) {
      this.page_num = val;
      this.getAllLend();
    },
    //获取所有正在借阅
    getAllLend() {
      axios({
        url: this.$store.state.yuming+"/admin/borrow/fuzzyQuery",
        method: "GET",
        params: {
          page_num: this.page_num,
          each_num: this.each_num,
          queryWhat: '0',
          content: this.searchText_lend,
          borrow_reserve: '1',
          is_history: '0',
        },
      })
        .then((res) => {
          const { code, data, page_count } = res.data;
          if (code == "200") {
            this.lendList = data;
            this.page_count_lend = page_count;
          } else if (code == "3") {
            this.lendList = [];
          } else {
            this.$message.error("获取所有正在借阅失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //模糊查询正在借阅
    searchLend() {
      this.page_num = 1;
      this.reloadBorrowData();
    },
    //历史借阅模糊搜索分页
    handleCurrentChange_lended(val) {
      this.page_num = val;
      this.getAllLended();
    },
    //获取所有历史借阅
    getAllLended() {
      axios({
        url: this.$store.state.yuming+"/admin/borrow/fuzzyQuery",
        method: "GET",
        params: {
          page_num: this.page_num,
          each_num: this.each_num,
          queryWhat: '0',
          content: this.searchText_lended,
          borrow_reserve: '1',
          is_history: '1',
        },
      })
        .then((res) => {
          const { code, data, page_count } = res.data;
          if (code == "200") {
            this.lendedList = data;
            this.page_count_lended = page_count;
          } else if (code == "3") {
            this.lendedList = [];
          } else {
            this.$message.error("获取所有历史借阅失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //模糊查询正在借阅
    searchLended() {
      this.page_num = 1;
      this.reloadBorrowData();
    },
    //设为逾期
    setBorrowOvertime(USERNAME, lendID) {
      axios({
        url: this.$store.state.yuming+"/admin/setBorrowOvertime",
        method: "POST",
        params: {
          username: USERNAME,
          lend_id: lendID,
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.reloadOrderData();
            this.$message({
              type: "success",
              message: "设置逾期成功",
        });
          } else {
            this.$message.error("设置逾期失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //借书
    addBorrow()
    {
      this.newBorrow.bar_code='';
      this.newBorrow.username='';
      this.addBorrowVisible=true;
    },
    borrowBook() {
      axios({
        url: this.$store.state.yuming+"/admin/borrowBook",
        method: "POST",
        params: {
          bar_code: this.newBorrow.bar_code,
          username: this.newBorrow.username,
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.reloadOrderData();
            this.$message({
              type: "success",
              message: "借书成功",
        });
          } else if (code == "25") {
            this.$message.error("书籍可被预约、可被借阅数量不足");
          } else {
            this.$message.error("借书失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //还书
    lendBook(BARCODE, USERNAME) {
      axios({
        url: this.$store.state.yuming+"/admin/lendBook",
        method: "POST",
        params: {
          bar_code: BARCODE,
          username: USERNAME,
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.reloadOrderData();
            this.$message({
              type: "success",
              message: "还书成功",
        });
          } else {
            this.$message.error("还书失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //重新加载借阅记录
    reloadBorrowData() {
      this.borrowDataLoading = true;
      this.getAllBooking();
      this.getAllLend();
      this.getAllLended();
      this.getBookingNum();
      this.getLendNum();
      this.getLendedNum();
      this.borrowDataLoading = false;
    },
    //删除借阅记录
    deleteBorrow(lendID) {
      axios({
        url: this.$store.state.yuming+"/admin/deleteBorrow",
        method: "DELETE",
        params: {
          lend_id: lendID,
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.reloadBorrowData();
            this.$message({
              type: "success",
              message: "删除借阅记录成功",
        });
          } else {
            this.$message.error("删除借阅记录失败");
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
    await this.getAllBooking();
    await this.getAllLend();
    await this.getAllLended();
    await this.getBookingNum();
    await this.getLendNum();
    await this.getLendedNum();
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
</style>