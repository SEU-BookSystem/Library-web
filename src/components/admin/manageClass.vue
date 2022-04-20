<template>
  <div class="home" v-loading="isLoading">
    <div class="content">
      <div class="header">
        <img height="70px" style="margin:20px 0" src="../../assets/jwbc.png" />
        <div class="title">后台管理</div>
      </div>
      <div style="margin: 10px 0"><el-page-header @back="gotoAdmin" content="分类管理"></el-page-header></div>
       <div>
        <el-card class="c-box-card1">
          <el-container>
            <el-aside width="35px"><div class="verticalBar-class"></div></el-aside>
            <el-main>
          <div style="font-size: 15px; margin-bottom:5px">
            在此处，您可以添加、修改、删除一、二级书籍分类。
          </div>
          <div style="font-size: 12px; color:grey">
            提示：请慎重管理分类，只有当分类下图书数目为0时，该分类才可以被删除。
          </div>
            </el-main>
          </el-container>
        </el-card>
      </div>
      <div class="c-box">
        <el-card class="c-box-card2">
          <el-row style="margin-bottom: 20px">
            <el-col :span="22">全部分类</el-col>
            <el-col :span="2"><el-button type="text" size="mini" @click="clearAddMain()">添加一级分类</el-button></el-col>
          </el-row>
          <div v-if="classList==''">
            <el-row><el-col :offset="11"><img src="../../assets/empty_grey.png" style="height:100px;margin-top:30px"></el-col></el-row>
            <el-row><el-col :offset="11"><p style="margin-left:20px;color:grey">暂无分类</p></el-col></el-row>
          </div>
          <el-row v-for="(main,id) in classList" :key="id" v-loading="classLoading">
            <el-col>
              <el-collapse accordion v-model="activeNames">
                <el-collapse-item :name="id">
                  <template slot="title" style="main-class">
                    <div>{{main.main_name}}</div>
                    <div style="margin-left:10px; color:grey">{{main.book_num}}本</div>
                    <el-button type="text" size="mini" style="margin-left:10px"
                    @click="clearAddSecond(main.main_name)">添加二级分类</el-button>
                    <el-button type="text" size="mini" @click="clearEditMain(main.main_id,main.main_name)">修改</el-button>
                    <el-button type="text" size="mini" @click="clearDeleteMain(main.main_id,main.main_name,main.book_num)">删除</el-button>
                  </template>
                  <el-row v-for="(second,idx) in main.second_category" :key="idx">
                    <el-col :span="22">
                      <div>{{second.second_name}}<span style="margin-left:10px; color:grey">{{second.book_num}}本</span></div>
                    </el-col>
                    <el-col :span="1"><el-button type="text" size="mini"
                    @click="clearEditSecond(second.second_id,second.second_name,main.main_name)">修改</el-button></el-col>
                    <el-col :span="1"><el-button type="text" size="mini"
                    @click="clearDeleteSecond(second.second_id,second.second_name,main.main_name,second.book_num)">删除</el-button></el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </div>
    <!--添加一级分类-->
    <el-dialog title="添加一级分类" :visible.sync="addMainClassVisible">
      <div style="margin-bottom:10px; color:grey">提示：您正在添加一级分类。</div>
      <el-form label-width="0" :rules="rules">
        <el-form-item prop="class_name">
          <el-input v-model="newClassName" placeholder="请输入一级分类名称" maxlength="5" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addMainClassVisible=false">取 消</el-button>
        <el-button type="primary" @click="addMain">确 定</el-button>
      </div>
    </el-dialog>
    <!--添加二级分类-->
    <el-dialog title="添加二级分类" :visible.sync="addSecondClassVisible">
      <div style="margin-bottom:10px; color:grey">提示：您正在添加一级分类"{{mainClassName}}"下的二级分类。</div>
      <el-form label-width="0" :rules="rules">
        <el-form-item prop="class_name">
          <el-input v-model="newClassName" placeholder="请输入二级分类名称" maxlength="5" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addSecondClassVisible=false">取 消</el-button>
        <el-button type="primary" @click="addSecond">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改一级分类-->
    <el-dialog title="修改一级分类" :visible.sync="editMainClassVisible">
      <div style="margin-bottom:10px; color:grey">提示：您正在修改一级分类"{{oldClassName}}"。</div>
      <el-form label-width="0" :rules="rules">
        <el-form-item prop="class_name">
          <el-input v-model="newClassName" placeholder="请输入新的一级分类名称" maxlength="5" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editMainClassVisible=false">取 消</el-button>
        <el-button type="primary" @click="updateMain">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改二级分类-->
    <el-dialog title="修改二级分类" :visible.sync="editSecondClassVisible">
      <div style="margin-bottom:10px; color:grey">提示：您正在修改一级分类"{{mainClassName}}"下的二级分类"{{oldClassName}}"。</div>
      <el-form label-width="0" :rules="rules">
        <el-form-item prop="class_name">
          <el-input v-model="newClassName" placeholder="请输入新的二级分类名称" maxlength="5" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editSecondClassVisible=false">取 消</el-button>
        <el-button type="primary" @click="updateSecond">确 定</el-button>
      </div>
    </el-dialog>
    <!--删除一级分类-->
    <el-dialog title="删除一级分类" :visible.sync="deleteMainClassVisible">
      <div v-if="num==0" style="margin-bottom:10px; color:grey">您确认要删除一级分类"{{oldClassName}}"吗？</div>
      <div v-if="num!=0" style="margin-bottom:10px; color:grey">一级分类"{{oldClassName}}"下仍有图书，不能删除。</div>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="num==0" @click="deleteMainClassVisible=false">取 消</el-button>
        <el-button v-if="num==0" type="primary" @click="deleteMain">确 定</el-button>
        <el-button v-if="num!=0" type="primary" @click="deleteMainClassVisible=false">确 定</el-button>
      </div>
    </el-dialog>
    <!--删除二级分类-->
    <el-dialog title="删除二级分类" :visible.sync="deleteSecondClassVisible">
      <div v-if="num==0" style="margin-bottom:10px; color:grey">
        您确认要删除一级分类"{{mainClassName}}"下的二级分类"{{oldClassName}}"吗？</div>
      <div v-if="num!=0" style="margin-bottom:10px; color:grey">
        一级分类"{{mainClassName}}"下的二级分类"{{oldClassName}}"下仍有图书，不能删除。</div>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="num==0" @click="deleteSecondClassVisible=false">取 消</el-button>
        <el-button v-if="num==0" type="primary" @click="deleteSecond">确 定</el-button>
        <el-button v-if="num!=0" type="primary" @click="deleteSecondClassVisible=false">确 定</el-button>
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
      isLoading: false,
      //分类loading
      classLoading: false,
      //展开面板集合
      activeNames: [],
      //对话框Visible
      addMainClassVisible: false,
      addSecondClassVisible: false,
      editMainClassVisible: false,
      editSecondClassVisible: false,
      deleteMainClassVisible: false,
      deleteSecondClassVisible: false,
      //暂存数据
      id: "",//修改和删除的分类id
      num: 0,//删除分类的图书数量,
      oldClassName: "",
      mainClassName: "",//添加和修改二级分类：一级分类名
      newClassName: "",//新分类名
      //分类列表
      classList: [
        /*{
          book_num: 2,
          main_name: "小说",
          main_id: "6ccf8604ff7bf563caffc87ea1fb5051",
          second_category: [
            {
              book_num: 2,
              second_id: "7e785167352c25447f1de155004da045",
              second_name: "悬疑",
            },
          ],
        },*/
      ],
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
    //获取分类
    getAll() {
      axios({
        url: this.$store.state.yuming+"/category/getAll",
        method: "GET",
        params: {},
      })
        .then((res) => {
          const { code, data } = res.data;
          if (code == "200") {
            this.classList = data;
          } else if (code == "3") {
            this.classList = [];
          } else {
            this.$message.error("获取分类失败");
          }
        })
        .catch(() => {
          Message({
            type: "error",
            message: "出现错误，请稍后再试",
          });
        });
    },
    //清空、初始化数据并打开对话框
    clearAddMain() {
      this.newClassName = "";
      this.addMainClassVisible = true;
    },
    clearAddSecond(name) {
      this.mainClassName = name;
      this.newClassName = "";
      this.addSecondClassVisible = true;
    },
    clearEditMain(id, name) {
      this.id = id;
      this.oldClassName = name;
      this.newClassName = "";
      this.editMainClassVisible = true;
    },
    clearEditSecond(id, second_name, main_name) {
      this.id = id;
      this.oldClassName = second_name;
      this.mainClassName = main_name;
      this.newClassName = "";
      this.editSecondClassVisible = true;
    },
    clearDeleteMain(id, name, num) {
      this.id = id;
      this.num = num;
      this.oldClassName = name;
      this.deleteMainClassVisible = true;
    },
    clearDeleteSecond(id, second_name, main_name, num) {
      this.id = id;
      this.num = num;
      this.oldClassName = second_name;
      this.mainClassName = main_name;
      this.deleteSecondClassVisible = true;
    },
    //添加一级分类
    addMain() {
      this.addMainClassVisible = false;
      axios({
        url: this.$store.state.yuming + "/admin/category/addMain",
        method: "POST",
        params: {
          main_name: this.newClassName,
        },
      }).then((res) => {
        if (res.data.code == 200) {
          this.classLoading = true;
          this.getAll();
          this.classLoading = false;
          this.$message({
            message: "添加一级分类成功",
            type: "success",
          });
        } else {
          this.$message.error("添加一级分类失败，请重试");
        }
      });
    },
    //添加二级分类
    addSecond() {
      this.addSecondClassVisible = false;
      axios({
        url: this.$store.state.yuming + "/admin/category/addSecond",
        method: "POST",
        params: {
          main_name: this.mainClassName,
          second_name: this.newClassName,
        },
      }).then((res) => {
        if (res.data.code == 200) {
          this.classLoading = true;
          this.getAll();
          this.classLoading = false;
          this.$message({
            message: "添加二级分类成功",
            type: "success",
          });
        } else {
          this.$message.error("添加二级分类失败，请重试");
        }
      });
    },
    //修改一级分类
    updateMain() {
      this.editMainClassVisible = false;
      axios({
        url: this.$store.state.yuming + "/admin/category/updateMain",
        method: "POST",
        params: {
          category_id: this.id,
          category_name: this.newClassName,
        },
      }).then((res) => {
        if (res.data.code == 200) {
          this.classLoading = true;
          this.getAll();
          this.classLoading = false;
          this.$message({
            message: "修改一级分类成功",
            type: "success",
          });
        } else {
          this.$message.error("修改一级分类失败，请重试");
        }
      });
    },
    //修改二级分类
    updateSecond() {
      this.editSecondClassVisible = false;
      axios({
        url: this.$store.state.yuming + "/admin/category/updateSecond",
        method: "POST",
        params: {
          category_id: this.id,
          category_name: this.newClassName,
        },
      }).then((res) => {
        if (res.data.code == 200) {
          this.classLoading = true;
          this.getAll();
          this.classLoading = false;
          this.$message({
            message: "修改二级分类成功",
            type: "success",
          });
        } else {
          this.$message.error("修改二级分类失败，请重试");
        }
      });
    },
    //删除一级分类
    deleteMain() {
      this.deleteMainClassVisible = false;
      axios({
        url: this.$store.state.yuming + "/admin/category/deleteMain",
        method: "DELETE",
        params: {
          category_id: this.id,
        },
      }).then((res) => {
        if (res.data.code == 200) {
          this.classLoading = true;
          this.getAll();
          this.classLoading = false;
          this.$message({
            message: "删除一级分类成功",
            type: "success",
          });
        } else {
          this.$message.error("删除一级分类失败，请重试");
        }
      });
    },
    //删除二级分类
    deleteSecond() {
      this.deleteSecondClassVisible = false;
      axios({
        url: this.$store.state.yuming + "/admin/category/deleteSecond",
        method: "DELETE",
        params: {
          category_id: this.id,
        },
      }).then((res) => {
        if (res.data.code == 200) {
          this.classLoading = true;
          this.getAll();
          this.classLoading = false;
          this.$message({
            message: "删除二级分类成功",
            type: "success",
          });
        } else {
          this.$message.error("删除二级分类失败，请重试");
        }
      });
    },
  },
  async created() {
    this.isLoading = true;
    await this.getAll();
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

</style>