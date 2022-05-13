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
              ref="userInfo"
              :model="userInfo"
              label-width="100px"
              label-position="left"
            >
              <el-row style="margin-top: 30px">
                <el-col>
                  <el-form-item label="姓名：" prop="name">
                    <span>{{ userInfo.name }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="性别：" prop="gender">
                    <span>{{ userInfo.gender }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="年龄：" prop="age">
                    <span>{{ userInfo.age }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="身份证号：" prop="id_card">
                    <span>{{ userInfo.id_card }}</span>
                  </el-form-item>
                </el-col> </el-row
              ><el-row>
                <el-col>
                  <el-form-item label="手机号：" prop="username">
                    <span>{{ userInfo.username }}</span>
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
        <el-tab-pane label="我的收藏" name="second" v-loading="collectionLoading">
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
          <div v-if="hasCollected == true">
            <header>
              <el-card class="collection-header-card">
                <el-row>
                  <el-col
                    :span="1"
                    class="collection-table-item"
                    style="margin-left: 10px"
                  >
                    <el-checkbox
                      v-model="collectionCheckAll"
                      class="myRedCheckBox"
                      @change="collection_check_all"
                    ></el-checkbox>
                  </el-col>
                  <el-col :span="2" class="collection-table-item"
                    >索书号</el-col
                  >
                  <el-col :span="13" class="collection-table-item"
                    >书籍信息</el-col
                  >
                  <el-col :span="1" :offset="4" class="collection-table-item"
                    >操作</el-col
                  >
                </el-row>
              </el-card>
            </header>
            <div class="collection-table-container">
              <div>
                <el-card style="margin: 20px 0">
                  <div class="collection-books">
                    <el-row
                      v-for="(books, idx) in collectionList"
                      :key="idx"
                      style="margin: 10px"
                    >
                      <el-col :span="1">
                        <el-checkbox
                          style="margin: 25px 0"
                          v-model="books.check_one"
                          class="myRedCheckBox"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="2"
                        style="margin: 25px 0"
                        class="collection-table-item"
                      >
                        <div>{{ books.reference_num }}</div>
                      </el-col>
                      <el-col :span="2">
                        <img
                          @click="goToBookInfo(books.reference_num)"
                          :src="changeUrl(books.image)"
                          style="height: 70px"
                        />
                      </el-col>
                      <el-col :span="11">
                        <div
                          style="margin-right: 30px"
                          class="collection-book"
                          @click="goToBookInfo(books.reference_num)"
                        >
                          {{ books.book_name }}
                        </div>
                        <div class="book-detail">作者：{{ books.author }}</div>
                        <div class="book-detail">
                          出版社：{{ books.publisher }}
                        </div>
                      </el-col>
                      <el-col :span="1" :offset="4">
                        <el-popconfirm
                          confirm-button-text="确认"
                          cancel-button-text="取消"
                          confirm-button-type="text"
                          @confirm="orderBook(books.reference_num)"
                          title="您确认要预约此书吗？"
                        >
                          <el-button
                            slot="reference"
                            type="text"
                            class="table-button"
                            style="margin: 15px 0px"
                            >预约</el-button
                          >
                        </el-popconfirm>
                      </el-col>
                      <el-col :span="2">
                        <el-popconfirm
                          confirm-button-text="确认"
                          cancel-button-text="取消"
                          confirm-button-type="text"
                          icon="el-icon-info"
                          icon-color="rgb(221, 68, 65)"
                          @confirm="delBook(books.collection_id)"
                          title="您确认要删除该收藏吗？"
                        >
                          <el-button
                            slot="reference"
                            type="text"
                            class="table-button"
                            style="margin: 15px 0px"
                            >删除</el-button
                          >
                        </el-popconfirm>
                      </el-col>
                    </el-row>
                  </div>
                </el-card>
              </div>
            </div>
            <footer>
              <el-card>
                <el-row>
                  <el-col
                    :span="1"
                    style="margin-left: 10px"
                    class="collection-table-footer-item"
                  >
                    <el-checkbox
                      v-model="collectionCheckAll"
                      class="myRedCheckBox"
                      @change="collection_check_all"
                    ></el-checkbox>
                  </el-col>
                  <el-col :span="11" class="collection-table-footer-item"
                    >全选</el-col
                  >
                  <el-col :span="6" class="collection-table-footer-item"
                    >已选<span style="color: rgb(221, 68, 65)">
                      {{ collection_totalNumber }} </span
                    >本书籍</el-col
                  >
                  <el-col
                    :span="2"
                    class="collection-table-footer-item"
                    style="margin: 12px"
                  >
                    <el-button
                      size="medium"
                      class="table-button"
                      @click="multiOrderBook"
                      >批量预约</el-button
                    >
                  </el-col>
                  <el-col
                    :span="2"
                    class="collection-table-footer-item"
                    style="margin: 12px"
                  >
                    <el-button
                      type="danger"
                      plain
                      size="medium"
                      class="table-button"
                      @click="multiDelBook"
                      >批量删除</el-button
                    >
                  </el-col>
                </el-row>
              </el-card>
            </footer>
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
          <div v-if="hasBorrowed == true"></div>
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
          <div v-if="hasBorrowedHistory == true"></div>
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
          <div v-if="hasViolated == true"></div>
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
        <el-tab-pane name="seventh" v-loading="messageLoading">
          <span slot="label"
            >消息<el-badge
              v-if="hasNoReadMessage==true"
              :value="unreadMessage"
              class="message"
              type="primary"
              :max="99"
            >
            </el-badge>
          </span>
          <div v-if="hasMessage == false">
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
                <p style="color: grey">您还没有通知消息哦~</p>
              </el-col>
            </el-row>
          </div>
          <div v-if="hasMessage == true">
            <el-row style="margin-bottom: 20px;margin-left: 20px">
              <el-button @click="multiReadMessage">一键已读</el-button>
              <el-button @click="multiDelMessage">删除全部</el-button>
            </el-row>
            <el-row
              v-for="message in messageList"
              :key="message.message_id"
              style="margin-bottom: 20px; margin-left: 20px"
            >
              <el-col :span="24" style="margin-bottom: 10px"
                ><el-badge
                  is-dot
                  class="item"
                  style="margin: 5px 5px 0 0"
                  v-if="message.is_read == 0"
                >
                </el-badge
                ><el-button
                  type="text"
                  style="padding: 0px; color: black;font-size:15px"
                  @click="readOneMessage(message.message_id)"
                  >{{message.content}}</el-button></el-col
              >
              <el-col :span="4" style="color: gray; font-size: 15px">{{
                message.send_time
              }}</el-col>
              <el-col :span="20"
                ><el-button
                  type="text"
                  style="padding: 0px; color: rgb(86, 85, 87)"
                  @click="delOneMessage(message.message_id)"
                  >删除此通知</el-button
                ></el-col
              >
              <el-col><el-divider></el-divider></el-col>
            </el-row>
            <el-row
              style="display: flex; justify-content: center; margin: 20px 0"
            >
              <el-pagination
                :current-page="currentMessagePage"
                @current-change="handleCurrentMessageChange"
                :page-count="messagePageNum"
                :page-size="10"
                layout="prev, pager, next, jumper"
                style="magin-left: 50px"
              >
              </el-pagination>
            </el-row>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Message } from "element-ui";
import qs from "qs";
export default {
  components: {},
  data() {
    return {
      //tab方向
      tabPosition: "left",
      activeName: "first",
      hasBorrowed: false,
      hasOrdered: false,
      hasBorrowedHistory: false,
      hasViolated: false,
      isLoading: false,
      //修改密码
      changePassword: false,
      //是否上传了头像
      userInfo: {
        name: "",
        password: "",
        age: "",
        gender: "",
        id_card: "",
        username: "",
        checkOrignPass: "",
        newpass: "",
        checkpass: "",
      },
      //我的收藏
      collectionLoading:false,
      hasCollected: true,
      collectionList: [
        {
          reference_num: "",
          book_name: "",
          author: "",
          publisher: "",
          image: "",
          collection_id: "",
          check_one: false,
        },
      ],
      collectionCheckAll: false,
      collection_totalNum: 0,
      //我的消息
      messageLoading: false,
      hasNoReadMessage: true,
      hasMessage: true,
      currentMessagePage: 1,
      messageList: [{}],
      unreadMessage: 0,
      messagePageNum: 0,
      //密码校验规则
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
    // 我的收藏
    collection_totalNumber() {
      var number_total = 0;
      this.collectionList.forEach((book) => {
        if (book.check_one == true) number_total = number_total + 1;
      });
      return number_total;
    },
  },
  methods: {
    //豆瓣图片加载
    changeUrl(_url) {
      if (_url !== undefined) {
        let _u = _url.substring(7); //_u:提取http://后面的部分
        return "https://images.weserv.nl/?url=" + _u;
      }
    },
    //返回首页
    gotoIndex() {
      this.$router.push("/#reloaded");
    },
    //修改密码
    confirmPass() {
      this.changePassword = false;
      this.userInfo.password = this.userInfo.newpass;
      var formData = new FormData();
      formData.append("password", this.userInfo.password);
      formData.append("username", this.userInfo.username);
      axios({
        url: this.$store.state.yuming + "/user/updatePassword",
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
    //我的收藏
    goToBookInfo(reference_num) {
      this.$router.push(`/bookInfo/${reference_num}`);
    },
    collection_check_all() {
      this.collectionList.forEach((book) => {
        book.check_one = this.collectionCheckAll;
      });
    },
    getAllCollection() {
      axios({
        url: this.$store.state.yuming + "/collection/getByUser",
        method: "GET",
        params: {},
      })
        .then((res) => {
          const { code, data, num } = res.data;
          if (code == "200") {
            this.collectionList = data;
            if (num == 0) {
              this.hasCollected = false;
            }
          } else {
            this.$message.error("获取收藏夹信息失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //单本预约
    orderBook(id) {
      axios({
        url: this.$store.state.yuming + "/collection/addReserve",
        method: "POST",
        params: {
          reference_nums: id,
          username: this.$store.state.username,
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.$message({
              message: "预约成功！",
              type: "success",
            });
          } else if (code == "26") {
            this.$message.error("借阅和预约书籍数量已达到最大值！");
          } else if (code == "25") {
            this.$message({
              dangerouslyUseHTMLString: true,
              message: "书籍{{data}}",
            });
          } else {
            this.$message.error("预约失败，请重试");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //批量预约
    multiOrderBook() {
      var multiOrderBookId = [];
      this.collectionList.forEach((book) => {
        if (book.check_one == true) {
          multiOrderBookId.push(book.reference_num);
        }
      });
      axios({
        url: this.$store.state.yuming + "/collection/addReserve",
        method: "POST",
        params: {
          reference_nums: multiOrderBookId,
          username: this.$store.state.username,
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { indices: false });
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.$message({
              message: "批量预约成功",
              type: "success",
            });
          } else if (code == "26") {
            this.$message.error("借阅和预约书籍数量已达到最大值！");
          } else {
            this.$message.error("批量预约失败,请重试");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    delBook(id) {
      axios({
        url: this.$store.state.yuming + "/collection/delete",
        method: "DELETE",
        params: {
          collection_id: id,
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.isLoading = true;
            this.getAll();
            this.isLoading = false;
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
    //批量删除收藏
    multiDelBook() {
      var multiDelBookId = [];
      this.collectionList.forEach((book) => {
        if (book.check_one == true) {
          multiDelBookId.push(book.collection_id);
        }
      });
      axios({
        url: this.$store.state.yuming + "/collection/multiDelete",
        method: "DELETE",
        params: {
          collection_ids: multiDelBookId,
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { indices: false });
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.$message({
              message: "批量删除成功",
              type: "success",
            });
            this.collectionLoading = true;
            this.getAllCollection();
            this.collectionLoading = false;
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
    //我的预约
    // order_check_all() {
    //   this.orderList.forEach((book) => {
    //     book.check_one = this.orderCheckAll;
    //   });
    // },
    // getAllOrder() {
    //   axios({
    //     url: this.$store.state.yuming + "/collection/getByUser",
    //     method: "GET",
    //     params: {},
    //   })
    //     .then((res) => {
    //       const { code, data, num } = res.data;
    //       if (code == "200") {
    //         this.collectionList = data;
    //         if (num == 0) {
    //           this.hasCollected = false;
    //         }
    //       } else {
    //         this.$message.error("获取收藏夹信息失败");
    //       }
    //     })
    //     .catch(() => {
    //       Message({
    //         type: "error",
    //         message: "出现错误，请稍后再试",
    //       });
    //     });
    // },
    //我的消息
    //实现消息分页
    handleCurrentMessageChange(val) {
      this.currentMessagePage = val;
      this.getUserMessage();
    },
    //阅读一条消息
    readOneMessage(id){
      axios({
        url: this.$store.state.yuming + "/message/read",
        method: "POST",
        params: {
           message_id:id
        },
      })
        .then((res) => {
          const { code} = res.data;
          if (code == "200") {
            this.messageLoading=true;
            this.getUserMessage();
            this.messageLoading=false;        
          } else {
            this.$message.error("已读失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //已读所有消息
    multiReadMessage(){
      axios({
        url: this.$store.state.yuming + "/message/readAll",
        method: "POST",
        params: {
          username: this.$store.state.username
        },
      })
        .then((res) => {
          const { code} = res.data;
          if (code == "200") {
            this.messageLoading=true;
            this.getUserMessage();
            this.messageLoading=false;        
          } else {
            this.$message.error("已读失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //删除一条消息
    delOneMessage(id){
      axios({
        url: this.$store.state.yuming + "/message/delete",
        method: "DELETE",
        params: {
          message_id: id
        },
      })
        .then((res) => {
          const { code} = res.data;
          if (code == "200") {
            this.messageLoading=true;
            this.getUserMessage();
            this.messageLoading=false;        
          } else {
            this.$message.error("删除消息失败，请重试");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //删除所有消息
    multiDelMessage(){
      axios({
        url: this.$store.state.yuming + "/message/deleteAll",
        method: "DELETE",
        params: {
          username: this.$store.state.username
        },
      })
        .then((res) => {
          const { code} = res.data;
          if (code == "200") {
            this.messageLoading=true;
            this.getUserMessage();
            this.messageLoading=false;        
          } else {
            this.$message.error("删除全部消息失败，请重试");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //获取用户的消息列表
    getUserMessage() {
      axios({
        url: this.$store.state.yuming + "/user/message/query",
        method: "GET",
        params: {
          page_num: this.currentMessagePage,
          each_num: 10,
        },
      })
        .then((res) => {
          const { code, data, page_count } = res.data;
          if (code == "200") {
            this.messageList = data;
            this.messagePageNum = page_count;
            if (page_count == 0) {
              this.hasMessage = false;
            }
          } else {
            this.$message.error("获取用户通知信息失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //获取未读消息数目
    getUnreadMessage() {
      axios({
        url: this.$store.state.yuming + "/message/nonReadNum",
        method: "GET",
        params: {
          username: this.$store.state.username,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.unreadMessage = data;
            if(data==0){
              this.hasNoReadMessage=false;
            }
          } else {
            this.$message.error("获取用户未读信息数目失败");
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
          username: this.$store.state.username,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.userInfo = data;
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
    //上传图片触发
    // handleCrop(file) {
    //   this.$nextTick(() => {
    //     this.$refs.myCropper.open(file.raw || file);
    //   });
    // },
    // 点击弹框重新时触发
    // upAgain() {
    //   this.$refs["upload"].$refs["upload-inner"].handleClick();
    // },
    // getFile(file) {
    //   this.formdata.append("img", file);
    //   this.hasShopAvatar = true;
    // 获取上传图片的本地URL，用于上传前的本地预览
    //   this.applypersonInfo.img = window.URL.createObjectURL(file);
    //   this.$refs.myCropper.close();
    // },
    // 提取文件后缀名
    // getSuffix(str) {
    //   const fileExtension = str.substring(str.lastIndexOf(".") + 1);
    //   return fileExtension;
    // },
    //上传图片时会被调用
    // changePhotoFile(file) {
    //   let type = this.getSuffix(file.name);
    //   const isLt6M = file.size / 1024 / 1024 < 6;
    //   if (
    //     type == "JPG" ||
    //     type == "JPEG" ||
    //     type == "PNG" ||
    //     type == "jpg" ||
    //     type == "png" ||
    //     type == "jpge"
    //   ) {
    //     if (!isLt6M) {
    //       this.$message.error("上传头像图片大小不能超过 6MB!");
    //     } else {
    //       this.handleCrop(file);
    //     }
    //   } else {
    //     this.$message.error("上传头像图片只能是 JPG、JPEG或PNG 格式!");
    //   }
    // },
  },
  async created() {
    this.isLoading = true;
    await this.getUserInfo();
    await this.getAllCollection();
    await this.getUserMessage();
    await this.getUnreadMessage();
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
.collection-header-card {
  height: 57px;
}
.collection-table-container {
  margin: 20px 0;
}
.collection-table-item {
  font-size: 13px;
}
.collection-table-action {
  font-size: 13px;
}
.collection-table-footer-item {
  margin: 20px 0;
  font-size: 13px;
}

.collection-book {
  font-size: 13px;
}
.book-detail {
  font-size: 13px;
  color: grey;
}

.collection-books {
  background: rgb(255, 255, 255);
  color: #303133;
  /*border:1px solid rgb(201, 201, 201);*/
}

/* 设置带边框的checkbox，选中后边框的颜色 */
.myRedCheckBox.is-bordered.is-checked {
  border-color: rgb(221, 68, 65);
}

/* 设置选中后的文字颜色 */
.myRedCheckBox .el-checkbox__input.is-checked + .el-checkbox__label {
  color: rgb(221, 68, 65);
}

/* 设置选中后对勾框的边框和背景颜色 */
.myRedCheckBox .el-checkbox__input.is-checked .el-checkbox__inner,
.myRedCheckBox .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  border-color: rgb(221, 68, 65);
  background-color: rgb(221, 68, 65);
}

/* 设置checkbox获得焦点后，对勾框的边框颜色 */
.myRedCheckBox .el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: rgb(221, 68, 65);
}

/* 设置鼠标经过对勾框，对勾框边框的颜色 */
.myRedCheckBox .el-checkbox__inner:hover {
  border-color: rgb(221, 68, 65);
}
.table-button {
  font-size: 13px;
  color: black;
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