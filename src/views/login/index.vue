<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { MyCard } from '@/components/my/card';
import { login } from '@/services/user';
import { storage } from '@/utils/storage';
import { ApiCode } from '@/constants/api';

defineOptions({
  name: 'loginPage',
});

const formState = reactive({
  username: '',
  password: '',
});

const loading = ref(false);
const router = useRouter();

const handleSubmit = async () => {
  if (!formState.username || !formState.password) {
    Message.warning('请输入用户名和密码');
    return;
  }

  loading.value = true;
  try {
    const res = await login({
      username: formState.username,
      password: formState.password,
    });

    if (res.code === ApiCode.Success && res.data?.token) {
      storage.set('token', res.data.token);
      Message.success('登录成功');
      router.push('/app/dashboard');
    } else {
      const message =
        res.code === ApiCode.LoginFailed ? '用户名或密码错误' : res.message || '登录失败';
      Message.error(message);
    }
  } catch (error) {
    console.error(error);
    Message.error('登录失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex min-h-[70vh] items-center justify-center">
    <div class="w-full max-w-md">
      <MyCard title="Sign in" subtitle="Welcome back" header-align="center">
        <a-form :model="formState" layout="vertical">
          <a-form-item field="username" label="用户名">
            <a-input v-model="formState.username" placeholder="请输入用户名" allow-clear />
          </a-form-item>

          <a-form-item field="password" label="密码">
            <a-input-password v-model="formState.password" placeholder="请输入密码" allow-clear />
          </a-form-item>
        </a-form>
        <a-button type="primary" size="large" long :loading="loading" @click="handleSubmit">
          登录
        </a-button>
      </MyCard>
    </div>
  </div>
</template>
