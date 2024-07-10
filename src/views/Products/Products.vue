<template>
  <div class="">
    <a-button
      type="primary"
      shape="round"
      size="large"
      @click="$router.push('/product/create')"
      class="mb-8"
    >
      <template #icon>
        <i class="bi bi-plus-circle mr-2"></i>
      </template>
      新增商品
    </a-button>
    <a-table :columns="columns" :data-source="data">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'image'">
          <div
            class="w-40 h-32 bg-cover bg-center rounded"
            :style="{ backgroundImage: `url(${record.image[0]?.path})` }"
          ></div>
        </template>
        <template v-if="column.key === 'created'">
          {{ formatDate(record.created, 'yyyy-MM-dd hh:mm') }}
        </template>
        <template v-if="column.key === 'group'">
          {{ record.group?.title }}
        </template>
        <template v-if="column.key === 'brand'">
          {{ record.brand?.name }}
        </template>
        <template v-if="column.key === 'status'">
          <span
            :class="+record.status === 1 ? 'text-emerald-500' : 'text-rose-500'"
            >{{ +record.status === 1 ? '上架中' : '已下架' }}</span
          >
        </template>
        <template v-else-if="column.key === 'action'">
          <div class="mb-6">
            <a-button
              type="primary"
              size="small"
              class="!text-xs"
              @click="
                (previewProductInfo = record), (showSingleProductInfo = true)
              "
            >
              詳情
            </a-button>
            <a-divider type="vertical" />
            <a-button
              type="primary"
              size="small"
              class="!text-xs"
              @click="$router.push(`/product/create/${record.id}`)"
            >
              編輯
            </a-button>
          </div>
          <div>
            <a-button
              type="primary"
              size="small"
              :danger="+record.status"
              class="!text-xs"
              @click="toggleProductStatus(record)"
            >
              {{ +record.status ? '下架' : '上架' }}
            </a-button>
            <a-divider type="vertical" />
            <a-button
              type="primary"
              size="small"
              danger
              class="!text-xs"
              @click="deleteItem(record.id)"
            >
              刪除
            </a-button>
          </div>
        </template>
      </template>
    </a-table>
  </div>
  <a-modal
    v-model:open="showSingleProductInfo"
    title="商品詳情"
    :footer="null"
    :destroyOnClose="true"
  >
    <a-carousel autoplay arrows class="my-4">
      <template #prevArrow>
        <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
          <i class="bi bi-arrow-left-circle"></i>
        </div>
      </template>
      <template #nextArrow>
        <div class="custom-slick-arrow text-gray-500" style="right: 10px">
          <i class="bi bi-arrow-right-circle"></i>
        </div>
      </template>
      <div
        v-for="img of previewProductInfo.image"
        :key="img.id"
        class="h-52 bg-gray-50 rounded p-3"
      >
        <img class="h-full mx-auto rounded" :src="img.path" />
      </div>
    </a-carousel>
    <div
      class="flex items-center border-gray-200 border my-2 rounded overflow-hidden leading-8"
    >
      <p class="w-32 bg-gray-200 text-gray-500 !mb-0 px-3">商品名稱</p>
      <p class="!mb-0 px-4">
        {{ previewProductInfo.name }}
      </p>
    </div>
    <div
      class="flex items-center border-gray-200 border my-2 rounded overflow-hidden leading-8"
    >
      <p class="w-32 bg-gray-200 text-gray-500 !mb-0 px-3">商品價錢</p>
      <p class="!mb-0 px-4">
        {{ previewProductInfo.price }}
      </p>
    </div>
    <div
      class="flex items-center border-gray-200 border my-2 rounded overflow-hidden leading-8"
    >
      <p class="w-32 bg-gray-200 text-gray-500 !mb-0 px-3">商品分類</p>
      <p class="!mb-0 px-4">
        {{ previewProductInfo.group?.title }}
      </p>
    </div>
    <div
      class="flex items-center border-gray-200 border my-2 rounded overflow-hidden leading-8"
    >
      <p class="w-32 bg-gray-200 text-gray-500 !mb-0 px-3">品牌</p>
      <p class="!mb-0 px-4">
        {{ previewProductInfo.brand?.name }}
      </p>
    </div>
    <div
      class="parent border-gray-200 border my-2 rounded overflow-hidden min-h-8"
    >
      <div class="w-32 bg-gray-200 text-gray-500 px-3 flex items-center">
        商品描述
      </div>
      <div class="px-4 flex items-center">
        {{ previewProductInfo.description }}
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { formatDate } from '@/utils/date';
import { Modal } from 'ant-design-vue';
import { message } from 'ant-design-vue';
const store = useStore();
const groups = ref([]);
const showSingleProductInfo = ref<boolean>(false);
const columns = [
  {
    title: '商品ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '商品圖片',
    dataIndex: 'image',
    key: 'image',
  },
  {
    title: '商品名稱',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '商品價錢',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: '商品類別',
    dataIndex: 'group',
    key: 'group',
  },
  {
    title: '品牌',
    dataIndex: 'brand',
    key: 'brand',
  },
  {
    title: '上架',
    dataIndex: 'status',
    key: 'status',
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
const previewProductInfo = ref({});
const data = ref([]);
const pagination = ref([]);
onMounted(() => {
  getProductsList();
  getGroups();
});
const getProductsList = async () => {
  const res = await store.dispatch('get_products_list');
  if (res) {
    data.value = res.data;
    pagination.value = res.pagination;
  }
};
const getGroups = async () => {
  groups.value = await store.dispatch('get_products_groups');
};
const deleteItem = (id) => {
  Modal.confirm({
    title: '確定要刪除該商品',
    content: '資料一經刪除後將永久無法恢復，確認是否要繼續',
    async onOk() {
      const res = await store.dispatch('delete_product', {
        id,
      });
      if (res) {
        getProductsList();
      }
    },
    onCancel() {},
  });
};
const toggleProductStatus = (product) => {
  Modal.confirm({
    title: +product.status === 0 ? '確定要上架該商品' : '確定要下架該商品',
    async onOk() {
      const res = await store.dispatch('set_products_status', {
        id: product.id,
        status: +product.status === 0 ? '1' : '0',
      });
      if (res) {
        message.success(+product.status === 0 ? '上架成功' : '下架成功');
        getProductsList();
      }
    },
    onCancel() {},
  });
};
</script>

<style scoped>
:deep(.slick-arrow.custom-slick-arrow) {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #888;
  transition: ease all 0.3s;
  opacity: 0.3;
  z-index: 1;
}
:deep(.slick-arrow.custom-slick-arrow:before) {
  display: none;
}
:deep(.slick-arrow.custom-slick-arrow:hover) {
  color: #687eff;
  opacity: 0.5;
}

:deep(.slick-slide h3) {
  color: #687eff;
}

.parent {
  display: grid;
  grid-template-columns: auto 1fr;
}
</style>
