<template>
  <el-table :data="allPermission" style="width: 100%; margin-bottom: 20px" row-key="id" :border="true"
    :default-expand-all="false">
    <el-table-column prop="name" label="名称" sortable />
    <el-table-column prop="code" label="权限值" sortable />
    <el-table-column prop="updateTime" label="修改时间" sortable />
    <el-table-column label="操作" sortable>
      <template #="{ row, $index }">
        <el-button v-on:click="savePermissionDialog(row)" size="small" type="primary" icon="Plus"
          :disabled="row.level == 4">{{ row.level == 3 ? '添加功能' : '添加菜单'
          }}</el-button>
        <el-button v-on:click="updatePermissionDialog(row)" size="small" type="primary" icon="Edit"
          :disabled="row.level == 1">编辑</el-button>
        <el-button @click="deletePermissin(row)" size="small" type="primary" icon="Delete"
          :disabled="row.level == 1">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="dialogVisible" title="添加菜单" width="30%">
    <el-form>
      <el-form-item label="名称">
        <el-input placeholder="请填写名称" v-model="permissin.name"></el-input>
      </el-form-item>
      <el-form-item label="权限值">
        <el-input placeholder="请填写权限值" v-model="permissin.code"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" v-on:click="updatePermission()">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reqFetchAllPermission, reqRemovePermission, reqSaveOrUpdatePermission } from '@/api/acl/menu';
import type { Permission, PermissionDataResult, PermissionList } from '@/api/acl/menu/type';
import type { BaseResponse } from '@/api/user/type';
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';

// 这里v-model 绑定 使用 ref无效
let permissin = reactive<Partial<Permission>>({

})
let allPermission = ref<PermissionList>([])
let dialogVisible = ref(false)


onMounted(() => {
  fetchAllPermission()
})

const fetchAllPermission = async () => {
  let result: PermissionDataResult = await reqFetchAllPermission()
  if (result.code == 200) {
    allPermission.value = result.data
  }
}

const savePermissionDialog = async (params: Permission) => {
  dialogVisible.value = false
  // Object.assign(permissin, params)
  permissin.level = params.level + 1
  permissin.pid = params.id

}

const updatePermissionDialog = async (params?: Permission) => {
  dialogVisible.value = true
  Object.assign(permissin, params)
}

const updatePermission = async () => {
  let params = permissin
  let result: BaseResponse = await reqSaveOrUpdatePermission(params as Permission)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: params?.id ? '更新菜单成功' : '新增菜单成功' })
    fetchAllPermission()
  } else {
    dialogVisible.value = false
    ElMessage({ type: 'error', message: params?.id ? '更新菜单失败' : '新增菜单失败' })
  }
}

// 删除 menu
const deletePermissin = async (data: Permission) => {
  let result: BaseResponse = await reqRemovePermission(data.id as number)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除菜单成功' })
    fetchAllPermission()
  } else {
    ElMessage({ type: 'error', message: '删除菜单失败' })
  }
}
</script>

<style lang="scss" scoped></style>