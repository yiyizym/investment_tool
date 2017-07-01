<template>
    <div>
        <el-form v-show="!forgottenPassword" :model="data" :rules="rules" ref="signInForm" label-width="100px">
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="data.email"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="data.password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="forgottenPassword = true" type="text">忘记密码</el-button>
            </el-form-item>
        </el-form>
        <el-form v-show="forgottenPassword" :model="data" :rules="rules" ref="resetPwdForm" label-width="100px">
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="data.email"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    data() {
        return {
            data: {
                email: '',
                password: '',
            },
            forgottenPassword: false,
            rules: {
                email: [
                    { type: 'email', required: true, message: '请输入合法的邮箱', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, message: '长度至少 6 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    watch: {
        forgottenPassword: function(newValue){
            let formToReset = newValue ? 'signInForm' : 'resetPwdForm';
            this.resetForm(formToReset);
        }
    },
    methods: {
        isValid(){
            let isValid = false;
            this.$refs[this.getActiveFormName()]
                .validate((valid)=> isValid = valid);
            return isValid;
        },
        reset() {
            this.resetForm('signInForm');
            this.forgottenPassword = false;
        },
        resetForm(formName){
            this.$refs[formName].resetFields();
        },
        getActiveFormName(){
            return this.forgottenPassword ? 'resetPwdForm' : 'signInForm';
        }
    }
}
</script>
<style>

</style>