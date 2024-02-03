<template>
  <RouterView></RouterView>
  <!-- 显示svg图标 -->
  <!-- <SvgIcon name="home" color="green" width="100px" height="100px"></SvgIcon> -->
</template>
<script setup lang="ts">
// 引入图标组件
import { Plus, Edit } from '@element-plus/icons-vue';
import request from './utils/request';
import { onMounted } from 'vue';
import { reqLogin } from './api/user/index'


onMounted(() => {
  // request({
  //   url: '/user/login',
  //   method: 'post',
  //   data: {
  //     username: 'admin',
  //     password: '111111'
  //   }
  // }).then((res) => {
  //   console.log(res);
  // })

  reqLogin({ username: 'admin', password: '111111' })
})
</script>

<style lang="scss">
div {
  h1 {
    /* color: $color; */
  }
}
</style>