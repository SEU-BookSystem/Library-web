<template>
  <div v-loading="isLoading">
    <div class="header">
      <div class="logo3">
        <img width="250px" src="../../assets/jwbc.png" />
      </div>
      <div class="title">店铺管理</div>
    </div>
    <div style="margin: 2% 10%">
      <el-page-header @back="goToManage" content="图书管理"></el-page-header>
    </div>
    <div style="margin: 2% 10%">
      <el-row style="margin: 0% 0% 5%">
        <el-card>
          <el-container>
            <el-aside
              style="width: 35px; padding-top: 10px; padding-bottom: 20px"
              ><div class="verticalBar1"></div
            ></el-aside>
            <el-main>
              <span style="font-weight: 1000">欢迎您，亲爱的店家 </span>
              <p style="font-weight: 1000">
                您可以在本页面进行图书管理，包括: 修改图书信息 新增图书 下架图书
              </p>
            </el-main>
          </el-container>
        </el-card>
      </el-row>
    </div>
    <div style="margin: 3% 10%">
      <el-card>
        <el-form label-width="120px">
          <el-form-item label="书名搜索：">
            <el-input
              v-model="searchText"
              placeholder="输入书名模糊搜索"
              @change="search(searchText)"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-table
          ref="multipleTable"
          :data="
            tableData
          "
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          v-loading="dataLoading"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="图片" width="130">
            <template slot-scope="scope"
              ><img :src="scope.row.image_b" class="imgStyle"
            /></template>
          </el-table-column>
          <el-table-column label="名称" width="120">
            <template slot-scope="scope">{{ scope.row.book_name }}</template>
          </el-table-column>
          <el-table-column label="作者" width="100">
            <template slot-scope="scope">{{ scope.row.author }}</template>
          </el-table-column>
          <el-table-column
            label="出版时间"
            width="100"
            :formatter="dateFormat"
            prop="print_time"
          >
          </el-table-column>
          <el-table-column label="出版社" width="120">
            <template slot-scope="scope">{{ scope.row.press }}</template>
          </el-table-column>
          <el-table-column label="一级分类" width="100">
            <template slot-scope="scope">{{
              scope.row.main_category
            }}</template>
          </el-table-column>
          <el-table-column label="二级分类" width="100">
            <template slot-scope="scope">{{
              scope.row.second_category
            }}</template>
          </el-table-column>
          <el-table-column label="单价" width="100">
            <template slot-scope="scope">{{ scope.row.price }}</template>
          </el-table-column>
          <el-table-column label="库存" width="100">
            <template slot-scope="scope">{{ scope.row.repertory }}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope"
              ><el-button
                type="text"
                style="font-size: 15px; width: 100%; text-align: left"
                @click="handleChange(scope.$index, scope.row)"
                >修改图书信息</el-button
              ><el-button
                type="text"
                style="
                  font-size: 15px;
                  margin-left: 0px;
                  width: 100%;
                  text-align: left;
                "
                @click="handleChangeBriefInfo(scope.$index, scope.row)"
                >修改图书简介</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-row style="text-align: center">
          <el-pagination
            :current-page="currentPage"
            @current-change="handleCurrentChange"
            :total="bookcount"
            layout="prev, pager, next, jumper"
          >
          </el-pagination>
        </el-row>
      </el-card>
    </div>
    <div style="margin: 1.5% 10% 3%">
      <el-button
        size="medium"
        type="primary"
        @click.native="dialogAddVisible = true"
        style="margin-left: 80%"
        >新增图书</el-button
      >
      <el-button size="medium" type="warning" @click.native="deleteBook()"
        >下架所选图书</el-button
      >
    </div>
    <div>
      <el-dialog
        title="修改图书信息"
        :visible.sync="dialogChangeVisible"
        width="60%"
        :before-close="handleClose"
        center
      >
        <el-form
          ref="lists1"
          :model="lists1"
          label-width="130px"
          :rules="rules"
        >
          <el-row>
            <el-col :span="11">
              <el-form-item label="图书图片：" prop="bookImg">
                <span
                  ><el-upload
                    class="avatar-uploader"
                    ref="upload"
                    action="http://47.94.131.208:8888"
                    :show-file-list="false"
                    :on-change="changePhotoFile"
                    :auto-upload="false"
                    :name="this.lists1.bookImg"
                  >
                    <img
                      v-if="lists1.bookImg"
                      :src="lists1.bookImg"
                      class="avatar"
                    />
                    <img v-else src="../../assets/avatar.jpg" class="avatar" />
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
                  ></my-cropper
                ></span>
              </el-form-item>
            </el-col>
            <el-col :span="1"><span>&emsp;</span></el-col>
            <el-col :span="11">
              <el-form-item label="图书出版时间：" prop="bookPubTime">
                <el-date-picker
                  v-model="lists1.bookPubTime"
                  type="date"
                  placeholder="选择出版时间"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            ><el-col :span="11">
              <el-form-item label="图书名称：" prop="bookName">
                <el-input v-model="lists1.bookName"></el-input>
              </el-form-item> </el-col
            ><el-col :span="1"><span>&emsp;</span></el-col
            ><el-col :span="11">
              <el-form-item label="图书作者：" prop="bookAuthor">
                <el-input v-model="lists1.bookAuthor"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="图书出版社：" prop="press">
                <el-input v-model="lists1.press"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="1"><span>&emsp;</span></el-col>
            <el-col :span="11">
              <el-form-item label="图书单价：" prop="bookPrice">
                <el-input v-model="lists1.bookPrice"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            ><el-col :span="11">
              <el-form-item label="图书一级分类：" prop="classOne">
                <el-select
                  v-model="lists1.classOne"
                  @change="change1"
                  placeholder="请选择图书一级分类"
                >
                  <el-option
                    v-for="option in categoryList"
                    :key="option.main_id"
                    :label="option.main_name"
                    :value="option.main_id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1"><span>&emsp;</span></el-col>
            <el-col :span="11">
              <el-form-item label="图书库存：" prop="Inventory">
                <el-input v-model.number="lists1.Inventory"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            ><el-col :span="11">
              <el-form-item label="图书二级分类：" prop="classTwo">
                <el-select
                  v-model="lists1.classTwo"
                  placeholder="请选择图书二级分类"
                  @change="change2"
                >
                  <el-option
                    v-for="option in categoryList[index2].second_category"
                    :key="option.second_id"
                    :label="option.second_name"
                    :value="option.second_id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel1">取 消</el-button>
          <el-button type="primary" @click="changeBook">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        title="新增图书"
        :visible.sync="dialogAddVisible"
        width="60%"
        :before-close="handleClose"
        center
      >
        <el-form
          ref="lists1"
          :model="lists1"
          label-width="130px"
          :rules="rules"
        >
          <el-row>
            <el-col :span="11">
              <el-form-item label="图书图片：" prop="bookImg">
                <span
                  ><el-upload
                    class="avatar-uploader"
                    ref="upload"
                    action="http://47.94.131.208:8888"
                    :show-file-list="false"
                    :on-change="changePhotoFile"
                    :auto-upload="false"
                    :name="this.lists1.bookImg"
                  >
                    <img
                      v-if="lists1.bookImg"
                      :src="lists1.bookImg"
                      class="avatar"
                    />
                    <img v-else src="../../assets/avatar.jpg" class="avatar" />
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
                  ></my-cropper
                ></span>
              </el-form-item>
            </el-col>
            <el-col :span="1"><span>&emsp;</span></el-col>
            <el-col :span="11">
              <el-form-item label="图书出版时间：" prop="bookPubTime">
                <el-date-picker
                  v-model="lists1.bookPubTime"
                  type="date"
                  placeholder="选择出版时间"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            ><el-col :span="11">
              <el-form-item label="图书名称：" prop="bookName">
                <el-input
                  v-model="lists1.bookName"
                ></el-input> </el-form-item></el-col
            ><el-col :span="1"><span>&emsp;</span></el-col>
            <el-col :span="11">
              <el-form-item label="图书作者：" prop="bookAuthor">
                <el-input v-model="lists1.bookAuthor"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="图书出版社：" prop="press">
                <el-input v-model="lists1.press"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="1"><span>&emsp;</span></el-col>
            <el-col :span="11">
              <el-form-item label="图书单价：" prop="bookPrice">
                <el-input v-model="lists1.bookPrice"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            ><el-col :span="11">
              <el-form-item label="图书一级分类：" prop="classOne">
                <el-select
                  v-model="lists1.classOne"
                  @change="change1"
                  placeholder="请选择图书一级分类"
                >
                  <el-option
                    v-for="option in categoryList"
                    :key="option.main_id"
                    :label="option.main_name"
                    :value="option.main_id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1"><span>&emsp;</span></el-col>
            <el-col :span="11">
              <el-form-item label="图书库存：" prop="Inventory">
                <el-input v-model.number="lists1.Inventory"></el-input>
              </el-form-item>
            </el-col> </el-row
          ><el-row
            ><el-col :span="11">
              <el-form-item label="图书二级分类：" prop="classTwo">
                <el-select
                  v-model="lists1.classTwo"
                  placeholder="请选择图书二级分类"
                  @change="change2"
                >
                  <el-option
                    v-for="option in categoryList[index2].second_category"
                    :key="option.second_id"
                    :label="option.second_name"
                    :value="option.second_id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel2">取 消</el-button>
          <el-button type="primary" @click="addBook('lists1')">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        title="图书简介"
        :visible.sync="dialogBriefVisible"
        width="60%"
        :before-close="handleClose"
        center
        ><el-input type="textarea" autosize v-model="briefInfo"></el-input
        ><span slot="footer" class="dialog-footer">
          <el-button @click="cancel3">取 消</el-button>
          <el-button type="primary" @click="changeBriefInfo">确 定</el-button>
        </span></el-dialog
      >
    </div>
  </div>
