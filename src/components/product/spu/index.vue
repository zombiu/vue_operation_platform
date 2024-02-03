<template>
  <el-form label-width="100px" label-position="left">
    <el-form-item label="spu名称">
      <el-input placeholder="请您输入SPU名称" v-model="spuResult.spuName"></el-input>
    </el-form-item>
    <el-form-item label="spu品牌">
      <el-select placeholder="请你选择品牌" v-model="spuResult.tmId">
        <el-option v-for="(item, $index) in trademarkList" :key="item.id" :label="item.tmName" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="spu描述">
      <el-input type="textarea" v-model="spuResult.description" />
    </el-form-item>

    <el-form-item label="spu照片">
      <!-- action 上传的地址 务必加上配置里的api  -->
      <el-upload v-model:file-list="imageList" class="avatar-uploader"
        action="http://114.115.179.162:8022/prod-api/admin/product/fileUpload" list-type="picture-card"
        :show-file-list="true">
        <!-- <img v-if="null" class="avatar" /> -->
        <el-icon class="avatar-uploader-icon">
          <Plus />
        </el-icon>
      </el-upload>
    </el-form-item>

    <el-form-item label="spu销售属性">
      <el-select :placeholder="selectableSaleAttrArr.length ? `您还有${selectableSaleAttrArr.length}个属性未选择` : '暂无数据可选择'"
        v-model="selectSaleAttrId">
        <el-option v-for="(item, $index) in selectableSaleAttrArr" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button style="margin-left: 10px" type="primary" icon="Plus" @click="addSaleAttr"
        :disabled="!selectSaleAttrId">添加销售属性</el-button>
    </el-form-item>

    <el-form-item label="">
      <el-table border style="margin: 10px 0 10px" :data="spuSaleAttrList">
        <el-table-column label="序号" width="120" align="center" type="index" />
        <el-table-column prop="saleAttrName" label="属性名" width="120" />
        <el-table-column prop="spuSaleAttrValueList" label="属性值">
          <!-- 这里使用插槽 slot  每一行是一个 SpuSaleAttrData-->
          <template #="{ row, $index }">
            <el-tag style="margin: 5px" v-for="(item, index) in row.spuSaleAttrValueList" :key="item.id" closable
              @close="row.spuSaleAttrValueList.splice(index, 1)">{{ item.saleAttrValueName }}
            </el-tag>
            <el-input @blur="inputBlur(row)" v-model="row.saleAttrValue" v-if="row.flag" placeholder="请输入属性值" size="small"
              style="width: 100px;margin-right: 5px;"></el-input>
            <el-button v-else type="primary" @click="addSpuAttrValue(row)" icon="Plus" size="small"></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="120">
          <template #="{ row, $index }">
            <el-popconfirm :title="'您确定要删除' + row.tmName + '?'" @confirm="deleteSpuAttr(row, $index)">
              <template #reference>
                <el-button type="primary" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="primary" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>


<script setup lang="ts">
import { reqGetBaseSaleAttrList, reqGetSpuImageList, reqGetSpuSaleAttrList, reqGetTrademarkList, reqSaveOrUpdateSpuInfo } from '@/api/product/spu';
import type { SpuSaleAttrValue, SpuSaleAttrData, BaseSaleAttrList, SpuImage, SpuImageList, BaseSaleAttrResult, SpuImageListResult, SpuRecord, SpuResponseData, SpuSaleAttrResult, Trademark, TrademarkListData, BaseSaleAttr } from '@/api/product/spu/type';
import type { BaseResponse } from '@/api/user/type';
import { ElMessage } from 'element-plus';
import type { UploadUserFile } from 'element-plus/lib/components/index.js';
import { computed, ref } from 'vue';

// 更新、添加时使用的数据实体
const spuResult = ref<SpuRecord>({
  "spuName": '',
  "description": '',
  "category3Id": '',
  "tmId": 0,
  "spuSaleAttrList": [],
  "spuImageList": [],
  "spuPosterList": []
})
// 响应式数据
const trademarkList = ref<Trademark[]>([])
// spu照片墙
const imageList = ref<SpuImage[]>([])

// 销售属性 + 属性值列表 
const spuSaleAttrList = ref<SpuSaleAttrData[]>([])
// 基本属性分类
const baseAttrList = ref<BaseSaleAttrList>([])

// 可选择的销售属性
const selectableSaleAttrArr = computed(() => {
  return baseAttrList.value.filter((value: BaseSaleAttr) => {
    return spuSaleAttrList.value.every((saleAttr: SpuSaleAttrData) => {
      return value.id != saleAttr.baseSaleAttrId
    })
  })

})
// 已选择的销售属性
const selectSaleAttrId = ref<number | string>('')

