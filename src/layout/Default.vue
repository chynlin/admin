<template>
  <a-layout class="h-screen">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="flex flex-col items-center py-8">
        <img class="w-2/3" src="@/assets/logo-white.png" alt="logo" />
        <p v-if="!collapsed" class="text-white text-center mt-4">
          後台管理系統
        </p>
      </div>
      <a-menu
        v-model:openKeys="state.openKeys"
        v-model:selectedKeys="state.selectedKeys"
        mode="inline"
        theme="dark"
        :inline-collapsed="state.collapsed"
        :items="items"
        @click="turnRouter"
      ></a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="!bg-white border-b border-gray-300 !p-0">
        <div class="h-full flex items-center px-4">
          <MenuUnfoldOne
            theme="outline"
            size="24"
            v-if="collapsed"
            class="trigger"
            @click="() => (collapsed = !collapsed)"
          />
          <MenuFoldOne
            theme="outline"
            size="24"
            v-else
            class="trigger"
            @click="() => (collapsed = !collapsed)"
          />
          <a-breadcrumb class="ml-4">
            <a-breadcrumb-item>Home</a-breadcrumb-item>
            <a-breadcrumb-item
              ><a href="">Application Center</a></a-breadcrumb-item
            >
            <a-breadcrumb-item
              ><a href="">Application List</a></a-breadcrumb-item
            >
            <a-breadcrumb-item>An Application</a-breadcrumb-item>
          </a-breadcrumb>
        </div>
      </a-layout-header>
      <a-layout-content class="p-4 overflow-scroll">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import { reactive, watch, h, ref } from 'vue';
import {
  ShoppingOutlined,
  PieChartOutlined,
  MailOutlined,
  DesktopOutlined,
  InboxOutlined,
  AppstoreOutlined,
  UserOutlined,
  SettingOutlined,
  DollarOutlined,
  ProfileOutlined,
  FireOutlined,
} from '@ant-design/icons-vue';
import router from '@/router';
const collapsed = ref<boolean>(false);
const state = reactive({
  collapsed: false,
  selectedKeys: ['1'],
  openKeys: [],
});
const items = reactive([
  {
    key: '1',
    icon: () => h(PieChartOutlined),
    url: '/',
    label: '儀表板',
    title: 'Option 1',
  },
  {
    key: 'sub1',
    icon: () => h(UserOutlined),
    url: '/user',
    label: '用戶管理',
    title: 'Navigation One',
  },
  {
    key: '2',
    icon: () => h(ShoppingOutlined),
    label: '產品管理',
    url: null,
    title: 'Option 2',
    children: [
      {
        key: '2-1',
        label: '產品列表',
        url: '/',
        title: 'Option 5',
      },
      {
        key: '2-2',
        label: '分類管理',
        url: '/',
        title: 'Option 7',
      },
      {
        key: '2-3',
        label: '品牌管理',
        url: '/',
        title: 'Option 8',
      },
      {
        key: '2-4',
        label: '庫存管理',
        url: '/',
        title: 'Option 8',
      },
    ],
  },
  {
    key: '3',
    icon: () => h(ProfileOutlined),
    label: '訂單管理',
    url: null,
    title: 'Option 3',
    children: [
      {
        key: '3-1',
        label: '訂單列表',
        url: '/',
        title: 'Option 5',
      },
      {
        key: '3-2',
        label: '退貨處理',
        url: '/',
        title: 'Option 7',
      },
    ],
  },
  {
    key: 'sub2',
    icon: () => h(FireOutlined),
    label: '營銷管理',
    url: null,
    title: 'Navigation Two',
    children: [
      {
        key: '9',
        label: '優惠券管理',
        url: '/',
        title: 'Option 9',
      },
      {
        key: '10',
        label: '活動管理',
        url: '/',
        title: 'Option 10',
      },
      {
        key: '11',
        label: '積分管理',
        url: '/',
        title: 'Option 11',
      },
    ],
  },
  {
    key: 'sub3',
    icon: () => h(DollarOutlined),
    label: '財務管理',
    url: null,
    title: 'Navigation Two',
    children: [
      {
        key: '12',
        label: '支付管理',
        url: '/',
        title: 'Option 9',
      },
      {
        key: '13',
        label: '退款管理',
        url: '/',
        title: 'Option 10',
      },
      {
        key: '14',
        label: '對賬管理',
        url: '/',
        title: 'Option 11',
      },
    ],
  },
  {
    key: 'sub4',
    icon: () => h(SettingOutlined),
    label: '設置',
    url: null,
    title: 'Navigation Two',
    children: [
      {
        key: '15',
        label: '全局設置',
        url: '/',
        title: 'Option 9',
      },
      {
        key: '16',
        label: '通知設置',
        url: '/',
        title: 'Option 10',
      },
      {
        key: '17',
        label: '管理員設置',
        url: '/admin-list',
        title: 'Option 11',
      },
    ],
  },
  {
    key: 'sub5',
    icon: () => h(DesktopOutlined),
    label: '操作日誌',
    url: '/',
    title: 'Navigation Two',
  },
]);

const turnRouter = (e) => {
  if (e.item.url) {
    router.push(e.item.url);
  }
};
watch(
  () => state.openKeys,
  (_val, oldVal) => {
    state.preOpenKeys = oldVal;
  }
);
</script>
<style>
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}

.site-layout .site-layout-background {
  background: #fff;
}
</style>
