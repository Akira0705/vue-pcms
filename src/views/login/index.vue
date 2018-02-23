<template>
  <div class="login-container">
    <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px"
      class="card-box login-form">
      <h3 class="title">跟进系统登录</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="用户名" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
          placeholder="密码"></el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
      </el-form-item>
      <el-button type="text" class="changePassBtn" @click="showChangePass">
        修改密码
      </el-button>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
    </el-form>

  <el-dialog title='编辑' :visible.sync='editdialogFormVisible' append-to-body >
    <el-form :model='adminformState' ref='ruleForm' label-width='120px' class='demo-ruleForm'>
        <el-form-item label='账号' prop='u_username'>
            <el-input size='small' v-model='adminformState.u_username'></el-input>
        </el-form-item>
        <el-form-item label='旧密码' prop='u_password'>
            <el-input size='small' v-model='adminformState.u_password'></el-input>
        </el-form-item>
        <el-form-item label='新密码' prop='u_password'>
            <el-input size='small' v-model='adminformState.u_password_new'></el-input>
        </el-form-item>
        <el-form-item class='dr-submitContent'>
          <el-button size='small' type='primary' @click="changePass">确定</el-button>
          <el-button size='small' @click='editdialogFormVisible = false;'>取消</el-button>
        </el-form-item>
    </el-form>
  </el-dialog>

  </div>
</template>

<script>
import { isvalidUsername } from "@/utils/validate";
import fetch from "@/utils/request";
import qs from "qs";

export default {
  name: "login",
  data() {
    /* const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    }; */
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(/* new Error('密码不能小于5位') */);
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          {
            required: true,
            trigger: "blur" /* , validator: validateUsername */
          }
        ],
        password: [
          { required: true, trigger: "blur" /* , validator: validatePass */ }
        ]
      },
      loading: false,
      pwdType: "password",
      editdialogFormVisible: false,
      adminformState: {}
    };
  },
  methods: {
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(token => {
              this.loading = false;
              this.$router.push({ path: "/" });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    showChangePass() {
      this.editdialogFormVisible = true;
    },
    changePass() {
      fetch({
        method: "post",
        url: "/user/changePass",
        data: qs.stringify(this.adminformState)
      }).then(() => {
        this.editdialogFormVisible = false;
        this.managerEdit = false;
        this.adminformState = {};
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
@import "src/styles/mixin.scss";
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  @include relative;
  height: 100vh;
  background-color: $bg;
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
    -webkit-text-fill-color: #fff !important;
  }
  input {
    background: transparent;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 0px;
    padding: 12px 5px 12px 15px;
    color: $light_gray;
    height: 47px;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
.changePassBtn {
  padding: 0;
}
</style>
