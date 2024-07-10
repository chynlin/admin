<template>
  <div class="">
    <a-button
      type="primary"
      shape="round"
      size="large"
      @click="showOrderModal = true"
      class="mb-8"
    >
      <template #icon>
        <i class="bi bi-plus-circle mr-2"></i>
      </template>
      新增訂單
    </a-button>
    <a-table :columns="columns" :data-source="data">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'created'">
          {{ formatDate(record.createdAt, 'yyyy-MM-dd hh:mm') }}
        </template>
        <template v-if="column.key === 'customer'">
          {{ record.customer?.name }}
        </template>
        <template v-if="column.key === 'status'">
          <span
            :class="
              +record.status === 'Completed'
                ? 'text-emerald-500'
                : 'text-rose-500'
            "
            >{{ record.status }}</span
          >
        </template>
        <template v-else-if="column.key === 'action'">
          <a-button
            type="primary"
            size="small"
            class="!text-xs"
            @click="(previewOrderInfo = record), (showOrderInfo = true)"
          >
            詳情
          </a-button>
          <a-divider type="vertical" />
          <a-button
            type="primary"
            size="small"
            class="!text-xs"
            @click="(editOrderInfo = record), (showOrderModal = true)"
          >
            編輯
          </a-button>
          <a-divider type="vertical" />
          <a-button
            type="primary"
            size="small"
            danger
            class="!text-xs"
            @click="deleteOrder(record.orderNumber)"
          >
            刪除
          </a-button>
        </template>
      </template>
    </a-table>
    <!-- 訂單詳情模態框 -->
    <a-modal
      v-model:open="showOrderInfo"
      title="訂單詳情"
      :footer="null"
      :destroyOnClose="true"
    >
      <div
        class="flex items-center border-gray-200 border my-2 rounded overflow-hidden leading-8"
      >
        <p class="w-32 bg-gray-200 text-gray-500 !mb-0 px-3">訂單編號</p>
        <p class="!mb-0 px-4">
          {{ previewOrderInfo.orderNumber }}
        </p>
      </div>
      <div
        class="flex items-center border-gray-200 border my-2 rounded overflow-hidden leading-8"
      >
        <p class="w-32 bg-gray-200 text-gray-500 !mb-0 px-3">客戶名稱</p>
        <p class="!mb-0 px-4">
          {{ previewOrderInfo.customer?.name }}
        </p>
      </div>
      <div
        class="flex items-center border-gray-200 border my-2 rounded overflow-hidden leading-8"
      >
        <p class="w-32 bg-gray-200 text-gray-500 !mb-0 px-3">訂單狀態</p>
        <p class="!mb-0 px-4">
          {{ previewOrderInfo.status }}
        </p>
      </div>
      <div
        class="parent border-gray-200 border my-2 rounded overflow-hidden min-h-8"
      >
        <div class="w-32 bg-gray-200 text-gray-500 px-3 flex items-center">
          訂單項目
        </div>
        <div class="px-4 flex flex-col justify-center space-y-2">
          <div v-for="item in previewOrderInfo.items" :key="item.id">
            <div class="flex justify-between leading-7">
              <span>{{ item.product?.name }}</span>
              <p class="mb-0">
                ￥{{ item.price }} <span>x{{ item.quantity }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex items-center border-gray-200 border my-2 rounded overflow-hidden leading-8"
      >
        <p class="w-32 bg-gray-200 text-gray-500 !mb-0 px-3">訂單總額</p>
        <p class="!mb-0 px-4">￥{{ previewOrderInfo.totalAmount }}</p>
      </div>
    </a-modal>
    <!-- 訂單編輯/新增模態框 -->
    <a-modal
      v-model:open="showOrderModal"
      :title="editOrderInfo ? '編輯訂單' : '新增訂單'"
      @ok="editOrderInfo ? updateOrder() : createOrder()"
      :destroyOnClose="true"
    >
      <a-form>
        <a-form-item label="客戶名稱">
          <a-select
            v-model:value="orderForm.customer_id"
            placeholder="選擇客戶"
            show-search
            option-filter-prop="label"
            :filter-option="filterCustomerOption"
            @scrollToBottom="loadMoreCustomers"
          >
            <a-select-option
              v-for="customer in customers"
              :key="customer.value"
              :value="customer.value"
            >
              {{ customer.label }}
            </a-select-option>
            <a-spin v-if="loading" />
          </a-select>
        </a-form-item>
        <a-form-item label="訂單狀態">
          <a-select v-model:value="orderForm.status" placeholder="選擇狀態">
            <a-select-option value="Pending">待處理</a-select-option>
            <a-select-option value="Completed">已完成</a-select-option>
            <a-select-option value="Cancelled">已取消</a-select-option>
          </a-select>
        </a-form-item>
        <!-- 訂單項目列錶 -->
        <a-form-item label="訂單項目">
          <div
            v-for="(item, index) in orderForm.items"
            :key="index"
            class="flex items-center mb-2"
          >
            <a-select
              v-model:value="item.product_id"
              placeholder="選擇産品"
              show-search
              filter-option="(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0"
              @change="handleProductChange(item)"
              class="flex-1 mr-2 w-40 text-ellipsis overflow-hidden whitespace-nowrap"
            >
              <a-select-option
                v-for="product in products"
                :key="product.id"
                :value="product.id"
              >
                {{ product.name }}
              </a-select-option>
            </a-select>
            <a-input-number
              v-model:value="item.quantity"
              min="1"
              placeholder="數量"
              class="mr-2"
            />
            <!-- 保持價格為隻讀狀態 -->
            <a-input-number
              v-model:value="item.price"
              min="0"
              placeholder="價格"
              :disabled="true"
            />
            <a-button
              type="danger"
              @click="orderForm.items.splice(index, 1)"
              class="ml-2"
            >
              <i class="bi bi-dash-circle"></i>
            </a-button>
          </div>
          <a-button type="dashed" class="w-full" @click="addOrderItem">
            <i class="bi bi-plus-circle"></i>
            添加項目
          </a-button>
        </a-form-item>

        <a-form-item label="物流公司">
          <a-input
            v-model:value="orderForm.logisticsCompany"
            placeholder="物流公司"
          />
        </a-form-item>
        <a-form-item label="物流單號">
          <a-input
            v-model:value="orderForm.trackingNumber"
            placeholder="物流單號"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { formatDate } from '@/utils/date';
import { Modal } from 'ant-design-vue';
interface OrderDetail {
  id: number;
  customer: {
    id: number;
    name: string;
  };
  totalAmount: number;
  items: {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    product: {
      id: number;
      name: string;
      price: number;
    };
  }[];
}
const store = useStore();
const data = ref([]);
const pagination = ref([]);
const customers = ref([]);
const products = ref([]);
const showOrderInfo = ref(false);
const showOrderModal = ref(false);
const previewOrderInfo = ref<OrderDetail | null>(null);
const editOrderInfo = ref(null);
const orderForm = ref({
  customer_id: null,
  status: 'Pending',
  items: [],
  logisticsCompany: '',
  trackingNumber: '',
});
const loading = ref(false);
let page = 1; // 初始化頁碼
const columns = [
  {
    title: '訂單編號',
    dataIndex: 'orderNumber',
    key: 'orderNumber',
  },
  {
    title: '客戶名稱',
    dataIndex: 'customer',
    key: 'customer',
  },
  {
    title: '物流公司',
    dataIndex: 'logisticsCompany',
    key: 'logisticsCompany',
  },
  {
    title: '物流單號',
    dataIndex: 'trackingNumber',
    key: 'trackingNumber',
  },
  {
    title: '訂單總額',
    dataIndex: 'totalAmount',
    key: 'totalAmount',
  },
  {
    title: '訂單狀態',
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
onMounted(() => {
  getOrderList();
  getCustomers();
  getProducts();
});
const filterCustomerOption = (input, option) =>
  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;

const getOrderList = async () => {
  const res = await store.dispatch('getOrderList');
  if (res) {
    console.log(res);

    data.value = res.data;
    pagination.value = res.pagination;
  }
};
const getCustomers = async () => {
  const res = await store.dispatch('get_user_list', { page });
  if (res) {
    customers.value = [
      ...customers.value,
      ...res.data.map((user) => ({
        label: user.name,
        value: String(user.id),
      })),
    ];
    page++; // 更新頁碼
  }
};
const loadMoreCustomers = async () => {
  const selectDom = document.getElementsByClassName(
    'ant-select'
  )[0] as HTMLElement;
  const scrollTop = selectDom.scrollTop;
  const offsetHeight = selectDom.offsetHeight;
  const scrollHeight = selectDom.scrollHeight;
  if (scrollTop + offsetHeight >= scrollHeight) {
    loading.value = true;
    await getCustomers();
    loading.value = false;
  }
};
const getProducts = async () => {
  const res = await store.dispatch('get_products_list'); // 調用獲取産品列錶的 action
  if (res) {
    products.value = res.data; // 將産品列錶數據賦給 products ref
  }
};

const handleProductChange = async (item) => {
  if (item.product_id) {
    const product = products.value.find((p) => p.id === item.product_id);
    if (product) {
      item.price = product.price; // 根據選擇的産品更新價格
    }
  }
};

const addOrderItem = () => {
  orderForm.value.items.push({ product_id: null, quantity: 1, price: 0 }); // 添加新的訂單項目
};

const deleteOrder = (id) => {
  Modal.confirm({
    title: '確定要刪除該訂單？',
    content: '刪除後將無法恢複，確認繼續？',
    async onOk() {
      const res = await store.dispatch('deleteOrder', { id });
      if (res) {
        getOrderList();
      }
    },
    onCancel() {},
  });
};
const updateOrder = async () => {
  const res = await store.dispatch('updateOrder', {
    ...editOrderInfo,
    ...orderForm.value,
  });
  if (res) {
    getOrderList();
    showOrderModal.value = false;
  }
};
const createOrder = async () => {
  const payload = {
    ...orderForm.value,
    items: JSON.stringify(orderForm.value.items),
  };
  const res = await store.dispatch('createOrder', payload);
  if (res) {
    getOrderList();
    showOrderModal.value = false;
  }
};
</script>

<style scoped>
.parent {
  display: grid;
  grid-template-columns: auto 1fr;
}
</style>
