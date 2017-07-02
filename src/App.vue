<template>
  <div id="app">
    <header>
      <div class="container">
        <h1 class="title">Logo</h1>
        <span class="wrapper">
          <el-button type="primary" v-show="!isLogIned" @click="handleSignIn">登录</el-button>
          <el-button type="primary" v-show="!isLogIned" @click="handleSignUp">注册</el-button>
          <el-button type="primary" v-show="isLogIned">{{userName}}</el-button>
          <el-button type="primary" v-show="isLogIned" @click="handleSignOut">退出</el-button>
        </span>
      </div>
    </header>
    <main>
      <el-row :gutter="20">
      <el-col :span="4">
        <el-menu :default-active="shown" class="" @select="handleSelect">
          <el-menu-item index="1">
            <i class="el-icon-menu"></i>定投记录</el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-setting"></i>基金列表</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="20">
        <div class="content" v-show="shown == '1'">
          <el-table :data="record" border style="width: 100%">
            <el-table-column fixed prop="boughtDate" label="日期">
            </el-table-column>
            <el-table-column prop="name" label="名称">
            </el-table-column>
            <el-table-column prop="code" label="代码">
            </el-table-column>
            <el-table-column prop="price" label="价格">
            </el-table-column>
            <el-table-column prop="suggestedAmount" label="计划买入">
            </el-table-column>
            <el-table-column prop="actualAmount" label="实际买入">
            </el-table-column>
            <el-table-column prop="addUp" label="累计">
            </el-table-column>
          </el-table>
        </div>
        <div class="content" v-show="shown == '2'">
        </div>
      </el-col>
    </el-row>
    </main>
  </div>
</template>

<script>
import backend from './backend.js';
import SignUp from './components/SignUp.vue';
import SignIn from './components/SignIn.vue';

export default {
  data() {
    return {
      userName: '',
      shown: '1',
      data: []
    }
  },

  mounted() {
    backend.init();
    
    this.loadPage();
  },

  computed: {
      record: function(){
        var addUp = 0
        return this.data.map(function(item, index, data){
          let actualAmount = Number(item['actualAmount']) || 0
          index ? (addUp = actualAmount + +data[index - 1]['addUp']) : (addUp += actualAmount);
          item['addUp'] = addUp;
          item['boughtDate'] = item['boughtDate'].toLocaleDateString();
          return item;
        }).reverse();

      },
      isLogIned: function(){
        return this.userName != '';
      }
  },

  methods: {
    handleSelect(index, path) {
      this.shown = String(index);
    },
    handleSignIn(){
      console.log('sign in')
      const h = this.$createElement;
      this.$msgbox({
        title: '登录',
        message: h(SignIn),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if(action === 'cancel'){
            return done();
          }
          let signInInstance = instance.$slots['default'][0].componentInstance;
          if(signInInstance.isValid() === false){
            return;
          }
          instance.confirmButtonLoading = true;
          instance.confirmButtonText = '提交中...';
          setTimeout(() => {
            done();
            setTimeout(() => {
              instance.confirmButtonLoading = false;
            }, 300);
          },1000);
        },
        callback: (action, instance) => {
          let signInInstance = instance.$slots['default'][0].componentInstance;

          if(action === 'cancel'){
            signInInstance.reset();
            return ;
          }

          if(signInInstance.forgottenPassword){
            backend
              .resetPassword(signInInstance.data.email)
              .then(success => {
                this.$message({
                  type: 'success',
                  message: '重置密码的邮件已发送到你的邮箱，请查收'
                });
              }, error => {
                this.$message({
                  type: 'error',
                  message: error.message
                });
              })
          }else{
            backend
              .signIn(signInInstance.data.email, signInInstance.data.password)
              .then(loginedUser => {
                this.$message({
                  type: 'success',
                  message: '登录成功'
                });
                this.loadPage();
              },error => {
                this.$message({
                  type: 'error',
                  message: error.message
                });
              });
          }
          signInInstance.reset();
        }
      });
    },
    handleSignUp(){
      console.log('sign up')
      const h = this.$createElement;
      this.$msgbox({
        title: '注册',
        message: h(SignUp),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if(action === 'cancel'){
            return done();
          }
          let signUpInstance = instance.$slots['default'][0].componentInstance;          
          if(signUpInstance.isValid() === false){
            return ;
          }
          instance.confirmButtonLoading = true;
          instance.confirmButtonText = '提交中...';
          setTimeout(() => {
            done();
            setTimeout(() => {
              instance.confirmButtonLoading = false;
            }, 300);
          },1000);
        },
        callback: (action, instance) => {
          let signUpInstance = instance.$slots['default'][0].componentInstance;  

          if(action === 'cancel'){
            return ;
          }
          
          backend
            .signUp(signUpInstance.data.email, signUpInstance.data.password)
            .then(loginedUser => {
              this.$message({
                type: 'info',
                message: '注册成功，登录前请先验证邮箱'
              });
            },error => {
              this.$message({
                type: 'error',
                message: error.message
              });
            });

          signUpInstance.reset();
          
        }
      });
    },
    handleSignOut(){
      this.$confirm('你确定要退出当前账号吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info',
          callback: (action, instance) => {
            if(action === 'confirm'){
              backend.signOut();
              this.resetPage();
              this.$message({
                type: 'success',
                message: '你已成功退出'
              })
            }
          }
        })
      
    },
    loadPage(){
      this.shown = '1';
      this.setUser();
      this.getFundHistory();
    },
    resetPage(){
      this.userName = '';
      this.shown = '1';
      this.data = [];
    },
    setUser(){
      var currentUser = backend.getCurrentUser();
      if(currentUser){
        this.userName = currentUser.getEmail();
      }
    },
    getFundHistory(){
      if(!this.isLogIned){
        return;
      }
      backend.getFundHistory().then(data => {
        this.data = data;
      })
    },
  }

}
</script>

<style>
body {
  margin: 0;
}
header {
    background-color: rgb(32, 160, 255);
}
header .container {
    box-sizing: border-box;
    max-width: 1080px;
    display: flex;
    height: 60px;
    margin: 0 auto 20px;
    align-items: center;
    justify-content: space-between;
}
header .container h1 {
  color: #fff;
}

main {
  max-width: 1080px;
  margin: 0 auto;
}

</style>
