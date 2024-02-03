<template>
  <div>
    <el-card>
      <el-form inline="true" class="search_form">
        <el-form-item label="用户名:">
          <el-input placeholder="请输入搜索内容" v-model="searchContent"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="searchUser">搜索</el-button>
          <el-button type="primary">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格内容 -->
    <el-card style="margin: 10px 0;">
      <el-button type="primary" @click="showAddUserView">添加</el-button>
      <el-button type="primary" @click="batchDelete" :disabled="!selectionUser.length">批量删除</el-button>
      <el-table border style="margin: 10px 0" :data="records" @selection-change="selectionChange">
        <el-table-column align="center" type="selection" />
        <el-table-column align="center" type="index" label="#" />
        <el-table-column align="center" label="ID" prop="id" />
        <el-table-column align="center" label="用户名" prop="username" />
        <el-table-column align="center" label="用户名称" prop="name" />
        <el-table-column align="center" label="用户角色" prop="roleName" />
        <el-table-column align="center" label="创建时间" prop="createTime" />
        <el-table-column align="center" label="更新时间" prop="updateTime" />
        <el-table-column width="320px" align="center" label="操作">
          <template #="{ row, $index }">
            <el-button type="primary" icon="User" v-on:click="showRoleView(row)">分配角色</el-button>
            <el-button type="primary" icon="Edit" @click="updateUser(row)">编辑</el-button>
            <el-button type="primary" icon="Delete" @click="deleteUser(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
        :disabled="false" :background="true" layout=" prev, pager, next, jumper,->,total, sizes," :total="total"
        prev-icon="DArrowLeft" next-icon="DArrowRight" @current-change="fetchUserListFunc"
        @size-change="handleSizeChange" />
    </el-card>

  </div>
  <!-- 添加/编辑用户 抽屉 -->
  <el-drawer v-model="drawer" :direction="RTL">
    <template #header>
      <h4>添加用户</h4>
    </template>
    <template #default>
      <el-form ref="drawerForm" :rules="rules" :model="userData">
        <el-form-item label="账号" prop="username">
          <el-input placeholder="请输入账号" v-model="userData.username"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input placeholder="请输入用户名称" v-model="userData.name"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" v-show="!userData.id" prop="password">
          <el-input type="password" placeholder="请输入用户密码" v-model="userData.password"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="addOrUpdateUser(userData)">确定</el-button>
      </div>
    </template>
  </el-drawer>

  <!-- 设置角色 抽屉 -->
  <el-drawer v-model="openDrawerRole" :direction="RTL">
    <template #header>
      <h4>分配角色(职位)</h4>
    </template>
    <template #default>
      <el-form ref="drawerForm" :rules="rules" :model="userData">
        <el-form-item label="账号" prop="username">
          <el-input placeholder="请输入账号" v-model="userData.username" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="职位列表" prop="name">
          <el-checkbox v-model="checkAllRole" :indeterminate="isIndeterminate"
            @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="checkedRoleArr" @change="handleCheckedRoleChange">
            <el-checkbox v-for="(role, $index) in allRoleArr" :key="role.id" :label="role">{{
              role.roleName
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="assignRole">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import type { BaseResponse } from '@/api/user/type';
import { fetchAllRole, fetchUserList, reqAddOrUpdateUser, reqDeleteBatchUser, reqDeleteUser, reqDoAssignRole } from "@/api/acl/user/index.ts";
import { onMounted, reactive, ref } from 'vue';
import type { UserRecord, UserListResult, AllRoleResult, RoleList, Role } from '@/api/acl/user/type.ts'
import { RTL } from 'element-plus/es/components/virtual-list/src/defaults.mjs';
import { ElMessage, type FormInstance } from 'element-plus';


let pageNo = ref(1)
let pageSize = ref(5)
let total = ref(100)
let drawer = ref(false)
// let drawerForm = ref<FormInstance>()
let drawerForm = ref()

let openDrawerRole = ref(false)
// 是否显示不稳定状态 (中间状态)
let isIndeterminate = ref(false)
let checkAllRole = ref(false)

let allRoleArr = ref<RoleList>([])
let checkedRoleArr = ref<RoleList>([])

let records = ref<Partial<UserRecord>[]>([])
let userData = reactive<UserRecord>({
  username: '',
  password: '',
  name: ''
})

let searchContent = ref<string>('')

onMounted(() => {
  fetchUserListFunc()
})

const fetchUserListFunc = async (page = 1,) => {
  pageNo.value = page
  let result: UserListResult = await fetchUserList(pageNo.value, pageSize.value,)
  if (result.code == 200) {
    records.value = result.data.records
    pageSize.value = result.data.size
    total.value = result.data.total
  } else {

  }
}

const handleSizeChange = async () => {
  fetchUserListFunc()
}

const showAddUserView = () => {
  drawer.value = true
  Object.assign(userData, {
    id: 0,
    username: '',
    password: '',
    name: ''
  })
}

const updateUser = (data: UserRecord) => {
  drawer.value = true
  Object.assign(userData, data)
}

const addOrUpdateUser = async (data: UserRecord) => {

  //保证全部表单相校验通过再发请求
  await drawerForm.value.validate()

  let result: BaseResponse = await reqAddOrUpdateUser(data)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: userData.id ? '更新成功' : '添加成功' })
    drawer.value = false
    fetchUserListFunc()
  } else {
    ElMessage({ type: 'error', message: userData.id ? '更新失败' : '添加成功' })
  }
}

