<template>
  <div v-loading="isLoading" class="home">
    <div class="content">
      <div class="header">
        <img height="70px" style="margin:20px 0" src="../../assets/wads.png" />
        <div class="title">后台管理</div>
      </div>
      <div style="margin: 10px 0"><el-page-header @back="gotoAdmin" content="书籍管理"></el-page-header></div>
      <div>
        <el-card class="box-card1">
          <el-container>
            <el-aside width="35px"><div class="verticalBar2"></div></el-aside>
            <el-main>
          <div style="font-size: 15px padding: 18px 0">
            在此处，您可以查看、查找、添加、编辑、删除图书信息。
          </div>
            </el-main>
          </el-container>
        </el-card>
      </div>
      <div>
        <el-card class="box-card1">
          <el-row v-loading="dataLoading">
            <el-col :span="6" style="text-align:center">
              <el-row><h2>{{storeNum}}</h2></el-row><el-row><span>在库</span></el-row>
            </el-col>
            <el-col :span="6" style="text-align:center">
              <el-row><h2>{{libraryNum}}</h2></el-row><el-row><span>在馆</span></el-row>
            </el-col>
            <el-col :span="6" style="text-align:center">
              <el-row><h2>{{lendNum}}</h2></el-row><el-row><span>已借</span></el-row>
            </el-col>
            <el-col :span="6" style="text-align:center">
              <el-row><h2>{{bookingNum}}</h2></el-row><el-row><span>预约</span></el-row>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <div class="box2" v-loading="dataLoading">
        <el-card class="box-card1">
          <template>
            <el-tabs v-model="activeName">
<!--





----------------------------------------------------分割线----------------------------------------------------





