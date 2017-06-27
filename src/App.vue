<template>
  <div id="app">
    <div class="head">logo</div>
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
          <el-table :data="record" border style="width: 100%" height="250">
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
        <div class="content" v-show="shown == 2">2</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
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
    }
  }
}
</script>

<style>
body {
  margin: 0;
}

.head {
  height: 50px;
  line-height: 50px;
}

.content {
  padding-right: 20px;
}
</style>
