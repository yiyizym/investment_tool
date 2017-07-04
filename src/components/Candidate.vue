<template>
    <el-table :data="recommend" :row-class-name="tableRowClassName" border style="width: 100%">
        <el-table-column fixed prop="date" label="日期">
        </el-table-column>
        <el-table-column prop="name" label="名称">
        </el-table-column>
        <el-table-column prop="code" label="代码">
        </el-table-column>
        <el-table-column prop="earningToPrice" label="盈利收益率(%)">
        </el-table-column>
        <el-table-column prop="priceToBook" label="市净率">
        </el-table-column>
        <el-table-column prop="dividendYieldRatio" label="股息率(%)">
        </el-table-column>
        <el-table-column prop="returnOnEquity" label="股本收益率(%)">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
            <template scope="scope">
                <el-button @click="handleBuyIn" type="text" size="small">买入</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    props: ['candidates'],
    computed: {
        recommend: function () {
            var newItem = {};
            return this.candidates.map(function (item, index, data) {
                newItem = Object.assign({}, item);
                newItem['date'] = newItem['date'].toLocaleDateString();
                return newItem;
            });
        }
    },
    methods: {
        handleBuyIn() {
            console.log('buy in');
        },
        tableRowClassName(row, index) {
            console.log(row);
            if (row['code'] == '510880') {
                return 'info-row';
            }
        },
    }
}
</script>

<style>
.el-table .info-row {
    background: #c9e5f5;
}
</style>
