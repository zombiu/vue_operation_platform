<template>
  <!-- 动态生成menu组件 -->

  <template v-for="(item, index) of menuList">
    <!-- 没有子路由的情况 -->
    <template v-if="!item.children">
      <el-menu-item :index="item.path" :key="item.path" v-if="!item.meta.hidden" @click="goRoute">
        <el-icon>
          <!-- 使用vue动态加载组件 -->
          <component :is="item.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 只有一个子路由的情况 -->
    <template v-if="item.children && item.children.length == 1">
      <!-- <el-menu-item :index="item.path" :key="item.path">
          <template #title>
            <span>{{ item.meta.title }}</span>
          </template>
        </el-menu-item> -->
      <el-menu-item
        :index="item.children[0].path"
        :key="item.children[0].path"
        v-if="!item.meta.hidden"
        @click="goRoute"
      >
        <template #title>
          <el-icon>
            <!-- 使用vue动态加载组件 -->
            <component :is="item.children[0].meta.icon"></component>
          </el-icon>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有大于1个子路由的情况 -->
    <template v-if="item.children && item.children.length > 1">
      <el-sub-menu :index="item.path" :key="item.path" v-if="!item.meta.hidden" @click="goRoute">
        <template #title>
          <el-icon>
            <!-- 使用vue动态加载组件 -->
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span>{{ item.meta.title }}</span></template
        >

        <!-- 使用递归函数 -->
        <MenuLayout :menuList="item.children"></MenuLayout>
      </el-sub-menu>
    </template>
  </template>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
// 父传子
let menuListProps = defineProps(['menuList'])

// 获取路由实例
let $router = useRouter()
const goRoute = (v: any) => {
  console.log(v)
  $router.push(v.index)
}
</script>

<script lang="ts">
export default {
  name: 'MenuLayout'
}
</script>

<style>
</style>