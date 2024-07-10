<template>
  <div>
    <div class="mb-4">
      <a-button type="primary" shape="round" @click="openThresholdModal">
        設定庫存預警區間
      </a-button>
    </div>
    <a-table :columns="columns" :dataSource="inventoryList" rowKey="product_id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'product_name'">
          <div class="text-ellipsis overflow-hidden whitespace-nowrap w-64">
            {{ record.Product.name }}
          </div>
        </template>
        <template v-if="column.key === 'quantity'">
          <span
            :class="{
              'text-red-500':
                record.quantity < lowStockThreshold ||
                record.quantity > highStockThreshold,
            }"
          >
            {{ record.quantity }}
          </span>
        </template>
        <template v-if="column.key === 'last_updated'">
          {{ formatDate(record.last_updated, 'yyyy-MM-dd hh:mm') }}
        </template>
      </template>
      <template #actions="{ record }">
        <div class="flex space-x-2">
          <a-button @click="openModal('in', record)" class="text-xs">
            入庫
          </a-button>
          <a-button @click="openModal('out', record)" class="text-xs">
            出庫
          </a-button>
          <a-button
            type="primary"
            @click="openHistoryModal(record)"
            class="text-xs"
          >
            更變紀錄
          </a-button>
        </div>
      </template>
    </a-table>

    <a-modal
      v-model:visible="isModalVisible"
      :title="modalTitle"
      @ok="handleOk"
      :okButtonProps="{ disabled: isOkDisabled }"
    >
      <a-form class="mt-8">
        <a-form-item label="數量">
          <a-input-number
            v-model:value="modalData.quantity"
            min="0"
            class="w-full"
          />
        </a-form-item>
        <a-form-item label="備註">
          <a-input v-model:value="modalData.remark" />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      v-model:visible="isHistoryModalVisible"
      title="庫存變動歷史"
      @ok="closeHistoryModal"
      class="text-center"
      :footer="null"
    >
      <a-table
        :columns="historyColumns"
        :dataSource="historyList"
        bordered
        rowKey="id"
        class="mt-6"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'change_type'">
            {{ +record.change_type === 1 ? '入庫' : '出庫' }}
          </template>
          <template v-if="column.key === 'date'">
            {{ formatDate(record.date, 'yyyy-MM-dd hh:mm') }}
          </template>
        </template>
      </a-table>
    </a-modal>
    <a-modal
      v-model:visible="isThresholdModalVisible"
      title="設定庫存預警區間"
      @ok="setStockThresholds"
    >
      <a-form class="mt-8">
        <a-form-item label="低庫存預警閾值">
          <a-input-number
            v-model:value="lowStockThreshold"
            placeholder="低庫存預警閾值"
            class="w-full"
          />
        </a-form-item>
        <a-form-item label="高庫存預警閾值">
          <a-input-number
            v-model:value="highStockThreshold"
            placeholder="高庫存預警閾值"
            class="w-full"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { TableColumnType } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { formatDate } from '@/utils/date';
import { computed } from '@vue/reactivity';

interface InventoryItem {
  product_id: number;
  Product: {
    id: number;
    name: string;
  };
  quantity: number;
  last_updated: string;
}

interface HistoryItem {
  id: number;
  product_id: number;
  change_type: string;
  quantity: number;
  date: string;
  remark: string;
}

const inventoryList = ref<InventoryItem[]>([]);
const historyList = ref<HistoryItem[]>([]);
const store = useStore();

const isModalVisible = ref(false);
const isHistoryModalVisible = ref(false);
const isThresholdModalVisible = ref(false);
const modalTitle = ref('');
const modalType = ref('');
const modalData = ref({
  product_id: 0,
  quantity: 0,
  remark: '',
  threshold: 0,
});
const lowStockThreshold = ref<number | null>(null);
const highStockThreshold = ref<number | null>(null);
const columns: TableColumnType[] = [
  { title: '産品ID', dataIndex: ['Product', 'id'], key: 'product_id' },
  { title: '産品名稱', dataIndex: ['Product', 'name'], key: 'product_name' },
  { title: '庫存數量', dataIndex: 'quantity', key: 'quantity', align: 'right' },
  { title: '最後更新時間', dataIndex: 'last_updated', key: 'last_updated' },
  { title: '操作', key: 'actions', slots: { customRender: 'actions' } },
];

const historyColumns: TableColumnType[] = [
  {
    title: '變動類型',
    dataIndex: 'change_type',
    key: 'change_type',
  },
  {
    title: '數量',
    dataIndex: 'quantity',
    key: 'quantity',
    align: 'right',
  },
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: '備註',
    dataIndex: 'remark',
    key: 'remark',
  },
];

const isOkDisabled = computed(() => {
  return modalData.value.quantity < 1;
});

const fetchInventoryList = async () => {
  const response = await store.dispatch('getInventoryList');
  if (response) {
    inventoryList.value = response;
  }
};

const fetchInventoryHistory = async (product_id: number) => {
  const response = await store.dispatch('getInventoryHistory', { product_id });
  if (response) {
    historyList.value = response;
  }
};

const openModal = (type: string, record: InventoryItem) => {
  modalType.value = type;
  modalData.value = {
    product_id: record.product_id,
    quantity: 0,
    remark: '',
    threshold: 0,
  };
  modalTitle.value =
    type === 'in' ? '增加庫存' : type === 'out' ? '減少庫存' : '';
  isModalVisible.value = true;
};

const openHistoryModal = (record: InventoryItem) => {
  fetchInventoryHistory(record.product_id);
  isHistoryModalVisible.value = true;
};

const handleOk = async () => {
  const { product_id, quantity, remark, threshold } = modalData.value;
  try {
    let response;
    if (modalType.value === 'in') {
      response = await store.dispatch('setInventoryIn', {
        product_id,
        quantity,
        remark,
      });
    } else if (modalType.value === 'out') {
      response = await store.dispatch('setInventoryOut', {
        product_id,
        quantity,
        remark,
      });
    } else if (modalType.value === 'alert') {
      const action =
        modalTitle.value === '設定低庫存預警'
          ? 'setInventoryLowAlert'
          : 'setInventoryHighAlert';
      response = await store.dispatch(action, {
        product_id,
        threshold,
      });
    }
    if (response) {
      fetchInventoryList();
    }
  } finally {
    isModalVisible.value = false;
  }
};

const closeHistoryModal = () => {
  isHistoryModalVisible.value = false;
};

const fetchThresholds = async () => {
  const response = await store.dispatch('getInventoryThresholds');
  if (response) {
    lowStockThreshold.value =
      response.lowStockThreshold !== null
        ? parseInt(response.lowStockThreshold, 10)
        : null;
    highStockThreshold.value =
      response.highStockThreshold !== null
        ? parseInt(response.highStockThreshold, 10)
        : null;
  }
};

const setStockThresholds = async () => {
  const response = await store.dispatch('setInventoryThreshold', {
    lowThreshold:
      lowStockThreshold.value !== null ? lowStockThreshold.value : undefined,
    highThreshold:
      highStockThreshold.value !== null ? highStockThreshold.value : undefined,
  });
  if (response) {
    isThresholdModalVisible.value = false;
  }
};

const openThresholdModal = () => {
  fetchThresholds();
  isThresholdModalVisible.value = true;
};
onMounted(() => {
  fetchInventoryList();
  fetchThresholds();
});
</script>

<style scoped>
/* 你可以在這裏添加你的樣式 */
</style>
