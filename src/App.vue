<template>
  <div id="app">
    <header>
      <div class="container">
        <h1 class="title">Logo</h1>
        <span class="wrapper">
          <el-button type="primary" @click="handleSignin">登录</el-button>
          <el-button type="primary" @click="handleSignup">注册</el-button>
        </span>
      </div>
    </header>
    <main>
      <el-row :gutter="20">
      <el-col :span="4">
        <el-menu default-active="1" class="" @select="handleSelect">
          <el-menu-item index="1">
            <i class="el-icon-menu"></i>定投记录</el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-setting"></i>基金列表</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="20">
        <div class="content" v-show="shown == 1">
          <el-table :data="record" border style="width: 100%">
            <el-table-column fixed prop="date" label="日期">
            </el-table-column>
            <el-table-column prop="code" label="代码">
            </el-table-column>
            <el-table-column prop="plan" label="计划买入(元)">
            </el-table-column>
            <el-table-column prop="actual" label="实际买入(元)">
            </el-table-column>
            <el-table-column prop="addUp" label="累计">
            </el-table-column>
          </el-table>
        </div>
        <div class="content" v-show="shown == 2">
        </div>
      </el-col>
    </el-row>
    </main>
  </div>
</template>

<script>
import backend from './backend.js';
import SignUp from './SignUp.vue';

export default {
  data() {
    return {
      shown: 1,
      data: [{
        date: '2016-05-03',
        code: '510690',
        plan: '1500',
        actual: '1450'
      },{
        date: '2016-06-03',
        code: '510690',
        plan: '1500',
        actual: '1450'
      },{
        date: '2016-07-03',
        code: '510690',
        plan: '1500',
        actual: '1450'
      }]
    }
  },

  mounted() {
    backend.init();
    // backend.test().then(function(){
    //   alert('LeanCloud Rocks!');
    // });
  },

  computed: {
      record: function(){
        var addUp = 0
        return this.data.map(function(item, index, data){
          index ? (addUp = +item['actual'] + +data[index - 1]['addUp']) : (addUp += +item['actual']);
          item['addUp'] = addUp;
          return item;
        }).reverse()

      }
  },

  methods: {
    handleSelect(index, path) {
      this.shown = index
    },
    handleSignin(){
      console.log('sign in')
    },
    handleSignup(){
      console.log('sign up')
      const h = this.$createElement;
        this.$msgbox({
          title: '消息',
          message: h(SignUp),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              setTimeout(() => {
                done();
                setTimeout(() => {
                  instance.confirmButtonLoading = false;
                }, 300);
              }, 3000);
            } else {
              done();
            }
          }
        }).then(action => {
          this.$message({
            type: 'info',
            message: 'action: ' + action
          });
        });

    }
  },

  components: {SignUp}
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
