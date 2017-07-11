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
        <el-table-column v-show="isLogIned" fixed="right" label="操作" width="120">
            <template scope="scope">
                <el-button @click="handleBuyIn(scope.$index, scope.row)" type="text" size="small">买入</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import util from '../util.js';
import backend from '../backend.js';
export default {
    props: ['candidates', 'history', 'isLogIned'],
    mounted() {
        this._setNationalDebt();
    },
    computed: {
        recommend: function () {
            var newItem = {};
            return this.candidates.map(function (item, index, data) {
                newItem = Object.assign({}, item);
                newItem['date'] = newItem['date'].toLocaleDateString();
                newItem['earningToPrice'] = newItem['earningToPrice'].toFixed(2);
                return newItem;
            });
        }
    },

    methods: {
        handleBuyIn(index, row) {
            console.log('buy in');
            let currentPE = row['priceToEarning'],
                code = row['code'],
                price = row['price'],
                defaultFirstBought = {
                    boughtDate: null,
                    actualAmount: 1000,
                    price: 1
                },
                firstBought = this.history.find((item) => item['code'] == code) || defaultFirstBought,
                monthsElapsed = util.getMonthsElapsed(firstBought['boughtDate'], (new Date())),
                suggestedTotal = firstBought['actualAmount'] * firstBought['price'] * Math.pow(1.01, monthsElapsed) * 10 / currentPE,
                // 因为实际买入数量只能是 100 的倍数，所以计算出建议买入总价后，还得显示四舍五入成整百的建议买入量
                suggestedAmount = Math.max(Math.round(suggestedTotal / price / 100.0) * 100, 100);
                // 显示有点怪，用 $msgbox 定制
            this.$prompt(`${code} 建议买入 ${suggestedAmount} 股，总价: ${suggestedAmount * price} 元`, '填写实际买入数量（整百）', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                inputValue: suggestedAmount,
                inputValidator: (value) => {
                    // https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
                    return !isNaN(parseFloat(value)) && isFinite(value) && value >= 100 && (value % 100 == 0);
                },
                inputErrorMessage: '请输入正确的整百数字',
                inputPlaceholder: '至少是 100 的整百数字'
            }).then(({value}) => {
                this.$emit('buy', row, suggestedAmount, value)
            }).catch(error => {
                this.$message({
                    type: 'info',
                    message: error
                });
            });
        },
        tableRowClassName(row, index) {
            // 盈利收效率大于 10 且 大于 2 倍的十年期国债利率 推荐

            if (row['earningToPrice'] > 10 && row['earningToPrice'] > 2 * this.nationalDebt) {
                return 'recommend-row';
            }
            // 盈利收效率大于 5 （假设余额宝的收益是 5% ）持有
            else if (row['earningToPrice'] > 5) {
                return 'hold-row';
            }
            // 否则 卖出
            else {
                return 'sell-row';
            }
        },
        _setNationalDebt() {
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