-->
    <el-tab-pane label="所有书目" name="first">
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
      <el-col :span="3"><div style="margin: 0 20px"><el-button round @click="searchBook()">搜索</el-button></div></el-col>
      <el-col :span="3"><div style="margin: 0 10px">
        <el-button round  
        @click="editBook.author='';
        editBook.book_name='';
        editBook.category_id='';
        editBook.date='';
        editBook.detail='';
        editBook.image='';
        editBook.isbn='';
        editBook.page_num='';
        editBook.price='';
        editBook.publisher='';
        editBook.reference_num='';
        editBook.num='';
        editBookOperation = 1;
        editBookVisible = true">添加</el-button>
      </div></el-col>
      <el-table
      :data="bookList"
      style="width: 100%"
      :default-sort = "{prop: 'update_time', order: 'descending'}">
      <template slot="empty">
        <img src="../../assets/empty_grey.png" style="height:100px;margin-top:30px">
        <p style="margin-top:0px">暂无书籍</p>
      </template>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="作者"><span>{{scope.row.author}}</span></el-form-item>
              <el-form-item label="出版社"><span>{{scope.row.publisher}}</span></el-form-item>
              <el-form-item label="页数"><span>{{scope.row.page_num}}</span></el-form-item>
              <el-form-item label="价格"><span>{{scope.row.price}}</span></el-form-item>
              <el-form-item label="分类"><span>{{scope.row.category_id}}-{{scope.row.main_category}}</span></el-form-item>
              <el-form-item label="索书号"><span>{{scope.row.reference_num}}</span></el-form-item>
              <el-form-item label="更新时间"><span>{{scope.row.update_time}}</span></el-form-item>
              <el-form-item label="简介"><span>{{scope.row.detail}}</span></el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="出版时间"></el-table-column>
        <el-table-column label="书籍封面">
          <template slot-scope="scope">
            <el-popover
            placement="right"
            title=""
            trigger="hover">
              <img class="img-max" :src="getImages(scope.row.image)"/>
              <img class="img-min" slot="reference" :src="getImages(scope.row.image)" style="max-height: 50px;max-width: 130px">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="book_name" label="书籍名称">
        </el-table-column>
        <el-table-column prop="isbn" label="ISBN"></el-table-column>
        <el-table-column prop="num" label="书籍数量"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text"
            @click="editBook.author=scope.row.author;
            editBook.book_name=scope.row.book_name;
            editBook.category_id=scope.row.category_id;
            editBook.date=scope.row.date;
            editBook.detail=scope.row.detail;
            editBook.image=scope.row.image;
            editBook.isbn=scope.row.isbn;
            editBook.page_num=scope.row.page_num;
            editBook.price=scope.row.price;
            editBook.publisher=scope.row.publisher;
            editBook.reference_num=scope.row.reference_num;
            editBookOperation=0;
            editBookVisible = true">编辑</el-button>
            <el-button size="mini" type="text" style="margin-left:10px"
            @click="editBook.num='';
            editBook.isbn=scope.row.isbn;
            addBookNumVisible = true">增加</el-button>
            <el-button size="mini" type="text" style="margin-left:10px"
            @click="editBook.reference_num=scope.row.reference_num;
            deleteBookData()">删除</el-button>
          </template>
        </el-table-column>
      </el-table>


      <el-dialog title="增加书籍数量" :visible.sync="addBookNumVisible" center width="440px">
        <el-form ref="editBook"
        :model="editBook"
        label-width="80px"
        :rules="rules">
          <el-form-item label="ISBN" prop="isbn">{{editBook.isbn}}</el-form-item>
          <el-form-item label="增加数量" prop="num">
            <el-input v-model="editBook.num" autocomplete="off" class="editInput"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addBookNumVisible = false">取 消</el-button>
          <el-button type="primary" @click="addBookNum();addBookNumVisible = false">确 定</el-button>
        </div>
      </el-dialog>


      <el-dialog title="编辑/添加书目信息" :visible.sync="editBookVisible" center width="440px">
        <el-form ref="editBook"
        :model="editBook"
        label-width="80px"
        :rules="rules">
        <el-form-item label="书目封面" prop="image">
          <el-upload 
          class="avatar-uploader"
          ref="upload"
          action="http://47.100.78.158:8888"
          :show-file-list="false"
          :on-change="changePhotoFile"
          :on-success="handleAvatarSuccess"
          :auto-upload="false"
          :name="editBook.image">
            <img :src="editBook.image" class="avatar" />
          </el-upload>
          <my-cropper
          ref="myCropper"
          @getFile="getFile"
          @upAgain="upAgain">
          </my-cropper>
          </el-form-item>
          <el-form-item label="名称" prop="book_name">
            <el-input v-model="editBook.book_name" autocomplete="off" class="editInput"></el-input>
          </el-form-item>
            <el-form-item label="作者" prop="author">
          <el-input v-model="editBook.author" autocomplete="off" class="editInput"></el-input>
            </el-form-item>
          <el-form-item label="出版社" prop="publisher">
            <el-input v-model="editBook.publisher" autocomplete="off" class="editInput"></el-input>
          </el-form-item>
          <el-form-item label="出版时间" prop="date">
            <el-input v-model="editBook.date" autocomplete="off" class="editInput"></el-input>
          </el-form-item>
          <el-form-item label="ISBN" prop="isbn">
            <el-input v-model="editBook.isbn" autocomplete="off" class="editInput"></el-input>
          </el-form-item>
          <el-form-item label="页数" prop="page_num">
            <el-input v-model="editBook.page_num" autocomplete="off" class="editInput"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input v-model="editBook.price" autocomplete="off" class="editInput"></el-input>
          </el-form-item>
          <el-form-item label="分类" prop="category_id">
            <el-input v-model="editBook.category_id" autocomplete="off" class="editInput"></el-input>
          </el-form-item>
          <el-form-item label="索书号" prop="reference_num">
            <el-input v-model="editBook.reference_num" autocomplete="off" class="editInput"></el-input>
          </el-form-item>
          <el-form-item label="简介" prop="detail">
            <el-input type="textarea" v-model="editBook.detail" :autosize="{ minRows: 2, maxRows: 5}" autocomplete="off" class="editInput"></el-input>
          </el-form-item>
          <el-form-item v-if="editBookOperation==1" label="数量" prop="num">
            <el-input v-model="editBook.num" autocomplete="off" class="editInput"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editBookVisible = false;formdata=''">取 消</el-button>
          <el-button v-if="editBookOperation==0" type="primary" @click="editBookData()">确 定</el-button>
          <el-button v-if="editBookOperation==1" type="primary" @click="addBookData()">确 定</el-button>
        </div>
      </el-dialog>
        <el-pagination
        :current-page="page_num"
        @current-change="handleCurrentChange"
        :page-count="page_count"
        layout="prev, pager, next, jumper">
        </el-pagination>
      </el-tab-pane>
