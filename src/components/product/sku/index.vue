<template>
  <el-form label-width="100px" label-position="left">
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuEntity.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)" v-model="skuEntity.price"></el-input>
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input placeholder="重量(g)" v-model="skuEntity.weight"></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input type="textarea" placeholder="SKU描述" v-model="skuEntity.skuDesc" />
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true" label-width="100px">
        <el-form-item v-for="(item, $index) in attrList" :key="item.id" :label="item.attrName">
          <el-select placeholder="请你选择平台属性" v-model="item.attrIdAndValueName">
            <el-option v-for="(attr, i) in item.attrValueList" :key="attr.id" :label="attr.valueName"
              :value="`${attr.attrId}:${attr.id}}`" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true" label-width="50px">
        <el-form-item v-for="(item, $index) of spuSaleAttrList" :key="item.id" :label="item.saleAttrName">
          <el-select placeholder="请你选择销售属性" v-model="item.saleAttrIdAndValueId">
            <el-option v-for="(attr, i) in item.spuSaleAttrValueList" :key="attr.id" :label="attr.saleAttrValueName"
              :value="`${attr.baseSaleAttrId}:${attr.id}}`" />
          </el-select>
        </el-form-item>

      </el-form>
    </el-form-item>

    <el-form-item label="图片名称">
      <el-table border style="margin: 10px 0 10px" :data="imageList" ref="table">
        <el-table-column width="100" align="center" type="selection" />
        <el-table-column prop="saleAttrName" label="图片">
          <template #="{ row, $index }">
            <img style="width: 100px;height: 100px;" :src="row.imgUrl" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="spuSaleAttrValueList" label="名称">
          <template #="{ row, $index }">
            <h4>{{ row.imgName }}</h4>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" @click="setDefaultImage(row, $index)">设为默认</el-button>
            <!-- <el-popconfirm :title="'您确定要删除' + row.tmName + '?'" @confirm="deleteSpuAttr(row, $index)">
              <template #reference>
                <el-button type="primary" size="small">设为默认</el-button>
              </template>
            </el-popconfirm> -->
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="primary" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>


<script setup lang="ts">
import { reqAttrInfoList, saveSkuInfo } from '@/api/product/attr';
import type { AttrList, AttrResponseData } from '@/api/product/attr/type';
import { reqGetBaseSaleAttrList, reqGetSpuImageList, reqGetSpuSaleAttrList, reqGetTrademarkList, reqSaveOrUpdateSpuInfo } from '@/api/product/spu';
import type { SkuEntity, SpuSaleAttrValue, SpuSaleAttrData, BaseSaleAttrList, SpuImage, SpuImageList, BaseSaleAttrResult, SpuImageListResult, SpuRecord, SpuResponseData, SpuSaleAttrResult, Trademark, TrademarkListData, BaseSaleAttr } from '@/api/product/spu/type';
import type { BaseResponse } from '@/api/user/type';
import { ElMessage } from 'element-plus';
import type { UploadUserFile } from 'element-plus/lib/components/index.js';
import { computed, reactive, ref } from 'vue';

let table = ref<any>()

const skuEntity = reactive<SkuEntity>({
  "category3Id": '',
  "price": '',
  "spuId": 0,
  "tmId": 0,
  "weight": '',
  "skuName": '',
  "skuDefaultImg": '',
  "skuDesc": '',
})

// 平台属性列表
const attrList = ref<AttrList>()

// spu照片墙
const imageList = ref<SpuImage[]>([])

// 销售属性列表 
const spuSaleAttrList = ref<SpuSaleAttrData[]>([])


const initSkuData = async (c1Id: string, c2Id: string, row: SpuRecord) => {
  console.log(JSON.stringify(row));
  Object.assign(skuEntity, {
    "category3Id": row.category3Id,
    "price": '',
    "spuId": row.id,
    "tmId": row.tmId,
    "weight": '',
    "skuName": '',
    "skuDefaultImg": '',
    "skuDesc": '',
    skuAttrValueList: [],
    skuSaleAttrValueList: []
  })

  // 进行网络请求
  let result1: AttrResponseData = await reqAttrInfoList(c1Id, c2Id, row.category3Id)
  if (result1.code == 200) {
    attrList.value = result1.data
  }

  let result2: SpuImageListResult = await reqGetSpuImageList(row.id!)
  if (result2.code == 200) {
    let imgs = result2.data
    imgs.forEach((value: SpuImage, index: number, array: SpuImage[]) => {
      imgs[index].name = value.imgName
      imgs[index].url = value.imgUrl
    })
    imageList.value = imgs
    console.log(JSON.stringify(imageList.value));

  }

  let result3: SpuSaleAttrResult = await reqGetSpuSaleAttrList(row.id!)
  if (result3.code == 200) {
    spuSaleAttrList.value = result3.data
  }

}


defineExpose({ initSkuData })
// @changeScene  事件名
const $emit = defineEmits(['changeScene']);

// 取消
const cancel = () => {
  // 子调父
  $emit('changeScene', 0, 'update')
}

// 保存
const save = async () => {
  // 收集信息
  skuEntity.skuAttrValueList = attrList.value?.reduce((prev: any, next: any) => {


    if (next.attrIdAndValueName) {
      let [attrId, valueId] = next.attrIdAndValueName.split(':')

      prev.push({ attrId, valueId })
    }
    return prev
  }, [])

  skuEntity.skuSaleAttrValueList = spuSaleAttrList.value?.reduce((prev: any, next: any) => {


    if (next.saleAttrIdAndValueId) {
      let [saleAttrId, saleAttrValueId] = next.saleAttrIdAndValueId.split(':')

      prev.push({ saleAttrId, saleAttrValueId })
    }
    return prev
  }, [])



  let result = await saveSkuInfo(skuEntity)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '添加sku成功' })
    $emit('changeScene', 0, '')
  } else {
    ElMessage({ type: 'error', message: '添加sku失败' })
  }
}

// 设置默认图片
const setDefaultImage = (data: SpuImage, index: number) => {
  console.log(table);
  imageList.value.forEach((row) => {
    table.value.toggleRowSelection(row, false)
  })
  table.value.toggleRowSelection(data, true)
  skuEntity.skuDefaultImg = data.imgUrl as string
}
</script>

<style lang="scss" scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>