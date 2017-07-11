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
    </el-table>
</template>

<script>
export default {
  props: ['history'],
}
</script>

<style>

</style>
