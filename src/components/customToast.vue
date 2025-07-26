<template>
  <div
      class="custom-toast"
      :class="{
      'toast-show': showToast,
      'toast-success': toastType === 'success',
      'toast-error': toastType === 'error'
    }"
  >
    <div class="toast-icon">
      <span v-if="toastType === 'success'">✓</span>
      <span v-if="toastType === 'error'">✕</span>
    </div>
    <div class="toast-message">{{ toastMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted } from 'vue';

// 定义接收的参数
const props = defineProps<{
  showToast: boolean; // 控制弹窗显示/隐藏
  toastMessage: string; // 弹窗内容
  toastType: 'success' | 'error'; // 弹窗类型
  duration?: number; // 自动关闭时间（默认3000ms）
}>();

// 自动关闭逻辑
onMounted(() => {
  if (props.showToast) {
    const timer = setTimeout(() => {
      // 通知父组件关闭弹窗
      emit('close');
    }, props.duration || 3000);

    // 清理定时器
    return () => clearTimeout(timer);
  }
});

// 定义向父组件传递的事件
const emit = defineEmits<{
  (e: 'close'): void; // 弹窗关闭事件
}>();
</script>

<style scoped>
@import '../styles/toast.css';
</style>