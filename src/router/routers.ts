// 存放路由的文件

import type { RouteRecordRaw } from 'vue-router'

export const constantRouter = [
  {
    path: '/',
    name: 'layout',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    meta: {
      title: '',
      hidden: false
    },
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('../views/home/index.vue'),
        meta: {
          title: '主页',
          hidden: false,
          icon: 'HomeFilled'
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/index.vue'),
    meta: {
      title: 'login',
      hidden: true,
      icon: 'HomeFilled'
    }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/404/index.vue'),
    meta: {
      title: '404',
      hidden: true,
      icon: 'HomeFilled'
    }
  },

  {
    path: '/screen',
    name: 'Screen',
    component: () => import('../views/screen/index.vue'),
    meta: {
      title: '数据大屏',
      hidden: false,
      icon: 'HomeFilled'
    }
  }
]

// 异步路由：用户根据权限判断是否拥有相关权限
export const asyncRouter: RouteRecordRaw[] = [
  {
    path: '/acl',
    name: 'Acl',
    component: () => import('@/layout/index.vue'),
    redirect: '/acl/user',
    meta: {
      title: '权限管理',
      hidden: false,
      icon: 'HomeFilled'
    },
    children: [
      {
        path: '/acl/user',
        name: 'User',
        component: () => import('../views/acl/user/index.vue'),
        meta: {
          title: '用户管理',
          hidden: false,
          icon: 'HomeFilled'
        }
      },
      {
        path: '/acl/role',
        name: 'Role',
        component: () => import('../views/acl/role/index.vue'),
        meta: {
          title: '角色管理',
          hidden: false,
          icon: 'HomeFilled'
        }
      },
      {
        path: '/acl/permission',
        name: 'Permission',
        component: () => import('../views/acl/permission/index.vue'),
        meta: {
          title: '菜单管理',
          hidden: false,
          icon: 'HomeFilled'
        }
      }
    ]
  },
  {
    path: '/product',
    name: 'Product',
    component: () => import('@/layout/index.vue'),
    redirect: '/product/trademark',
    meta: {
      title: '商品管理',
      hidden: false,
      icon: 'HomeFilled'
    },
    children: [
      {
        path: '/product/trademark',
        name: 'Trademark',
        component: () => import('../views/product/trademark/index.vue'),
        meta: {
          title: '品牌管理',
          hidden: false,
          icon: 'HomeFilled'
        }
      },
      {
        path: '/product/attr',
        name: 'Attr',
        component: () => import('../views/product/attr/index.vue'),
        meta: {
          title: '属性管理',
          hidden: false,
          icon: 'HomeFilled'
        }
      },
      {
        path: '/product/spu',
        name: 'Spu',
        component: () => import('../views/product/spu/index.vue'),
        meta: {
          title: 'SPU管理',
          hidden: false,
          icon: 'HomeFilled'
        }
      },
      {
        path: '/product/sku',
        name: 'Sku',
        component: () => import('../views/product/sku/index.vue'),
        meta: {
          title: 'SKU管理',
          hidden: false,
          icon: 'HomeFilled'
        }
      }
    ]
  }
]

// 任意路由
export const anyRouter = [
  {
    // 任意不匹配的路由
    path: '/:patchMatch(.*)*',
    name: 'any',
    redirect: '/404',
    meta: {
      title: '任意路由',
      hidden: true
    }
  }
]
