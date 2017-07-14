<template>
    <section>
        <div>
            <span class="typing"></span>
        </div>
        <el-button @click="handleTry" type="primary">试用</el-button>
    </section>
</template>
<script>
import Typed from 'typed.js';
var options = {
    strings: ["这是一个定投工具", "这是一个指数基金定投工具"],
    loop: true,
    typeSpeed: 40
};
export default {
    mounted() {
        new Typed(".typing", options);
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
