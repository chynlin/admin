<template>
  <div class="">
    <a-button
      type="primary"
      shape="round"
      size="large"
      @click="$router.push('/brand/create')"
      class="mb-8"
    >
      <template #icon>
        <i class="bi bi-plus-circle mr-2"></i>
      </template>
      新增品牌
    </a-button>
    <a-table :columns="columns" :data-source="data">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'logo'">
          <img class="max-w-[100px]" :src="record.logo" :alt="record.name" />
        </template>
        <template v-if="column.key === 'description'">
          <p class="max-w-[350px]">
            {{ record.description }}
          </p>
        </template>
        <template v-if="column.key === 'created'">
          {{ formatDate(record.created, 'yyyy-MM-dd hh:mm') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <span>
            <a-button
              type="primary"
              size="small"
              class="!text-xs"
              @click="$router.push(`/brand/create/${record.id}`)"
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
  logo: any;
  name: string;
  description: string;
  created: number;
}
const store = useStore();
const columns = [
  {
    title: '品牌ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '品牌LOGO',
    dataIndex: 'logo',
    key: 'logo',
  },
  {
    title: '品牌名稱',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '品牌描述',
    dataIndex: 'description',
    key: 'description',
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
  getBrands();
});
const getBrands = async () => {
  data.value = await store.dispatch('get_brand_list');
};

const deleteRoles = (id) => {
  Modal.confirm({
    title: '確定要刪除該品牌',
    content: '資料一經刪除後將永久無法恢復，請確認品牌底下無所屬的商品',
    async onOk() {
      const res = await store.dispatch('delete_brand', {
        id,
      });
      if (res) {
        getBrands();
      }
    },
    onCancel() {},
  });
};
</script>

<style scoped></style>
