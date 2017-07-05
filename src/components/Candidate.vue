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
                <el-button @click="handleBuyIn(scope.$index, scope.row)" type="text" size="small">买入</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import util from '../util.js';
export default {
    props: ['candidates','history'],
    mounted(){
        this._setNationalDebt();
    },
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
        handleBuyIn(index, row) {
            console.log('buy in');
            let currentPE = 1 / row['earningToPrice'] * 100,
                code = row['code'],
                firstBought = this.history.find((item) => item['code'] == code), // TODO 没找到的情况要考虑
                monthsElapsed = util.getMonthsElapsed(firstBought['boughtDate'],(new Date())),
                recommendAmount = Number(firstBought['actualAmount']) * Math.pow(1.01,monthsElapsed) * 10 / currentPE;
        },
        tableRowClassName(row, index) {
            // 盈利收效率大于 10 且 大于 2 倍的十年期国债利率 推荐

            if (row['earningToPrice'] > 10 && row['earningToPrice'] > 2 * this.nationalDebt) {
                return 'recommend-row';
            }
            // 盈利收效率大于 5 （假设余额宝的收益是 5% ）持有
            else if(row['earningToPrice'] > 5){
                return 'hold-row';
            }
            // 否则 卖出
            else {
                return 'sell-row';
            }
        },
        _setNationalDebt(){
            // TODO get from backend
            this.nationalDebt = 3.55;
        },

    }
}
</script>

<style>
.el-table .recommend-row {
    background: #c9e5f5;
}
.el-table .hold-row {
    /*background: #c9e5f5;*/
}
.el-table .sell-row {
    background: #f38585;
}
</style>
