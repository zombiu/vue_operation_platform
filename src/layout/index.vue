<template>
  <div class="layout_container">
    <div class="layout_slider" :class="{ fold: layoutFoldStore.fold ? false : false }">
      <logo></logo>
      <!-- menu菜单 -->
      <el-scrollbar class="scrollbar">
        <!-- 这里使用选择器不好使 -->
        <el-menu :collapse="layoutFoldStore.fold" background-color="$base_menu_backgroudcolor" text-color="white"
          mode="vertical" :default-active="$router.currentRoute.value.path" style="border-right: 0">
          <!-- style="border-right: 0" 去掉右边白线 -->
          <!-- <el-menu-item index="1">首页</el-menu-item>
          <el-menu-item index="2">数据大屏</el-menu-item>
          <el-sub-menu index="3">
            <template #title> <span>权限管理</span></template>
            <el-menu-item index="3-1">用户管理</el-menu-item>
            <el-menu-item index="3-2">角色管理</el-menu-item>
            <el-menu-item index="3-3">菜单管理</el-menu-item>
          </el-sub-menu> -->

          <!-- 动态生成menu菜单 传入路由数据-->
          <MenuLayout :menuList="userStore.menuRoutes"></MenuLayout>
        </el-menu>
      </el-scrollbar>
    </div>
    <div class="layout_tabbar" :class="{ fold: layoutFoldStore.fold ? true : false }">
      <div class="tabbar_left">
        <Breadcrumb />
      </div>
      <div class="tabbar_right">
        <Setting />
      </div>
    </div>
    <div class="layout_main" :class="{ fold: layoutFoldStore.fold ? true : false }">
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { useRouter } from 'vue-router'
import Main from '@/layout/main/index.vue'
import Logo from './logo/logo.vue'
import { useUserStore } from '@/stores/modules/user.ts'
import MenuLayout from './menu/index.vue'
import Breadcrumb from './tabbar/breadcrumb/index.vue'
import Setting from './tabbar/setting/index.vue'
import useLayoutFoldStore from '@/stores/modules/setting'
import { onMounted } from 'vue'

// 用来传递路由数据
let userStore = useUserStore()

let $router = useRouter()
// console.log($router)
// 菜单的折叠状态
let layoutFoldStore = useLayoutFoldStore()
// 加载用户信息
onMounted(() => {
  // userStore.userInfo()
})
</script>

<script lang="ts">
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Layout'
}
</script>

<style lang="scss" scoped>
.layout_container {
  width: 100%;
  height: 100vh;
}

.layout_slider {
  width: $base_menu_width;
  height: 100%;
  background-color: $base_menu_backgroudcolor;
  // 过渡动画
  transition: all 0.3s;

  &.fold {
    width: $base_menu_min_width;
  }

  .scrollbar {
    width: 100%;
    height: calc(100vh - 50px);
  }

  .slider_menu {
    background-color: $base_menu_backgroudcolor;
  }
}

.layout_tabbar {
  display: flex;
  // 主轴排列方式
  justify-content: space-between;
  // 侧轴排列方式
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  width: calc(100% - $base_menu_width);
  height: $base_tabbar_height;
  background-color: #fff;
  // 过渡动画
  transition: all 0.3s;
  border-bottom: 1px solid rgba($color: #000000, $alpha: 0.2);

  &.fold {
    width: calc(100% - $base_menu_min_width);
  }
}

.layout_main {
  position: absolute;
  right: 0;
  top: $base_tabbar_height;
  width: calc(100% - $base_menu_width);
  height: calc(100vh - $base_tabbar_height);

  padding: 20px;
  overflow: auto;
  // 过渡动画
  transition: all 0.3s;

  p {
    height: 1000px;
    background-color: gray;
  }

  &.fold {
    width: calc(100% - $base_menu_min_width);
  }
}

.tabbar_left {
  display: flex;
  padding: 0 20px;
}

.tabbar_right {
  display: flex;
  align-items: center;
}
</style>>

