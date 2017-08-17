<template>
    <section>
        <div>
            <div class="typing"></div>
        </div>
        <el-button @click="handleTry" type="primary">试用</el-button>
    </section>
</template>
<script>
const YaType = require('yatype');

let option = {
    strings: [
        {content: '这是一款定投工具'},
        {content: '这是一款 ETF 基金定投工具'},
        {content: '这是一款不太专业的 ETF 基金定投工具'}
    ],
    effect: 'moveBack'
}

export default {
    mounted() {
        new YaType('.typing', option);
    },
    methods: {
        handleTry() {
            this.$emit('tryToUse')
        }
    }
}
</script>
<style>

</style>
