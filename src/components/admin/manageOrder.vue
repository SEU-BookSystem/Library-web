<template>
  <div class="home" v-loading="isloading">
    <div class="content">
      <div class="header">
        <img height="70px" style="margin:20px 0" src="../../assets/jwbc.png" />
        <div class="title">后台管理</div>
      </div>
      <div style="margin: 10px 0"><el-page-header @back="gotoAdmin" content="订单管理"></el-page-header></div>
       <div>
        <el-card class="box-card1">
          <el-container>
            <el-aside width="35px"><div class="verticalBar2"></div></el-aside>
            <el-main>
          <div style="font-size: 15px padding: 18px 0">
            在此处，您可以查看、查找、编辑、取消订单。
          </div>
            </el-main>
          </el-container>
        </el-card>
      </div>
      <div class="box2">
        <el-card class="box-card1">
          <el-form label-width="120px">
            <el-form-item label="买家邮箱搜索：">
              <el-input
              v-model="searchText"
              placeholder="输入买家邮箱模糊搜索"
              @change="search(searchText)"
              ></el-input>
            </el-form-item>
          </el-form>
          <el-table
          v-loading="orderDataLoading"
          :data="orderList"
          style="width: 100%"
          :default-sort = "{prop: 'create_time', order: 'descending'}">
            <template slot="empty">
              <img src="../../assets/empty_grey.png" style="height:100px;margin-top:30px">
              <p style="margin-top:0px">暂无订单</p>
            </template>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-table :data="scope.row.books" border>
                    <el-table-column prop="book_name" label="书籍名称"></el-table-column>
                    <el-table-column prop="price" label="单价(元)"></el-table-column>
                    <el-table-column prop="number" label="数量（本）"></el-table-column>
                    <el-table-column label="小计(元)">
                      <template slot-scope="scope_s">
                        <div>{{scope_s.row.price*scope_s.row.number}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="return_status" label="状态" width="210px">
                      <template slot-scope="scope_s">
                        <div v-if="scope_s.row.return_status==-1">正常</div>
                        <div v-if="scope_s.row.return_status==1">
                          <el-button type="text" @click="returnPass(scope_s.row.order_book_id)">同意退款</el-button>
                          <el-button type="text" @click="preReturnFail(scope_s.row.order_book_id)">拒绝退款</el-button>
                        </div>
                        <div v-if="scope_s.row.return_status==2">已退款</div>
                        <div v-if="scope_s.row.return_status==3">已拒绝退款</div>
                        <div v-if="scope_s.row.return_status==4">
                          <el-button type="text" @click="exchangePass(scope_s.row.order_book_id)">同意换货</el-button>
                          <el-button type="text" @click="preExchangeFail(scope_s.row.order_book_id)">拒绝换货</el-button>
                        </div>
                        <div v-if="scope_s.row.return_status==5">已换货</div>
                        <div v-if="scope_s.row.return_status==6">已拒绝换货</div>
                        <div v-if="scope_s.row.return_status==7">
                          <el-button type="text" @click="returnAllPass(scope_s.row.order_book_id)">同意退货退款</el-button>
                          <el-button type="text" @click="preReturnAllFail(scope_s.row.order_book_id)">拒绝退货退款</el-button>
                        </div>
                        <div v-if="scope_s.row.return_status==8">已退货退款</div>
                        <div v-if="scope_s.row.return_status==9">已拒绝退货退款</div>
                      </template>
                    </el-table-column>
                </el-table>
                <!--<p>总价：{{scope.row.total}}</p>-->
              </template>
            </el-table-column>
            <el-table-column prop="create_time" label="下单时间" sortable></el-table-column>
            <el-table-column prop="username" label="买家邮箱" width="170px"></el-table-column>
            <el-table-column prop="shop_name" label="卖家名称">
            </el-table-column>
            <el-table-column prop="status" label="订单状态"
             :filters="[
              { text: '已取消', value: 1 },
              { text: '未付款', value: 2 },
              { text: '未发货', value: 3 },
              { text: '已发货', value: 4 },
              { text: '已收货', value: 5 },
              { text: '已评价', value: 6 },
            ]"
            :filter-method="filterState">
              <template slot-scope="scope">
                <div v-if="scope.row.status==1">已取消</div>
                <div v-if="scope.row.status==2">未付款</div>
                <div v-if="scope.row.status==3">未发货</div>
                <div v-if="scope.row.status==4">已发货</div>
                <div v-if="scope.row.status==5">已收货</div>
                <div v-if="scope.row.status==6">已评价</div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="preChangeOrderStatus(scope.row.order_id)">编辑订单状态</el-button>
                <el-button size="mini" type="text" @click="cancelOrder(scope.row.order_id)">取消订单</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row style="text-align: center">
          <el-pagination
            :current-page="currentPage"
            @current-change="handleCurrentChange"
            :total="orderCount"
            layout="prev, pager, next, jumper"
          >
          </el-pagination>
        </el-row>
        </el-card>
      </div>
    </div>
    <el-dialog title="编辑订单状态" :visible.sync="editOrderVisible" width="40%">
      <el-select v-model="orderStatus" filterable placeholder="请选择订单状态">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editOrderVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeOrderStatus">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="拒绝退款" :visible.sync="returnFailVisible">
      <el-input v-model="checkOpinion" placeholder="请输入拒绝退款理由"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="returnFailVisible = false">取 消</el-button>
        <el-button type="primary" @click="returnFail">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="拒绝换货" :visible.sync="exchangeFailVisible">
      <el-input v-model="checkOpinion" placeholder="请输入拒绝换货理由"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="exchangeFailVisible = false">取 消</el-button>
        <el-button type="primary" @click="exchangeFail">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="拒绝退货退款" :visible.sync="returnAllFailVisible">
      <el-input v-model="checkOpinion" placeholder="请输入拒绝退货退款理由"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="returnAllFailVisible = false">取 消</el-button>
        <el-button type="primary" @click="returnAllFail">确 定</el-button>
      </div>
    </el-dialog>
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
      orderDataLoading: false,
      //模糊搜索
      searchText: "",
      //分页
      currentPage: 1,
      orderCount: 0,
      orderCountPerPage: 10,
      //编辑订单状态
      editOrderVisible: false,
      orderId: "",
      orderStatus: "",
      checkOpinion: "",
      returnFailVisible: false,
      exchangeFailVisible: false,
      returnAllFailVisible: false,
      options: [{
          value: 1,
          label: '已取消'
        }, {
          value: 2,
          label: '未付款'
        }, {
          value: 3,
          label: '未发货'
        }, {
          value: 4,
          label: '已发货'
        }, {
          value: 5,
          label: '已收货'
        }, {
          value: 6,
          label: '已评价'
        }],
      //订单
      orderList:[
        /*{
          create_time: "2021-07-15 18:31:30",//下单时间
          username: "AB",//购买用户
          shop_name: "CD",//商家名称
          status: 2,//订单状态 1.已取消 2.未付款 3.未发货 4.已发货 5.已收货 6.已评价
          total: 1000,
          order_id: "",
          books:[
            {
              book_image_b: require("../../assets/kuku.png"),//书籍图片
              book_image_s: require("../../assets/kuku.png"),//书籍图片
              book_name: "C++入门",//书籍名称
              price: 100,//书籍单价
              number: 10,//书籍数量
              repertory: 100,//库存
              return_status: -1,//-1.无效 1.申请退款未审核 2.同意 3.拒绝
              // 4.换货申请未审核 5.换货同意 6.换货拒绝 7.退货退款申请未审核 8.退货退款通过 9.退货退款拒绝
            },
          ],
        },*/
      ],
    };
  },
  computed: {
  },
  methods:{
    //回到管理员主页
    gotoAdmin() {
      this.$router.push("/adminManage");
    },
    //筛选订单状态
    filterState(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    //分页
    handleCurrentChange(val) {
      this.currentPage = val;
      if(this.searchText=="") {
        this.getOrderNum();
        this.getOrder();
      }
      else this.searchOrder(this.searchText);
    },
    //模糊查询订单
    search(username) {
      this.currentPage = 1;
      this.searchOrder(username);
    },
    searchOrder(username) {
      axios({
        url: this.$store.state.yuming + "/order/fuzzyQuery",
        method: "GET",
        params: {
          page_num: this.currentPage,
          order_num: this.orderCountPerPage,
          status: 0,
          content: username,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.orderList = data;
          } else {
            this.$message.error("查询订单失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
      //获取订单的数目
      axios({
        url: this.$store.state.yuming + "/order/fuzzyQueryCount",
        method: "GET",
        params: {
          status: 0,
          content: username,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.orderCount = data;
          } else {
            this.$message.error("获取订单数量失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    //重新加载订单数据
    reloadOrderData() {
      this.orderDataLoading = true;
      this.getOrderNum();
      this.getOrder();
      this.orderDataLoading = false;
    },
    //获取分页订单总数
    getOrderNum() {
      axios({
        url: this.$store.state.yuming+"/getOrderNum",
        method: "GET",
        params: {
          identity: 2,
          status: 0,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.orderCount = data;
          } else {
            this.$message.error("获取分页订单总数失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //获取订单分页
    getOrder() {
      axios({
        url: this.$store.state.yuming+"/getOrder",
        method: "GET",
        params: {
          page_num: this.currentPage,
          order_num: this.orderCountPerPage,
          status: 0,
          identity: 2,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.orderList = data;
          } else {
            this.$message.error("获取订单分页失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //取消订单
    cancelOrder(id) {
      axios({
        url: this.$store.state.yuming+"/order/cancel",
        method: "POST",
        params: {
          order_id: id,
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.reloadOrderData();
            this.$message({
              type: "success",
              message: "取消成功",
        });
          } else {
            this.$message.error("取消失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //准备编辑订单状态的数据
    preChangeOrderStatus(id) {
      this.orderId = id;
      this.orderStatus = "";
      this.editOrderVisible = true;
    },
    //确认编辑订单状态
    changeOrderStatus() {
      axios({
        url: this.$store.state.yuming+"/admin/changeOrderStatus",
        method: "POST",
        params: {
          order_id:this.orderId,
          status: this.orderStatus,
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.reloadOrderData();
            this.$message({
              type: "success",
              message: "编辑订单状态成功",
        });
          } else {
            this.$message.error("编辑订单状态失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
      this.editOrderVisible = false;
    },
    //同意退款
    returnPass(id) {
      axios({
        url: this.$store.state.yuming + "/shop/returnPass",
        method: "POST",
        params: {
          order_book_id: id,
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.reloadOrderData();
          } else {
            this.$message.error("同意退款失败,请重试");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //同意换货
    exchangePass(id) {
      axios({
        url: this.$store.state.yuming + "/shop/exchangePass",
        method: "POST",
        params: {
          order_book_id: id,
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.reloadOrderData();
          } else {
            this.$message.error("同意换货失败,请重试");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //同意退款退货
     returnAllPass(id) {
      axios({
        url: this.$store.state.yuming + "/shop/returnAllPass",
        method: "POST",
        params: {
          order_book_id: id,
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.reloadOrderData();
          } else {
            this.$message.error("同意退款退货失败,请重试");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //拒绝退款
    preReturnFail(id) {
      this.orderId = id;
      this.checkOpinion = "";
      this.returnFailVisible = true;
    },
    returnFail() {
      axios({
        url: this.$store.state.yuming + "/shop/returnFail",
        method: "POST",
        params: {
          order_book_id: this.orderId,
          check_opinion: this.checkOpinion,
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.reloadOrderData();
          } else {
            this.$message.error("拒绝退款失败,请重试");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
      this.returnFailVisible = false;
    },
    //拒绝换货
    preExchangeFail(id) {
      this.orderId = id;
      this.checkOpinion = "";
      this.exchangeFailVisible = true;
    },
    exchangeFail() {
      axios({
        url: this.$store.state.yuming + "/shop/exchangeFail",
        method: "POST",
        params: {
          order_book_id: this.orderId,
          check_opinion: this.checkOpinion,
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.reloadOrderData();
          } else {
            this.$message.error("拒绝换货失败,请重试");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
      this.exchangeFailVisible = false;
    },
    //拒绝退款退货
    preReturnAllFail(id) {
      this.orderId = id;
      this.checkOpinion = "";
      this.returnAllFailVisible = true;
    },
    returnAllFail() {
      axios({
        url: this.$store.state.yuming + "/shop/returnAllFail",
        method: "POST",
        params: {
          order_book_id: this.orderId,
          check_opinion: this.checkOpinion,
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.reloadOrderData();
          } else {
            this.$message.error("拒绝退款退货失败,请重试");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
      this.returnAllFailVisible = false;
    },
  },
  async created() {
    this.isLoading = true;
    await this.getOrderNum();
    await this.getOrder();
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