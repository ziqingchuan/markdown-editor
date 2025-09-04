<template>
  <div
      class="text-toolbar"
      ref="toolbarRef"
      :style="{ left: toolbarLeft + 'px', top: toolbarTop + 'px' }"
      @mousedown="startDrag"
      @touchstart.passive="startDrag"
      :class="{ 'app-dark': isDarkMode }"
  >
    <!-- 工具栏按钮 -->
    <Tooltip
        content="加粗"
        :is-dark-mode="isDarkMode"
    >
      <button class="toolbar-btn" @click="onFormat('bold')">
        <img src="../assets/bold.svg" alt="加粗">
      </button>
    </Tooltip>

    <Tooltip
        content="斜体"
        :is-dark-mode="isDarkMode"
    >
      <button class="toolbar-btn" @click="onFormat('italic')">
        <img src="../assets/italic.svg" alt="斜体">
      </button>
    </Tooltip>

    <Tooltip
        content="下划线"
        :is-dark-mode="isDarkMode"
    >
      <button class="toolbar-btn" @click="onFormat('underline')">
        <img src="../assets/underline.svg" alt="下划线">
      </button>
    </Tooltip>
    <Tooltip
        content="链接"
        :is-dark-mode="isDarkMode"
    >
      <button class="toolbar-btn" @click="onFormat('link')">
        <img src="../assets/link.svg" alt="链接">
      </button>
    </Tooltip>
    <Tooltip
        content="行内公式"
        :is-dark-mode="isDarkMode"
    >
      <button class="toolbar-btn" @click="onFormat('math')">
        <img src="../assets/math.svg" alt="链接">
      </button>
    </Tooltip>
    <Tooltip
        content="行内代码"
        :is-dark-mode="isDarkMode"
    >
      <button class="toolbar-btn" @click="onFormat('code')">
        <img src="../assets/code.svg" alt="代码">
      </button>
    </Tooltip>
    <Tooltip
        content="引用块"
        :is-dark-mode="isDarkMode"
    >
      <button class="toolbar-btn" @click="onFormat('quote')">
        <img src="../assets/quote.svg" alt="引用">
      </button>
    </Tooltip>
    <Tooltip
        content="无序列表"
        :is-dark-mode="isDarkMode"
    >
      <button class="toolbar-btn" @click="onFormat('list')">
        <img src="../assets/list.svg" alt="列表">
      </button>
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import type { ContentType } from '../types/contentType.ts';
import { textHandler } from '../utils/textHandler.ts';
import Tooltip from "../components/Tooltip.vue";

const props = defineProps<{
  editorRef: HTMLTextAreaElement | undefined;
  isDarkMode: boolean;
  initialLeft?: number;
  initialTop?: number;
}>();

const emit = defineEmits<{
  (e: 'format', content: string): void;
  (e: 'positionChange', left: number, top: number): void;
}>();

// DOM 引用和状态
const toolbarRef = ref<HTMLDivElement>();
const toolbarLeft = ref(props.initialLeft || 0);
const toolbarTop = ref(props.initialTop || 0);
const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);

// 格式化文本
const onFormat = (type: ContentType) => {
  if (!props.editorRef) return;
  const selectedText = window.getSelection()?.toString() || '';
  const formattedText = textHandler(type, selectedText);
  emit('format', formattedText);
};

// 拖拽逻辑（兼容鼠标和触摸事件）
const startDrag = (e: MouseEvent | TouchEvent) => {
  if (!toolbarRef.value) return;

  // 统一获取坐标
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

  const target = e.target as HTMLElement;
  if (target === toolbarRef.value || target.classList.contains('toolbar-btn')) {
    isDragging.value = true;
    startX.value = clientX - toolbarLeft.value;
    startY.value = clientY - toolbarTop.value;

    // 监听所有事件
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('touchmove', handleDrag, { passive: false });
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
  }
};

const handleDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value || !toolbarRef.value) return;

  // 阻止触摸默认行为（避免页面滚动）
  if ('touches' in e) e.preventDefault();

  // 统一获取坐标
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

  // 边界计算
  const toolbarWidth = toolbarRef.value.offsetWidth;
  const toolbarHeight = toolbarRef.value.offsetHeight;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  let newLeft = clientX - startX.value;
  let newTop = clientY - startY.value;
  newLeft = Math.max(0, Math.min(newLeft, screenWidth - toolbarWidth - 30));
  newTop = Math.max(0, Math.min(newTop, screenHeight - toolbarHeight - 30));

  // 更新位置
  toolbarLeft.value = newLeft;
  toolbarTop.value = newTop;
  emit('positionChange', newLeft, newTop);
};

const stopDrag = () => {
  if (isDragging.value) {
    isDragging.value = false;
    // 移除所有事件监听
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('touchmove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchend', stopDrag);
  }
};

// 初始化位置
const initToolbarPosition = () => {
  if (!toolbarRef.value) return;
  const toolbarWidth = toolbarRef.value.offsetWidth;
  const toolbarHeight = toolbarRef.value.offsetHeight;
  const margin = 30;

  toolbarLeft.value = Math.max(margin, window.innerWidth - toolbarWidth - margin);
  toolbarTop.value = Math.max(margin, window.innerHeight - toolbarHeight - margin);
  emit('positionChange', toolbarLeft.value, toolbarTop.value);
};

// 响应式调整
const handleResize = () => {
  if (!isDragging.value) initToolbarPosition();
};

// 生命周期
onMounted(() => {
  nextTick(initToolbarPosition);
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  stopDrag(); // 确保清除所有事件
});
</script>
<style scoped>
@import '../styles/textToolbar.css';
</style>
