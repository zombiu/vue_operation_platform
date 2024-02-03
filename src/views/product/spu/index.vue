<template>
  <Category :scene="scene" />
  <el-card style="margin-top: 10px">
    <div v-show="scene == 0">
      <el-button :disabled="!categoryStore.c3Id" style="margin-bottom: 10px" type="primary" icon="Plus"
        @click="addSpu">添加SPU</el-button>
      <el-table border :data="records">
        <!-- prop  对应列内容的字段名 -->
        <el-table-column label="序号" width="80px" align="center" type="index" />
        <el-table-column prop="spuName" label="SPU名称" />
        <el-table-column prop="description" label="SPU描述"> </el-table-column>
        <el-table-column label="SPU操作">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" icon="Plus" @click="addSku(row)"></el-button>
            <el-button type="primary" size="small" icon="Edit" @click="editSpu(row)"></el-button>
            <el-button type="primary" size="small" icon="WarningFilled" @click="showSku(row)"></el-button>
            <el-popconfirm :title="'您确定要删除' + row.spuName + '?'" @confirm="deleteAttr(row)">
              <template #reference>
                <el-button type="primary" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination style="margin-top: 10px" v-model:current-page="pageNo" v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]" :small="false" :disabled="false" :background="true"
        layout=" prev, pager, next, jumper,->,total, sizes," :total="total" prev-icon="DArrowLeft" next-icon="DArrowRight"
        @size-change="handleSizeChange" @current-change="fetchSPU" />
    </div>
    <!-- 添加spu -->
    <AddSpuView v-show="scene == 1" ref="spuView" @exit="changeScene" />
    <AddSkuView v-show="scene == 2" ref="skuView" @changeScene="changeScene" />
  </el-card>

  <el-dialog v-model="dialogVisible" title="Shipping address">
    <el-table :data="skuInfoList">
      <el-table-column property="skuName" label="Sku名称" />
      <el-table-column property="price" label="Sku价格" />
      <el-table-column property="weight" label="Sku重量" />
      <el-table-column property="skuDefaultImg" label="Sku图片">

      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import useCategoryStore from '@/stores/modules/category'
import { reqFetchSpu, reqGetSkuInfoList } from '@/api/product/spu/index'
import type { SkuInfo, SkuInfoListResult, Records, SpuRecord, SpuResponseData } from '@/api/product/spu/type'
import AddSpuView from '@/components/product/spu/index.vue'
import AddSkuView from '@/components/product/sku/index.vue'
const pageNo = ref(1)
const limit = ref(3)
const records = ref<Records>([])
const total = ref(1)
const categoryStore = useCategoryStore()
// 0 spu表 1 添加spu  2 添加sku
const scene = ref(0)
const spuView = ref<any>()
const skuView = ref<any>()

const dialogVisible = ref(false)
const skuInfoList = ref<SkuInfo[]>([])

const changeScene = (type: number = 0, mode: 'update' | 'add') => {
  scene.value = type
  if (type == 0) {
    if (mode == 'add') {
      // 刷新列表
      fetchSPU()
    } else {
      fetchSPU(pageNo.value)
    }
  }
}
watch(
  () => {
    return categoryStore.c3Id
  },
  () => {
    if (!categoryStore.c3Id) {
      records.value = []
      total.value = 0
      pageNo.value = 0
      return
    }
    fetchSPU()
  }
)

// 获取SPU分页数据的函数
const fetchSPU = async (pager = 1) => {
  pageNo.value = pager
  let result: SpuResponseData = await reqFetchSpu(pageNo.value, limit.value, categoryStore.c3Id)
  if (result.code == 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}

const handleSizeChange = () => {
  fetchSPU()
}

// 添加spu
const addSpu = () => {
  scene.value = 1
  spuView.value.initAttrData(categoryStore.c3Id)
}
// 编辑spu
const editSpu = (row: SpuRecord) => {
  scene.value = 1
  spuView.value.initAttrData(row)
}

// 推退出编辑状态

//添加sku
const addSku = (row: SpuRecord) => {
  scene.value = 2
  console.log(row);
  skuView.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

// 展示sku列表
const showSku = async (row: SpuRecord) => {
  let result: SkuInfoListResult = await reqGetSkuInfoList(row.id as number)
  if (result.code == 200) {
    // 展示弹框列表
    console.log(result.data);
    skuInfoList.value = result.data
    dialogVisible.value = true
  } else {

  }
}

</script>

<style lang="scss" scoped></style>