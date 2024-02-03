<template>
  <div class="logo">
    <img :src="setting.logo" alt="" />
    <p>{{ setting.title }}</p>
  </div>
</template>

<script lang="ts" setup>
import setting from '@/setting'
</script>

<script lang="ts">
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Logo'
}
</script>

<style lang="scss">
.logo {
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  color: white;
  padding-left: 10px;
  img {
    width: 40px;
    height: 40px;
  }
  p {
    font-size: 20px;
    margin-left: 10px;
  }
}
</style>