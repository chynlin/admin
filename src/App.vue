<script setup lang="ts"></script>

<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#687EFF',
      },
    }"
  >
    <router-view />
  </a-config-provider>
</template>

<style></style>
