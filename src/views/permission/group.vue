<template>
    <div class="app-container">
        <el-row class='dr-datatable' >
            <el-col :span="24">
                <el-row class='dr-datatable'>
                    <el-button size="small" type="primary" icon="el-icon-plus" @click="addInfo">新建分组</el-button>
                </el-row>
                <el-table :data="groupInfo" border>
                    <!-- <el-table-column prop="role_id" label="分组ID" width="50"></el-table-column>
                    <el-table-column prop="role_desc" label="分组描述"></el-table-column> -->
                    <el-table-column prop="role_name" label="分组名称">
                      <template slot-scope="scope">
                        <el-button @click="showUsersList(groupInfo[scope.$index].role_name)" type="text"><h3>{{ groupInfo[scope.$index].role_name }}<span>（{{ groupInfo[scope.$index].num || 0 }}）</span></h3></el-button>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="permissionFormVisible = true;permissionForm.role_id=groupInfo[scope.$index].role_id">权限设置</el-button>
                            <el-button type="text" size="small" @click="beforSetMenu(scope.$index,groupInfo)">路由设置</el-button>
                            <el-button type="text" size="small" @click="editGroup(scope.$index,groupInfo)">编辑</el-button>
                            <el-button type="text" size="small" @click="deleGroup(scope.$index,groupInfo)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <Pagination pageType="GetGroupnInfo" :pageInfo="groupPage" ></Pagination> -->
            </el-col>
        </el-row>

        <el-dialog title='编辑' :visible.sync='editdialogFormVisible' :before-close='beforeclose' width="70%">
            <el-form :model='groupForm' :rules='rules' ref='ruleForm' label-width='80px' class='demo-ruleForm'>
                <el-form-item class='dr-submitContent' label='分组名称'>
                    <el-input placeholder='分组名称' size='small' v-model='groupForm.role_name'></el-input>
                </el-form-item>
                <el-form-item class='dr-submitContent' label='分组描述'>
                    <el-input placeholder='分组描述' size='small' v-model='groupForm.role_desc'></el-input>
                </el-form-item>
                <el-form-item class='dr-submitContent'>
                    <el-button size='small' type='primary' @click="addGroup">确定</el-button>
                    <el-button size='small' @click='editdialogFormVisible = false;'>取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title='权限设置' :visible.sync='permissionFormVisible' :before-close='permissionbeforeclose' class='permissionselect' width="80vw">
            <el-form :model='groupForm' :rules='rules' ref='ruleForm' label-width='80px' class='demo-ruleForm'>
                <el-form-item v-for="(item,index) in permissionList" :key="index">
                    <template>
                        <el-transfer
                            class="transfer"
                            filterable
                            :props="{
                                key: 'value',
                                label: 'desc'
                            }"
                            :titles="[titleList[index][0], titleList[index][1]]"
                            filter-placeholder="请输入权限名称"
                            v-model="permissionForm.permissionId"
                            :data="item"
                            @change="changePermission">
                        </el-transfer>
                    </template>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="permissionFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="setPermissionSure">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title='路由设置' :visible.sync='menuFormVisible' :before-close='permissionbeforeclose' class='permissionselect' width="80vw">
            <el-form :model='menuForm' :rules='rules' ref='ruleForm' label-width='120px' class='demo-ruleForm'>
                <el-form-item>
                    <template>
                        <el-transfer
                            class="transfer"
                            :props="{
                                key: 'value',
                                label: 'desc'
                            }"
                            :titles="titleList2"
                            v-model="menuForm.menuId"
                            :data="menuList"
                            @change="changeMenu">
                        </el-transfer>
                    </template>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="menuFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="setMenuSure">确 定</el-button>
            </span>
        </el-dialog>

        <el-card class="box-card" :class="showActionListBool ? '' : 'ationListMove'" ref="actionList">
          <div slot="header">
            <el-row class="action_header">
              <h3>{{ showRoleName }}</h3>
              <el-button class="actionBtn" icon="el-icon-close" size="big" type="text" @click="showActionListBool = false;"></el-button>
            </el-row>
          </div>
          <Manager :admin-info="adminInfo" :group-info="groupInfo"></Manager>
        </el-card>

    </div>
