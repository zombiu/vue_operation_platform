<template>
  <el-card style="margin-top: 10px">
    <el-table border style="margin: 10px 0" :data="skuInfoArr">
      <el-table-column width="100" align="center" type="index" label="序号" />
      <el-table-column width="180" align="center" label="名称" prop="skuName" show-overflow-tooltip />
      <el-table-column width="180" align="center" label="描述" prop="skuDesc" show-overflow-tooltip />
      <el-table-column width="180" label="默认图片">
        <template #="{ row, $index }">
          <img style="width: 100px;height: 100px;" :src="row.skuDefaultImg" alt="">
        </template>
      </el-table-column>
      <el-table-column width="180" align="center" label="重量(g)" prop="weight" />
      <el-table-column width="180" align="center" label="价格(元)" prop="price" />
      <el-table-column width="250" label="操作" fixed="right">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" icon="top" @click="handleSale(row)"></el-button>
          <el-button type="primary" size="small" icon="Edit"></el-button>
          <el-button type="primary" size="small" icon="InfoFilled" @click="showSkuInfo(row)"></el-button>


          <el-popconfirm :title="'您确定要删除' + row.skuName + '?'" @confirm="deleteSku(row)" width="200px">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"> </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[10, 20, 30, 40]"
      :disabled="false" :background="true" layout=" prev, pager, next, jumper,->,total, sizes," :total="total"
      prev-icon="DArrowLeft" next-icon="DArrowRight" @current-change="fetchSkuList" />
  </el-card>

  <el-drawer v-model="drawer" direction="rtl">
    <template #header>
      <h4>查看商品详情</h4>
    </template>
    <template #default>
      <div>
        <el-row style="margin: 10px 0;">
          <el-col :span="8">名称</el-col>
          <el-col :span="16">{{ skuData.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="8">描述</el-col>
          <el-col :span="16">{{ skuData.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="8">价格</el-col>
          <el-col :span="16">{{ skuData.price }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="8">平台属性</el-col>
          <el-col :span="16">
            <el-tag style="margin-right: 5px;" v-for="(item, $index) of skuData.skuAttrValueList" :key="item.id">{{
              item.valueName }}</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="8">销售属性</el-col>
          <el-col :span="16">
            <el-tag style="margin-right: 5px;" v-for="(item, $index) in skuData.skuSaleAttrValueList" :key="item.id">{{
              item.saleAttrValueName }}</el-tag>

          </el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="8">商品图片</el-col>
          <el-col :span="16">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item v-for="item in skuData.skuImageList" :key="item.id">
                <img :src="item.imgUrl" alt="" style="width: 100%;height: 100%;">
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { reqFetchSkuList, reqOnSale, reqCancelSale, reqDeleteSku, getSkuInfo } from '@/api/product/sku';
import type { SkuInfoListResult, SkuInfo, SkuInfoResult } from '@/api/product/sku/type';
import type { BaseResponse } from '@/api/user/type';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';

onMounted(() => {
  fetchSkuList()
})

let pageNo = ref(1)
let limit = ref(10)
let total = ref(0)
let drawer = ref(false)

let skuInfoArr = ref<SkuInfo[]>([])
let skuData = ref<SkuInfo>({
  spuId: 0,
  price: 0,
  skuName: '',
  skuDesc: '',
  weight: '',
  tmId: 0,
  category3Id: 0,
  skuDefaultImg: '',
  skuImageList: [],
  skuAttrValueList: [],
  skuSaleAttrValueList: [],

})

const fetchSkuList = async (pageIndex = 1) => {
  pageNo.value = pageIndex
  let result: SkuInfoListResult = await reqFetchSkuList(pageNo.value, limit.value)
  console.log(JSON.stringify(result));
  if (result.code == 200) {
    skuInfoArr.value = result.data.records
    total.value = result.data.total
    limit.value = result.data.size
  }
}

const onSale = async (skuId: number) => {
  let result: BaseResponse = await reqOnSale(skuId);
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '上架成功' })
  } else {
    ElMessage({ type: 'success', message: '上架失败' })
  }
}

const cancelSale = async (skuId: number) => {
  let result: BaseResponse = await reqCancelSale(skuId);
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '下架成功' })
  } else {
    ElMessage({ type: 'success', message: '下架失败' })
  }
}

const handleSale = async (skuInfo: SkuInfo) => {
  if (skuInfo.isSale == 1) {
    cancelSale(skuInfo.id as number)
  } else {
    onSale(skuInfo.id as number)
  }
}

// 展示sku详情
const showSkuInfo = async (skuInfo: SkuInfo) => {
  drawer.value = true
  let result: SkuInfoResult = await getSkuInfo(skuInfo.id as number)
  if (result.code == 200) {
    skuData.value = result.data
  }
}

// 删除sku
const deleteSku = async (skuInfo: SkuInfo) => {
  let result: BaseResponse = await reqDeleteSku(skuInfo.id as number)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    fetchSkuList(skuInfoArr.value.length > 1 ? pageNo.value : (pageNo.value - 1))
  } else {
    ElMessage({ type: 'success', message: '删除失败' })
  }
}
</script>

<style lang="scss" scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>