import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Default',
    component: () => import('@/layout/Default.vue'),
    children: [
        {
            path: '/',
            name: 'Home',
                component: () => import('@/views/Home.vue'),
          },
        {
            path: '/user',
            name: 'User',
          component: () => import('@/views/Users/User.vue'),
        },
        {
          path: '/user/create/:id?',
          name: 'UserCreate',
          component: () => import('@/views/Users/UserCreate.vue'),
        },
        {
          path: '/admin/create/:id?',
          name: 'AdminCreate',
          component: () => import('@/views/Admin/AdminCreate.vue'),
        },
        {
          path: '/admin-list',
          name: 'Admin',
          component: () => import('@/views/Admin/Admin.vue'),
        },
        {
          path: '/role-management',
          name: 'RoleManagement',
          component: () => import('@/views/Roles/RoleManagement.vue'),
      },
      {
        path: '/role/create/:id?',
        name: 'RoleCreate',
        component: () => import('@/views/Roles/RoleCreate.vue'),
      },
        {
          path: '/product-group',
          name: 'ProductGroup',
          component: () => import('@/views/Group/ProductGroup.vue'),
      },
      {
        path: '/group/create/:id?',
        name: 'GroupCreate',
        component: () => import('@/views/Group/GroupCreate.vue'),
      },
        {
          path: '/brand',
          name: 'Brand',
          component: () => import('@/views/Brand/Brand.vue'),
      },
      {
        path: '/brand/create/:id?',
        name: 'BrandCreate',
        component: () => import('@/views/Brand/BrandCreate.vue'),
      },
      {
        path: '/products',
        name: 'Products',
        component: () => import('@/views/Products/Products.vue'),
      },
      {
        path: '/product/create/:id?',
        name: 'ProductCreate',
        component: () => import('@/views/Products/ProductCreate.vue'),
      },
    ]
  },
  {
      path: '/sign',
      name: 'Sign',
          component: () => import('@/views/Sign.vue'),
    },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
