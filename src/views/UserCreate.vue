<template>
  <div class="w-full h-full">
    <a-page-header
      :title="route.params.id ? '編輯用戶' : '新增用戶'"
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
          <a-select v-if="key === 'country'" v-model:value="field.val">
            <a-select-option
              v-for="select of countries"
              :key="select.code"
              :value="select.country"
            >
              {{ select.code }} {{ select.country }}
            </a-select-option>
          </a-select>
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
            {{ route.params.id ? '編輯' : '添加' }}
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
const countries = ref([]);
const formState = ref<FormState>({
  name: {
    key: 'name',
    label: '用戶名稱',
    placeholder: '請輸入用戶名稱',
    val: '',
    type: 'text',
    rules: {
      required: true,
      message: '',
    },
  },
  email: {
    key: 'email',
    label: '電子信箱',
    placeholder: '請輸入信箱地址',
    val: '',
    type: 'email',
    rules: {
      required: true,
      message: '',
    },
  },
  country: {
    key: 'country',
    label: '手機號碼國家',
    placeholder: '請輸入手機號碼國家',
    val: '',
    type: 'text',
    rules: {
      required: true,
      message: '',
    },
  },
  mobile: {
    key: 'mobile',
    label: '手機號碼',
    placeholder: '請輸入手機號碼',
    val: '',
    type: 'text',
    rules: {
      required: true,
      message: '',
    },
  },
  password: {
    key: 'password',
    label: '用戶密碼',
    placeholder: '請輸入用戶密碼',
    val: '',
    type: 'password',
    rules: {
      required: !route.params.id,
      message: '',
    },
  },
});

onMounted(() => {
  if (route.params.id) {
    getUserInfo();
  }
  getCountries();
});

const getUserInfo = async () => {
  const res = await store.dispatch('get_user_info', {
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

const getCountries = async () => {
  countries.value = await store.dispatch('get_countries_code');
};

const submitUserForm = async () => {
  const actionName = route.params.id ? 'edit_user' : 'add_user';
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
    router.replace('/user');
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
