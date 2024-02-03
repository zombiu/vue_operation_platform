<template>
  <div class="login_container">
    <layout>
      <el-row>
        <el-col :span="12" :xs="0"></el-col>
        <el-col :span="12" :xs="24">
          <div class="login_form">
            <el-form :model="loginForm" :rules="rules" ref="el_form">
              <h1>Hello</h1>
              <h2>欢迎来到硅谷甄选</h2>
              <el-form-item prop="username">
                <el-input v-model="loginForm.username" :prefix-icon="User" />
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  type="password"
                  v-model="loginForm.password"
                  show-password="true"
                  :prefix-icon="Lock"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  :loading="loading"
                  class="login_btn"
                  type="primary"
                  v-on:click="userLogin"
                  >登录</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </layout>
  </div>
</template>

<script setup lang="ts">
// 引入图标组件
import { Plus, Edit, User, Lock } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import { reactive, ref } from 'vue'
import { useUserStore } from '@/stores/modules/user.ts'
import { useRouter, useRoute } from 'vue-router'
import { getTime } from '@/utils/time'
import { el } from 'element-plus/es/locale'

const loginForm = reactive({ username: 'admin', password: 'atguigu123' })
let loading = ref(false)

const validatorUsername = (rule: any, value: any, callback: any) => {
  if (value.length >= 5) {
    return callback()
  } else {
    return callback(new Error('用户名至少5位'))
  }
}

const validatorPassword = (rule: any, value: any, callback: any) => {
  if (value.length >= 5) {
    return callback()
  } else {
    return callback(new Error('密码至少5位'))
  }
}
const rules = {
  username: [
    // { required: true, message: 'Please input Activity name', trigger: 'blur' },  validator
    // { required: true, min: 5, max: 15, message: '用户名最少5位，最多15位', trigger: 'change' },
    { trigger: 'change', validator: validatorUsername }
  ],
  password: [
    // { required: true, message: 'Please input Activity name', trigger: 'blur' },
    // { required: true, min: 5, max: 15, message: '密码最少6位，最多16位', trigger: 'change' }
    { trigger: 'change', validator: validatorUsername }
  ]
}
let el_form = ref()
console.log('el_form=' + el_form)
let $router = useRouter()
let $route = useRoute()
const userStore = useUserStore()
const userLogin = async () => {
  //保证全部表单相校验通过再发请求
  await el_form.value.validate()
  loading.value = true
  console.log('login')
  try {
    await userStore.userLogin(loginForm)

    let redirect: any = $route.query.redirect

    if (redirect) {
      $router.push(redirect)
      console.log('获取的query参数=' + redirect)
    } else {
      $router.push('./')
    }
    const time = getTime()
    ElNotification({ type: 'success', message: '欢迎回来', title: `hi,${time}` })
    loading.value = false
  } catch (error) {
    ElNotification({ type: 'error', message: error.message })
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;

  h1 {
    font-size: 40px;
    color: white;
  }

  h2 {
    font-size: 20px;
    padding: 20px 0;
    color: white;
  }

  .login_btn {
    width: 100%;
  }
}

.login_form {
  position: relative;
  top: 30vh;
  width: 500px;
  background: url(../../assets/images/login_form.png);
  padding: 40px;
  box-sizing: content-box;
}
</style>