</template>
<script>
import Pagination from "../../components/pagination/pageLXL.vue";
import Manager from "./manager.vue";
import { getAllRouters } from "@/api/routerManage.js";
import { mapGetters } from "vuex";
import fetch from "@/utils/request";
import qs from "qs";
export default {
  name: "grop",
  data() {
    return {
      editdialogFormVisible: false,
      permissionFormVisible: false,
      menuFormVisible: false,
      groupForm: {},
      permissionForm: { role_id: "", permissionId: [] },
      rules: {},
      filterMethod(query, item) {
        return item.desc.indexOf(query) > -1;
      },
      menuForm: {},
      menuList: [],
      titleList2: ["未选择路由", "已选择路由"],
      titleList: [
        ["订单权限", "已选订单权限"],
        ["客户权限", "已选客户权限"],
        ["用户权限", "已选用户权限"],
        ["杂项权限", "已选杂项权限"],
        ["订单权限", "已选订单权限"],
        ["客户权限", "已选客户权限"],
        ["用户权限", "已选用户权限"],
        ["杂项权限", "已选杂项权限"]
      ],
      permissionList: [[], [], [], [], [], [], [], []],
      permissionID: [],
      // 控制 客户操作 列表的展示
      showActionListBool: false,
      // 传入到子组件的用户数据
      adminInfo: [],
      showRoleName: ''
    };
  },
  methods: {
    editGroup(index, row) {
      this.editdialogFormVisible = true;
      Object.assign(this.groupForm, row[index]);
    },
    addInfo() {
      this.edit = false;
      this.editdialogFormVisible = true;
    },
    beforSetMenu(index, row) {
      this.menuFormVisible = true;
      this.menuForm.role_id = row[index].role_id;
      console.log(this.menuForm);
    },
    setMenuSure() {
      fetch({
        method: "post",
        url: "/permission/setMenu",
        data: qs.stringify(this.menuForm)
      }).then(result => {
        this.menuFormVisible = false;
      });
    },
    setPermission(index, row) {
      this.permissionFormVisible = true;
      alert(this.permissionFormVisible);
      this.permissionForm.role_id = row[index].role_id;
    },
    setPermissionSure() {
      fetch({
        method: "post",
        url: "/permission/setpermission",
        data: qs.stringify(this.permissionForm)
      }).then(results => {
        this.permissionFormVisible = false;
      });
    },
    removeByValue(arr, val) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
          arr.splice(i, 1);
          break;
        }
      }
    },
    removeBigType(val) {
      if (val.value === 1) {
        this.showhandle = false;
      } else if (val.value === 2) {
        this.showshow = false;
      }
    },
    changePermission(val) {
      console.log("this.permissionID", this.permissionID);
    },
    changeMenu(val) {
      console.log("this.menuId", this.menuForm.menuId);
    },
    permissionbeforeclose(done) {
      return new Promise((resolve, reject) => {
        this.adminformState = {};
        resolve(true);
      }).then(_ => {
        done();
      });
    },
    beforeclose(done) {
      return new Promise((resolve, reject) => {
        this.adminformState = {};
        resolve(true);
      }).then(_ => {
        done();
      });
    },
    addGroup() {
      console.log(this.groupForm);
      fetch({
        method: "post",
        url: "/permission/addGroup",
        data: qs.stringify(this.groupForm)
      }).then(result => {
        this.editdialogFormVisible = false;
        this.$store.dispatch("GetGroupnInfo");
      });
    },
    deleGroup(index, row) {
      this.$confirm("此操作将永久删除该分组, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        fetch({
          method: "post",
          url: "/permission/deleGroup",
          data: qs.stringify({ role_id: row[index].role_id })
        }).then(() => {
          this.$store.dispatch("GetGroupnInfo", {
            pageInfo: {
              pageSize: this.$store.getters.groupPage.pageSize,
              pageNum: this.$store.getters.groupPage.pageNum
            }
          });
        });
      });
    },
    showUsersList(role_name) {
      this.showActionListBool = true;
      this.showRoleName = role_name;
      this.getAdminInfo();
    },
    getAdminInfo() {
      let arr = this.$store.getters.adminInfo;
      this.adminInfo = arr.filter(item => {
        return item.role_name == this.showRoleName;
      })
    }
  },
  computed: {
    ...mapGetters(["groupInfo", "groupPage"])
  },
  beforeCreate() {
    if (!this.$store.getters.adminInfo) {
      this.$store
        .dispatch("GetAdminInfo", {
          exit: 0
        })
        .then((results) => {
          console.log("GetAdminInfo");
          this.loading = false;
        });
    }
    if (!this.$store.getters.groupInfo) {
      this.$store.dispatch("GetGroupnInfo", {
        pageInfo: {
          pageSize: 10,
          pageNum: 1
        }
      });
    }
    fetch({
      method: "get",
      url: "/permission/AllPermission"
    }).then(results => {
      console.log(results);
      for (let i = 0; i < results.data.length; i++) {
        const Small = results.data[i].permissionSmallType;
        if (Small > 20) {
          this.permissionList[Small - 17][
            this.permissionList[Small - 17].length
          ] = {
            value: results.data[i].id,
            desc: results.data[i].Pdesc
          };
        } else {
          this.permissionList[Small - 11][
            this.permissionList[Small - 11].length
          ] = {
            value: results.data[i].id,
            desc: results.data[i].Pdesc
          };
        }
      }
    });
    getAllRouters().then(result => {
      console.log(result);
      for (let i = 0; i < result.data.list.length; i++) {
        this.menuList[this.menuList.length] = {
          value: result.data.list[i].id,
          desc: result.data.list[i].Mdesc
        };
      }
    });
  },
  components: {
    Pagination,
    Manager
  }
};
</script>
<style>
.dr-datatable {
  margin-bottom: 1em;
}
.permissionselect {
  min-width: 1366px;
}
.permissionselect .el-transfer-panel {
  width: 360px;
}
.bigtype {
  width: 250px;
}

.box-card {
  position: fixed;
  top: 50px;
  right: 20px;
  width: 75%;
  height: 90%;
  overflow: auto;
  transition: transform 1s;
}
.action_header {
  height: 30px;
  line-height: 30px;
  text-align: center;
}
.action_header h3 {
  display: inline-block;
  margin: 0;
}
.actionBtn {
  float: right;
  padding: 3px 0;
  font-size: 22px;
  color: #2d2f33;
}
.ationListMove {
  transform: translateX(110%);
}

.transfer .el-transfer-panel {
  width: 35%
}
</style>
