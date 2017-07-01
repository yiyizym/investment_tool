<template>
    <el-form :model="data" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="data.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="data.password" auto-complete="off"></el-input>
        </el-form-item>
    </el-form>
</template>
<script>
export default {
    data() {
        return {
            data: {
                email: '',
                password: ''
            },
            rules: {
                email: [
                    { type: 'email', required: true, message: '请输入正确的邮箱', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入正确密码', trigger: 'blur' },
                    { min: 6, message: '长度至少 6 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        isValid(){
            let isValid = false;
            this.$refs['form'].validate((valid)=> isValid = valid);
            return isValid;
        },
        reset() {
            this.$refs['form'].resetFields();
        }
    }
}
</script>
<style>

</style>