<!--





----------------------------------------------------分割线----------------------------------------------------





-->
      <el-tab-pane label="所有书籍" name="second">
      <el-col :span="15">
      <el-form>
          <el-form-item>
            <el-input
              v-model="searchText_s"
              placeholder="输入关键词精确搜索"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-col>
        <el-col :span="9"><div style="margin: 0 20px">
          <el-button-group>
            <el-button round @click="searchBarCode()">按条码号</el-button>
            <el-button round @click="searchReferenceNum()">按索引号</el-button>
            <el-button round @click="searchAll()">全部</el-button>
          </el-button-group>
        </div></el-col>
      <el-table
      :data="booksList"
      style="width: 100%">
      <template slot="empty">
        <img src="../../assets/empty_grey.png" style="height:100px;margin-top:30px">
        <p style="margin-top:0px">暂无书籍</p>
      </template>
        <el-table-column prop="reference_num" label="索引号"></el-table-column>
        <el-table-column prop="bar_code" label="条码号"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.status==1">在库</div>
            <div v-if="scope.row.status==2">在馆</div>
            <div v-if="scope.row.status==3">在借</div>
            <div v-if="scope.row.status==4">预约</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" style="margin-left:10px" v-if="scope.row.status==1"
            @click="upBooksData(scope.row.bar_code)">上架</el-button>
            <el-button size="mini" type="text" style="margin-left:10px" v-if="scope.row.status==2"
            @click="downBooksData(scope.row.bar_code)">下架</el-button>
            <el-button size="mini" type="text" style="margin-left:10px"
            @click="deleteBooksData(scope.row.bar_code)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
        <el-pagination
        :current-page="page_num"
        @current-change="handleCurrentChange_s"
        :page-count="page_count_s"
        layout="prev, pager, next, jumper">
        </el-pagination>
      </el-tab-pane>
      </el-tabs>
          </template>
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
      page_num: 1,
      each_num: 10,
      page_count: 0,
      searchText_s: "",
      page_count_s: 0,
      style: 1,
      //书目表
      bookList: [],
      //书籍表
      booksList: [],
      //编辑书目
      editBook:{
        author: "",
        book_name: "",
        category_id: "",
        date: "",
        detail: "",
        image: "",
        isbn: "",
        main_category: "",
        num: "",
        page_num: "",
        price: "",
        publisher: "",
        reference_num: "",
        update_time: ""
      },
      editBookOperation: "",//0表示编辑，1表示添加
      formdata: new FormData(),
      rules: {
        book_name: [
          { required: true, message: "名称不得为空", trigger: "blur" },
        ],
        author: [
          { required: true, message: "作者不得为空", trigger: "blur" },
        ],
        publisher: [
          { required: true, message: "出版社不得为空", trigger: "blur" },
        ],
        date: [
          { required: true, message: "出版时间不得为空", trigger: "blur" },
        ],
        ISBN: [
          { required: true, message: "ISBN不得为空", trigger: "blur" },
        ],
        page_num: [
          { required: true, message: "页数不得为空", trigger: "blur" },
        ],
        price: [
          { required: true, message: "价格不得为空", trigger: "blur" },
        ],
        category_id: [
          { required: true, message: "分类不得为空", trigger: "blur" },
        ],
        reference_num: [
          { required: true, message: "索书号不得为空", trigger: "blur" },
        ],
        detail: [
          { required: true, message: "简介不得为空", trigger: "blur" },
        ],
      },
      storeNum: 0,
      libraryNum: 0,
      lendNum: 0,
      bookingNum: 0,
      activeName: 'first',
      editBookVisible: false,
      addBookNumVisible: false,
    };
  },
  computed: {},
  methods:{
    //回到管理员主页
    gotoAdmin() {
      this.$router.push("/adminManage");
    },
    //图片403问题
    getImages(_url) {
      if(_url !== undefined) {
        let _u = _url.substring(7);
        return 'https://images.weserv.nl/?url=' + _u;
      }
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
      this.formdata.append("image", file);
      //获取上传图片的本地URL，用于上传前的本地预览
      this.editBook.image=window.URL.createObjectURL(file);
      this.$refs.myCropper.close();
    },
    //头像上传成功之后的方法,进行回调
    handleAvatarSuccess(res) {
      if (res.code === 0) {
        this.editBook.image = res.image;
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
    //获取在库书籍数量
    getStoreNum() {
      axios({
        url: this.$store.state.yuming+"/admin/getBookNumByStatus",
        method: "GET",
        params: {
          status: 1,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.storeNum = data;
          } else {
            this.$message.error("获取在库书籍数量失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //获取在馆书籍数量
    getLibraryNum() {
      axios({
        url: this.$store.state.yuming+"/admin/getBookNumByStatus",
        method: "GET",
        params: {
          status: 2,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.libraryNum = data;
          } else {
            this.$message.error("获取在馆书籍数量失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //获取在借书籍数量
    getLendNum() {
      axios({
        url: this.$store.state.yuming+"/admin/getBookNumByStatus",
        method: "GET",
        params: {
          status: 3,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.lendNum = data;
          } else {
            this.$message.error("获取在借书籍数量失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //获取预约书籍数量
    getBookingNum() {
      axios({
        url: this.$store.state.yuming+"/admin/getBookNumByStatus",
        method: "GET",
        params: {
          status: 4,
        },
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.bookingNum = data;
          } else {
            this.$message.error("获取预约书籍数量失败");
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
      this.getAllBook();
    },
    //获取所有书目
    getAllBook() {
      axios({
        url: this.$store.state.yuming+"/admin/book/fuzzyQuery",
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
            this.bookList = data;
            this.page_count = page_count;
          } else if (code == "3") {
            this.bookList = [];
          } else {
            this.$message.error("获取所有书目失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //模糊查询书目
    searchBook() {
      this.page_num = 1;
      this.reloadData();
    },
    //精确搜索分页
    handleCurrentChange_s(val) {
      this.page_num = val;
      this.getAllBooks();
    },
    //获取所有书目
    getAllBooks() {
      axios({
        url: this.$store.state.yuming+"/admin/book/getBookItem",
        method: "GET",
        params: {
          page_num: this.page_num,
          each_num: this.each_num,
          style: this.style,
          content: this.searchText_s,
        },
      })
        .then((res) => {
          const { code, data, page_count } = res.data;
          if (code == "200") {
            this.booksList = data;
            this.page_count_s = page_count;
          } else if (code == "3") {
            this.booksList = [];
          } else {
            this.$message.error("获取所有书目失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //精确查询书籍
    searchBarCode() {
      this.page_num = 1;
      this.style = 3;
      this.reloadData();
    },
    searchReferenceNum() {
      this.page_num = 1;
      this.style = 2;
      this.reloadData();
    },
    searchAll() {
      this.page_num = 1;
      this.style = 1;
      this.reloadData();
    },
    //重新加载数据
    reloadData() {
      this.dataLoading = true;
      this.getAllBook();
      this.getStoreNum();
      this.getLibraryNum();
      this.getLendNum();
      this.getBookingNum();
      this.getAllBooks();
      this.dataLoading = false;
    },
    //编辑书目信息
    editBookData() {
      this.updateAvatar();
      this.updateBook();
      this.formdata="";
      this.editBookVisible = false;
      this.reloadData();
    },
    updateAvatar() {
      this.formdata.append("reference_num", this.editBook.reference_num);
      axios({
        url: this.$store.state.yuming+"/admin/book/updateImg",
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
              message: "编辑封面成功",
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
    updateBook() {
      axios({
        url: this.$store.state.yuming+"/admin/book/updateBook",
        method: "POST",
        params: {
          reference_num: this.editBook.reference_num,
          book_name: this.editBook.book_name,
          author: this.editBook.author,
          page_num: this.editBook.page_num,
          price: this.editBook.price,
          isbn: this.editBook.isbn,
          detail: this.editBook.detail,
          publisher: this.editBook.publisher,
          date: this.editBook.date,
          category_id: this.editBook.category_id,
        }
      })
        .then((res) => {
          if (res.data.code == 200) {
            this.reloadData();
            this.$message({
              type: "success",
              message: "编辑书目信息成功",
        });
          } else {
            this.$message.error("编辑书目信息失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //添加书目信息
    addBookData() {
      //this.updateAvatar();
      this.addBook();
      this.formdata="";
      this.editBookVisible = false;
      this.reloadData();
    },
    addBook() {
      this.formdata.append("reference_num", this.editBook.reference_num);
      this.formdata.append("book_name", this.editBook.book_name);
      this.formdata.append("author", this.editBook.author);
      this.formdata.append("page_num", this.editBook.page_num);
      this.formdata.append("price", this.editBook.price);
      this.formdata.append("isbn", this.editBook.isbn);
      this.formdata.append("detail", this.editBook.detail);
      this.formdata.append("publisher", this.editBook.publisher);
      this.formdata.append("date", this.editBook.date);
      this.formdata.append("category_id", this.editBook.category_id);
      this.formdata.append("num", this.editBook.num);
      axios({
        url: this.$store.state.yuming+"/admin/book/addBook",
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
              message: "添加书目信息成功",
        });
          } else if (res.data.code == 201) {
            this.$message({
              type: "success",
              message: "书籍已经存在，书目已入库，书籍信息未更改",
        });
          } else {
            this.$message.error("添加书目信息失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //增加图书数量
    addBookNum() {
      axios({
        url: this.$store.state.yuming+"/admin/book/addBookNum",
        method: "POST",
        params: {
          isbn: this.editBook.isbn,
          num: this.editBook.num,
        }
      })
        .then((res) => {
          if (res.data.code == 200) {
            this.reloadData();
            this.$message({
              type: "success",
              message: "增加书籍数量成功",
        });
          } else {
            this.$message.error("增加书籍数量失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //删除书目
    deleteBookData() {
      axios({
        url: this.$store.state.yuming+"/admin/book/delete",
        method: "DELETE",
        params: {
          reference_num: this.editBook.reference_num,
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.reloadData();
            this.$message({
              type: "success",
              message: "删除书目成功",
        });
          } else {
            this.$message.error("删除书目失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //上架书籍
    upBooksData(BARCODE) {
      axios({
        url: this.$store.state.yuming+"/admin/bookShelf",
        method: "POST",
        params: {
          bar_codes: BARCODE,
        }
      })
        .then((res) => {
          if (res.data.code == 200) {
            this.reloadData();
            this.$message({
              type: "success",
              message: "上架书籍成功",
        });
          } else {
            this.$message.error("上架书籍失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //下架书籍
    downBooksData(BARCODE) {
      axios({
        url: this.$store.state.yuming+"/admin/bookUnshelf",
        method: "POST",
        params: {
          bar_codes: BARCODE,
        }
      })
        .then((res) => {
          if (res.data.code == 200) {
            this.reloadData();
            this.$message({
              type: "success",
              message: "下架书籍成功",
        });
          } else {
            this.$message.error("下架书籍失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //删除书籍
    deleteBooksData(BARCODE) {
      axios({
        url: this.$store.state.yuming+"/admin/book/deleteBookItem",
        method: "DELETE",
        params: {
          bar_code: BARCODE,
        },
      })
        .then((res) => {
          const { code } = res.data;
          if (code == "200") {
            this.reloadData();
            this.$message({
              type: "success",
              message: "删除书籍成功",
        });
          } else {
            this.$message.error("删除书籍失败");
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
      await this.getAllBook();
      await this.getStoreNum();
      await this.getLibraryNum();
      await this.getLendNum();
      await this.getBookingNum();
      await this.getAllBooks();
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
  width: 100%;
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