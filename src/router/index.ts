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
          component: () => import('@/views/User.vue'),
        },
        {
          path: '/user/create/:id?',
          name: 'UserCreate',
          component: () => import('@/views/UserCreate.vue'),
        },
        {
          path: '/admin-list',
          name: 'Admin',
          component: () => import('@/views/Admin.vue'),
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
