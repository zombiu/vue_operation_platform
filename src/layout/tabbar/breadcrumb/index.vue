<template>
  <!-- 写行内元素才管用 -->
  <el-icon style="margin-right: 10px" @click="foldHandle">
    <component :is="layoutFoldStore.fold ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- <el-breadcrumb-item>
      <el-icon style="margin-right: 3px"> <Lock /> </el-icon>权限管理</el-breadcrumb-item
    >
    <el-breadcrumb-item
      ><el-icon style="margin-right: 3px"> <UserFilled /> </el-icon>用户管理</el-breadcrumb-item
    > -->

    <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="item.path" :to="item.path" v-show="item.meta.title">
      <el-icon style="margin-right: 3px">
        <component :is="item.meta.icon"></component>
      </el-icon>{{ item.meta.title }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import useLayoutSettingStore from '@/stores/modules/setting'

let $route = useRoute()


let layoutFoldStore = useLayoutSettingStore()
const foldHandle = () => {
  layoutFoldStore.fold = !layoutFoldStore.fold

}
</script>

<script lang="ts">
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Breadcrumb'
}
</script>

<style lang="scss" scoped></style>