const cancel = () => {
  drawer.value = false
  openDrawerRole.value = false
}


// rule 验证规则  value 需要验证的内容  callback 验证是否成功的promise
const validatorUsername = (rule: any, value: any, callback: any) => {
  if (value.length >= 5) {
    return callback()
  } else {
    return callback(new Error('用户名至少5位'))
  }
}

const validatorPassword = (rule: any, value: any, callback: any) => {
  if (value.length >= 5) {
    return callback()
  } else {
    return callback(new Error('密码至少5位'))
  }
}

const validatorName = (rule: any, value: any, callback: any) => {
  if (value.length >= 4) {
    return callback()
  } else {
    return callback(new Error('用户名至少4位'))
  }
}

// Form 组件提供了表单验证的功能，只需为 rules 属性传入约定的验证规则，并将 form-Item 的 prop 属性设置为需要验证的特殊键值即可
const rules = {
  username: [
    { required: true, trigger: 'blur', validator: validatorUsername }
  ],
  password: [
    { required: true, trigger: 'blur', validator: validatorPassword }
  ],
  name: [
    { required: true, trigger: 'blur', validator: validatorName }
  ],
}

// 分配角色
const showRoleView = async (data: UserRecord) => {
  openDrawerRole.value = true
  userData = data
  // 请求角色列表
  let result: AllRoleResult = await fetchAllRole(data.id as number)
  if (result.code == 200) {
    allRoleArr.value = result.data.allRolesList
    checkedRoleArr.value = result.data.assignRoles

    // 不稳定状态 
    isIndeterminate.value = checkedRoleArr.value.length > 0 && checkedRoleArr.value.length < allRoleArr.value.length
    // 是否全选
    checkAllRole.value = checkedRoleArr.value.length == allRoleArr.value.length
  }
}

// 全选/全不选逻辑
const handleCheckAllChange = async (check: boolean) => {
  checkedRoleArr.value = check ? allRoleArr.value : []

  isIndeterminate.value = checkedRoleArr.value.length > 0 && checkedRoleArr.value.length < allRoleArr.value.length
}

const handleCheckedRoleChange = (arr: Role[]) => {
  console.log(arr);
  isIndeterminate.value = arr.length > 0 && arr.length < allRoleArr.value.length
  checkedRoleArr.value = arr
  checkAllRole.value = checkedRoleArr.value.length == arr.length && arr.length > 0

}

// 设置角色
const assignRole = async () => {
  let params = {
    roleIdList: checkedRoleArr.value.map(item => item.id),
    userId: userData.id as number
  }
  let result: BaseResponse = await reqDoAssignRole(params)
  if (result.code == 200) {
    openDrawerRole.value = false
    ElMessage({ type: 'success', message: '设置职位成功' })

    fetchUserListFunc(pageNo.value)
  } else {
    ElMessage({ type: 'success', message: '设置职位失败' })
  }
}

// 删除用户
const deleteUser = async (user: UserRecord) => {
  let result: BaseResponse = await reqDeleteUser(user.id as number)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除用户成功' })

    fetchUserListFunc(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({ type: 'error', message: '删除用户失败' })
  }
}


let selectionUser = ref<UserRecord[]>([])
const selectionChange = (params: UserRecord[]) => {
  selectionUser.value = params
}

// 批量删除
const batchDelete = async () => {
  let idList = selectionUser.value.map(item => item.id as number)
  let result: BaseResponse = await reqDeleteBatchUser(idList)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '批量删除用户成功' })

    fetchUserListFunc(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({ type: 'error', message: '疲劳删除用户失败' })
  }
}

// 搜索用户
const searchUser = async () => {
  let result: UserListResult = await fetchUserList(pageNo.value, pageSize.value, searchContent.value)
  if (result.code == 200) {
    records.value = result.data.records
    pageSize.value = result.data.size
    total.value = result.data.total
  } else {

  }
}
</script>

<style lang="scss" scoped>
.search_form {
  display: flex;
  justify-content: space-between;
  height: 40px;
}
</style>