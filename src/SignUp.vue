<template>
    <el-form :model="signUpForm" :rules="rules" ref="signUpForm" label-width="100px" class="demo-signUpForm">
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="signUpForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="signUpForm.password"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('signUpForm')">立即创建</el-button>
            <el-button @click="resetForm('signUpForm')">重置</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
export default {
    data() {
        return {
            signUpForm: {
                email: '',
                password: ''
            },
            rules: {
                email: [
                    { type: 'email', required: true, message: '请输入正确的邮箱', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
}
</script>
<style>

</style>

