<template>
  <el-card>
    <el-form inline="false">
      <el-form-item label="一级分类">
        <el-select v-model="categoryStore.c1Id" @change="changeC1" :disabled="scene != 0">
          <el-option
            v-for="(item, index) in categoryStore.c1Arr"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="categoryStore.c2Id" @change="changeC2" :disabled="scene != 0">
          <el-option
            v-for="(item, index) in categoryStore.c2Arr"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="categoryStore.c3Id" :disabled="scene != 0">
          <el-option
            v-for="(item, index) in categoryStore.c3Arr"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import useCategoryStore from '@/stores/modules/category'

let categoryStore = useCategoryStore()

onMounted(() => {
  getC1SelectList()
})

function getC1SelectList() {
  categoryStore.getC1SelectList()
}

// 选择器 选中值发生变化时触发
const changeC1 = () => {
  // 清除缓存数据
  categoryStore.c2Arr = []
  categoryStore.c2Id = ''
  categoryStore.c3Arr = []
  categoryStore.c3Id = ''

  categoryStore.getC2SelectList()
}

const changeC2 = () => {
  // 清除缓存数据
  categoryStore.c3Arr = []
  categoryStore.c3Id = ''

  categoryStore.getC3SelectList()
}

defineProps(['scene'])
</script>