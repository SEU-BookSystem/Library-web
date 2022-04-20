<template>
  <div v-loading="isLoading">
    <div class="header">
      <div class="logo">
        <img height="70px" style="margin: 20px 0" src="../assets/jwbc.png" />
      </div>
      <el-page-header
        @back="gotoIndex"
        content="个人主页"
        style="display: flex; justify-content: center; align-items: center"
      ></el-page-header>
    </div>
    <div class="tab">
      <el-tabs v-model="activeName">
        <el-tab-pane label="首页" name="first">
          <div class="personCard">
            <div class="up">
              <el-card class="personDetail">
                <el-row>
                  <div
                    style="
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      flex-wrap: wrap;
                      margin: 20px;
                    "
                  >
                    <img
                      v-if="this.userInfo.avatar_b"
                      style="
                        height: 150px;
                        width: 150px;
                        border-radius: 50%;
                        margin: 5%;
                      "
                      :src="this.userInfo.avatar_b"
                    />
                    <img
                      v-else
                      style="
                        height: 150px;
                        width: 150px;
                        border-radius: 50%;
                        margin: 5%;
                      "
                      src="../assets/avatar.jpg"
                    />
                  </div>
                </el-row>
                <el-row style="margin: 10px" class="all">
                  <div
                    style="
                      font-size: 20px;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                    "
                  >
                    {{ this.userInfo.name }}
                  </div>
                </el-row>
                <el-row style="margin: 10px" class="all">
                  <div
                    style="
                      font-size: 15px;
                      color: #909399;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                    "
                  >
                    {{ this.userInfo.username }}
                  </div>
                </el-row>
                <el-row
                  style="margin: 20px 10px; margin-bottom: 0px"
                  class="all"
                >
                  <el-button
                    type="text"
                    style="font-size: 15px"
                    @click="gotoAddress"
                    >我的收货地址</el-button
                  >
                </el-row>
                <el-row style="margin: 0px 10px" class="all">
                  <el-button
                    type="text"
                    style="font-size: 15px"
                    @click="gotoChange"
                    >修改资料</el-button
                  >
                </el-row>
              </el-card>
              <div
                style="
                  display: flex;
                  justify-content: space-around;
                  align-items: center;
                  flex-wrap: wrap;
                  margin-left: 5%;
                "
              >
                <el-row
                  style="
                    margin-top: 50px;
                    display: flex;
                    justify-content: space-between;
                  "
                >
                  <el-col :span="8">
                    <el-card
                      shadow="never"
                      class="noCard"
                      @click.native="gotoAllOrder"
                    >
                      <i
                        class="iconfont-dingdanlan-copy"
                        style="font-size: 50px; margin: 50px"
                      />
                      <el-button
                        type="text"
                        style="
                          font-size: 15px;
                          margin: 20px 50px;
                          color: #3d678a;
                        "
                        >全部订单</el-button
                      >
                    </el-card>
                  </el-col>
                  <el-col :span="8">
                    <el-card
                      class="cccard"
                      shadow="never"
                      @click.native="gotoDaifukuan"
                    >
                      <i
                        class="iconfont-daifukuan"
                        style="font-size: 50px; margin: 50px"
                      />
                      <el-button
                        type="text"
                        style="
                          font-size: 15px;
                          margin: 20px 50px;
                          color: #fffff0;
                        "
                        >待付款</el-button
                      >
                    </el-card>
                  </el-col>
                  <el-col :span="8">
                    <el-card
                      shadow="never"
                      class="noCard"
                      @click.native="gotoDaifahuo"
                    >
                      <i
                        class="iconfont-daifahuoL"
                        style="font-size: 50px; margin: 50px"
                      />
                      <el-button
                        type="text"
                        style="
                          font-size: 15px;
                          margin: 20px 50px;
                          color: #3d678a;
                        "
                        >待发货</el-button
                      >
                    </el-card>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-card
                      class="cccard"
                      shadow="never"
                      @click.native="gotoDaishouhuo"
                    >
                      <i
                        class="iconfont-daishouhuoW"
                        style="font-size: 50px; margin: 50px"
                      />
                      <el-button
                        type="text"
                        style="
                          font-size: 15px;
                          margin: 20px 50px;
                          color: #fffff0;
                        "
                        >待收货</el-button
                      >
                    </el-card>
                  </el-col>
                  <el-col :span="8">
                    <el-card
                      shadow="never"
                      class="noCard"
                      @click.native="gotoDaipingjia"
                    >
                      <i
                        class="iconfont-fankuiL"
                        style="font-size: 50px; margin: 50px"
                      />
                      <el-button
                        type="text"
                        style="
                          font-size: 15px;
                          margin: 20px 50px;
                          color: #3d678a;
                        "
                        >待评价</el-button
                      >
                    </el-card>
                  </el-col>
                  <el-col :span="8">
                    <el-card
                      class="cccard"
                      shadow="never"
                      @click.native="gotoTuikuan"
                    >
                      <i
                        class="iconfont-shouhouW"
                        style="font-size: 50px; margin: 50px"
                      />
                      <el-button
                        type="text"
                        style="
                          font-size: 15px;
                          margin: 20px 60px;
                          color: #fffff0;
                        "
                      >
                        退款</el-button
                      >
                    </el-card>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="我的收货地址" name="second">
          <el-row v-loading="addressLoading">
            <div style="margin-bottom: 20px">
              <el-row>
                <el-col :key="item.id" v-for="item in myAddressList" :span="6">
                  <el-card class="addressCard">
                    <el-form ref="item" :v-model="item" label-width="80px">
                      <el-form-item label="姓名" prop="name">
                        <div style="display: flex; justify-content: flex-start">
                          {{ item.name }}
                        </div>
                      </el-form-item>
                      <el-form-item label="电话号码" prop="phone">
                        <div style="display: flex; justify-content: flex-start">
                          {{ item.phone }}
                        </div>
                      </el-form-item>
                      <el-form-item label="详细地址" prop="name">
                        <div
                          style="
                            display: flex;
                            justify-content: flex-start;
                            flex-wrap: wrap;
                            word-break: break-all;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            display: -webkit-box;
                            -webkit-line-clamp: 1;
                            -webkit-box-orient: vertical;
                          "
                          :title="item.address"
                        >
                          {{ item.address }}
                        </div>
                      </el-form-item>
                      <el-form-item>
                        <el-row
                          style="display: flex; justify-content: flex-start"
                        >
                          <el-col>
                            <el-button
                              type="text"
                              style="margin: 0 5px"
                              v-if="item.status == 0"
                              @click="setDefaultAddress(item)"
                              >设为默认地址
                            </el-button>
                            <el-button
                              type="text"
                              style="margin: 0 5px"
                              v-else
                              disabled
                              >默认地址
                            </el-button>
                          </el-col>
                          <el-col>
                            <el-button
                              type="text"
                              style="margin: 0 5px"
                              @click="eidtAddress(item)"
                              >编辑
                            </el-button>
                            <el-button
                              type="text"
                              style="margin: 0 5px"
                              @click="editDelAddress(item)"
                              >删除
                            </el-button></el-col
                          >
                        </el-row>
                      </el-form-item>
                    </el-form>
                  </el-card>
                </el-col>
              </el-row>
              <el-row
                ><el-button
                  size="min"
                  icon="el-icon-setting"
                  type="text"
                  @click="clearNewAddress"
                  >添加收货人信息</el-button
                ></el-row
              >
              <!--删除收货人信息-->
              <el-dialog
                title="提示"
                :visible.sync="delAddressVisible"
                width="30%"
              >
                <span>确认删除收货地址</span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="delAddressVisible = false"
                    >取 消</el-button
                  >
                  <el-button type="primary" @click="confirmDelAddress"
                    >确 定</el-button
                  >
                </span>
              </el-dialog>
              <!--编辑收货人信息-->
              <el-dialog title="编辑收货人信息" :visible.sync="editInfoVisible">
                <el-form
                  :model="editMyAddress"
                  label-width="120px"
                  :rules="newAddressRules"
                >
                  <el-form-item label="姓名" prop="name">
                    <el-input
                      type="text"
                      style="width: 200px"
                      v-model="editMyAddress.name"
                      clearable
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="电话号码" prop="phone">
                    <el-input
                      type="text"
                      style="width: 200px"
                      v-model="editMyAddress.phone"
                      clearable
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="详细地址" prop="address">
                    <el-input
                      type="textarea"
                      maxlength="50"
                      show-word-limit
                      clearable
                      style="width: 500px"
                      rows="5"
                      v-model="editMyAddress.address"
                    ></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="editInfoVisible = false">取消</el-button>
                  <el-button type="primary" @click="confirmChangeAddress"
                    >确认编辑</el-button
                  >
                </div>
              </el-dialog>
              <!--添加收货人信息-->
              <el-dialog title="添加收货人信息" :visible.sync="addInfoVisible">
                <el-form
                  ref="newAddress"
                  :model="newAddress"
                  label-width="120px"
                  :rules="newAddressRules"
                >
                  <el-form-item label="姓名" prop="name">
                    <el-input
                      type="text"
                      v-model="newAddress.name"
                      style="width: 200px"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="电话号码" prop="phone">
                    <el-input
                      type="text"
                      v-model="newAddress.phone"
                      style="width: 200px"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="详细地址" prop="address">
                    <el-input
                      type="textarea"
                      maxlength="50"
                      show-word-limit
                      clearable
                      style="width: 500px"
                      rows="5"
                      v-model="newAddress.address"
                    ></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="addInfoVisible = false">取消</el-button>
                  <el-button type="primary" @click="addNewAddress"
                    >确认新增</el-button
                  >
                </div>
              </el-dialog>
            </div>
          </el-row>
        </el-tab-pane>
        <el-tab-pane
          v-if="this.userInfo.identity == 0"
          label="申请成为商家"
          name="third"
        >
          <div
            style="display: flex; justify-content: center; align-items: center"
          >
            <el-form
              ref="applyShopInfo"
              :model="applyShopInfo"
              label-width="80px"
              :rules="applyRules"
              label-position="left"
            >
              <el-row>
                <el-col>
                  <el-form-item label-position="left">
                    <div>
                      <h3 style="color: #909399">
                        注意：在此，您可以申请成为商家。请仔细考虑店铺封面，认真填写店铺名称和申请理由。否则，您将有可能遭到拒绝。
                      </h3>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="margin-top: 20px">
                <el-col>
                  <el-form-item label="店铺封面" prop="img">
                    <el-upload
                      class="avatar-uploader"
                      ref="upload"
                      action="http://47.94.131.208:8888"
                      :show-file-list="false"
                      :on-change="changePhotoFile"
                      :auto-upload="false"
                      :name="this.applyShopInfo.img"
                    >
                      <img
                        v-if="this.applyShopInfo.img"
                        :src="this.applyShopInfo.img"
                        class="avatar"
                      />
                      <img v-else :src="this.imgUrl" class="avatar" />
                      <div class="avatar-uploader-icon">
                        <i
                          class="el-icon-warning-outline"
                          style="margin-right: 5px"
                        ></i>
                        <i style="color: #909399">点击图片进行修改</i>
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
                  <el-form-item label="店铺名称" prop="shop_name">
                    <el-input
                      type="text"
                      v-model="applyShopInfo.shop_name"
                      maxlength="10"
                      show-word-limit
                      style="width: 250px"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="店主名" prop="shopper_name">
                    <el-input
                      type="text"
                      v-model="applyShopInfo.shopper_name"
                      maxlength="10"
                      show-word-limit
                      style="width: 250px"
                    ></el-input>
                    <div>
                      <i
                        class="el-icon-warning-outline"
                        style="margin-right: 5px"
                      ></i>
                      <i style="color: #909399">请填写申请人的真实姓名</i>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="申请理由" prop="apply_reason">
                    <el-input
                      type="textarea"
                      v-model="applyShopInfo.apply_reason"
                      maxlength="100"
                      show-word-limit
                      clearable
                      style="width: 500px"
                      rows="5"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item>
                    <el-button type="primary" @click="confirmApply"
                      >确认申请</el-button
                    >
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane
          v-if="this.userInfo.identity == 0"
          label="申请历史"
          name="fourth"
        >
          <el-table
            v-if="hasApplyHistory == true"
            :data="applyHistory"
            style="width: 100%"
            :default-sort="{ prop: 'create_time', order: 'descending' }"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-row>
                    <el-form-item label="申请理由">
                      <span>{{ props.row.apply_reason }}</span>
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-form-item
                      label="审核结果"
                      v-if="props.row.apply_status == 2"
                    >
                      <el-tag v-if="props.row.pass_status == 1" type="success"
                        >已通过</el-tag
                      >
                      <el-tag v-if="props.row.pass_status == 2" type="danger"
                        >已拒绝</el-tag
                      >
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-form-item
                      label="审核意见"
                      v-if="props.row.apply_status == 2"
                    >
                      <span>{{ props.row.check_opinion }}</span>
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-form-item
                      label="存在状态"
                      v-if="props.row.exist_status != -1"
                    >
                      <el-tag v-if="props.row.exist_status == 1" type="success"
                        >未注销</el-tag
                      >
                      <el-tag v-if="props.row.exist_status == 2" type="warning"
                        >已注销</el-tag
                      >
                    </el-form-item>
                  </el-row>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              prop="create_time"
              label="申请时间"
              sortable
            ></el-table-column>
            <el-table-column label="店铺头像">
              <template slot-scope="scope">
                <el-popover placement="right" title="" trigger="hover">
                  <img class="img-max" :src="scope.row.avatar_b" />
                  <img
                    class="img-min"
                    slot="reference"
                    :src="scope.row.avatar_s"
                    :alt="scope.row.avatar_s"
                    style="max-height: 50px; max-width: 130px"
                  />
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              prop="shop_name"
              label="店铺名称"
            ></el-table-column>
            <el-table-column
              prop="shopper_name"
              label="店主名称"
            ></el-table-column>
            <el-table-column prop="apply_status" label="审核状态">
              <template v-slot="x">
                <el-tag v-if="x.row.apply_status == 1" type="warning"
                  >未审核</el-tag
                >
                <el-tag v-if="x.row.apply_status == 2" type="success"
                  >已审核</el-tag
                >
                <el-tag v-if="x.row.apply_status == 3" type="info"
                  >已取消</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="x">
                <el-button
                  size="medium"
                  v-if="x.row.apply_status == 1"
                  type="text"
                  >撤销</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div v-if="hasApplyHistory==false">
            <el-row>
              <el-col :offset="9">
                <img
                  src="../assets/empty_grey.png"
                  style="height: 220px; margin: 50px"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :offset="11">
                <p style="margin-left: 0px; color: grey">还没有申请过店铺哦~</p>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane v-else label="我的店铺" name="fifth">
          <div
            style="display: flex; justify-content: center; align-items: center"
          >
            <el-form
              ref="shopInfo"
              :model="shopInfo"
              label-width="80px"
              label-position="left"
            >
              <el-row style="margin-top: 30px">
                <el-col>
                  <el-form-item label="店铺封面" prop="img">
                    <img
                      v-if="this.shopInfo.avatar_b"
                      :src="this.shopInfo.avatar_b"
                      class="avatar"
                    />
                    <img v-else src="../assets/avatar.jpg" class="avatar" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="店铺名称" prop="shop_name">
                    <span>{{ shopInfo.shop_name }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="店主名" prop="shopper_name">
                    <span>{{ shopInfo.shopper_name }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="评分" prop="apply_reason">
                    <el-rate
                      v-model="value"
                      disabled
                      show-score
                      text-color="#ff9900"
                      score-template="{value}"
                      style="margin-top: 10px"
                    >
                    </el-rate>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item>
                    <el-button type="text" @click="gotoShopManager"
                      >点击管理我的商铺</el-button
                    >
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
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
      hasApplyHistory: false,
      imgUrl: require("../assets/avatar.jpg"),
      orderId: "",
      isLoading: false,
      //收货地址loading
      addressLoading: false,
      activeName: "first",
      //是否上传了头像
      hasShopAvatar: false,
      userInfo: {
        avatar_s: "",
        username: "",
        name: "",
        password: "",
        identity: "",
      },
      //申请店铺
      applyShopInfo: {
        img: "",
        shopper_name: "",
        shop_name: "",
        apply_reason: "",
      },
      //店铺信息
      shopInfo: {
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
    gotoChange() {
      this.$router.push("/change");
    },
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
        this.applyShopInfo.img = "";
        this.applyShopInfo.shopper_name = "";
        this.applyShopInfo.shop_name = "";
        this.applyShopInfo.apply_reason = "";
      } else {
        this.formdata.append("shopper_name", this.applyShopInfo.shopper_name);
        this.formdata.append("shop_name", this.applyShopInfo.shop_name);
        this.formdata.append("apply_reason", this.applyShopInfo.apply_reason);
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
            this.applyShopInfo.img = "";
            this.applyShopInfo.shopper_name = "";
            this.applyShopInfo.shop_name = "";
            this.applyShopInfo.apply_reason = "";
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
            this.hasApplyHistory = true;
          } else if (code == "3") {
            this.hasApplyHistory = false;
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
    getShopInfo() {
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
            this.shopInfo = data;
            this.value = this.shopInfo.rate;
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
        await this.getShopInfo();
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
      this.applyShopInfo.img = window.URL.createObjectURL(file);
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
</style>