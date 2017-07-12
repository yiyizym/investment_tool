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
        <el-menu :default-active="shown" @select="handleSelect">
          <el-menu-item index="1">
            <i class="el-icon-menu"></i>定投记录</el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-setting"></i>基金列表</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="20">
        <div class="content" v-show="shown == '1'">
          <FundHistory
            :history="record"
            :isLogIned="isLogIned"
            v-on:deleteHistory="deleteHistory"
            border
            style="width: 100%"></FundHistory>
        </div>
        <div class="content" v-show="shown == '2'">
          <Candidate
            :candidates="candidates" 
            :history="fundHistory"
            :isLogIned="isLogIned"
            v-on:buy="buy"></Candidate>
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
import Candidate from './components/Candidate.vue';
import FundHistory from './components/FundHistory.vue';

export default {
  data() {
    return {
      userName: '',
      shown: '',
      fundHistory: [],
      candidates: []
    }
  },

  mounted() {
    backend.init();
    
    this.loadPage();
  },

  computed: {
      record: function(){
        var addUp = 0;
        return this.fundHistory.map((item, index, data) => {
          var itemCopy = Object.assign({}, item);
          itemCopy['boughtDate'] = itemCopy['boughtDate'].toLocaleDateString();
          return itemCopy;
        }).map((item, index, data) => {
          let actualAmount = item['actualAmount'] || 0
          index ? (addUp = actualAmount * item['price'] + data[index - 1]['addUp']) : (addUp += actualAmount * item['price']);
          item['addUp'] = Math.round(addUp);
          return item;
        }).reverse();

      },
      isLogIned: function(){
        return this.userName != '';
      }
  },

  components: {Candidate, FundHistory},

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
      this.shown = '2';
      this.setUser();
      this.getFundHistory();
      this.getCandidates();
    },
    resetPage(){
      this.userName = '';
      this.shown = '1';
      this.fundHistory = [];
      this.candidates = [];
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
        this.fundHistory = data;
      })
    },
    getCandidates(){
      if(!this.isLogIned){
        return;
      }
      backend.getCandidates().then(data => {
        this.candidates = data;
      })
    },
    buy(row, suggestedAmount, actualAmount){
      backend
        .createFundHistory(row, suggestedAmount, actualAmount)
        .then(fundHistory => {
          this.insertHistory(row, suggestedAmount, actualAmount);
          this.$message({
              type: 'success',
              message: `你买入了 ${actualAmount * row['price']} 元 ${row['code']} 基金`
          });
        })
        .catch((error) => {
            console.error('Failed to create new object, with error message: ' + error.message);
        })
    },

    insertHistory(row, suggestedAmount, actualAmount){
      this.fundHistory.push({
        'name': row['name'],
        'code': row['code'],
        'boughtDate': (new Date()),
        'suggestedAmount': suggestedAmount,
        'actualAmount': actualAmount,
        'price': row['price']
      })
    },

    deleteHistory(data){
      console.log(data);
      backend
        .deleteFundHistory(data['id'])
        .then(_ => {
          debugger
          // this.fundHistory.splice(index, 1);
          //TODO
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
        .catch(error => console.error)
    }
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
