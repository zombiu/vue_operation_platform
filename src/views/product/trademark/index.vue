<template>
  <el-card class="box-card">
    <el-button type="primary" icon="Plus" @click="addTrademark">添加品牌</el-button>
    <el-table border style="width: 100%; margin: 20px 0 10px" :data="trademarkArr">
      <el-table-column prop="id" label="序号" width="80" align="center" />
      <el-table-column prop="tmName" label="品牌名称" />
      <el-table-column prop="logoUrl" label="品牌Logo">
        <!-- 这里使用插槽 slot -->
        <template #="{ row, $index }">
          <img
            :src="row.logoUrl.startsWith('http') ? row.logoUrl : 'http://' + row.logoUrl"
            alt=""
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="品牌操作">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="editTrademark(row)"
          ></el-button>
          <el-popconfirm
            :title="'您确定要删除' + row.tmName + '?'"
            @confirm="deleteTrademark(row.id)"
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 9]"
      :small="false"
      :disabled="false"
      :background="true"
      layout=" prev, pager, next, jumper,->,total, sizes,"
      :total="total"
      prev-icon="DArrowLeft"
      next-icon="DArrowRight"
      @size-change="handleSizeChange"
      @current-change="fetchTrademarkList"
    />
  </el-card>

  <el-dialog v-model="dialogFormVisible" :title="trademarkPramas.id ? '修改品牌' : '添加品牌'">
    <el-form width="80%" :model="trademarkPramas" :rules="rules" ref="trademarkFrom">
      <el-form-item label="品牌名称" label-width="80px" prop="tmName">
        <el-input placeholder="请输入品牌名称" v-model="trademarkPramas.tmName"></el-input>
      </el-form-item>
      <el-form-item label="品牌Logo" label-width="80px" prop="logoUrl">
        <!-- action 上传的地址 务必加上配置里的api  -->
        <el-upload
          class="avatar-uploader"
          action="/api/admin/product/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="trademarkPramas.logoUrl" :src="trademarkPramas.logoUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel" type="primary">取消</el-button>
        <el-button type="primary" @click="confirm"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import {
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
  reqFetchTrademarkList
} from '@/api/product/trademark/index'
import type { Records, Trademark, TrademarkData, UploadResult } from '@/api/product/trademark/type'
import { ElMessage } from 'element-plus'
import { BaseResponse } from '@/api/user/type'

let pageNo = ref<number>(1)

let limit = ref<number>(3)
let total = ref<number>(0)

onMounted(() => {
  fetchTrademarkList()
})

let trademarkArr = ref<Records>([])
// current-change事件会注入目标页码数
async function fetchTrademarkList(pageIndex: number = 1) {
  pageNo.value = pageIndex
  let result: TrademarkData = await reqFetchTrademarkList(pageNo.value, limit.value)
  trademarkArr.value = result.data.records
  total.value = result.data.total
  // console.log(result)
}
// 分页器的自定义事件 会注入一个当前页码的数据 页码变化时回调
// const handleCurrentChange = (pageNo: number) => {
//   fetchTrademarkList()
// }
// 分页器 每页数据变化时的回调
const handleSizeChange = () => {
  fetchTrademarkList()
}

// const trademarkLogo = computed((row: any) => {
//   return row.logoUrl.startsWith('http') ? row.logoUrl : 'http://' + row.logoUrl
// })

let dialogFormVisible = ref(false)
const addTrademark = () => {
  dialogFormVisible.value = true
  // 清空缓存的响应数据
  trademarkPramas.id = ''
  trademarkPramas.tmName = ''
  trademarkPramas.logoUrl = ''

  // 清空表单验证错误
  // 1.第一种方法 使用ts 问号语法
  // trademarkFrom.value?.clearValidate('tmName')
  // trademarkFrom.value?.clearValidate('logoUrl')
  // 2.第二种方法
  nextTick(() => {
    trademarkFrom.value.clearValidate('tmName')
    trademarkFrom.value.clearValidate('logoUrl')
  })
}
const cancel = () => {
  dialogFormVisible.value = false
}
const confirm = async () => {
  // 进行表单校验
  await trademarkFrom.value.validate()
  let result: BaseResponse = await reqAddOrUpdateTrademark(trademarkPramas)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: trademarkPramas.id ? '修改品牌成功' : '添加品牌成功' })
    // 刷新最大条目数
    fetchTrademarkList(trademarkPramas.id ? pageNo.value : 1)
  } else {
    ElMessage({ type: 'error', message: trademarkPramas.id ? '修改品牌失败' : '添加品牌失败' })
  }
  dialogFormVisible.value = false
}

// 图片上传
const trademarkPramas = reactive<Trademark>({
  tmName: '',
  logoUrl: ''
})
//  上传文件之前的钩子，参数为上传的文件， 若返回false或者返回 Promise 且被 reject，则停止上传
const beforeAvatarUpload = (rowFile: File) => {
  // console.log(rowFile)
  // 判断上传文件的格式和大小
  if (rowFile.type == 'image/png' || rowFile.type == 'image/jpeg' || rowFile.type == 'image/gif') {
    if (rowFile.size / 1024 / 1024 < 4) {
      return true
    }
    ElMessage({ type: 'error', message: '上传图片格式不能大于4M' })
    return Promise.reject()
  } else {
    ElMessage({ type: 'error', message: '上传图片格式只能时Png|Jpeg|Gif' })
    return Promise.reject()
  }
}
// 文件上传成功时的钩子
const handleAvatarSuccess = (response: UploadResult, uploadFile: File) => {
  console.log(response)
  // 保存上传成功的链接地址
  trademarkPramas.logoUrl = response.data
  // 清除表单验证错误提示
  trademarkFrom.value.clearValidate('logoUrl')
}

// 编辑操作
const editTrademark = (params: Trademark) => {
  console.log('editTrademark=' + params)

  dialogFormVisible.value = true
  // 填充要修改的数据
  // 使用工具类合并数据
  // Object.assign(trademarkPramas, params)
  trademarkPramas.id = params.id
  trademarkPramas.tmName = params.tmName
  trademarkPramas.logoUrl = params.logoUrl

  nextTick(() => {
    trademarkFrom.value.clearValidate('tmName')
    trademarkFrom.value.clearValidate('logoUrl')
  })
}
// 删除操作
const deleteTrademark = async (id: string | number) => {
  let result: BaseResponse = await reqDeleteTrademark(id)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除品牌成功' })
    fetchTrademarkList(trademarkArr.value.length < 1 ? pageNo.value - 1 : pageNo.value)
  } else {
    ElMessage({ type: 'error', message: '删除品牌失败' })
  }
}
// 表单验证规则
let trademarkFrom = ref()
const validatorTmName = (rule: any, value: any, callback: any) => {
  if (value.length >= 2) {
    return callback()
  } else {
    return callback(new Error('品牌名称至少2位'))
  }
}

const validatorLogoUrl = (rule: any, value: any, callback: any) => {
  if (value) {
    return callback()
  } else {
    return callback(new Error('品牌Logo不能为空'))
  }
}

const rules = {
  tmName: [{ required: true, trigger: 'blur', validator: validatorTmName }],
  logoUrl: [{ required: true, trigger: 'blur', validator: validatorLogoUrl }]
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