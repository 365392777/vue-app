<template>
  <div class="bgiBox">
       <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>后台登录页</span>
            </div>
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="账号" prop="uname">
                  <el-input type="text" v-model="ruleForm.uname" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="upwd">
                  <el-input type="password" v-model="ruleForm.upwd" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                  <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
      </el-card>
    </div>
</template>
<script>
export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账号'))
      } else {
        if (this.ruleForm.upwd !== '') {
          this.$refs.ruleForm.validateField('upwd')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        uname: '',
        upwd: ''
      },
      rules: {
        uname: [
          { validator: validatePass, trigger: 'blur' }
        ],
        upwd: [
          { validator: validatePass2, trigger: 'blur' }
        ]

      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios({
            method: 'post',
            url: 'http://localhost:8899/admin/account/login',
            data: this.ruleForm
          }).then(res => {
            console.log(res)
          })
          this.$message({
            message: '恭喜你登录成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '登录失败404',
            type: 'warning'
          })
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style>
.bgiBox{
  width: 500px;
  height: 350px;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%)
}
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
</style>