const initAttrData = async (row: SpuRecord) => {
  trademarkList.value = []
  imageList.value = []
  spuSaleAttrList.value = []
  baseAttrList.value = []

  spuResult.value = row

  // 进行网络请求
  let result1: TrademarkListData = await reqGetTrademarkList()
  if (result1.code == 200) {
    trademarkList.value = result1.data
  }

  let result2: SpuImageListResult = await reqGetSpuImageList(row.id!)
  if (result2.code == 200) {
    let imgs = result2.data
    imgs.forEach((value: SpuImage, index: number, array: SpuImage[]) => {
      imgs[index].name = value.imgName
      imgs[index].url = value.imgUrl
    })
    imageList.value = result2.data.map((value: SpuImage) => {
      return {
        name: value.imgName!,
        url: value.imgUrl!
      }
    })
    console.log(JSON.stringify(imageList.value));

  }

  let result3: SpuSaleAttrResult = await reqGetSpuSaleAttrList(row.id!)
  if (result3.code == 200) {
    spuSaleAttrList.value = result3.data
  }


  let result4: BaseSaleAttrResult = await reqGetBaseSaleAttrList()
  if (result4.code == 200) {
    baseAttrList.value = result4.data
  }
}

// 添加新的spu
const initAddSpu = async (c3Id: string) => {
  // 数据清除
  Object.assign(spuResult.value, {
    id: 0,
    "spuName": '',
    "description": '',
    "category3Id": c3Id,
    "tmId": 0,
    "spuSaleAttrList": [],
    "spuImageList": [],
    "spuPosterList": []
  })
  imageList.value = []
  spuSaleAttrList.value = []

  // 进行网络请求
  let result1: TrademarkListData = await reqGetTrademarkList()
  if (result1.code == 200) {
    trademarkList.value = result1.data
  }

  let result4: BaseSaleAttrResult = await reqGetBaseSaleAttrList()
  if (result4.code == 200) {
    baseAttrList.value = result4.data
  }
}

// 添加属性值
const addSpuAttrValue = (row: SpuSaleAttrData) => {
  row.flag = true
}
// 输入属性值后 失去焦点
const inputBlur = (row: SpuSaleAttrData) => {
  const { baseSaleAttrId, saleAttrValue } = row
  let newAttrValue: SpuSaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue!
  }

  if (!saleAttrValue?.trim()) {
    ElMessage({ type: 'error', message: '属性值不能为空' })
    return
  }

  let match = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName == saleAttrValue
  })

  if (match) {
    ElMessage({ type: 'error', message: '属性值不能重复' })
    return
  }

  row.spuSaleAttrValueList.push(newAttrValue)
  row.flag = false
  row.saleAttrValue = ''

}
// 添加销售属性
const addSaleAttr = () => {
  selectableSaleAttrArr.value.forEach((params: BaseSaleAttr) => {
    console.log(params, selectSaleAttrId.value);

    if (params.id == selectSaleAttrId.value) {
      // push一个 SpuSaleAttrData
      spuSaleAttrList.value.push({
        baseSaleAttrId: params.id,
        saleAttrName: params.name,
        spuSaleAttrValueList: []
      })
    }
  })
}
// 删除属性值
const deleteSpuAttr = (row: SpuSaleAttrData, $index: number) => {
  console.log('deleteSpuAttr=' + JSON.stringify(row));
  // 第一个参数是要删除或插入的起始位置，第二个参数是要删除的元素个数（如果不删除元素，则设置为0）
  spuSaleAttrList.value.splice($index, 1)
}

defineExpose({ initAttrData, initAddSpu })
// @exit  事件名
const $emit = defineEmits(['exit']);

// 取消
const cancel = () => {
  spuResult.value = {
    "spuName": '',
    "description": '',
    "category3Id": '',
    "tmId": 0,
    "spuSaleAttrList": [],
    "spuImageList": [],
    "spuPosterList": []
  };
  // 子调父
  $emit('exit', 0, 'update')
}

// 保存
const save = async () => {
  spuResult.value.spuImageList = imageList.value.map((value: SpuImage, index: number) => {
    value.imgName = value.name
    value.imgUrl = value.url
    return value
  })
  spuResult.value.spuSaleAttrList = spuSaleAttrList.value
  let result: BaseResponse = await reqSaveOrUpdateSpuInfo(spuResult.value)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '保存成功' })
    $emit('exit', 0, spuResult.value.id ? 'update' : 'add')
  } else {
    ElMessage({ type: 'error', message: '保存失败' })
  }
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