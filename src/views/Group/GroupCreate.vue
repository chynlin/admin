<template>
  <div class="w-full h-full">
    <a-page-header
      :title="route.params.id ? '編輯分類' : '創建分類'"
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
              {{ select.title }}
            </a-select-option>
          </a-select>
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
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
const store = useStore();
const router = useRouter();
const route = useRoute();

interface FormField {
  key: string;
  label: string;
  placeholder: string;
  val: string;
  type: string;
  rules: {
    required: boolean;
    message: string;
  };
}

type FormState = Record<string, FormField>;

const loading = ref(false);
const formState = ref<FormState>({
  title: {
    key: 'title',
    label: '分類名稱',
    placeholder: '請輸入分類名稱',
    val: '',
    type: 'text',
    rules: {
      required: true,
      message: '',
    },
  },
});

onMounted(() => {
  if (route.params.id) {
    getGroupInfo();
  }
});

const getGroupInfo = async () => {
  const res = await store.dispatch('get_group_item', {
    id: route.params.id,
  });
  if (res) {
    for (const key in formState.value) {
      if (res[key]) {
        formState.value[key].val = res[key];
      }
    }
  }
};

const submitUserForm = async () => {
  const actionName = route.params.id ? 'edit_group' : 'create_group';
  loading.value = true;
  let payload = Object.values(formState.value).reduce((acc, e) => {
    acc[e.key] = e.val;
    return acc;
  }, {});
  if (route.params.id) {
    payload['id'] = route.params.id;
  }
  const res = await store.dispatch(actionName, payload);
  loading.value = false;
  if (res) {
    router.replace('/product-group');
  }
};
const onFinish = (values: any) => {
  submitUserForm();
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
</script>

<style scoped></style>
