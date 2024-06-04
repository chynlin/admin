<template>
  <div class="">
    <a-button
      type="primary"
      shape="round"
      size="large"
      @click="$router.push('/user/create')"
      class="mb-8"
    >
      <template #icon>
        <i class="bi bi-person-plus-fill text-xl mr-2"></i>
      </template>
      新增管理員
    </a-button>
    <a-table :columns="columns" :data-source="data">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'created'">
          {{ formatDate(record.created, 'yyyy-MM-dd hh:mm') }}
        </template>
        <template v-if="column.key === 'state'">
          <span v-if="+record.state === 1">正常</span>
          <span v-else class="text-rose-500">凍結</span>
        </template>
        <template v-else-if="column.key === 'action'">
          <span>
            <a-button
              type="primary"
              size="small"
              class="!text-xs"
              @click="$router.push(`/user/create/${record.id}`)"
            >
              編輯
            </a-button>
            <a-divider type="vertical" />
            <a-button
              type="primary"
              size="small"
              class="!text-xs"
              @click="freezeUser(record)"
            >
              {{ +record.state ? '凍結' : '解凍' }}
            </a-button>
            <a-divider type="vertical" />
            <a-button
              type="primary"
              size="small"
              danger
              class="!text-xs"
              @click="deleteUser(record.id)"
            >
              刪除
            </a-button>
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { formatDate } from '@/utils/date';
import { Modal } from 'ant-design-vue';
import { message } from 'ant-design-vue';
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  date: number;
}
const store = useStore();
const columns = [
  {
    title: '會員ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '用戶名稱',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '電子信箱',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: '國家',
    dataIndex: 'country',
    key: 'country',
  },
  {
    title: '手機號碼',
    dataIndex: 'mobile',
    key: 'mobile',
  },
  {
    title: '狀態',
    dataIndex: 'state',
    key: 'state',
  },
  {
    title: '註冊日期',
    key: 'created',
    dataIndex: 'created',
  },
  {
    title: '操作',
    key: 'action',
  },
];

const data = ref<User[]>([]);
const pagination = ref<User[]>([]);
onMounted(() => {
  getUsersList();
});
const getUsersList = async () => {
  const res = await store.dispatch('get_admin_list');
  if (res) {
    data.value = res.data;
    pagination.value = res.pagination;
  }
};
const deleteUser = (id) => {
  Modal.confirm({
    title: '確定要刪除該用戶',
    content: '資料一經刪除後將永久無法恢復，確認是否要繼續',
    async onOk() {
      const res = await store.dispatch('delete_user', {
        id,
      });
      if (res) {
        getUsersList();
      }
    },
    onCancel() {},
  });
};
const freezeUser = (user) => {
  Modal.confirm({
    title: +user.state === 0 ? '確定要解凍該用戶' : '確定要凍結該用戶',
    async onOk() {
      const res = await store.dispatch('freeze_user', {
        id: user.id,
        state: +user.state === 0 ? '1' : '0',
      });
      if (res) {
        message.success(user.state === 0 ? '解凍成功' : '凍結成功');
        getUsersList();
      }
    },
    onCancel() {},
  });
};
</script>

<style scoped></style>
