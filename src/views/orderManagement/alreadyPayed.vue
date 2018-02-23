<template>
  <div class="app-container">
      <el-row class="dr-datatable" justify="center" :gutter="20">
        <el-col :span="7">
          <span class="type">业务大类</span>
          <el-select size="small" v-model="search.searchBigType" @change="searchFor">
            <el-option value="" label="全部">全部</el-option>
            <el-option value="信贷" label="信贷">信贷</el-option>
            <el-option value="房贷" label="房贷">房贷</el-option>
          </el-select>
        </el-col>
        <el-col :span="7">
          <span class="type">业务小类</span>
          <el-select size="small" v-model="search.searchSmallType" @change="searchFor">
            <el-option value="" label="全部">全部</el-option>
            <el-option value="放大贷">放大贷</el-option>
            <el-option value="薪资贷">薪资贷</el-option>
            <el-option value="小贷">小贷</el-option>
            <el-option value="车抵贷">车抵贷</el-option>
            <el-option value="抵押">抵押</el-option>
            <el-option value="质抵">质抵</el-option>
            <el-option value="垫资">垫资</el-option>
          </el-select>
        </el-col>
        <el-col :span="6" :offset="3">
          <el-input size="small" class="searchInput" placeholder="客户名称、电话、录入员" v-model="search.searchString">
              <template slot="prepend">综合搜索</template>
              <el-button slot="append" icon="el-icon-search" @click="searchFor"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-row class="dr-datatable" justify="center">
          <el-date-picker
            size="small"
                v-model="search.date"
                type="daterange"
                 align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions2"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                @change="searchFor">
          </el-date-picker>
      </el-row>
      <el-row class="dr-datatable" justify="center">
          <el-button slot="append" icon="el-icon-search" @click="searchFor"></el-button>
          <el-button v-if="roles[0]===1||roles[0]===2||roles[0]===6" size="small" @click="sousuo('unreceived')" type="default" round>待接收订单</el-button>
          <el-button size="small" @click="sousuo('handling')" round>跟进中订单</el-button>
          <el-button size="small" @click="sousuo('reprieve')" round>暂缓订单</el-button>
          <el-button size="small" @click="sousuo('chargeBack')" round>退单订单</el-button>
          <el-button size="small" @click="sousuo('approval')" type="default" round>审批中订单</el-button>
          <el-button size="small" @click="sousuo('all')" type="default" round>全部订单</el-button>
          <el-button size="small" @click="sousuo('alreadyReleased')" type="default" class="btn-active" round>已放款订单</el-button>
          <el-button size="small" @click="sousuo('finished')" type="default" round>已完成订单</el-button>
      </el-row>
      <el-table border :data="orderInfo" align="center" v-loading="loading" ref="multipleTable" tooltip-effect="dark" style="width: 100%" >
          <!-- <el-table-column label="日志">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="circle-check" @click="readlogs(scope.$index, orderInfo)">查看日志</el-button>
              <br>
              <el-button size="mini" type="text" icon="circle-check" @click="readnotes(scope.$index, orderInfo)">查看备注</el-button>
            </template>
          </el-table-column> -->
          <el-table-column prop="payfor_id" label="序号" show-overflow-tooltip>
          </el-table-column>
          <!-- <el-table-column prop="proNum" label="合同编号" show-overflow-tooltip>
          </el-table-column> -->
          <el-table-column prop="customerName" label="客户姓名" show-overflow-tooltip>
          </el-table-column>
          <!-- <el-table-column prop="businessBigType" label="业务大类" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="businessSmallType" label="业务小类" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="businessRequire" label="业务需求" show-overflow-tooltip>
          </el-table-column> -->
          <el-table-column prop="lr_renyuan" label="当前负责人" show-overflow-tooltip>
          </el-table-column>
          <!-- <el-table-column prop="fk_name" label="风控人员" show-overflow-tooltip>
          </el-table-column> -->
          <el-table-column prop="proNewdata" label="订单生成日期" show-overflow-tooltip>
          </el-table-column>
          <!-- <el-table-column prop="acceptData" label="接单日期" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="pay_date" label="放款日期" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="payforChannel" label="放款渠道" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="payforMoney" label="放款金额" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="tip" label="服务费" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="paybackPoint" label="返点" show-overflow-tooltip>
          </el-table-column> -->
          <!-- <el-table-column prop="paybackWay" label="还款方式" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="limitDate" label="贷款期限" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="dabaoBZ" label="风控备注" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="caiwuBZ" label="财务备注" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="sellBZ" label="前台备注" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="lookBZ" label="监督备注" show-overflow-tooltip>
          </el-table-column> -->
          <el-table-column label="状态" show-overflow-tooltip>
            <template slot-scope="scope"><el-row>已放款</el-row></template>
          </el-table-column>
          <!-- <el-table-column label="确认" width="110px">
            <template slot-scope="scope">
              <el-button type="text" size="mini" icon="circle-check" @click="confirm(scope.$index, orderInfo)">确认</el-button>
              <el-button type="text" v-if="roles[0]===5" size="mini" icon="circle-check" @click="financialConfirm(scope.$index, orderInfo)">服务费确认</el-button>
            </template>
          </el-table-column> -->

          <el-table-column label="操作" >
            <template slot-scope="scope">
              <el-button type="text"  @click="showActionList(scope.$index, orderInfo[scope.$index])">订单操作</el-button>
            </template>
          </el-table-column>
      </el-table>
      <Pagination @changeOrderInfo="changeOrderInfo" :search-params="search" :pageInfo="orderPage"></Pagination>
      <!-- 日志 -->
      <!-- <el-dialog width="80%" :title='logtitle' :visible.sync="logFormVisible">
        <el-table border :data="logInfo" align="center" v-loading="loading" ref="multipleTable" tooltip-effect="dark" style="width: 100%" >
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="c_name" label="客户姓名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="fk_name" label="风控专员" show-overflow-tooltip></el-table-column>
          <el-table-column prop="meet_time" label="双方见面时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="need_ed" label="客户需求批贷额度" show-overflow-tooltip></el-table-column>
          <el-table-column prop="if_sign" :formatter="ifsignFormatter" label="是否签单" show-overflow-tooltip></el-table-column>
          <el-table-column prop="not_reason" label="没有签单的原因" show-overflow-tooltip></el-table-column>
          <el-table-column prop="case_number" label="签单合同编号" show-overflow-tooltip></el-table-column>
          <el-table-column label="合同扫描件">
            <template slot-scope="scope">
              <img @click="enlargePic(logInfo[scope.$index].case_file)" :src="logInfo[scope.$index].case_file" :alt="logInfo[scope.$index].case_file" width="100%">
            </template>
          </el-table-column>
          <el-table-column prop="tip" label="服务费点位" show-overflow-tooltip></el-table-column>
          <el-table-column prop="log_beizhu" label="备注" show-overflow-tooltip></el-table-column>
          <el-table-column prop="addtime" label="填写时间" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-dialog> -->

        <!-- 确认 -->
        <el-dialog status-icon width="80%" center title="确认备注" :visible.sync="dialogFormVisible">
            <el-form :model="dialogInfo" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
                <el-form-item label="备注" prop="affirmBz">
                    <el-input type="textarea" placeholder="请输入备注" size="small" v-model="dialogInfo.affirmBz"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="submit('ruleForm')">确 定</el-button>
            </span>
        </el-dialog>



        <!-- 客户操作列表 -->
      <el-card class="box-card" :class="showActionListBool ? '' : 'ationListMove'" ref="actionList">
        <div slot="header" class="">
          <el-row class="action_header">
            <h3>订单操作</h3>
            <el-button class="actionBtn" icon="el-icon-close" size="big" type="text" @click="closeActionList"></el-button>
          </el-row>
        </div>
        <div class="action_body">
          <el-collapse class="action_coll"  accordion>
            <!-- 订单信息 -->
            <el-collapse-item name="1" >
              <template slot="title"><el-button class="action_btn">订单信息</el-button></template>
              <el-row>
                <el-col :span="12"><h3>客户名字：</h3><span>{{ currUser.customerName }}</span></el-col>
                <el-col :span="12"><h3>录入人员：</h3><span>{{ currUser.lr_renyuan }}</span></el-col>
              </el-row>
              <el-row>
                <el-col :span="12"><h3>客户电话：</h3><span>{{ currUser.businessRequire }}</span></el-col>
                <el-col :span="12"><h3>录入时间：</h3><span>{{ currUser.acceptDate }}</span></el-col>
              </el-row>
              <el-row>
                <el-col :span="12"><h3>客户大类：</h3><span>{{ currUser.businessBigType }}</span></el-col>
                <el-col :span="12"><h3>当前负责人：</h3><span>{{ currUser.lr_renyuan }}</span><span class="action_proType">{{ currUser.proType }}</span></el-col>
              </el-row>
              <el-row>
                <el-col :span="12"><h3>客户小类：</h3><span>{{ currUser.businessSmallType }}</span></el-col>
              </el-row>
              <el-row>
                <el-col :span="12"><h3>业务需求：</h3><span>{{ currUser.businessRequire }}</span></el-col>
              </el-row>
              <el-row>
                <el-col :span="12"><h3>渠道：</h3><span>{{ currUser.way }}</span></el-col>
              </el-row>
              <el-row>
                <el-col :span="12"><h3>服务费：</h3><span>{{ currUser.payforMoney || 0 }}</span></el-col>
              </el-row>
            </el-collapse-item>



            <!-- 客户信息编辑 -->
            <el-collapse-item name="2">
              <template slot="title"><el-button class="action_btn" @click="showPhoneNum(currIndex, orderInfo)">客户信息编辑</el-button></template>
              <customer-details ref="details"></customer-details>
            </el-collapse-item>

            <!-- 查看日志 -->
            <el-collapse-item name="3">
              <template slot="title"><el-button class="action_btn" @click="readlogs(currIndex, orderInfo)">查看日志</el-button></template>
              <el-table border :data="logInfo" align="center" v-loading="loading" ref="multipleTable" tooltip-effect="dark" style="width: 100%" >
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="c_name" label="客户姓名" show-overflow-tooltip></el-table-column>
                <el-table-column prop="fk_name" label="风控专员" show-overflow-tooltip></el-table-column>
                <el-table-column prop="meet_time" label="双方见面时间" show-overflow-tooltip></el-table-column>
                <el-table-column prop="need_ed" label="客户需求批贷额度" show-overflow-tooltip></el-table-column>
                <el-table-column prop="if_sign" :formatter="ifsignFormatter" label="是否签单" show-overflow-tooltip></el-table-column>
                <el-table-column prop="not_reason" label="没有签单的原因" show-overflow-tooltip></el-table-column>
                <el-table-column prop="case_number" label="签单合同编号" show-overflow-tooltip></el-table-column>
                <el-table-column label="合同扫描件">
                  <template slot-scope="scope">
                    <img @click="enlargePic(logInfo[currIndex].case_file)" :src="logInfo[currIndex].case_file" :alt="logInfo[scope.$index].case_file" width="100%">
                  </template>
                </el-table-column>
                <el-table-column prop="tip" label="服务费点位" show-overflow-tooltip></el-table-column>
                <el-table-column prop="log_beizhu" label="备注" show-overflow-tooltip></el-table-column>
                <el-table-column prop="addtime" label="填写时间" show-overflow-tooltip></el-table-column>
              </el-table>
            </el-collapse-item>

            <el-collapse-item name="4">
              <template slot="title">
                <el-button type="primary" class="action_btn" @click="confirm(currIndex, orderInfo)">确认</el-button>
              </template>
            </el-collapse-item>

          </el-collapse>

        </div>
      </el-card>



  </div>
