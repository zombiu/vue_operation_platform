<template>
  <!-- 路由组件出口的位置 -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" v-if="load" />
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue'
import useLayoutSettingStore from '@/stores/modules/setting'

let load = ref(true)
let layoutSettingStore = useLayoutSettingStore()
watch(
  () => {
    return layoutSettingStore.refresh
  },
  () => {
    load.value = false
    console.log('监听refresh=' + layoutSettingStore.refresh)
    nextTick(() => {
      load.value = true
    })
  }
)
</script>

<script lang="ts">
export default {
  name: 'Main'
}
</script>

<style lang="scss" scoped>
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}
.fade-enter-active {
  transition: all 1s;
}
.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>