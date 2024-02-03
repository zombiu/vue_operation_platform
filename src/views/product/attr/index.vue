<template>
  <div>
    <Category :scene="scene" />
    <el-card style="margin-top: 10px">
      <!-- 属性展示页面 -->
      <div v-show="scene == 0">
        <el-button
          style="margin-bottom: 10px"
          type="primary"
          icon="Plus"
          @click="addAttr"
          :disabled="!categoryStore.c3Id"
          >添加属性</el-button
        >
        <el-table border :data="attrList">
          <!-- prop  对应列内容的字段名 -->
          <el-table-column prop="id" label="序号" width="80px" align="center" type="index" />
          <el-table-column prop="attrName" label="属性名称" width="120px" />
          <el-table-column prop="attrValueList" label="属性值名称">
            <!-- 这里插槽里的row是一整行的数据 -->
            <template #="{ row, $index }">
              <el-tag style="margin: 5px" v-for="(item, index) in row.attrValueList" :key="item.id"
                >{{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="120px">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="editAttrValue(row)"
              ></el-button>
              <el-popconfirm
                :title="'您确定要删除' + row.attrName + '?'"
                @confirm="deleteAttr(row)"
              >
                <template #reference>
                  <el-button type="primary" size="small" icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性页面 -->
      <div v-show="scene == 1">
        <el-form width="50%" :model="trademarkPramas" :rules="rules" inline="true">
          <el-form-item label="属性名称">
            <el-input placeholder="请输入属性名称" v-model="attrData.attrName"></el-input>
          </el-form-item>
        </el-form>

        <el-button :disabled="!attrData.attrName" type="primary" icon="Plus" @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button type="primary" @click="cancel">取消</el-button>

        <el-table border :data="attrData.attrValueList" style="margin: 10px 0">
          <!-- prop  对应列内容的字段名 -->
          <el-table-column label="序号" width="80px" align="center" type="index" />
          <el-table-column label="属性值">
            <template #="{ row, $index }">
              <el-input
                :ref="(el) => (attrValueInpputArr[$index] = el)"
                @focus="toEdit(row, $index)"
                v-if="row.flag"
                @blur="toView(row, $index)"
                placeholder="请输入属性值"
                v-model="row.valueName"
              ></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #="{ row, $index }">
              <el-popconfirm
                :title="'您确定要删除' + row.tmName + '?'"
                @confirm="deleteAttrValue(row.id)"
              >
                <template #reference>
                  <el-button type="primary" size="small" icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </template> </el-table-column
        ></el-table>
        <el-button style="margin-bottom: 10px" type="primary" @click="saveAttr">保存</el-button>
        <el-button style="margin-bottom: 10px" type="primary" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reqAttrInfoList, reqDeleteAttrValue, saveAttrInfo } from '@/api/product/attr'
import type { AttrList, AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'
import { BaseResponse } from '@/api/user/type'
import useCategoryStore from '@/stores/modules/category'
import { ElMessage } from 'element-plus'
import { nextTick, onMounted, reactive, ref, watch } from 'vue'

let attrData = reactive<Attr>({
  attrName: '',
  attrValueList: [],
  categoryId: 0,
  categoryLevel: 3
})
const categoryStore = useCategoryStore()

let attrList = ref<AttrList>([])
watch(
  () => {
    // 监听第三个选择器 数据的id
    return categoryStore.c3Id
  },
  (value: any) => {
    console.log('watch value=' + value)
    // 清空数据
    attrList.value = []
    if (!value) {
      return
    }
    requestAttrList()
  }
)

onMounted(() => {
  // requestAttrList()
})

const requestAttrList = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  let result: AttrResponseData = await reqAttrInfoList(c1Id, c2Id, c3Id)
  if (result.code == 200) {
    attrList.value = result.data
  }
}
// 控制 添加属性 或者 展示属性
let scene = ref(0)

const addAttr = () => {
  // 清空缓存的数据  以及给categoryId赋值
  Object.assign(attrData, {
    attrName: '',
    attrValueList: [],
    categoryId: categoryStore.c3Id,
    categoryLevel: 3
  })

  scene.value = 1
}

const attrValueInpputArr = ref<any[]>([])
const addAttrValue = () => {
  attrData.attrValueList.push({
    valueName: '',
    flag: true
  })
  nextTick(() => {
    // 获取input 设置焦点
    attrValueInpputArr.value[attrValueInpputArr.value.length - 1].focus()
    console.log(attrValueInpputArr.value)
  })
}

const cancel = () => {
  scene.value = 0
}

const saveAttr = async () => {
  let result: BaseResponse = await saveAttrInfo(attrData)
  if (result.code == 200) {
    cancel()
    requestAttrList()
    ElMessage({ type: 'success', message: attrData.id ? '修改成功' : '保存成功' })
  } else {
    ElMessage({ type: 'error', message: attrData.id ? '修改失败' : '保存失败' })
  }
}
// 失去焦点事件
const toView = (row: AttrValue, $index: number) => {
  if (!row.valueName.trim()) {
    attrData.attrValueList.slice($index, 1)
    attrValueInpputArr.value.slice($index, 1)
    return
  }
  // 如果有属性值相等 就直接删除
  for (let i = 0; i < attrData.attrValueList.length; i++) {
    if (i != $index) {
      if (row.valueName == attrData.attrValueList[i].valueName) {
        ElMessage({ type: 'error', message: '属性值不能重复' })
        attrData.attrValueList.slice($index, 1)
        attrValueInpputArr.value.slice($index, 1)
      }
    }
  }
  row.flag = false
}

const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  nextTick(() => {
    attrValueInpputArr.value[$index].focus()
    console.log(attrValueInpputArr.value[$index])
  })
}

// 编辑已有的属性值
const editAttrValue = (row: Attr) => {
  scene.value = 1
  Object.assign(attrData, row)
  console.log(attrData)
}
// 删除属性
const deleteAttr = async (row: Attr) => {
  console.log('删除' + JSON.stringify(row))

  let result: BaseResponse = await reqDeleteAttrValue(row.id!)
  if (result.code) {
    ElMessage({ type: 'success', message: '删除属性成功' })
  } else {
    ElMessage({ type: 'error', message: '删除属性失败' })
  }
}
</script>

<style lang="scss" scoped>
</style>