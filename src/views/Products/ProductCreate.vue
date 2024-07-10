<template>
  <div class="w-full h-full">
    <a-page-header
      :title="route.params.id ? '編輯產品' : '新增產品'"
      @back="$router.go(-1)"
      class="!p-0"
    />
    <div class="px-4 py-6">
      <a-form
        layout="vertical"
        :model="formState"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          v-for="(field, key) of formState"
          :key="key"
          :name="[key, 'val']"
          :label="field.label"
          :rules="[field.rules]"
        >
          <a-select
            v-if="field.type === 'select'"
            v-model:value="field.val"
            :placeholder="field.placeholder"
          >
            <a-select-option
              v-for="select of field.options"
              :key="select.id"
              :value="select.id"
            >
              {{ select.title || select.name }}
            </a-select-option>
          </a-select>
          <a-switch
            v-else-if="field.type === 'switch'"
            v-model:checked="field.val"
          />
          <a-upload
            v-else-if="field.type === 'file'"
            v-model:fileList="fileList"
            :before-upload="beforeUpload"
            list-type="picture-card"
            @preview="handlePreview"
            @change="handleChange"
            @remove="handleRemove"
          >
            <div v-if="field.val.length <= 30">
              <div style="margin-top: 8px">Upload</div>
            </div>
          </a-upload>
          <a-input
            v-else
            v-model:value="field.val"
            :placeholder="field.placeholder"
            :type="field.type"
            :disabled="field.disabled"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
            class="w-32 h-10 mt-6"
          >
            {{ route.params.id ? '保存' : '添加' }}
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
  <!-- 图片预览 Modal -->
  <a-modal v-model:visible="previewVisible" :footer="null">
    <div class="p-10">
      <img :src="previewImage" alt="图片预览" style="width: 100%" />
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { message, Modal } from 'ant-design-vue';
const store = useStore();
const router = useRouter();
const route = useRoute();

interface Option {
  id: number;
  title?: string;
  name?: string;
}

interface FormField {
  key: string;
  label: string;
  placeholder: string;
  val: any;
  type: string;
  disabled: boolean;
  options?: Option[];
  rules: {
    required: boolean;
    message: string;
  };
}

type FormState = Record<string, FormField>;
const fileList = ref([]);
const previewVisible = ref(false);
const previewImage = ref('');
const loading = ref(false);
const formState = ref<FormState>({
  name: {
    key: 'name',
    label: '產品名稱',
    placeholder: '請輸入產品名稱',
    val: '',
    type: 'text',
    disabled: false,
    rules: {
      required: true,
      message: '',
    },
  },
  price: {
    key: 'price',
    label: '產品價錢',
    placeholder: '請輸入產品價錢',
    val: '',
    type: 'text',
    disabled: false,
    rules: {
      required: true,
      message: '',
    },
  },
  brand_id: {
    key: 'brand_id',
    label: '品牌',
    placeholder: '請選擇品牌',
    val: null,
    type: 'select',
    options: [],
    disabled: false,
    rules: {
      required: true,
      message: '',
    },
  },
  group_id: {
    key: 'group_id',
    label: '產品類別',
    placeholder: '請選擇產品類別',
    val: null,
    type: 'select',
    options: [],
    disabled: false,
    rules: {
      required: true,
      message: '',
    },
  },
  description: {
    key: 'description',
    label: '產品描述',
    placeholder: '請輸入產品描述',
    val: '',
    type: 'text',
    disabled: false,
    rules: {
      required: !route.params.id,
      message: '',
    },
  },
  image: {
    key: 'image',
    label: '產品封面',
    placeholder: '請選擇產品封面',
    val: [],
    type: 'file',
    disabled: false,
    rules: {
      required: !route.params.id,
      message: '',
    },
  },
  status: {
    key: 'status',
    label: '上架狀態',
    placeholder: null,
    val: false,
    type: 'switch',
    disabled: false,
    rules: {
      required: !route.params.id,
      message: '',
    },
  },
});

onMounted(async () => {
  if (route.params.id) {
    await getProductInfo();
  }
  getProductGroups();
  getProductBrands();
});

const getProductInfo = async () => {
  const res = await store.dispatch('get_products_info', {
    id: route.params.id,
  });
  if (res) {
    for (const key in formState.value) {
      if (res[key]) {
        if (key === 'status') {
          formState.value[key].val = true;
        } else if (key === 'image') {
          res[key].forEach((e) => {
            fileList.value.push({
              image_id: e.id,
              thumbUrl: e.path,
            });
          });
        } else {
          formState.value[key].val = res[key];
        }
      }
    }
  }
};

const getProductGroups = async () => {
  formState.value.group_id.options = await store.dispatch(
    'get_products_groups'
  );
};

const getProductBrands = async () => {
  formState.value.brand_id.options = await store.dispatch('get_brand_list');
};

const handleRemove = (file) => {
  if (file.originFileObj) {
    console.log('file');
    return true;
  } else {
    return new Promise((resolve, reject) => {
      Modal.confirm({
        title: '提示',
        content: '資料一經刪除無法復原，是否確認要移除？',
        async onOk() {
          const history = fileList.value.find(
            (e) => e.thumbUrl === file.thumbUrl
          );
          const res = await store.dispatch('remove_product_image', {
            product_id: route.params.id,
            image_id: history.image_id,
          });
          if (res) {
            resolve(true);
          } else {
            reject(false);
          }
        },
        onCancel() {
          reject(false);
        },
      });
    });
  }
};
// 阻止默认上传行为
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG 文件!');
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片必须小于 2MB!');
    return false;
  }
  // 阻止默认上传行为
  return false;
};
// 自定义预览行为
const handlePreview = (file) => {
  if (file.url) {
    previewImage.value = file.url;
  } else if (file.thumbUrl) {
    previewImage.value = file.thumbUrl;
  }
  previewVisible.value = true;
};
// 处理文件更改
const handleChange = (info) => {
  let files = [...info.fileList];
  files = files.slice(-10); // 只保留最后10张图片
  formState.value.image.val = files.map((file) => file.originFileObj); // 直接存储文件对象
  fileList.value = files;
};

const submitProductForm = async () => {
  const actionName = route.params.id ? 'edit_product' : 'add_product';
  loading.value = true;
  let payload = new FormData();
  Object.values(formState.value).map((e) => {
    if (e.key === 'image') {
      e.val.forEach((file) => {
        file && payload.append('images', file);
      });
    } else if (e.key === 'status') {
      payload.append('status', e.val ? '1' : '0');
    } else {
      payload.append(e.key, e.val);
    }
  });
  if (route.params.id) {
    payload.append('id', String(route.params.id));
  }

  const res = await store.dispatch(actionName, payload);
  loading.value = false;
  if (res) {
    router.replace('/products');
  }
};
const onFinish = (values: any) => {
  submitProductForm();
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
</script>

<style scoped></style>
