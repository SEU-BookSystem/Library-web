<template>
  <div v-loading="isLoading">
    <div class="header">
      <div class="logo">
        <img height="70px" style="margin: 20px 0" src="../assets/jwbc.png" />
      </div>
      <el-page-header
        @back="toUser"
        content="我的订单"
        style="display: flex; justify-content: center; align-items: center"
      ></el-page-header>
      <el-input
        placeholder="输入名称模糊搜索订单"
        v-model="searchInput"
        style="width: 500px; margin-left: 200px"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click.native="gotoSearch"
        >
        </el-button>
      </el-input>
    </div>
    <div>
      <el-row style="margin-left: 5%">
        <el-col :span="3">
          <el-menu :default-active="orderNum" class="el-menu-vertical-demo">
            <el-menu-item index="1" @click.native="allOrderMenu">
              <i class="iconfont-dingdan1"></i>
              <span slot="title" style="margin-left: 10px">全部订单</span>
            </el-menu-item>
            <el-menu-item index="2" @click.native="daifukuanMenu">
              <i class="iconfont-daifukuan1"></i>
              <span slot="title" style="margin-left: 10px">待付款</span>
            </el-menu-item>
            <el-menu-item index="3" @click.native="daifahuoMenu">
              <i class="iconfont-daifahuo1"></i>
              <span slot="title" style="margin-left: 10px">待发货</span>
            </el-menu-item>
            <el-menu-item index="4" @click.native="daishouhuoMenu">
              <i class="iconfont-daishouhuo1"></i>
              <span slot="title" style="margin-left: 10px">待收货</span>
            </el-menu-item>
            <el-menu-item index="5" @click.native="daipingjiaMenu">
              <i class="iconfont-xiaoxi"></i>
              <span slot="title" style="margin-left: 10px">待评价</span>
            </el-menu-item>
            <el-menu-item index="6" @click.native="tuikuanMenu">
              <i class="iconfont-shouhou1"></i>
              <span slot="title" style="margin-left: 10px">退款</span>
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col
          :span="20"
          style="margin-left: 10px"
          v-if="orderNum == 0 && searchTotal != 0"
        >
          <el-card class="header-card">
            <el-row>
              <el-col :span="10" :offset="1" class="table-header-item"
                >商品信息</el-col
              >
              <el-col :span="2" class="table-header-item">单价</el-col>
              <el-col :span="2" class="table-header-item">数量</el-col>
              <el-col :span="2" class="table-header-item">实付款</el-col>
              <el-col :span="3" class="table-header-item">商品操作</el-col>
              <el-col :span="2" class="table-header-item">交易状态</el-col>
              <el-col :span="2" class="table-header-item">操作</el-col>
            </el-row>
          </el-card>
          <div v-for="(item, index) in this.searchList" :key="index">
            <el-card style="margin-bottom: 20px">
              <el-row style="margin-bottom: 30px">
                <el-col class="shop-name" :span="6">
                  {{ item.create_time }}</el-col
                >
                <el-col class="shop-name" :span="10"
                  ><i class="el-icon-goods"></i> {{ item.shop_name }}</el-col
                >
              </el-row>
              <div class="books">
                <el-row>
                  <el-col :span="19">
                    <el-row
                      v-for="(book, idx) in item.books"
                      :key="idx"
                      style="margin: 10px"
                    >
                      <el-col :span="2">
                        <img :src="book.book_image_b" style="height: 70px" />
                      </el-col>
                      <el-col :span="12">
                        <div style="margin-right: 30px" class="book-name">
                          {{ book.book_name }}
                        </div>
                        <div class="book-detail">作者：{{ book.author }}</div>
                        <div class="book-detail">出版社：{{ book.press }}</div>
                      </el-col>
                      <el-col :span="3">
                        <div style="margin: 25px 0">¥{{ book.price }}</div>
                      </el-col>
                      <el-col :span="2">
                        <div style="margin: 25px 0">
                          {{ book.number }}
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div style="margin: 25px 10px">
                          ￥{{ book.book_total_price }}
                        </div>
                      </el-col>
                      <el-col :span="1">
                        <div
                          style="margin-top: 15px"
                          v-if="item.status > 3 && book.return_status == -1"
                        >
                          <el-tooltip
                            content="确认收货七天之内可申请退款"
                            placement="bottom"
                            effect="light"
                          >
                            <el-button
                              type="text"
                              size="mini"
                              @click="
                                gotoRefund(book.order_book_id, item.firm_time)
                              "
                              >退款/退换货</el-button
                            >
                          </el-tooltip>
                        </div>
                        <div
                          style="margin-top: 15px"
                          v-if="item.status > 3 && book.return_status == 0"
                        >
                          <el-button type="text" disabled size="mini"
                            >退款/退换货</el-button
                          >
                        </div>
                        <div
                          style="margin-top: 15px"
                          v-if="book.return_status > 0"
                        >
                          <el-button
                            type="text"
                            size="mini"
                            @click="
                              gotoService(
                                book.order_book_id,
                                book.return_status
                              )
                            "
                            >退款详情</el-button
                          >
                        </div>
                        <div>
                          <div
                            class="pay-name"
                            @click="gotoRemark(book.order_book_id)"
                            v-if="item.status == 5 && book.remark_status == 0"
                          >
                            评价
                          </div>
                          <div
                            class="pay-name"
                            disabled
                            v-if="item.status == 6 && book.remark_status == 1"
                          >
                            已评价
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="3" :offset="1">
                    <el-row style="margin-top: 30px">
                      <el-col :span="18">
                        <div style="margin-bottom: 5px">
                          <div class="status-name" v-if="item.status == 1">
                            已取消
                          </div>
                          <div class="status-name" v-if="item.status == 2">
                            未付款
                          </div>
                          <div class="status-name" v-if="item.status == 3">
                            买家已付款
                          </div>
                          <div class="status-name" v-if="item.status == 4">
                            卖家已发货
                          </div>
                          <div class="status-name" v-if="item.status == 5">
                            交易成功
                          </div>
                          <el-button
                            type="text"
                            size="mini"
                            @click="gotoOrderDetail(item.order_id)"
                          >
                            订单详情
                          </el-button>
                        </div>
                      </el-col>
                      <el-col :span="6">
                        <div style="margin-bottom: 5px">
                          <div
                            class="pay-name"
                            v-if="item.status == 2"
                            @click="allOrderPay(item.order_id, item.total)"
                          >
                            付款
                          </div>
                          <el-button
                            v-if="item.status == 2"
                            type="text"
                            size="mini"
                            style="margin: 0"
                            @click="cancelOrder(item.order_id)"
                            >取消订单</el-button
                          >
                          <el-button
                            type="text"
                            size="mini"
                            v-if="item.status == 3"
                            >提醒卖家发货
                          </el-button>
                          <el-button
                            type="text"
                            size="mini"
                            v-if="item.status == 4"
                            >确认收货
                          </el-button>
                        </div>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </div>
          <div style="display: flex; justify-content: center">
            <el-pagination
              layout="prev, pager, next"
              :current-page="searchCurrent"
              :page-size="5"
              :page-count="searchTotal"
              @current-change="searchChange"
            >
            </el-pagination>
          </div>
        </el-col>
        <el-col
          :span="20"
          style="margin-left: 10px"
          v-if="orderNum == 0 && searchTotal == 0"
        >
          <el-row
            ><el-col :offset="9"
              ><img
                src="../assets/empty_grey.png"
                style="height: 220px; margin: 50px" /></el-col
          ></el-row>
          <el-row
            ><el-col :offset="11"
              ><p style="margin-left: 0px; color: grey">
                没有搜索到任何订单哦~
              </p></el-col
            ></el-row
          >
        </el-col>
        <el-col
          :span="20"
          style="margin-left: 10px"
          v-if="orderNum == 1 && allOrderTotal != 0"
        >
          <el-card class="header-card">
            <el-row>
              <el-col :span="10" :offset="1" class="table-header-item"
                >商品信息</el-col
              >
              <el-col :span="2" class="table-header-item">单价</el-col>
              <el-col :span="2" class="table-header-item">数量</el-col>
              <el-col :span="2" class="table-header-item">实付款</el-col>
              <el-col :span="3" class="table-header-item">商品操作</el-col>
              <el-col :span="2" class="table-header-item">交易状态</el-col>
              <el-col :span="2" class="table-header-item">操作</el-col>
            </el-row>
          </el-card>
          <div v-for="(item, index) in this.allOrderList" :key="index">
            <el-card style="margin-bottom: 20px">
              <el-row style="margin-bottom: 30px">
                <el-col class="shop-name" :span="6">
                  {{ item.create_time }}</el-col
                >
                <el-col class="shop-name" :span="10"
                  ><i class="el-icon-goods"></i> {{ item.shop_name }}</el-col
                >
              </el-row>
              <div class="books">
                <el-row>
                  <el-col :span="19">
                    <el-row
                      v-for="(book, idx) in item.books"
                      :key="idx"
                      style="margin: 10px"
                    >
                      <el-col :span="2">
                        <img :src="book.book_image_b" style="height: 70px" />
                      </el-col>
                      <el-col :span="12">
                        <div style="margin-right: 30px" class="book-name">
                          {{ book.book_name }}
                        </div>
                        <div class="book-detail">作者：{{ book.author }}</div>
                        <div class="book-detail">出版社：{{ book.press }}</div>
                      </el-col>
                      <el-col :span="3">
                        <div style="margin: 25px 0">¥{{ book.price }}</div>
                      </el-col>
                      <el-col :span="2">
                        <div style="margin: 25px 0">
                          {{ book.number }}
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div style="margin: 25px 10px">
                          ￥{{ book.book_total_price }}
                        </div>
                      </el-col>
                      <el-col :span="1">
                        <div
                          style="margin-top: 15px"
                          v-if="item.status > 3 && book.return_status == -1"
                        >
                          <el-tooltip
                            content="确认收货七天之内可申请退款"
                            placement="bottom"
                            effect="light"
                          >
                            <el-button
                              type="text"
                              size="mini"
                              @click="
                                gotoRefund(book.order_book_id, item.firm_time)
                              "
                              >退款/退换货</el-button
                            >
                          </el-tooltip>
                        </div>
                        <div
                          style="margin-top: 15px"
                          v-if="item.status > 3 && book.return_status == 0"
                        >
                          <el-button type="text" disabled size="mini"
                            >退款/退换货</el-button
                          >
                        </div>
                        <div
                          style="margin-top: 15px"
                          v-if="book.return_status > 0"
                        >
                          <el-button
                            type="text"
                            size="mini"
                            @click="
                              gotoService(
                                book.order_book_id,
                                book.return_status
                              )
                            "
                            >退款详情</el-button
                          >
                        </div>
                        <div>
                          <el-button
                            type="text"
                            size="mini"
                            @click="gotoRemark(book.order_book_id)"
                            v-if="item.status == 5 && book.remark_status == 0"
                          >
                            评价
                          </el-button>
                          <el-button
                            type="text"
                            size="mini"
                            disabled
                            v-if="item.status == 6 && book.remark_status == 1"
                          >
                            已评价
                          </el-button>
                        </div>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="3" :offset="1">
                    <el-row style="margin-top: 30px">
                      <el-col :span="18">
                        <div style="margin-bottom: 5px">
                          <div class="status-name" v-if="item.status == 1">
                            已取消
                          </div>
                          <div class="status-name" v-if="item.status == 2">
                            未付款
                          </div>
                          <div class="status-name" v-if="item.status == 3">
                            买家已付款
                          </div>
                          <div class="status-name" v-if="item.status == 4">
                            卖家已发货
                          </div>
                          <div class="status-name" v-if="item.status == 5">
                            交易成功
                          </div>
                          <el-button
                            type="text"
                            size="mini"
                            @click="gotoOrderDetail(item.order_id)"
                          >
                            订单详情
                          </el-button>
                        </div>
                      </el-col>
                      <el-col :span="6">
                        <div style="margin-bottom: 5px">
                          <el-button
                            type="text"
                            size="mini"
                            v-if="item.status == 2"
                            @click="allOrderPay(item.order_id, item.total)"
                          >
                            付款
                          </el-button>
                          <el-button
                            v-if="item.status == 2"
                            type="text"
                            size="mini"
                            style="margin: 0"
                            @click="cancelOrder(item.order_id)"
                            >取消订单</el-button
                          >
                          <el-button
                            type="text"
                            size="mini"
                            v-if="item.status == 3"
                            >提醒卖家发货
                          </el-button>
                          <el-button
                            type="text"
                            size="mini"
                            v-if="item.status == 4"
                            >确认收货
                          </el-button>
                        </div>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </div>
          <div style="display: flex; justify-content: center">
            <el-pagination
              layout="prev, pager, next"
              :current-page="allOrderCurrent"
              :page-size="5"
              :page-count="allOrderTotal"
              @current-change="allOrderChange"
            >
            </el-pagination>
          </div>
        </el-col>
        <el-col
          :span="20"
          style="margin-left: 10px"
          v-if="orderNum == 1 && allOrderTotal == 0"
        >
          <el-row
            ><el-col :offset="9"
              ><img
                src="../assets/empty_grey.png"
                style="height: 220px; margin: 50px" /></el-col
          ></el-row>
          <el-row
            ><el-col :offset="11"
              ><p style="margin-left: 0px; color: grey">
                还没有任何订单哦~
              </p></el-col
            ></el-row
          >
        </el-col>
        <el-col
          :span="20"
          style="margin-left: 10px"
          v-if="orderNum == 2 && daifukuanTotal != 0"
        >
          <el-card class="header-card">
            <el-row>
              <el-col :span="10" :offset="1" class="table-header-item"
                >商品信息</el-col
              >
              <el-col :span="2" class="table-header-item">单价</el-col>
              <el-col :span="2" class="table-header-item">数量</el-col>
              <el-col :span="2" class="table-header-item">实付款</el-col>
              <el-col :span="3" class="table-header-item">商品操作</el-col>
              <el-col :span="2" class="table-header-item">交易状态</el-col>
              <el-col :span="2" class="table-header-item">操作</el-col>
            </el-row>
          </el-card>
          <div v-for="(item, index) in this.daifukuanList" :key="index">
            <el-card style="margin-bottom: 20px">
              <el-row style="margin-bottom: 30px">
                <el-col class="shop-name" :span="6">
                  {{ item.create_time }}</el-col
                >
                <el-col class="shop-name" :span="10"
                  ><i class="el-icon-goods"></i> {{ item.shop_name }}</el-col
                >
              </el-row>
              <div class="books">
                <el-row>
                  <el-col :span="19">
                    <el-row
                      v-for="(book, idx) in item.books"
                      :key="idx"
                      style="margin: 10px"
                    >
                      <el-col :span="2">
                        <img :src="book.book_image_b" style="height: 70px" />
                      </el-col>
                      <el-col :span="12">
                        <div style="margin-right: 30px" class="book-name">
                          {{ book.book_name }}
                        </div>
                        <div class="book-detail">作者：{{ book.author }}</div>
                        <div class="book-detail">出版社：{{ book.press }}</div>
                      </el-col>
                      <el-col :span="3">
                        <div style="margin: 25px 0">¥{{ book.price }}</div>
                      </el-col>
                      <el-col :span="2">
                        <div style="margin: 25px 0">
                          {{ book.number }}
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div style="margin: 25px 10px">
                          ￥{{ book.book_total_price }}
                        </div>
                      </el-col>
                      <el-col :span="1"> </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="3" :offset="1">
                    <el-row style="margin-top: 30px">
                      <el-col :span="18">
                        <div style="margin-bottom: 5px">
                          <div class="status-name">未付款</div>
                          <el-button
                            type="text"
                            size="mini"
                            @click="gotoOrderDetail(item.order_id)"
                          >
                            订单详情
                          </el-button>
                        </div>
                      </el-col>
                      <el-col :span="6">
                        <div>
                          <el-button
                            type="text"
                            size="mini"
                            @click="allOrderPay(item.order_id, item.total)"
                          >
                            付款
                          </el-button>
                          <el-button
                            v-if="item.status == 2"
                            type="text"
                            size="mini"
                            style="margin: 0"
                            @click="cancelOrder(item.order_id)"
                            >取消订单</el-button
                          >
                        </div>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </div>
          <div style="display: flex; justify-content: center">
            <el-pagination
              layout="prev, pager, next"
              :current-page="daifukuanCurrent"
              :page-size="5"
              :page-count="daifukuanTotal"
              @current-change="daifukuanChange"
            >
            </el-pagination>
          </div>
        </el-col>
        <el-col
          :span="20"
          style="margin-left: 10px"
          v-if="orderNum == 2 && daifukuanTotal == 0"
        >
          <el-row
            ><el-col :offset="9"
              ><img
                src="../assets/empty_grey.png"
                style="height: 220px; margin: 50px" /></el-col
          ></el-row>
          <el-row
            ><el-col :offset="11"
              ><p style="margin-left: 0px; color: grey">
                还没有任何订单哦~
              </p></el-col
            ></el-row
          >
        </el-col>
        <el-col
          :span="20"
          style="margin-left: 10px"
          v-if="orderNum == 3 && daifahuoTotal != 0"
        >
          <el-card class="header-card">
            <el-row>
              <el-col :span="10" :offset="1" class="table-header-item"
                >商品信息</el-col
              >
              <el-col :span="2" class="table-header-item">单价</el-col>
              <el-col :span="2" class="table-header-item">数量</el-col>
              <el-col :span="2" class="table-header-item">实付款</el-col>
              <el-col :span="3" class="table-header-item">商品操作</el-col>
              <el-col :span="2" class="table-header-item">交易状态</el-col>
              <el-col :span="2" class="table-header-item">操作</el-col>
            </el-row>
          </el-card>
          <div v-for="(item, index) in this.daifahuoList" :key="index">
            <el-card style="margin-bottom: 20px">
              <el-row style="margin-bottom: 30px">
                <el-col class="shop-name" :span="6">
                  {{ item.create_time }}</el-col
                >
                <el-col class="shop-name" :span="10"
                  ><i class="el-icon-goods"></i> {{ item.shop_name }}</el-col
                >
              </el-row>
              <div class="books">
                <el-row>
                  <el-col :span="19">
                    <el-row
                      v-for="(book, idx) in item.books"
                      :key="idx"
                      style="margin: 10px"
                    >
                      <el-col :span="2">
                        <img :src="book.book_image_b" style="height: 70px" />
                      </el-col>
                      <el-col :span="12">
                        <div style="margin-right: 30px" class="book-name">
                          {{ book.book_name }}
                        </div>
                        <div class="book-detail">作者：{{ book.author }}</div>
                        <div class="book-detail">出版社：{{ book.press }}</div>
                      </el-col>
                      <el-col :span="3">
                        <div style="margin: 25px 0">¥{{ book.price }}</div>
                      </el-col>
                      <el-col :span="2">
                        <div style="margin: 25px 0">
                          {{ book.number }}
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div style="margin: 25px 10px">
                          ￥{{ book.book_total_price }}
                        </div>
                      </el-col>
                      <el-col :span="1">
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="3" :offset="1">
                    <el-row style="margin-top: 30px">
                      <el-col :span="18">
                        <div style="margin-bottom: 5px">
                          <div class="status-name">买家已付款</div>
                          <el-button
                            type="text"
                            size="mini"
                            @click="gotoOrderDetail(item.order_id)"
                          >
                            订单详情
                          </el-button>
                        </div>
                      </el-col>
                      <el-col :span="6">
                        <div >
                          <el-button type="text" size="mini"
                            >提醒卖家发货
                          </el-button>
                        </div>
                        <el-button
                            type="text"
                            size="mini"
                            style="margin: 0"
                            @click="cancelOrder(item.order_id)"
                            >取消订单</el-button
                          >
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </div>
          <div style="display: flex; justify-content: center">
            <el-pagination
              layout="prev, pager, next"
              :current-page="daifahuoCurrent"
              :page-size="5"
              :page-count="daifahuoTotal"
              @current-change="daifahuoChange"
            >
            </el-pagination>
          </div>
        </el-col>
        <el-col
          :span="20"
          style="margin-left: 10px"
          v-if="orderNum == 3 && daifahuoTotal == 0"
        >
          <el-row
            ><el-col :offset="9"
              ><img
                src="../assets/empty_grey.png"
                style="height: 220px; margin: 50px" /></el-col
          ></el-row>
          <el-row
            ><el-col :offset="11"
              ><p style="margin-left: 0px; color: grey">
                还没有任何订单哦~
              </p></el-col
            ></el-row
          >
        </el-col>
        <el-col
          :span="20"
          style="margin-left: 10px"
          v-if="orderNum == 4 && daishouhuoTotal != 0"
        >
          <el-card class="header-card">
            <el-row>
              <el-col :span="10" :offset="1" class="table-header-item"
                >商品信息</el-col
              >
              <el-col :span="2" class="table-header-item">单价</el-col>
              <el-col :span="2" class="table-header-item">数量</el-col>
              <el-col :span="2" class="table-header-item">实付款</el-col>
              <el-col :span="3" class="table-header-item">商品操作</el-col>
              <el-col :span="2" class="table-header-item">交易状态</el-col>
              <el-col :span="2" class="table-header-item">操作</el-col>
            </el-row>
          </el-card>
          <div v-for="(item, index) in this.daishouhuoList" :key="index">
            <el-card style="margin-bottom: 20px">
              <el-row style="margin-bottom: 30px">
                <el-col class="shop-name" :span="6">
                  {{ item.create_time }}</el-col
                >
                <el-col class="shop-name" :span="10"
                  ><i class="el-icon-goods"></i> {{ item.shop_name }}</el-col
                >
              </el-row>
              <div class="books">
                <el-row>
                  <el-col :span="19">
                    <el-row
                      v-for="(book, idx) in item.books"
                      :key="idx"
                      style="margin: 10px"
                    >
                      <el-col :span="2">
                        <img :src="book.book_image_b" style="height: 70px" />
                      </el-col>
                      <el-col :span="12">
                        <div style="margin-right: 30px" class="book-name">
                          {{ book.book_name }}
                        </div>
                        <div class="book-detail">作者：{{ book.author }}</div>
                        <div class="book-detail">出版社：{{ book.press }}</div>
                      </el-col>
                      <el-col :span="3">
                        <div style="margin: 25px 0">¥{{ book.price }}</div>
                      </el-col>
                      <el-col :span="2">
                        <div style="margin: 25px 0">
                          {{ book.number }}
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div style="margin: 25px 10px">
                          ￥{{ book.book_total_price }}
                        </div>
                      </el-col>
                      <el-col :span="1">
                        <div
                          style="margin-top: 15px"
                          v-if="item.status >= 3 && book.return_status == -1"
                        >
                          <el-tooltip
                            content="确认收货七天之内可申请退款"
                            placement="bottom"
                            effect="light"
                          >
                            <el-button
                              type="text"
                              size="mini"
                              @click="
                                gotoRefund(book.order_book_id, item.firm_time)
                              "
                              >退款/退换货</el-button
                            >
                          </el-tooltip>
                        </div>
                        <div
                          style="margin-top: 15px"
                          v-if="item.status >= 3 && book.return_status == 0"
                        >
                          <el-button type="text" disabled size="mini"
                            >退款/退换货</el-button
                          >
                        </div>
                        <div
                          style="margin-top: 15px"
                          v-if="book.return_status > 0"
                        >
                          <el-button
                            type="text"
                            size="mini"
                            @click="
                              gotoService(
                                book.order_book_id,
                                book.return_status
                              )
                            "
                            >退款详情</el-button
                          >
                        </div>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="3" :offset="1">
                    <el-row style="margin-top: 30px">
                      <el-col :span="18">
                        <div style="margin-bottom: 5px">
                          <div class="status-name">卖家已发货</div>
                          <el-button
                            type="text"
                            size="mini"
                            @click="gotoOrderDetail(item.order_id)"
                          >
                            订单详情
                          </el-button>
                        </div>
                      </el-col>
                      <el-col :span="6">
                        <div style="margin-bottom: 5px">
                          <el-button
                            type="text"
                            size="mini"
                            @click="confirmReceive(item.order_id)"
                            >确认收货
                          </el-button>
                        </div>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </div>
          <div style="display: flex; justify-content: center">
            <el-pagination
              layout="prev, pager, next"
              :current-page="daishouhuoCurrent"
              :page-size="5"
              :page-count="daishouhuoTotal"
              @current-change="daishouhuoChange"
            >
            </el-pagination>
          </div>
        </el-col>
        <el-col
          :span="20"
          style="margin-left: 10px"
          v-if="orderNum == 4 && daishouhuoTotal == 0"
        >
          <el-row
            ><el-col :offset="9"
              ><img
                src="../assets/empty_grey.png"
                style="height: 220px; margin: 50px" /></el-col
          ></el-row>
          <el-row
            ><el-col :offset="11"
              ><p style="margin-left: 0px; color: grey">
                还没有任何订单哦~
              </p></el-col
            ></el-row
          >
        </el-col>
        <el-col
          :span="20"
          style="margin-left: 10px"
          v-if="orderNum == 5 && daipingjiaTotal != 0"
        >
          <el-card class="header-card">
            <el-row>
              <el-col :span="10" :offset="1" class="table-header-item"
                >商品信息</el-col
              >
              <el-col :span="2" class="table-header-item">单价</el-col>
              <el-col :span="2" class="table-header-item">数量</el-col>
              <el-col :span="2" class="table-header-item">实付款</el-col>
              <el-col :span="3" class="table-header-item">商品操作</el-col>
              <el-col :span="2" class="table-header-item">交易状态</el-col>
              <el-col :span="2" class="table-header-item">操作</el-col>
            </el-row>
          </el-card>
          <div v-for="(item, index) in this.daipingjiaList" :key="index">
            <el-card style="margin-bottom: 20px">
              <el-row style="margin-bottom: 30px">
                <el-col class="shop-name" :span="10">
                  {{ item.create_time }}</el-col
                >
                <el-col class="shop-name" :span="6"
                  ><i class="el-icon-goods"></i> {{ item.shop_name }}</el-col
                >
              </el-row>
              <div class="books">
                <el-row>
                  <el-col :span="19">
                    <el-row
                      v-for="(book, idx) in item.books"
                      :key="idx"
                      style="margin: 10px"
                    >
                      <el-col :span="2">
                        <img :src="book.book_image_b" style="height: 70px" />
                      </el-col>
                      <el-col :span="12">
                        <div style="margin-right: 30px" class="book-name">
                          {{ book.book_name }}
                        </div>
                        <div class="book-detail">作者：{{ book.author }}</div>
                        <div class="book-detail">出版社：{{ book.press }}</div>
                      </el-col>
                      <el-col :span="3">
                        <div style="margin: 25px 0">¥{{ book.price }}</div>
                      </el-col>
                      <el-col :span="2">
                        <div style="margin: 25px 0">
                          {{ book.number }}
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div style="margin: 25px 10px">
                          ￥{{ book.book_total_price }}
                        </div>
                      </el-col>
                      <el-col :span="1">
                        <div
                          style="margin-top: 15px"
                          v-if="item.status >= 3 && book.return_status == -1"
                        >
                          <el-tooltip
                            content="确认收货七天之内可申请退款"
                            placement="bottom"
                            effect="light"
                          >
                            <el-button
                              type="text"
                              size="mini"
                              @click="
                                gotoRefund(book.order_book_id, item.firm_time)
                              "
                              >退款/退换货</el-button
                            >
                          </el-tooltip>
                        </div>
                        <div
                          style="margin-top: 15px"
                          v-if="item.status >= 3 && book.return_status == 0"
                        >
                          <el-button type="text" disabled size="mini"
                            >退款/退换货</el-button
                          >
                        </div>
                        <div
                          style="margin-top: 15px"
                          v-if="book.return_status > 0"
                        >
                          <el-button
                            type="text"
                            size="mini"
                            @click="
                              gotoService(
                                book.order_book_id,
                                book.return_status
                              )
                            "
                            >退款详情</el-button
                          >
                        </div>
                        <div>
                          <div
                            class="pay-name"
                            @click="gotoRemark(book.order_book_id)"
                            v-if="book.remark_status == 0"
                          >
                            评价
                          </div>
                          <div
                            class="pay-name"
                            disabled
                            v-if="book.remark_status == 1"
                          >
                            已评价
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="3" :offset="1">
                    <el-row style="margin-top: 30px">
                      <el-col :span="18">
                        <div style="margin-bottom: 5px">
                          <div class="status-name">交易成功</div>
                          <el-button
                            type="text"
                            size="mini"
                            @click="gotoOrderDetail(item.order_id)"
                          >
                            订单详情
                          </el-button>
                        </div>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </div>
          <div style="display: flex; justify-content: center">
            <el-pagination
              layout="prev, pager, next"
              :current-page="daipingjiaCurrent"
              :page-size="5"
              :page-count="daipingjiaTotal"
              @current-change="daipingjiaChange"
            >
            </el-pagination>
          </div>
        </el-col>
        <el-col
          :span="20"
          style="margin-left: 10px"
          v-if="orderNum == 5 && daipingjiaTotal == 0"
        >
          <el-row
            ><el-col :offset="9"
              ><img
                src="../assets/empty_grey.png"
                style="height: 220px; margin: 50px" /></el-col
          ></el-row>
          <el-row
            ><el-col :offset="11"
              ><p style="margin-left: 0px; color: grey">
                还没有任何订单哦~
              </p></el-col
            ></el-row
          >
        </el-col>
        <el-col
          :span="20"
          style="margin-left: 10px"
          v-if="orderNum == 6 && tuikuanTotal != 0"
        >
          <el-card class="header-card">
            <el-row>
              <el-col :span="10" :offset="1" class="table-header-item"
                >商品信息</el-col
              >
              <el-col :span="2" class="table-header-item">单价</el-col>
              <el-col :span="2" class="table-header-item">数量</el-col>
              <el-col :span="2" class="table-header-item">实付款</el-col>
              <el-col :span="3" class="table-header-item">商品操作</el-col>
              <el-col :span="2" class="table-header-item">交易状态</el-col>
              <el-col :span="2" class="table-header-item">操作</el-col>
            </el-row>
          </el-card>
          <div v-for="(item, index) in this.tuikuanList" :key="index">
            <el-card style="margin-bottom: 20px">
              <el-row style="margin-bottom: 30px">
                <el-col class="shop-name" :span="6">
                  {{ item.books.create_time }}</el-col
                >
                <el-col class="shop-name" :span="10"
                  ><i class="el-icon-goods"></i> {{ item.shop_name }}</el-col
                >
              </el-row>
              <div class="books">
                <el-row>
                  <el-col :span="19">
                    <el-row style="margin: 10px">
                      <el-col :span="2">
                        <img :src="item.books.image_b" style="height: 70px" />
                      </el-col>
                      <el-col :span="12">
                        <div style="margin-right: 30px" class="book-name">
                          {{ item.books.book_name }}
                        </div>
                        <div class="book-detail">
                          作者：{{ item.books.author }}
                        </div>
                        <div class="book-detail">
                          出版社：{{ item.books.press }}
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div style="margin: 25px 0">
                          ¥{{ item.books.price }}
                        </div>
                      </el-col>
                      <el-col :span="2">
                        <div style="margin: 25px 0">
                          {{ item.number }}
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div style="margin: 25px 10px">
                          ￥{{ item.books.price }}
                        </div>
                      </el-col>
                      <el-col :span="1">
                        <div style="margin-top: 15px">
                          <el-button
                            type="text"
                            size="mini"
                            @click="
                              gotoService(
                                item.order_book_id,
                                item.return_status
                              )
                            "
                            >退款详情</el-button
                          >
                        </div>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="3" :offset="1">
                    <el-row style="margin-top: 30px">
                      <el-col :span="18">
                        <div style="margin-bottom: 5px">
                          <div class="status-name" v-if="item.status == 1">
                            已取消
                          </div>
                          <div class="status-name" v-if="item.status == 2">
                            未付款
                          </div>
                          <div class="status-name" v-if="item.status == 3">
                            买家已付款
                          </div>
                          <div class="status-name" v-if="item.status == 4">
                            卖家已发货
                          </div>
                          <div class="status-name" v-if="item.status == 5">
                            交易成功
                          </div>

                          <el-button
                            type="text"
                            size="mini"
                            @click="gotoOrderDetail(item.order_id)"
                          >
                            订单详情
                          </el-button>
                        </div>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </div>
        </el-col>
        <el-col
          :span="20"
          style="margin-left: 10px"
          v-if="orderNum == 6 && tuikuanTotal == 0"
        >
          <el-row
            ><el-col :offset="9"
              ><img
                src="../assets/empty_grey.png"
                style="height: 220px; margin: 50px" /></el-col
          ></el-row>
          <el-row
            ><el-col :offset="11"
              ><p style="margin-left: 0px; color: grey">
                还没有退款退货任何订单哦~
              </p></el-col
            ></el-row
          >
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { Message } from "element-ui";
export default {
  data() {
    return {
      isLoading: false,
      orderNum: this.$route.params.orderId,
      serviceId: "",
      searchInput: "",
      searchCurrent: 1,
      searchTotal: 1,
      searchReturn: true,
      searchList: [
        {
          order_id: "",
          shop_name: "",
          create_time: "",
          status: "",
          total: "",
          books: [
            {
              remark_status: "",
              return_status: "",
              order_book_id: "",
              book_image_b: "",
              book_name: "",
              author: "",
              press: "",
              price: "",
              number: "",
              book_total_price: "",
            },
          ],
        },
      ],
      allOrderCurrent: 1,
      allOrderTotal: 1,
      allOrderReturn: true,
      allOrderList: [
        {
          order_id: "",
          shop_name: "",
          create_time: "",
          status: "",
          total: "",
          books: [
            {
              remark_status: "",
              return_status: "",
              order_book_id: "",
              book_image_b: "",
              book_name: "",
              author: "",
              press: "",
              price: "",
              number: "",
              book_total_price: "",
            },
          ],
        },
      ],
      daifukuanCurrent: 1,
      daifukuanTotal: 1,
      daifukuanList: [
        {
          order_id: "",
          shop_name: "",
          create_time: "",
          status: "",
          books: [
            {
              remark_status: "",
              return_status: "",
              order_book_id: "",
              book_image_b: "",
              book_name: "",
              author: "",
              press: "",
              price: "",
              number: "",
              book_total_price: "",
            },
          ],
        },
      ],
      daifahuoCurrent: 1,
      daifahuoTotal: 1,
      daifahuoReturn: true,
      daifahuoList: [
        {
          order_id: "",
          shop_name: "",
          create_time: "",
          status: "",
          books: [
            {
              remark_status: "",
              return_status: "",
              order_book_id: "",
              book_image_b: "",
              book_name: "",
              author: "",
              press: "",
              price: "",
              number: "",
              book_total_price: "",
            },
          ],
        },
      ],
      daishouhuoCurrent: 1,
      daishouhuoTotal: 1,
      daishouhuoReturn: true,
      daishouhuoList: [
        {
          order_id: "",
          shop_name: "",
          create_time: "",
          status: "",
          books: [
            {
              remark_status: "",
              return_status: "",
              order_book_id: "",
              book_image_b: "",
              book_name: "",
              author: "",
              press: "",
              price: "",
              number: "",
              book_total_price: "",
            },
          ],
        },
      ],
      daipingjiaCurrent: 1,
      daipingjiaTotal: 1,
      daipingjiaReturn: true,
      daipingjiaList: [
        {
          order_id: "",
          shop_name: "",
          create_time: "",
          status: "",
          books: [
            {
              remark_status: "",
              return_status: "",
              order_book_id: "",
              book_image_b: "",
              book_name: "",
              author: "",
              press: "",
              price: "",
              number: "",
              book_total_price: "",
            },
          ],
        },
      ],
      tuikuanCurrent: 1,
      tuikuanTotal: 1,
      tuikuanReturn: true,
      tuikuanList: [
        {
          books: {
            remark_status: "",
            return_status: "",
            order_book_id: "",
            book_image_b: "",
            book_name: "",
            author: "",
            press: "",
            price: "",
            number: "",
            book_total_price: "",
          },
        },
      ],
    };
  },
  computed: {},
  methods: {
    //返回个人主页
    toUser() {
      this.$router.push("/person");
    },
    gotoOrderDetail(e) {
      this.$router.push("/orderDetail/" + e);
    },
    gotoRefund(id, time) {
      axios({
        url: this.$store.state.yuming + "/order/compareTime",
        method: "POST",
        params: {
          firm_time: time,
        },
      }).then((res) => {
        const { code, data } = res.data;
        if (code == "200") {
          if (data == 0) {
            this.allOrderReturn = true;
            this.$router.push("/refund/" + id);
          } else {
            this.changeStatus(id);
            this.$message({
              message: "确认收货七天之后不可退款",
              type: "warning",
            });
            this.allOrderReturn = false;
          }
        } else {
          this.$message.error("出现错误，请重试");
        }
      });
    },
    //
    changeStatus(id) {
      axios({
        url: this.$store.state.yuming + "/order/updateReturnStatus",
        method: "POST",
        params: {
          order_book_id: id,
          return_status: 0,
        },
      }).then((res) => {
        const {code} = res.data;
        if (code == "200") {
        } else {
          this.$message.error("更新状态错误，请重试");
        }
      });
    },
    gotoRemark(e) {
      this.$router.push("/remark/" + e);
    },
    gotoService(id, status) {
      if (status == 1 || status == 2 || status == 3) {
        this.serviceId = 1;
        this.$router.push(`/service/${id}/${this.serviceId}`);
      }
      if (status == 4 || status == 5 || status == 6) {
        this.serviceId = 3;
        this.$router.push(`/service/${id}/${this.serviceId}`);
      }
      if (status == 7 || status == 8 || status == 9) {
        this.serviceId = 2;
        this.$router.push(`/service/${id}/${this.serviceId}`);
      }
    },
    allOrderMenu() {
      this.orderNum = "1";
    },
    daifukuanMenu() {
      this.orderNum = "2";
    },
    daifahuoMenu() {
      this.orderNum = "3";
    },
    daishouhuoMenu() {
      this.orderNum = "4";
    },
    daipingjiaMenu() {
      this.orderNum = "5";
    },
    tuikuanMenu() {
      this.orderNum = "6";
    },
    //模糊搜索
    async gotoSearch() {
      this.orderNum = "0";
      this.isLoading = true;
      await this.getSearch();
      await this.getSearchNum();
      this.isLoading = false;
    },
    //分页
    async searchChange(value) {
      this.searchCurrent = value;
      this.isLoading = true;
      await this.getSearch();
      this.isLoading = false;
    },
    //分页获取订单信息
    getSearch() {
      axios({
        url: this.$store.state.yuming + "/order/fuzzyQuery",
        method: "GET",
        params: {
          page_num: this.searchCurrent,
          order_num: 5,
          status: 0,
          content: this.searchInput,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.searchList = data;
          } else {
            this.$message.error("搜索失败，请重输");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //获取订单数目
    getSearchNum() {
      axios({
        url: this.$store.state.yuming + "/order/fuzzyQueryCount",
        method: "GET",
        params: {
          status: 0,
          content: this.searchInput,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.searchTotal = Math.ceil(data / 5);
          } else {
            this.$message.error("出现错误，请重试");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    //全部订单
    //分页
    async allOrderChange(value) {
      this.allOrderCurrent = value;
      this.isLoading = true;
      await this.getAllOrders();
      this.isLoading = false;
    },
    //分页获取订单信息
    getAllOrders() {
      axios({
        url: this.$store.state.yuming + "/getOrder",
        method: "GET",
        params: {
          page_num: this.allOrderCurrent,
          order_num: 5,
          status: 0,
          identity: 0,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.allOrderList = data;
          } else {
            this.$message.error("获取订单信息失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //获取订单数目
    getAllOrdersNum() {
      axios({
        url: this.$store.state.yuming + "/getOrderNum",
        method: "GET",
        params: {
          status: 0,
          identity: 0,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.allOrderTotal = Math.ceil(data / 5);
          } else {
            this.$message.error("获取全部订单数目失败");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    //待付款订单
    //分页
    async daifukuanChange(value) {
      this.daifukuanCurrent = value;
      this.isLoading = true;
      await this.getDaifukuan();
      this.isLoading = false;
    },
    //分页获取订单信息
    getDaifukuan() {
      axios({
        url: this.$store.state.yuming + "/getOrder",
        method: "GET",
        params: {
          page_num: this.daifukuanCurrent,
          order_num: 5,
          status: 2,
          identity: 0,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.daifukuanList = data;
          } else {
            this.$message.error("获取待付款订单信息失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //获取订单数目
    getDaifukuanNum() {
      axios({
        url: this.$store.state.yuming + "/getOrderNum",
        method: "GET",
        params: {
          status: 2,
          identity: 0,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.daifukuanTotal = Math.ceil(data / 5);
          } else {
            this.$message.error("获取待付款订单数目失败");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    //待发货订单
    //分页
    async daifahuoChange(value) {
      this.daifahuoCurrent = value;
      this.isLoading = true;
      await this.getDaifahuo();
      this.isLoading = false;
    },
    //分页获取订单信息
    getDaifahuo() {
      axios({
        url: this.$store.state.yuming + "/getOrder",
        method: "GET",
        params: {
          page_num: this.daifahuoCurrent,
          order_num: 5,
          status: 3,
          identity: 0,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.daifahuoList = data;
          } else {
            this.$message.error("获取待发货订单信息失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //获取订单数目
    getDaifahuoNum() {
      axios({
        url: this.$store.state.yuming + "/getOrderNum",
        method: "GET",
        params: {
          status: 3,
          identity: 0,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.daifahuoTotal = Math.ceil(data / 5);
          } else {
            this.$message.error("获取待发货订单数目失败");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    //待收货订单
    //分页
    async daishouhuoChange(value) {
      this.daishouhuoCurrent = value;
      this.isLoading = true;
      await this.getDaishouhuo();
      this.isLoading = false;
    },
    //分页获取订单信息
    getDaishouhuo() {
      axios({
        url: this.$store.state.yuming + "/getOrder",
        method: "GET",
        params: {
          page_num: this.allOrderCurrent,
          order_num: 5,
          status: 4,
          identity: 0,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.daishouhuoList = data;
          } else {
            this.$message.error("获取待收货订单信息失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //获取订单数目
    getDaishouhuoNum() {
      axios({
        url: this.$store.state.yuming + "/getOrderNum",
        method: "GET",
        params: {
          status: 4,
          identity: 0,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.daishouhuoTotal = Math.ceil(data / 5);
          } else {
            this.$message.error("获取全部订单数目失败");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    //待评价订单
    //分页
    async daipingjiaChange(value) {
      this.daipingjiaCurrent = value;
      this.isLoading = true;
      await this.getDaipingjia();
      this.isLoading = false;
    },
    //分页获取订单信息
    getDaipingjia() {
      axios({
        url: this.$store.state.yuming + "/getOrder",
        method: "GET",
        params: {
          page_num: this.daipingjiaCurrent,
          order_num: 5,
          status: 5,
          identity: 0,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.daipingjiaList = data;
          } else {
            this.$message.error("获取待评价订单信息失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //获取订单数目
    getDaipingjiaNum() {
      axios({
        url: this.$store.state.yuming + "/getOrderNum",
        method: "GET",
        params: {
          status: 5,
          identity: 0,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.daipingjiaTotal = Math.ceil(data / 5);
          } else {
            this.$message.error("获取待评价订单数目失败");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    //退款订单
    //分页
    async tuikuanChange(value) {
      this.tuikuanCurrent = value;
      this.isLoading = true;
      await this.getTukuan();
      this.isLoading = false;
    },
    //分页获取订单信息
    getTuikuan() {
      axios({
        url: this.$store.state.yuming + "/order/reback",
        method: "GET",
        params: {
          page_num: this.tuikuanCurrent,
          order_num: 5,
          status: 0,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.tuikuanList = data;
          } else {
            this.$message.error("获取退款退货订单信息失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //获取订单数目
    getTuikuanNum() {
      axios({
        url: this.$store.state.yuming + "/order/rebackCount",
        method: "GET",
        params: {
          status: 0,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.tuikuanTotal = Math.ceil(data / 5);
          } else {
            this.$message.error("获取退款退货订单数目失败");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    //付款
    allOrderPay(order_id, total) {
      //this.$router.push(`/pay/${order_id}/${total}`);
      axios({
        url: this.$store.state.yuming + "/alipay",
        method: "GET",
        params: {
          order_id: order_id,
          subject: "图书",
          total_amount: total,
          body: "",
        },
      }).then((res) => {
        //document.querySelector("body").innerHTML = res.data; //查找到当前页面的body，将后台返回的form替换掉他的内容
        //document.forms[0].setAttribute('target', '_blank')
        //document.forms[0].submit(); //执行submit表单提交，让页面重定向，跳转到支付宝页面
        // 添加之前先删除一下，如果单页面，页面不刷新，添加进去的内容会一直保留在页面中，二次调用form表单会出错
        let divForm = document.getElementsByTagName("divform");
        if (divForm.length) {
          document.body.removeChild(divForm[0]);
        }
        const div = document.createElement("divform");
        div.innerHTML = res.data; // data就是接口返回的form 表单字符串
        document.body.appendChild(div);
        document.forms[0].setAttribute("target", "_blank"); // 新开窗口跳转
        document.forms[0].submit();
        this.reloaded();
      });
    },
    //重新加载页面
    async reloaded() {
      this.isLoading = true;
      await this.getAllOrders();
      await this.getAllOrdersNum();
      await this.getDaifukuan();
      await this.getDaifukuanNum();
      await this.getDaifahuo();
      await this.getDaifahuoNum();
      await this.getDaishouhuo();
      await this.getDaishouhuoNum();
      await this.getDaipingjia();
      await this.getDaipingjiaNum();
      this.isLoading = false;
    },
    //取消订单
    cancelOrder(id) {
      axios({
        url: this.$store.state.yuming + "/order/cancel",
        method: "POST",
        params: {
          order_id: id,
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.$message({
              message: "取消订单成功",
              type: "success",
            });
            this.reloaded();
          } else {
            this.$message.error("取消失败，请重试");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    //确认收货
    confirmReceive(id) {
      axios({
        url: this.$store.state.yuming + "/order/firm",
        method: "POST",
        params: {
          order_id: id,
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.$message({
              message: "确认订单成功",
              type: "success",
            });
            this.reloaded();
          } else {
            this.$message.error("确认失败，请重试");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
  },
  async created() {
    this.isLoading = true;
    await this.getAllOrders();
    await this.getAllOrdersNum();
    await this.getDaifukuan();
    await this.getDaifukuanNum();
    await this.getDaifahuo();
    await this.getDaifahuoNum();
    await this.getDaishouhuo();
    await this.getDaishouhuoNum();
    await this.getDaipingjia();
    await this.getDaipingjiaNum();
    await this.getTuikuanNum();
    await this.getTuikuan();
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
.shop-name {
  font-size: 16px;
  font-weight: 600;
}
.book-name {
  font-size: 13px;
}
.status-name {
  font-size: 10px;
  color: rgb(221, 98, 98);
  font-weight: 400;
  margin-bottom: 7px;
  margin-top: 5px;
}
.action-name {
  font-size: 15px;
}
.book-detail {
  font-size: 13px;
  color: grey;
}
.books {
  background: rgb(255, 255, 255);
  color: #303133;
  /*border:1px solid rgb(201, 201, 201);*/
}
.header-card {
  height: 60px;
  margin-bottom: 10px;
}
.table-header-item {
  display: flex;
  align-items: center;
  font-size: 15px;
}
.pay-name {
  font-size: 10px;
  color: rgb(64, 158, 255);
}
</style>