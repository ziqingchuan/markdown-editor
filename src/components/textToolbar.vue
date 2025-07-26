<template>
  <div
      class="text-toolbar"
      ref="toolbarRef"
      :style="{ left: toolbarLeft + 'px', top: toolbarTop + 'px' }"
      @mousedown="startDrag"
      :class="{ 'app-dark': isDarkMode }"
  >
    <!-- 工具栏按钮 -->
    <button class="toolbar-btn" @click="onFormat('bold')" title="加粗">
      <img src="../assets/bold.svg" alt="加粗">
    </button>
    <button class="toolbar-btn" @click="onFormat('italic')" title="斜体">
      <img src="../assets/italic.svg" alt="斜体">
    </button>
    <button class="toolbar-btn" @click="onFormat('underline')" title="下划线">
      <img src="../assets/underline.svg" alt="下划线">
    </button>
    <button class="toolbar-btn" @click="onFormat('link')" title="链接">
      <img src="../assets/link.svg" alt="链接">
    </button>
    <button class="toolbar-btn" @click="onFormat('code')" title="代码">
      <img src="../assets/code.svg" alt="代码">
    </button>
    <button class="toolbar-btn" @click="onFormat('quote')" title="引用">
      <img src="../assets/quote.svg" alt="引用">
    </button>
    <button class="toolbar-btn" @click="onFormat('list')" title="列表">
      <img src="../assets/list.svg" alt="列表">
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import type { ContentType } from '../types/contentType.ts';
import { textHandler } from '../utils/textHandler.ts';

// 接收父组件传递的编辑器引用和初始位置
const props = defineProps<{
  editorRef: HTMLTextAreaElement | undefined; // 编辑器DOM引用
  isDarkMode: boolean;
  initialLeft?: number; // 初始左侧定位
  initialTop?: number; // 初始顶部定位
}>();

// 工具栏DOM引用
const toolbarRef = ref<HTMLDivElement>();
// 工具栏定位状态
const toolbarLeft = ref(props.initialLeft || 0);
const toolbarTop = ref(props.initialTop || 0);
const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);

// 向父组件传递事件
const emit = defineEmits<{
  // 传递格式化后的文本给父组件
  (e: 'format', content: string): void;
  // 传递工具栏位置变化（可选，用于父组件保存位置）
  (e: 'positionChange', left: number, top: number): void;
}>();

// 格式化文本（调用工具函数处理后传递给父组件）
const onFormat = (type: ContentType) => {
  if (!props.editorRef) return;
  const selectedText = window.getSelection()?.toString() || '';
  const formattedText = textHandler(type, selectedText);
  emit('format', formattedText); // 传递格式化后的文本
};

// 拖拽相关方法
const startDrag = (e: MouseEvent) => {
  if (!toolbarRef.value) return;
  const target = e.target as HTMLElement;
  if (e.target === toolbarRef.value || target.classList.contains('toolbar-btn')) {
    isDragging.value = true;
    startX.value = e.clientX - toolbarLeft.value;
    startY.value = e.clientY - toolbarTop.value;
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
  }
};

const handleDrag = (e: MouseEvent) => {
  if (!isDragging.value || !toolbarRef.value) return;
  const toolbarWidth = toolbarRef.value.offsetWidth;
  const toolbarHeight = toolbarRef.value.offsetHeight;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // 计算新位置并限制边界
  let newLeft = e.clientX - startX.value;
  let newTop = e.clientY - startY.value;
  newLeft = Math.max(0, Math.min(newLeft, screenWidth - toolbarWidth));
  newTop = Math.max(0, Math.min(newTop, screenHeight - toolbarHeight - 10));

  // 更新位置并通知父组件
  toolbarLeft.value = newLeft;
  toolbarTop.value = newTop;
  emit('positionChange', newLeft, newTop);
};

const stopDrag = () => {
  if (isDragging.value) {
    isDragging.value = false;
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
  }
};

// 初始化工具栏位置
const initToolbarPosition = () => {
  if (!toolbarRef.value) return;
  const toolbarWidth = toolbarRef.value.offsetWidth;
  const toolbarHeight = toolbarRef.value.offsetHeight;
  const marginLeft = 10;
  const marginTop = 60;

  const maxLeft = window.innerWidth - marginLeft - toolbarWidth;
  const maxTop = window.innerHeight - marginTop - toolbarHeight;

  toolbarLeft.value = Math.max(marginLeft, maxLeft);
  toolbarTop.value = Math.max(marginTop, maxTop);
  emit('positionChange', toolbarLeft.value, toolbarTop.value);
};

// 监听窗口大小变化
const handleResize = () => {
  if (!isDragging.value) {
    initToolbarPosition();
  }
};

// 组件生命周期
onMounted(() => {
  nextTick(initToolbarPosition); // 确保DOM渲染后初始化位置
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('mouseup', stopDrag);
});
</script>

<style scoped>
@import '../styles/textToolbar.css';
</style>