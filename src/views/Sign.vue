<template>
  <div
    class="w-full h-screen bg-gradient-to-br from-sky-100 bg-rose-100 flex items-center justify-center"
  >
    <div
      class="h-96 w-[500px] bg-white/80 shadow-lg rounded-lg px-12 flex flex-col justify-evenly"
    >
      <p class="text-2xl font-semibold text-center">後台管理系統</p>
      <a-form
        :model="formState"
        name="basic"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          name="account"
          :rules="[{ required: true, message: '請輸入您的使用者名稱' }]"
        >
          <a-input v-model:value="formState.account" size="large">
            <template #prefix>
              <div
                class="text-base pr-3 mr-2 border-r border-gray-200 h-4 flex items-center"
              >
                <i class="bi bi-person"></i>
              </div>
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          name="password"
          :rules="[{ required: true, message: '請輸入您的使用者密碼' }]"
        >
          <a-input-password v-model:value="formState.password" size="large">
            <template #prefix>
              <div
                class="text-base pr-3 mr-2 border-r border-gray-200 h-4 flex items-center"
              >
                <i class="bi bi-lock"></i>
              </div>
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item name="remember">
          <a-checkbox v-model:checked="formState.remember" class="mt-6"
            >記住帳號</a-checkbox
          >
        </a-form-item>

        <a-form-item class="mb-0">
          <a-button
            type="primary"
            html-type="submit"
            class="w-full"
            size="large"
          >
            登入
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

interface FormState {
  account: string;
  password: string;
  remember: boolean;
}

const store = useStore();
const router = useRouter();
const formState = ref<FormState>({
  account: '',
  password: '',
  remember: true,
});
onMounted(() => {
  const lastItem = localStorage.getItem('acc');
  if (lastItem) {
    formState.value = JSON.parse(lastItem);
  }
});
const login = async () => {
  const res = await store.dispatch('admin_login', formState.value);
  if (res) {
    router.replace('/');
  }
};
const onFinish = (values: any) => {
  if (formState.value.remember) {
    localStorage.setItem('acc', JSON.stringify(formState.value));
  } else {
    localStorage.removeItem('acc');
  }
  login();
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
</script>

<style scoped></style>
