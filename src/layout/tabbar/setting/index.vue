<template>
  <el-button icon="Refresh" circle @click="refreshView" />
  <el-button icon="FullScreen" circle @click="fullScreen" />
  <el-button icon="Setting" circle @click="settingClick" />
  <img :src="userStore.avatar" alt="" class="avatar" />
  <el-dropdown style="margin-left: 10px">
    <span>
      {{ userStore.username }}<el-icon><arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item icon="Plus" @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <el-drawer v-model="drawer" title="主题设置" :direction="RTL">
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker v-model="color" show-alpha :predefine="predefineColors" @change="colorChange" />
      </el-form-item>
      <el-form-item label="黑暗模式">
        <el-switch v-model="value2" class="mt-2" style="margin-left: 24px" inline-prompt active-icon="Check"
          inactive-icon="Close" @change="darkChange" />
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script lang="ts" setup>
import useLayoutSettingStore from '@/stores/modules/setting'
import { useUserStore } from '@/stores/modules/user'
import { RTL } from 'element-plus/es/components/virtual-list/src/defaults.mjs';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'

const value2 = ref(false)
let drawer = ref(false)
let layoutSettingStore = useLayoutSettingStore()
const refreshView = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}

const fullScreen = () => {
  // 判断是否全屏
  let full = document.fullscreenElement
  console.log('是否全屏=' + full)

  if (full) {
    // 退出全屏
    document.exitFullscreen()
  } else {
    // 设置web全屏
    document.documentElement.requestFullscreen()
  }
}

// 获取路由器对象
let $router = useRouter()
let $route = useRoute()
const logout = async () => {
  try {
    await userStore.logout()
  } catch (error) {
    console.log(error)
  }
  $router.push({ path: '/login', query: { redirect: $route.fullPath } })
}

let userStore = useUserStore()

const settingClick = () => {
  drawer.value = true
}

const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

const colorChange = (params: string) => {
  drawer.value = false

  const el = document.documentElement

  // 设置 css 变量
  el.style.setProperty('--el-color-primary', params)
}

const darkChange = (value: boolean) => {
  let html = document.documentElement
  if (value) {
    html.className = 'dark'
  } else {
    html.className = ''
  }

}
</script>

<script lang="ts">
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Setting'
}
</script>

<style lang="scss" scoped>
.avatar {
  width: 32px;
  height: 32px;
  margin-left: 10px;
  border-radius: 50%;
}
</style>