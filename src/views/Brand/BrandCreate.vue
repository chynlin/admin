<template>
  <div class="w-full h-full">
    <a-page-header
      :title="route.params.id ? '編輯品牌' : '創建品牌'"
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
          <a-upload
            v-if="field.type === 'file'"
            v-model:fileList="fileList"
            :before-upload="beforeUpload"
            list-type="picture-card"
            @preview="handlePreview"
            @change="handleChange"
          >
            <div v-if="!fileList.length">
              <div style="margin-top: 8px">Upload</div>
            </div>
          </a-upload>
          <a-input
            v-else
            v-model:value="field.val"
            :placeholder="field.placeholder"
            :type="field.type"
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
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { message } from 'ant-design-vue';
const store = useStore();
const router = useRouter();
const route = useRoute();

interface FormField {
  key: string;
  label: string;
  placeholder: string;
  val: any;
  type: string;
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
    label: '品牌名稱',
    placeholder: '請輸入品牌名稱',
    val: '',
    type: 'text',
    rules: {
      required: false,
      message: '',
    },
  },
  logo: {
    key: 'logo',
    label: '品牌LOGO',
    placeholder: '請輸入品牌名稱',
    val: [],
    type: 'file',
    rules: {
      required: false,
      message: '',
    },
  },
  description: {
    key: 'description',
    label: '品牌描述',
    placeholder: '請輸入品牌描述',
    val: '',
    type: 'text',
    rules: {
      required: false,
      message: '',
    },
  },
});

onMounted(() => {
  if (route.params.id) {
    getBrandInfo();
  }
});

const getBrandInfo = async () => {
  const res = await store.dispatch('get_brand_info', {
    id: route.params.id,
  });
  if (res) {
    for (const key in formState.value) {
      if (res[key]) {
        if (key === 'logo') {
          fileList.value.push({
            thumbUrl: res[key],
          });
        } else {
          formState.value[key].val = res[key];
        }
      }
    }
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
  formState.value.logo.val = files.map((file) => file.originFileObj); // 直接存储文件对象
  fileList.value = files;
};
const submitForm = async () => {
  const actionName = route.params.id ? 'update_brand' : 'create_brand';
  loading.value = true;
  let payload = new FormData();
  Object.values(formState.value).map((e) => {
    if (e.key !== 'logo') {
      payload.append(e.key, e.val);
    } else {
      e.val.forEach((file) => {
        payload.append('logo', file);
      });
    }
  });
  if (route.params.id) {
    payload.append('id', String(route.params.id));
  }
  const res = await store.dispatch(actionName, payload);
  loading.value = false;
  if (res) {
    router.replace('/brand');
  }
};
const onFinish = (values: any) => {
  submitForm();
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
</script>

<style scoped></style>
