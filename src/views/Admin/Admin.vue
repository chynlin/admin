<template>
  <div class="">
    <a-button
      type="primary"
      shape="round"
      size="large"
      @click="$router.push('/admin/create')"
      class="mb-8"
    >
      <template #icon>
        <i class="bi bi-plus-circle mr-2"></i>
      </template>
      新增管理員
    </a-button>
    <a-table :columns="columns" :data-source="data">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'created'">
          {{ formatDate(record.created, 'yyyy-MM-dd hh:mm') }}
        </template>
        <template v-if="column.key === 'level'">
          <span>{{ record.role?.title }}</span>
        </template>
        <template v-else-if="column.key === 'action'">
          <span>
            <a-button
              type="primary"
              size="small"
              class="!text-xs"
              @click="$router.push(`/admin/create/${record.id}`)"
            >
              編輯
            </a-button>
            <a-divider type="vertical" />
            <a-button
              type="primary"
              size="small"
              danger
              class="!text-xs"
              @click="deleteAdmin(record.id)"
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
    title: '管理員ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '管理員名稱',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '管理員帳號',
    dataIndex: 'account',
    key: 'account',
  },
  {
    title: '管理員等級',
    dataIndex: 'level',
    key: 'level',
  },
  {
    title: '添加日期',
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
  getAdminsList();
});
const getAdminsList = async () => {
  const res = await store.dispatch('get_admin_list');
  if (res) {
    data.value = res.data;
    pagination.value = res.pagination;
  }
};

const deleteAdmin = (id) => {
  Modal.confirm({
    title: '確定要刪除該管理員',
    content: '資料一經刪除後將永久無法恢復，確認是否要繼續',
    async onOk() {
      const res = await store.dispatch('delete_admin', {
        id,
      });
      if (res) {
        getAdminsList();
      }
    },
    onCancel() {},
  });
};
</script>

<style scoped></style>