</template>

<script>
import { getorderlist, getPhoneNum } from "@/api/orderlist.js";
import { mapGetters } from "vuex";
import Pagination from "../../components/pagination/alreadyPayed.vue";
import customerDetails from "./../customerManagement/customerDetails.vue";
import {
  readNotes,
  readLogs,
  confirm,
  searchpayfororderlist
} from "@/api/orderlist.js";

export default {
  data() {
    return {
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      search: {},
      orderInfo: [],
      orderPage: {},
      loading: true,
      logInfo: [],
      logtitle: "",
      logFormVisible: false,
      rules: {
        affirmBz: { required: true, message: "备注不能为空", trigger: "blur" }
      },
      dialogInfo: {},
      dialogFormVisible: false,
      // 控制 订单操作 列表的展示
      showActionListBool: false,
      // 当前操作订单用户信息
      currUser: {},
      currIndex: 0
    };
  },
  methods: {
    searchFor() {
      this.loading = true;
      if (this.search.date && this.search.date.length > 0) {
        if (this.search.date[0] === this.search.date[1]) {
          this.search.startDate = this.search.date[0];
          this.search.endDate = "";
        } else {
          this.search.startDate = this.search.date[0];
          this.search.endDate = this.search.date[1];
        }
      }
      this.search.pageNum = 1;
      this.search.pageSize = 10;
      searchpayfororderlist(this.search).then(result => {
        this.loading = false;
        this.orderInfo = result.data.list;
        this.orderPage = {
          totalItems: result.data.totalItems,
          pageNum: result.data.pageNum,
          pageSize: result.data.pageSize
        };
      });
    },
    changeOrderInfo(result) {
      this.orderInfo = result.data;
      // this.$nextTick(function() {
      this.orderPage = result.page;
      // console.log(this.orderPage, result.page);
      // });
    },
    readlogs(index, rows) {
      readLogs({ id: rows[index].id }).then(result => {
        this.logtitle = `客户${result.data.list[0].c_name}跟踪日志`;
        this.logInfo = result.data.list;
        // this.logFormVisible = true;
      });
    },
    readnotes(index, rows) {
      readNotes({ customerId: rows[index].customerId }).then(result =>
        this.$alert(`<pre>${result.c_bz}</pre>`, "备注", {
          dangerouslyUseHTMLString: true
        })
      );
    },
    ifsignFormatter(row, column, cellValue) {
      switch (cellValue) {
        case "1":
          return "是";
        case "0":
          return "否";
      }
    },
    confirm(index, rows) {
      this.dialogInfo = {
        payfor_id: rows[index].payfor_id
      };
      this.dialogFormVisible = true;
    },
    financialConfirm(index, rows) {
      this.dialogInfo = {
        payfor_id: rows[index].payfor_id,
        affirmType: 1
      };
      this.dialogFormVisible = true;
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          confirm(this.dialogInfo).then(result => {
            if (result.superior) {
              this.$socket.emit("message", {
                to: result.superior,
                msg: result.message
              });
            }
            this.dialogInfo = {};
            this.dialogFormVisible = false;
            getorderlist(
              {
                pageNum: this.orderPage.pageNum,
                pageSize: this.orderPage.pageSize
              },
              "alredyReleased"
            ).then(result => {
              this.orderInfo = result.data.list;
              this.orderPage = {
                pageNum: result.data.pageNum,
                pageSize: result.data.pageSize,
                totalItems: result.data.totalItems
              };
              this.loading = false;
            });
          });
        } else {
          this.$message("请检查表单信息");
          return false;
        }
      });
    },
    showPhoneNum(index, rows) {
      getPhoneNum({ customerId: rows[index].customerId }).then(result => {
        // 获取手机号码放到currUser上
        this.currUser.customerTel = result.data;
      }).then(result => {
        this.editCustomerInfo();
      });
    },
    showActionList(_currOrderIndex, currOrderInfos) {
      // console.log(_currOrderIndex, currOrderInfos);
      // 客户操作按钮事件
      this.currIndex = _currOrderIndex;
      this.currUser = currOrderInfos;
      this.showActionListBool = true;
      // 绑定 更改生产状态 数据
      this.dialogInfo = {
        c_name: currOrderInfos.customerName,
        customerId: currOrderInfos.customerId,
        id: currOrderInfos.id,
        proType:　currOrderInfos.proType
      };
    },
    closeActionList() {
      this.showActionListBool = false;
    },
    editCustomerInfo() {
      this.$refs.details.searchFor(this.currUser.customerTel);
      console.log(this.currUser);
    },
    sousuo(type) {
      this.loading = false;
      var orderType;
      switch (type) {
        case "unreceived":
          this.typeName = "待接收订单";
          orderType = "待接收"
          break;
        case "handling":
          this.typeName = "跟进中订单";
          orderType = "跟进中"
          break;
        case "reprieve":
          this.typeName = "暂缓订单";
          orderType = "暂缓"
          break;
        case "chargeBack":
          this.typeName = "退单订单";
          orderType = "退单"
          break;
        case "approval":
          this.typeName = "审批中订单";
          orderType = "审批中"
          break;
        case "all":
          this.typeName = "全部订单";
          orderType = ""
          break;
        case "alreadyReleased":
          return;
        case "finished":
          this.typeName = "已完成订单";
          orderType = "已完成"
          break;
      }
      this.changeType(orderType);

      this.$router.push("/orderManagement/mostOrder");
    },
    bigTypeChange() { // 大类小类日期，改变了都会搜索一次
      this.searchFor();
    },
    changeType(type) { // 由于两个页面，点击其他订单会跳转改变状态
      this.$store.dispatch('NavOrderList',{ type });
    }
  },
  components: { Pagination, customerDetails },
  computed: { ...mapGetters(["roles"]) },
  mounted() {
    getorderlist(
      { pageNum: 1, pageSize: 10 },
      "alredyReleased"
    ).then(result => {
      this.orderInfo = result.data.list;
      this.orderPage = {
        pageNum: result.data.pageNum,
        pageSize: result.data.pageSize,
        totalItems: result.data.totalItems
      };
      this.loading = false;
    });
  }
};
</script>

<style lang="scss">
.dr-datatable {
  margin-bottom: 1em;
}
.searchInput {
  width: 350px;
}
.type {
  font-size: 14px;
}

.title {
  height: 50px;
  line-height: 50px;
}
.title h3 {
  margin: 0;
}
.serach {
  height: 50px;
  line-height: 50px;
}
.customerTable {
  margin-top: 30px;
}
.box-card {
  position: fixed;
  z-index: 1;
  top: 50px;
  right: 30px;
  width: 50%;
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
.el-collapse-item__content h3 {
  display: inline-block;
  margin: 0;
}
.action_proType {
  margin-left: 10px;
  color: #2d2f33;
}
.ationListMove {
  transform: translateX(110%);
}
.action_body .action_btn {
  width: 100%;
}
.action_coll {
  border: 0;
}
.action_coll .el-collapse-item.is-active {
  height: calc(100vh - 400px);
  overflow: auto;
}
.action_coll .el-collapse-item__header {
  border: 0;
}
.action_coll .el-collapse-item__header i {
  display: none;
}
.demo-ruleForm .btn-footer {
  text-align: center;
}
</style>
