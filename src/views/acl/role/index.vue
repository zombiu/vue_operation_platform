<template>
  <el-card>
    <el-form inline="false" class="roleForm">
      <el-form-item label="角色名称:">
        <el-input placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-on:click="searchRole">搜索</el-button>
        <el-button type="primary">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <!-- 角色列表 -->
  <el-card>
    <el-button type="primary" icon="Plus" @click="showInputRoleDialog">添加角色</el-button>
    <el-table border style="margin: 10px 0" :data="roleList">
      <el-table-column align="center" type="index" label="#" />
      <el-table-column align="center" label="ID" prop="id" />
      <el-table-column align="center" label="职位名称" prop="roleName" />
      <el-table-column align="center" label="创建时间" prop="createTime" />
      <el-table-column align="center" label="更新时间" prop="updateTime" />
      <el-table-column width="320px" align="center" label="操作">
        <template #="{ row, $index }">
          <el-button type="primary" icon="User" v-on:click="openSetPermission(row)">分配角色</el-button>
          <el-button type="primary" icon="Edit" @click="updateRole(row)">编辑</el-button>
          <el-popconfirm :title="`您确认删除职位${row.roleName}吗`" @confirm="deleteRole(row)" width="260">
            <template #reference>
              <el-button type="primary" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]" :disabled="false"
      :background="true" layout=" prev, pager, next, jumper,->,total, sizes," :total="total" prev-icon="DArrowLeft"
      next-icon="DArrowRight" @current-change="fetchRoleList" @size-change="handleSizeChange" />
  </el-card>
  <!-- 编辑/添加对话框 -->
  <el-dialog v-model="dialogVisible" :title="roleParams.id ? '编辑' : '添加'" width="30%">
    <el-form>
      <el-form-item label="职位名称">
        <el-input placeholder="请填写职位名称" v-model="roleParams.roleName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addOrUpdateRole">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 分配角色 -->
  <el-drawer v-model="drawer" direction="rtl">
    <template #header>
      <h4>分配菜单与按钮的权限</h4>
    </template>
    <template #default>
      <el-tree ref="tree" :data="menuListRef" :show-checkbox="true" node-key="id" :default-expanded-keys="[2, 3]"
        :default-checked-keys="selectedMenuArr" :props="defaultProps" :default-expand-all="true" />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { reqAddOrUpdateRole, reqFetchMenuList, reqFetchRoleList, reqRemoveRole, reqSetPermission } from '@/api/acl/role';
import type { MenuDataResult, MenuList, RoleListResult, RoleRecord } from '@/api/acl/role/type';
import type { BaseResponse } from '@/api/user/type';
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';

let pageNo = ref(1)
let pageSize = ref(5)
let total = ref(100)
let drawer = ref(false)
let dialogVisible = ref(false)

let roleParams = reactive<RoleRecord>({
  roleName: '',
})
let roleList = ref<RoleRecord[]>([])
let menuListRef = ref<MenuList>([])
// 选中的菜单权限
let selectedMenuArr = ref<number[]>([])
let tree = ref()

onMounted(() => {
  fetchRoleList()
})

const fetchRoleList = async (index = 1) => {
  pageNo.value = index
  let result: RoleListResult = await reqFetchRoleList(pageNo.value, pageSize.value)
  if (result.code == 200) {
    roleList.value = result.data.records
    console.log(roleList.value);

    total.value = result.data.total
    pageSize.value = result.data.size
  }
}

const handleSizeChange = () => {
  fetchRoleList()
}

// 
const showInputRoleDialog = () => {
  Object.assign(roleParams, {
    id: 0,
    roleName: '',
  })
  dialogVisible.value = true
}

// 添加  role
const addOrUpdateRole = async () => {
  let result: BaseResponse = await reqAddOrUpdateRole(roleParams)
  if (result.code == 200) {
    dialogVisible.value = false
    ElMessage({ type: 'success', message: '添加职位成功' })

    fetchRoleList()
  } else {
    ElMessage({ type: 'success', message: '添加职位失败' })
  }
}

const updateRole = (role: RoleRecord) => {
  console.log(role);
  Object.assign(roleParams, role)
  console.log(roleParams);

  dialogVisible.value = true
}

async function openSetPermission(role: RoleRecord) {
  drawer.value = true
  Object.assign(roleParams, role)
  console.log(roleParams);
  let result: MenuDataResult = await reqFetchMenuList(role.id as number)
  if (result.code == 200) {
    menuListRef.value = result.data

    selectedMenuArr.value = []
    // 所有被选中的四级权限
    filterSelectedMenu(result.data, selectedMenuArr.value)
    console.log(selectedMenuArr.value);

  }
}

const filterSelectedMenu = (data: MenuList, selection: number[]) => {
  data.forEach(item => {
    if (item.level == 4 && item.select) {
      selection.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelectedMenu(item.children, selection)
    }
  })
}

const defaultProps = {
  children: 'children',
  label: 'name',
}

const cancel = () => {
  drawer.value = false
}

const confirm = async () => {

  let selectMenuId: number[] = tree.value.getCheckedKeys()
  selectMenuId.concat(tree.value.getHalfCheckedKeys())

  let result: BaseResponse = await reqSetPermission(roleParams.id as number, selectMenuId)
  if (result.code == 200) {
    drawer.value = false
    ElMessage({ type: 'success', message: '修改权限成功' })
    window.location.reload()
  }
}

// 删除角色
const deleteRole = async (role: RoleRecord) => {
  let result: BaseResponse = await reqRemoveRole(role.id as number)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除角色成功' })
    fetchRoleList(roleList.value.length > 0 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({ type: 'error', message: '删除角色失败' })
  }
}
</script>

<style lang="scss" scoped>
.roleForm {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>