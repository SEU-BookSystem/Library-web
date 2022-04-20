<template>
  <div v-loading="isLoading">
    <div class="header">
      <div class="logo">
        <img height="70px" style="margin: 20px 0" src="../assets/jwbc.png" />
      </div>
      <el-page-header
        v-if="isDisabled == false"
        @back="gotoRefund"
        content="填写详细信息"
        style="display: flex; justify-content: center; align-items: center"
      ></el-page-header>
      <el-page-header
        v-if="isDisabled == true"
        @back="gotoOrder"
        content="详细信息"
        style="display: flex; justify-content: center; align-items: center"
      ></el-page-header>
    </div>
    <div v-if="this.serviceId == 1">
      <el-row>
        <el-col :offset="4" :span="16">
          <el-steps
            v-if="this.refundAdmin == true"
            :space="300"
            :active="refundStatus"
            align-center
            simple
            finish-status="success"
          >
            <el-step title="买家申请仅退款"></el-step>
            <el-step title="卖家处理退款申请"></el-step>
            <el-step title="退款完毕"></el-step>
          </el-steps>
          <el-steps
            v-if="this.refundAdmin == false"
            :space="300"
            :active="3"
            align-center
            simple
            finish-status="finish"
          >
            <el-step title="买家申请仅退款"></el-step>
            <el-step title="卖家处理退款申请"></el-step>
            <el-step title="拒绝申请"></el-step>
          </el-steps>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0">
        <el-col :offset="4" :span="16">
          <el-card>
            <el-form
              ref="refundInfo"
              :model="refundInfo"
              label-width="100px"
              :rules="firstRules"
            >
              <el-form-item label="退款商品：">
                <el-row v-for="(books, idx) in bookList.books" :key="idx">
                  <el-col :span="3">
                    <img
                      :src="books.book_image_b"
                      style="height: 100px; width: 100px"
                    />
                  </el-col>
                  <el-col :span="20" style="margin-left: 10px">
                    <div style="margin-right: 30px" class="book-name">
                      {{ books.book_name }}
                    </div>
                    <div class="book-total" style="margin-top: 20px">
                      ￥{{ books.book_total_price }}
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="服务类型："> 仅退款 </el-form-item>
              <el-form-item label="货物状态：">
                <el-radio-group
                  v-model="radio"
                  prop="goods_status"
                  v-if="isDisabled == false"
                >
                  <el-radio :label="1">未收到货</el-radio>
                  <el-radio :label="2">已收到货</el-radio>
                </el-radio-group>
                <div
                  v-if="
                    isDisabled == true &&
                    this.bookList.books[0].transport_status == 1
                  "
                >
                  未收到货
                </div>
                <div
                  v-if="
                    isDisabled == true &&
                    this.bookList.books[0].transport_status == 2
                  "
                >
                  已收到货
                </div>
              </el-form-item>
              <el-form-item label="退款原因：" prop="option">
                <el-select
                  v-model="refundInfo.option"
                  placeholder="请选择"
                  v-if="radio == 1 && isDisabled == false"
                >
                  <el-option
                    v-for="item in firstOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <el-select
                  v-model="refundInfo.option"
                  placeholder="请选择"
                  v-if="radio == 2 && isDisabled == false"
                >
                  <el-option
                    v-for="item in secondOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <div v-if="isDisabled == true">
                  {{ this.bookList.books[0].return_reason }}
                </div>
              </el-form-item>
              <el-form-item
                label="退款金额："
                class="book-total"
                v-for="(books, idx) in bookList.books"
                :key="idx"
              >
                ￥{{ books.book_total_price }}
              </el-form-item>
              <el-form-item label="退款说明：" prop="reason">
                <el-input
                  v-if="isDisabled == false"
                  type="textarea"
                  v-model="refundInfo.reason"
                  maxlength="200"
                  show-word-limit
                  clearable
                  style="width: 500px"
                  rows="5"
                ></el-input>
                <div v-if="isDisabled == true" style="width: 500px">
                  {{ bookList.books[0].return_detail }}
                </div>
              </el-form-item>
              <el-form-item label="上传图片：" prop="img">
                <el-upload
                  v-if="isDisabled == false"
                  class="avatar-uploader"
                  ref="upload"
                  action="http://47.94.131.208:8888"
                  :show-file-list="false"
                  :on-change="changePhotoFile"
                  :auto-upload="false"
                  :name="this.refundInfo.img"
                >
                  <img
                    v-if="this.refundInfo.img"
                    :src="this.refundInfo.img"
                    class="avatar"
                  />
                  <img v-else src="../assets/avatar.jpg" class="avatar" />
                  <div class="avatar-uploader-icon">
                    <i
                      class="el-icon-warning-outline"
                      style="margin-right: 5px"
                    ></i>
                    <i style="color: #909399">可上传1张凭证</i>
                  </div>
                </el-upload>
                <my-cropper
                  ref="myCropper"
                  @getFile="getFile"
                  @upAgain="upAgain"
                ></my-cropper>
                <img
                  v-if="
                    isDisabled == true && this.bookList.books[0].return_image_b
                  "
                  :src="this.bookList.books[0].return_image_b"
                  class="avatar"
                  style="margin-top: 15px"
                />
                <div
                  v-if="
                    isDisabled == true && !this.bookList.books[0].return_image_b
                  "
                >
                  没有上传凭证哦~
                </div>
              </el-form-item>
              <el-form-item v-if="isDisabled == false">
                <el-button @click="confirmRefund"> 提交 </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div v-if="this.serviceId == 2">
      <el-row>
        <el-col :offset="3" :span="18">
          <el-steps
            v-if="returnGoodsAdmin == true"
            :space="300"
            :active="returnGoodsStatus"
            align-center
            simple
            finish-status="success"
          >
            <el-step title="买家申请退货退款"></el-step>
            <el-step title="卖家处理退货申请"></el-step>
            <el-step title="买家退货"></el-step>
            <el-step title="退款完毕"></el-step>
          </el-steps>
          <el-steps
            v-if="returnGoodsAdmin == false"
            :space="300"
            :active="3"
            align-center
            simple
            finish-status="finish"
          >
            <el-step title="买家申请退货退款"></el-step>
            <el-step title="卖家处理退货申请"></el-step>
            <el-step title="拒绝申请"></el-step>
          </el-steps>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0">
        <el-col :offset="3" :span="18">
          <el-card>
            <el-form
              ref="refundInfo"
              :model="refundInfo"
              label-width="100px"
              style="margin-left: 150px"
              :rules="secondRules"
            >
              <el-form-item label="退款商品：">
                <el-row v-for="(books, idx) in bookList.books" :key="idx">
                  <el-col :span="3">
                    <img
                      :src="books.book_image_b"
                      style="height: 100px; width: 100px"
                    />
                  </el-col>
                  <el-col :span="20" style="margin-left: 10px">
                    <div style="margin-right: 30px" class="book-name">
                      {{ books.book_name }}
                    </div>
                    <div class="book-total" style="margin-top: 20px">
                      ￥{{ books.book_total_price }}
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="服务类型："> 退货退款 </el-form-item>
              <el-form-item label="退款原因：" prop="option">
                <el-select
                  v-model="refundInfo.option"
                  placeholder="请选择"
                  v-if="isDisabled == false"
                >
                  <el-option
                    v-for="item in thirdOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <div v-if="isDisabled == true">
                  {{ this.bookList.books[0].return_reason }}
                </div>
              </el-form-item>
              <el-form-item
                label="退款金额："
                class="book-total"
                v-for="(books, idx) in bookList.books"
                :key="idx"
              >
                ￥{{ books.book_total_price }}
              </el-form-item>
              <el-form-item label="退款说明：" prop="reason">
                <el-input
                  v-if="isDisabled == false"
                  type="textarea"
                  v-model="refundInfo.reason"
                  maxlength="200"
                  show-word-limit
                  clearable
                  style="width: 500px"
                  rows="5"
                ></el-input>
                <div v-if="isDisabled == true" style="width: 500px">
                  {{ bookList.books[0].return_detail }}
                </div>
              </el-form-item>
              <el-form-item label="上传图片：" prop="img">
                <el-upload
                  v-if="isDisabled == false"
                  class="avatar-uploader"
                  ref="upload"
                  action="http://47.94.131.208:8888"
                  :show-file-list="false"
                  :on-change="changePhotoFile"
                  :auto-upload="false"
                  :name="this.refundInfo.img"
                >
                  <img
                    v-if="this.refundInfo.img"
                    :src="this.refundInfo.img"
                    class="avatar"
                  />
                  <img v-else src="../assets/avatar.jpg" class="avatar" />
                  <div class="avatar-uploader-icon">
                    <i
                      class="el-icon-warning-outline"
                      style="margin-right: 5px"
                    ></i>
                    <i style="color: #909399">可上传1张凭证</i>
                  </div>
                </el-upload>
                <my-cropper
                  ref="myCropper"
                  @getFile="getFile"
                  @upAgain="upAgain"
                ></my-cropper>
                <img
                  v-if="
                    isDisabled == true && this.bookList.books[0].return_image_b
                  "
                  :src="this.bookList.books[0].return_image_b"
                  class="avatar"
                  style="margin-top: 15px"
                />
                <div
                  v-if="
                    isDisabled == true && !this.bookList.books[0].return_image_b
                  "
                >
                  没有上传凭证哦~
                </div>
              </el-form-item>
              <el-form-item v-if="isDisabled == false">
                <el-button @click="confirmReturnGoods"> 提交 </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div v-if="this.serviceId == 3">
      <el-row>
        <el-col :offset="3" :span="18">
          <el-steps
            v-if="exchangeGoodsAdmin == true"
            :space="300"
            :active="exchangeGoodsStatus"
            align-center
            simple
            finish-status="success"
          >
            <el-step title="买家申请换货"></el-step>
            <el-step title="卖家处理换货申请"></el-step>
            <el-step title="买家退货"></el-step>
            <el-step title="卖家再次发货"></el-step>
            <el-step title="换货完毕"></el-step>
          </el-steps>
          <el-steps
            v-if="exchangeGoodsAdmin ==false"
            :space="300"
            :active="3"
            align-center
            simple
            finish-status="finish"
          >
            <el-step title="买家申请换货"></el-step>
            <el-step title="卖家处理换货申请"></el-step>
            <el-step title="拒绝申请"></el-step>
          </el-steps>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0">
        <el-col :offset="3" :span="18">
          <el-card>
            <el-form
              ref="refundInfo"
              :model="refundInfo"
              label-width="100px"
              style="margin-left: 150px"
              :rules="thirdRules"
            >
              <el-form-item label="换货商品：">
                <el-row v-for="(books, idx) in bookList.books" :key="idx">
                  <el-col :span="3">
                    <img
                      :src="books.book_image_b"
                      style="height: 100px; width: 100px"
                    />
                  </el-col>
                  <el-col :span="20" style="margin-left: 10px">
                    <div style="margin-right: 30px" class="book-name">
                      {{ books.book_name }}
                    </div>
                    <div class="book-total" style="margin-top: 20px">
                      ￥{{ books.book_total_price }}
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="服务类型："> 换货 </el-form-item>
              <el-form-item label="换货原因：" prop="option">
                <el-select
                  v-model="refundInfo.option"
                  placeholder="请选择"
                  v-if="isDisabled == false"
                >
                  <el-option
                    v-for="item in fouthOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <div v-if="isDisabled == true">
                  {{ bookList.books[0].return_reason }}
                </div>
              </el-form-item>
              <el-form-item
                label="换货地址："
                prop="addressId"
                v-if="isDisabled == false"
              >
                <el-table :data="myAddressList">
                  <el-table-column width="35">
                    <template slot-scope="scope">
                      <el-radio
                        :label="scope.row.id"
                        v-model="refundInfo.addressId"
                      ></el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="收货人" width="100">
                  </el-table-column>
                  <el-table-column prop="phone" label="电话号码" width="200">
                  </el-table-column>
                  <el-table-column prop="address" label="收货地址">
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item label="换货地址：" v-if="isDisabled == true">
                <el-row>
                  <el-col :span="2">收货人：</el-col>
                  <el-col :span="19">{{
                    this.returnAddress.receiver_name
                  }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="2">电话号码：</el-col>
                  <el-col :span="19">{{ this.returnAddress.phone }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="2">收货地址：</el-col>
                  <el-col :span="12">{{ this.returnAddress.address }}</el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="退款说明：" prop="reason">
                <el-input
                  v-if="isDisabled == false"
                  type="textarea"
                  v-model="refundInfo.reason"
                  maxlength="200"
                  show-word-limit
                  clearable
                  style="width: 500px"
                  rows="5"
                ></el-input>
                <div v-if="isDisabled == true" style="width: 500px">
                  {{ bookList.books[0].return_detail }}
                </div>
              </el-form-item>
              <el-form-item label="上传图片：" prop="img">
                <el-upload
                  v-if="isDisabled == false"
                  class="avatar-uploader"
                  ref="upload"
                  action="http://47.94.131.208:8888"
                  :show-file-list="false"
                  :on-change="changePhotoFile"
                  :auto-upload="false"
                  :name="this.refundInfo.img"
                >
                  <img
                    v-if="this.refundInfo.img"
                    :src="this.refundInfo.img"
                    class="avatar"
                  />
                  <img v-else src="../assets/avatar.jpg" class="avatar" />
                  <div class="avatar-uploader-icon">
                    <i
                      class="el-icon-warning-outline"
                      style="margin-right: 5px"
                    ></i>
                    <i style="color: #909399">可上传1张凭证</i>
                  </div>
                </el-upload>
                <my-cropper
                  ref="myCropper"
                  @getFile="getFile"
                  @upAgain="upAgain"
                ></my-cropper>
                <img
                  v-if="
                    isDisabled == true && this.bookList.books[0].return_image_b
                  "
                  :src="this.bookList.books[0].return_image_b"
                  class="avatar"
                  style="margin-top: 15px"
                />
                <div
                  v-if="
                    isDisabled == true && !this.bookList.books[0].return_image_b
                  "
                >
                  没有上传凭证哦~
                </div>
              </el-form-item>
              <el-form-item v-if="isDisabled == false">
                <el-button @click="confirmExchangeGoods"> 提交 </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import MyCropper from "../components/cropper.vue";
import axios from "axios";
export default {
  components: {
    MyCropper,
  },
  data() {
    return {
      isDisabled: true,
      refundStatus: 0,
      returnGoodsStatus: 0,
      exchangeGoodsStatus: 0,
      refundAdmin: true,
      returnGoodsAdmin: true,
      exchangeGoodsAdmin: true,
      filelist: [],
      radio: 1,
      bookId: this.$route.params.bookId,
      serviceId: this.$route.params.serviceId,
      isLoading: false,
      //图片formdata
      imgForm: new FormData(),
      //数据formdata
      dataForm: new FormData(),
      //是否上传凭证
      hasProof: false,
      firstOptions: [
        {
          value: "不喜欢/不想要",
          label: "不喜欢/不想要",
        },
        {
          value: "空包裹",
          label: "空包裹",
        },
        {
          value: "未按约定时间发货",
          label: "未按约定时间发货",
        },
        {
          value: "快递/物流一直未送到",
          label: "快递/物流一直未送到",
        },
        {
          value: "快递/物流无跟踪记录",
          label: "快递/物流无跟踪记录",
        },
        {
          value: "货物破损已拒签",
          label: "货物破损已拒签",
        },
      ],
      secondOptions: [
        {
          value: "退运费",
          label: "退运费",
        },
        {
          value: "实际商品与描述不符",
          label: "实际商品与描述不符",
        },
        {
          value: "做工粗糙/有瑕疵",
          label: "做工粗糙/有瑕疵",
        },
        {
          value: "收到商品时有破损/污渍/变形",
          label: "收到商品时有破损/污渍/变形",
        },
        {
          value: "未按约定时间发货",
          label: "未按约定时间发货",
        },
        {
          value: "卖家发错货",
          label: "卖家发错货",
        },
      ],
      thirdOptions: [
        {
          value: "七天无理由退换货",
          label: "七天无理由退换货",
        },
        {
          value: "退运费",
          label: "退运费",
        },
        {
          value: "实际商品与描述不符",
          label: "实际商品与描述不符",
        },
        {
          value: "做工粗糙/有瑕疵",
          label: "做工粗糙/有瑕疵",
        },
        {
          value: "收到商品时有破损/污渍/变形",
          label: "收到商品时有破损/污渍/变形",
        },
        {
          value: "少件",
          label: "少件",
        },
        {
          value: "未按约定时间发货",
          label: "未按约定时间发货",
        },
        {
          value: "卖家发错货",
          label: "卖家发错货",
        },
      ],
      fouthOptions: [
        {
          value: "七天无理由退换货",
          label: "七天无理由退换货",
        },
        {
          value: "实际商品与描述不符",
          label: "实际商品与描述不符",
        },
        {
          value: "做工粗糙/有瑕疵",
          label: "做工粗糙/有瑕疵",
        },
        {
          value: "收到商品时有破损/污渍/变形",
          label: "收到商品时有破损/污渍/变形",
        },
        {
          value: "少件",
          label: "少件",
        },
        {
          value: "卖家发错货",
          label: "卖家发错货",
        },
      ],
      firstRules: {
        goods_status: [
          { required: true, message: "请选择货物状态", trigger: "blur" },
        ],
        option: [
          { required: true, message: "请选择退款原因", trigger: "blur" },
        ],
      },
      secondRules: {
        option: [
          { required: true, message: "请选择退款原因", trigger: "blur" },
        ],
      },
      thirdRules: {
        option: [
          { required: true, message: "请选择退款原因", trigger: "blur" },
        ],
        addressId: [
          { required: true, message: "请选择换货地址", trigger: "blur" },
        ],
      },
      bookList: {
        books: [
          {
            book_image_b: "",
            book_name: "",
            author: "",
            press: "",
            book_total_price: "",
          },
        ],
      },
      refundInfo: {
        goods_status: "",
        reason: "",
        option: "",
        img: "",
        addressId: 1,
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
      returnAddress: {
        receiver_name: "",
        phone: "",
        address: "",
      },
    };
  },
  methods: {
    gotoRefund() {
      this.$router.push("/refund/" + this.bookId);
    },
    gotoOrder() {
      this.$router.push("/userOrder/1");
    },
    //获取书本信息
    getBookInfo() {
      axios({
        url: this.$store.state.yuming + "/order/getBookByID",
        method: "GET",
        params: {
          order_book_id: this.bookId,
        },
      }).then((res) => {
        if (res.data.code == 200) {
          this.bookList = res.data.data;
          if (this.bookList.books[0].return_status == -1) {
            this.isDisabled = false;
          } else if (this.bookList.books[0].return_status == 1) {
            this.refundStatus = 1;
          } else if (this.bookList.books[0].return_status == 2) {
            this.refundStatus = 3;
          } else if (this.bookList.books[0].return_status == 3) {
            this.refundStatus = 2;
            this.refundAdmin = false;
          } else if (this.bookList.books[0].return_status == 7) {
            this.returnGoodsStatus = 1;
          } else if (this.bookList.books[0].return_status == 8) {
            this.returnGoodsStatus = 4;
          } else if (this.bookList.books[0].return_status == 9) {
            this.returnGoodsStatus = 3;
            this.returnGoodsAdmin = false;
          } else if (this.bookList.books[0].return_status == 4) {
            this.exchangeGoodsStatus = 1;
            this.getAddress();
          } else if (this.bookList.books[0].return_status == 5) {
            this.exchangeGoodsStatus = 5;
            this.getAddress();
          } else {
            this.exchangeGoodsStatus = 3;
            this.exchangeGoodsAdmin = false;
            this.getAddress();
          }
        } else {
          this.$message.error("获取商品信息失败，请重试");
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
    //获取换货地址
    getAddress() {
      axios({
        url: this.$store.state.yuming + "/address/public/getByID",
        method: "GET",
        params: {
          address_id: this.bookList.address_id,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.returnAddress = data;
          } else {
            this.$message.error("获取换货地址信息失败");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    //上传退款申请
    confirmRefund() {
      if (this.refundInfo.option != "") {
        if (this.hasProof == true) {
          axios({
            url: this.$store.state.yuming + "/order/returnImg",
            method: "POST",
            data: this.imgForm,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }).then((res) => {
            if (res.data.code == 200) {
              this.refundInfo.img = "";
              this.imgForm.delete("order_book_id");
              this.imgForm.delete("img");
            } else {
              this.$message.error("上传图片凭证失败");
              this.refundInfo.img = "";
              this.imgForm.delete("order_book_id");
              this.imgForm.delete("img");
            }
          });
        }
        this.dataForm.append("order_book_id", this.bookId);
        this.dataForm.append("return_reason", this.refundInfo.option);
        this.dataForm.append("return_detail", this.refundInfo.reason);
        this.dataForm.append("transport_status", this.radio);
        axios({
          url: this.$store.state.yuming + "/order/return",
          method: "POST",
          data: this.dataForm,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }).then((res) => {
          if (res.data.code == 200) {
            this.refundInfo.options = "";
            this.refundInfo.reason = "";
            this.radio = 1;
            this.dataForm.delete("order_book_id");
            this.dataForm.delete("return_reason");
            this.dataForm.delete("return_detail");
            this.dataForm.delete("transport_status");
            this.$router.push("/userOrder/1");
            this.$message({
              message: "提交成功",
              type: "success",
            });
          } else {
            this.$message.error("提交退货申请失败");
            this.refundInfo.options = "";
            this.refundInfo.reason = "";
            this.radio = 1;
            this.dataForm.delete("order_book_id");
            this.dataForm.delete("return_reason");
            this.dataForm.delete("return_detail");
            this.dataForm.delete("transport_status");
          }
        });
      } else {
        this.$message({
          message: "请选择退款原因",
          type: "warning",
        });
      }
    },
    //上传退货退款申请
    confirmReturnGoods() {
      if (this.refundInfo.option != "") {
        if (this.hasProof == true) {
          axios({
            url: this.$store.state.yuming + "/order/returnImg",
            method: "POST",
            data: this.imgForm,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }).then((res) => {
            if (res.data.code == 200) {
              this.refundInfo.img = "";
              this.imgForm.delete("order_book_id");
              this.imgForm.delete("img");
            } else {
              this.$message.error("上传图片凭证失败");
              this.refundInfo.img = "";
              this.imgForm.delete("order_book_id");
              this.imgForm.delete("img");
            }
          });
        }
        this.dataForm.append("order_book_id", this.bookId);
        this.dataForm.append("return_reason", this.refundInfo.option);
        this.dataForm.append("return_detail", this.refundInfo.reason);
        axios({
          url: this.$store.state.yuming + "/order/returnAll",
          method: "POST",
          data: this.dataForm,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }).then((res) => {
          if (res.data.code == 200) {
            this.refundInfo.options = "";
            this.refundInfo.reason = "";
            this.dataForm.delete("order_book_id");
            this.dataForm.delete("return_reason");
            this.dataForm.delete("return_detail");
            this.$router.push("/userOrder/1");
            this.$message({
              message: "提交成功",
              type: "success",
            });
          } else {
            this.$message.error("提交退货申请失败");
            this.refundInfo.options = "";
            this.refundInfo.reason = "";
            this.dataForm.delete("order_book_id");
            this.dataForm.delete("return_reason");
            this.dataForm.delete("return_detail");
          }
        });
      } else {
        this.$message({
          message: "请选择退款原因",
          type: "warning",
        });
      }
    },
    //上传换货申请
    confirmExchangeGoods() {
      if (this.refundInfo.option != "") {
        if (this.hasProof == true) {
          axios({
            url: this.$store.state.yuming + "/order/returnImg",
            method: "POST",
            data: this.imgForm,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }).then((res) => {
            if (res.data.code == 200) {
              this.refundInfo.img = "";
              this.imgForm.delete("order_book_id");
              this.imgForm.delete("img");
            } else {
              this.$message.error("上传图片凭证失败");
              this.refundInfo.img = "";
              this.imgForm.delete("order_book_id");
              this.imgForm.delete("img");
            }
          });
        }
        this.dataForm.append("order_book_id", this.bookId);
        this.dataForm.append("return_reason", this.refundInfo.option);
        this.dataForm.append("return_detail", this.refundInfo.reason);
        this.dataForm.append("exchange_address_id", this.refundInfo.addressId);
        axios({
          url: this.$store.state.yuming + "/order/exchange",
          method: "POST",
          data: this.dataForm,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }).then((res) => {
          if (res.data.code == 200) {
            this.refundInfo.options = "";
            this.refundInfo.reason = "";
            this.refundInfo.addressId = "";
            this.dataForm.delete("order_book_id");
            this.dataForm.delete("return_reason");
            this.dataForm.delete("return_detail");
            this.dataForm.delete("exchange_address_id");
            this.$router.push("/userOrder/1");
            this.$message({
              message: "提交成功",
              type: "success",
            });
          } else {
            this.$message.error("提交退货申请失败");
            this.refundInfo.options = "";
            this.refundInfo.reason = "";
            this.refundInfo.addressId = "";
            this.dataForm.delete("order_book_id");
            this.dataForm.delete("return_reason");
            this.dataForm.delete("return_detail");
            this.dataForm.delete("exchange_address_id");
          }
        });
      } else {
        this.$message({
          message: "请选择退款原因",
          type: "warning",
        });
      }
    },
    //上传图片时会被调用
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
      this.hasProof = true;
      this.imgForm.append("img", file);
      this.imgForm.append("order_book_id", this.bookId);
      // 获取上传图片的本地URL，用于上传前的本地预览
      this.refundInfo.img = window.URL.createObjectURL(file);
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
          this.$message.error("上传图片大小不能超过 6MB!");
        } else {
          this.handleCrop(file);
        }
      } else {
        this.$message.error("上传图片只能是 JPG、JPEG或PNG 格式!");
      }
    },
  },
  async created() {
    this.isLoading = true;
    if (this.serviceId == 3) {
      await this.getUserAddress();
    }
    await this.getBookInfo();
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
.logo {
  display: flex;
  justify-content: center;
  margin: 20px;
}
.book-name {
  font-size: 15px;
}
.book-total {
  color: rgb(221, 98, 98);
}
.book-detail {
  font-size: 13px;
  color: grey;
}
.el-divider--horizontal {
  display: block;
  height: 1px;
  width: 100%;
  margin-bottom: 15px;
  margin-top: 0px;
}
.chooseCard {
  margin: 10px 20px;
  height: 130px;
}
.title {
  font-weight: 600;
  margin-bottom: 10px;
}
.description {
  color: grey;
}
.avatar {
  width: 150px;
  height: 150px;
}
</style>