</template>
<script>
import MyCropper from "../cropper.vue";
import axios from "axios";
import { Message } from "element-ui";
import moment from "moment";
import qs from "qs";
export default {
  components: {
    MyCropper,
  },
  data() {
    return {
      book_id: [],
      searchText: "",
      isLoading: false,
      dataLoading: false,
      dialogChangeVisible: false,
      dialogAddVisible: false,
      dialogBriefVisible: false,
      itemKey: 0,
      index: 0,
      index2: 0,
      shop_id: "",
      briefInfo: "",
      currentPage: 1,
      bookcount: 0,
      value: [],
      categoryList: [
        {
          book_num: 0,
          main_name: "",
          main_id: "",
          second_category: [{ book_num: "", second_name: "", second_id: "" }],
        },
      ],
      tableData: [],
      lists1: {
        bookid: "",
        bookImg: "",
        bookName: "",
        bookAuthor: "",
        classOne: "",
        classOne_id: "",
        classTwo: "",
        classTwo_id: "",
        bookPrice: "",
        Inventory: "",
        bookPubTime: "",
        press: "",
      },
      multipleSelection: [],
      formdata: new FormData(),
      imgdata: new FormData(),
      briefdata: new FormData(),
      rules: {
        bookName: [
          {
            type: "string",
            required: true,
            message: "请输入书名",
            trigger: "blur",
          },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
        ],
        bookAuthor: [
          {
            type: "string",
            required: true,
            message: "请输入作者",
            trigger: "blur",
          },
        ],
        classOne: [
          {
            required: true,
            message: "请选择图书一级分类",
            trigger: "change",
          },
        ],
        classTwo: [
          {
            required: true,
            message: "请选择图书二级分类",
            trigger: "change",
          },
        ],
        bookPrice: [
          {
            required: true,
            pattern: /^\d+\.?\d{2,2}$/,
            message: "请输入正确的金额（具有两位小数）",
            trigger: "blur",
          },
        ],
        Inventory: [
          {
            type: "integer",
            required: true,
            message: "请输入书本库存",
            trigger: "blur",
          },
        ],
        bookPubTime: [
          {
            required: true,
            message: "请选择书本出版时间",
            trigger: "blur",
          },
        ],
        press: [
          {
            type: "string",
            required: true,
            message: "请输入出版社",
            trigger: "blur",
          },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
    };
  },
  computed: {
    hasUsername() {
      return this.$store.state.username;
    },
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
      if(this.searchText=="")
      this.getBook();
      else this.searchBook(this.searchText);
    },
    //时间格式化
    dateFormat(row, column) {
      var date = row[column.property];
      return moment(date).format("YYYY-MM-DD");
    },
    //回调一级分类的值
    change1(val) {
      this.lists1.classOne_id = val;
      for (let i = 0; i < this.categoryList.length; i++) {
        if (this.categoryList[i].main_id == val) {
          this.index2 = i;
        }
      }
    },
    //回调二级分类的值
    change2(val) {
      this.lists1.classTwo_id = val;
    },
    //前往店铺管理页
    goToManage() {
      this.$router.push("/shopManage#reloaded");
    },
    //模糊查询图书
    search(book_name) {
      this.currentPage = 1;
      this.searchBook(book_name);
    },
    searchBook(book_name) {
      axios({
        url: this.$store.state.yuming + "/book/fuzzyQuery",
        method: "GET",
        params: {
          page_num: this.currentPage,
          book_num: 10,
          style: 1,
          queryWhat: 1,
          content: book_name,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.tableData = data;
          } else {
            this.$message.error("查询图书失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
      //获取这些书的数目
      axios({
        url: this.$store.state.yuming + "/book/fuzzyQueryCount",
        method: "GET",
        params: {
          queryWhat: 1,
          content: book_name,
        },
      })
        .then((res) => {
          const { code, count } = res.data;
          if (code == "200") {
            this.bookcount = count;
          } else {
            this.$message.error("获取图书数目失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    //获取这家店铺里的书
    getBook() {
      axios({
        url: this.$store.state.yuming + "/book/getPage",
        method: "GET",
        params: {
          page_num: this.currentPage,
          book_num: 10,
          style: 2,
          main_category_id: "",
          second_category_id: "",
          year: "",
          year_before: "",
          year_after: "",
          shop_id: this.shop_id,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.tableData = data;
          } else {
            this.$message.error("获取新书信息失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
      //获取书的总数
      axios({
        url: this.$store.state.yuming + "/book/getPageCount",
        method: "GET",
        params: {
          main_category_id: "",
          second_category_id: "",
          year: "",
          year_before: "",
          year_after: "",
          shop_id: this.shop_id,
        },
      })
        .then((res) => {
          const { code, count } = res.data;
          if (code == "200") {
            this.bookcount = count;
          } else {
            this.$message.error("获取图书数目失败，请刷新");
          }
        })
        .catch(() => {
          this.$message.error("出现错误，请稍后再试");
        });
    },
    //修改图书信息时，获取这一行的初始信息
    handleChange(index) {
      this.lists1.bookid = this.tableData[index].id;
      this.lists1.bookImg = this.tableData[index].image_b;
      this.lists1.bookName = this.tableData[index].book_name;
      this.lists1.bookAuthor = this.tableData[index].author;
      this.lists1.classOne = this.tableData[index].main_category;
      this.lists1.classTwo = this.tableData[index].second_category;
      this.lists1.bookPrice = this.tableData[index].price;
      this.lists1.Inventory = this.tableData[index].repertory;
      this.lists1.bookPubTime = this.tableData[index].print_time;
      this.lists1.press = this.tableData[index].press;
      this.index = index;
      this.dialogChangeVisible = true;
    },
    //修改图书简介时，获取图书简介，之后修改
    handleChangeBriefInfo(index) {
      this.briefInfo = this.tableData[index].detail;
      this.briefdata.append("book_id", this.tableData[index].id);
      axios({
        url: this.$store.state.yuming + "/book/getDetail",
        method: "GET",
        params: {
          book_id: this.tableData[index].id,
        },
      }).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("获取图书简介成功");
        } else {
          this.$message.error("获取图书简介失败，请重试");
        }
      });
      this.index = index;
      this.dialogBriefVisible = true;
    },
    //修改图书简介
    changeBriefInfo() {
      this.briefdata.append("detail", this.briefInfo);
      axios({
        url: this.$store.state.yuming + "/shop/book/updateDetail",
        method: "POST",
        data: this.briefdata,
      }).then((res) => {
        if (res.data.code == 200) {
          this.dataLoading = true;
          this.getBook();
          this.dataLoading = false;
          this.$message({
            message: "修改图书简介成功",
            type: "success",
          });
          this.dialogBriefVisible = false;
          this.briefInfo = "";
          this.briefdata = new FormData();
        } else {
          this.$message.error("修改图书简介失败，请重试");
          this.formdata = new FormData();
        }
      });
    },
    //修改图书信息
    changeBook() {
      this.tableData[this.index].id = this.lists1.bookid;
      this.tableData[this.index].book_name = this.lists1.bookName;
      this.tableData[this.index].author = this.lists1.bookAuthor;
      this.tableData[this.index].main_category = this.lists1.classOne;
      this.tableData[this.index].main_category_id = this.lists1.classOne_id;
      this.tableData[this.index].second_category = this.lists1.classTwo;
      this.tableData[this.index].second_category_id = this.lists1.classTwo_id;
      this.tableData[this.index].price = this.lists1.bookPrice;
      this.tableData[this.index].repertory = this.lists1.Inventory;
      this.tableData[this.index].print_time = this.lists1.bookPubTime;
      this.tableData[this.index].press = this.lists1.press;
      this.formdata.append("book_id", this.lists1.bookid);
      this.formdata.append("book_name", this.lists1.bookName);
      this.formdata.append("author", this.lists1.bookAuthor);
      this.formdata.append("price", this.lists1.bookPrice);
      this.formdata.append("repertory", this.lists1.Inventory);
      this.formdata.append("press", this.lists1.press);
      this.formdata.append("print_time", this.lists1.bookPubTime);
      this.formdata.append("main_category_id", this.lists1.classOne_id);
      this.formdata.append("second_category_id", this.lists1.classTwo_id);
      this.formdata.append("shop_id", this.shop_id);
      this.formdata.append("edition", null);
      axios({
        url: this.$store.state.yuming + "/shop/book/updateBook",
        method: "POST",
        data: this.formdata,
      }).then((res) => {
        if (res.data.code == 200) {
          this.dataLoading = true;
          this.getBook();
          this.dataLoading = false;
          this.$message({
            message: "修改图书成功",
            type: "success",
          });
          this.dialogChangeVisible = false;
          this.lists1 = "";
          this.formdata = new FormData();
        } else {
          this.$message.error("修改图书失败，请重试");
          this.formdata = new FormData();
        }
      });
    },
    //添加图书
    addBook(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formdata.append("book_name", this.lists1.bookName);
          this.formdata.append("author", this.lists1.bookAuthor);
          this.formdata.append("price", this.lists1.bookPrice);
          this.formdata.append("repertory", this.lists1.Inventory);
          this.formdata.append("press", this.lists1.press);
          this.formdata.append("print_time", this.lists1.bookPubTime);
          this.formdata.append("main_category_id", this.lists1.classOne_id);
          this.formdata.append("second_category_id", this.lists1.classTwo_id);
          this.formdata.append("shop_id", this.shop_id);
          this.formdata.append("edition", null);
          axios({
            url: this.$store.state.yuming + "/shop/book/addBook",
            method: "POST",
            data: this.formdata,
          }).then((res) => {
            if (res.data.code == 200) {
              this.dataLoading = true;
              this.getBook();
              this.dataLoading = false;
              this.$message({
                message: "新增图书成功",
                type: "success",
              });
              this.dialogAddVisible = false;
              this.lists1.bookid = "";
              this.lists1.bookImg = "";
              this.lists1.bookName = "";
              this.lists1.bookAuthor = "";
              this.lists1.classOne = "";
              this.lists1.classOne_id = "";
              this.lists1.classTwo = "";
              this.lists1.classTwo_id = "";
              this.lists1.bookPrice = "";
              this.lists1.Inventory = "";
              this.lists1.bookPubTime = "";
              this.lists1.press = "";
              this.formdata = new FormData();
            } else {
              this.$message.error("新增图书失败，请重试");
              this.formdata = new FormData();
            }
          });
        } else {
          return false;
        }
      });
    },
    //取消修改图书时，进行清空
    cancel1() {
      this.dialogChangeVisible = false;
      this.lists1.bookid = "";
      this.lists1.bookImg = "";
      this.lists1.bookName = "";
      this.lists1.bookAuthor = "";
      this.lists1.classOne = "";
      this.lists1.classOne_id = "";
      this.lists1.classTwo = "";
      this.lists1.classTwo_id = "";
      this.lists1.bookPrice = "";
      this.lists1.Inventory = "";
      this.lists1.bookPubTime = "";
      this.lists1.press = "";
      this.formdata = new FormData();
    },
    //取消添加图书时，进行清空
    cancel2() {
      this.dialogAddVisible = false;
      this.lists1.bookid = "";
      this.lists1.bookImg = "";
      this.lists1.bookName = "";
      this.lists1.bookAuthor = "";
      this.lists1.classOne = "";
      this.lists1.classOne_id = "";
      this.lists1.classTwo = "";
      this.lists1.classTwo_id = "";
      this.lists1.bookPrice = "";
      this.lists1.Inventory = "";
      this.lists1.bookPubTime = "";
      this.lists1.press = "";
      this.formdata = new FormData();
    },
    //取消修改简介时，进行清空
    cancel3() {
      this.dialogBriefVisible = false;
      this.briefInfo = "";
      this.formdata = new FormData();
    },
    //下架所选图书
    deleteBook() {
      this.$confirm("是否下架所选图书?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.book_id.push(this.multipleSelection[i].id);
        }
        axios({
          url: this.$store.state.yuming + "/shop/book/multiDelete",
          method: "DELETE",
          params: {
            book_id: this.book_id,
          },
          paramsSerializer: (params) => {
            return qs.stringify(params, { indices: false });
          },
        })
          .then((res) => {
            const { code } = res.data;
            if (code == "200") {
              this.dataLoading = true;
              this.getBook();
              this.dataLoading = false;
              this.$message({
                type: "success",
                message: "下架所选图书成功",
              });
              this.book_id = [];
            } else {
              this.$message.error("下架所选图书失败");
              this.book_id = [];
            }
          })
          .catch(() => {
            Message({
              type: "error",
              message: "出现错误，请稍后再试",
            });
          });
      });
    },
    //点击x号或对话框外部的关闭
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          done();
          this.lists1.bookid = "";
          this.lists1.bookImg = "";
          this.lists1.bookName = "";
          this.lists1.bookAuthor = "";
          this.lists1.classOne = "";
          this.lists1.classOne_id = "";
          this.lists1.classTwo = "";
          this.lists1.classTwo_id = "";
          this.lists1.bookPrice = "";
          this.lists1.Inventory = "";
          this.lists1.bookPubTime = "";
          this.lists1.press = "";
        })
        .catch(() => {});
    },
    //回调多选中的图书的值
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
    //更改或者添加图书图片
    getFile(file) {
      if (this.dialogChangeVisible == true) {
        this.imgdata.append("img", file);
        this.imgdata.append("book_id", this.lists1.bookid);
        axios({
          url: this.$store.state.yuming + "/shop/book/updateImg",
          method: "POST",
          data: this.imgdata,
        }).then((res) => {
          if (res.data.code == 200) {
            this.lists1.bookImg = window.URL.createObjectURL(file);
            this.$message({
              message: "更改图书图片成功",
              type: "success",
            });
            this.imgdata = new FormData();
          } else {
            this.$message.error("更改图书图片失败，请重试");
            this.imgdata = new FormData();
          }
        });
      } else {
        this.formdata.append("img", file);
        this.lists1.bookImg = window.URL.createObjectURL(file);
      }
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
            this.shop_id = data.id;
            this.getBook();
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //获取所有目录信息
    getAllCategory() {
      axios({
        url: this.$store.state.yuming + "/category/getAll",
        method: "GET",
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.categoryList = data;
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
    await this.getShopInfo();
    await this.getAllCategory();
    this.isLoading = false;
  },
};
</script>
<style acoped>
.header {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-left: 10%;
  margin-right: 10%;
}
.logo3 {
  display: flex;
  justify-content: center;
  width: 200px;
  margin: 20px 100px;
  position: relative;
  right: 250px;
}
.imgStyle {
  width: 100px;
  height: 120px;
}
.verticalBar1 {
  width: 3px;
  height: 100%;
  background: rgb(60, 59, 105);
  display: inline-block;
  vertical-align: top;
  margin-right: 0px;
  margin-left: 30px;
  border-radius: 20%;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.title {
  font-size: 35px;
  padding: 30px 10px;
  position: relative;
  left: 180px;
}
.el-select {
  width: 100%;
}
</style>