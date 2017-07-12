<template>
  <el-table :data="history" border style="width: 100%">
    <el-table-column fixed prop="boughtDate" label="日期">
    </el-table-column>
    <el-table-column prop="name" label="名称">
    </el-table-column>
    <el-table-column prop="code" label="代码">
    </el-table-column>
    <el-table-column prop="price" label="价格">
    </el-table-column>
    <el-table-column prop="suggestedAmount" label="计划买入量">
    </el-table-column>
    <el-table-column prop="actualAmount" label="实际买入量">
    </el-table-column>
    <el-table-column prop="addUp" label="累计">
    </el-table-column>
    <el-table-column v-show="isLogIned" fixed="right" label="操作" width="120">
        <template scope="scope">
            <el-button @click="handleDelete(scope.row)" v-show="inOneMonth(scope.row)" type="text" size="small">删除</el-button>
        </template>
    </el-table-column>
    </el-table>
</template>

<script>
import util from '../util.js';
export default {
  props: ['history','isLogIned'],

  methods: {
    handleDelete(row){
      this
        .$confirm(`你要删除（${row.boughtDate} 买入 ${row.code}）这条历史记录吗？`)
        .then(_ => this.$emit('deleteHistory', row))
        .catch(_ => this.$message({type: 'info',message: '你已取消'}))
      
    },
    inOneMonth(data){
      return util.getMonthsElapsed((new Date(data['boughtDate'])), new Date()) == 0;
    }
  }
}
</script>

<style>

</style>
