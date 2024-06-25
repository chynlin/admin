<template>
  <div class="">
    <a-button
      type="primary"
      shape="round"
      size="large"
      @click="$router.push('/group/create')"
      class="mb-8"
    >
      <template #icon>
        <i class="bi bi-plus-circle mr-2"></i>
      </template>
      新增分類
    </a-button>
    <a-table :columns="columns" :data-source="data">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'created'">
          {{ formatDate(record.created, 'yyyy-MM-dd hh:mm') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <span>
            <a-button
              type="primary"
              size="small"
              class="!text-xs"
              @click="$router.push(`/group/create/${record.id}`)"
            >
              編輯
            </a-button>
            <a-divider type="vertical" />
            <a-button
              type="primary"
              size="small"
              danger
              class="!text-xs"
              @click="deleteRoles(record.id)"
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
    title: '分類ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '分類名稱',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '創建日期',
    key: 'created',
    dataIndex: 'created',
  },
  {
    title: '操作',
    key: 'action',
  },
];
const data = ref<User[]>([]);
onMounted(() => {
  getGroups();
});
const getGroups = async () => {
  data.value = await store.dispatch('get_products_groups');
};

const deleteRoles = (id) => {
  Modal.confirm({
    title: '確定要刪除該分類',
    content: '資料一經刪除後將永久無法恢復，請確認分類底下無所屬的商品',
    async onOk() {
      const res = await store.dispatch('delete_group', {
        id,
      });
      if (res) {
        getGroups();
      }
    },
    onCancel() {},
  });
};
</script>

<style scoped></style>
