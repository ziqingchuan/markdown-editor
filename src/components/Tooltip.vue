<template>
  <div class="tooltip-wrapper" @mouseenter="showTooltip" @mouseleave="hideTooltip">
    <!-- 插槽：放置需要触发tooltip的元素 -->
    <slot></slot>

    <!-- Tooltip提示框 -->
    <div
        v-if="visible"
        class="tooltip-content"
        :class="{ 'app-dark': isDarkMode }"
        :style="{
        left: `${position.x}px`,
        top: `${position.y}px`,
        minWidth: minWidth
      }"
        @mouseenter="keepTooltipVisible"
        @mouseleave="startAutoHide"
    >
      {{ content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';

// 接收的参数
const props = defineProps<{
  content: string; // 提示内容
  isDarkMode?: boolean; // 是否暗黑模式
  minWidth?: string; // 最小宽度，默认'auto'
  delay?: number; // 显示延迟，默认100ms
  autoHideDelay?: number; // 自动隐藏延迟，默认1000ms
}>();

// 状态管理
const visible = ref(false);
const position = ref({ x: 0, y: 0 });
let enterTimer: any = null;
let hideTimer: any = null;

// 显示tooltip
const showTooltip = (e: MouseEvent) => {
  // 清除之前的定时器
  clearTimers();

  // 设置延迟显示
  enterTimer = setTimeout(() => {
    // 计算位置（偏移10px避免鼠标遮挡）
    position.value = {
      x: e.clientX + 10,
      y: e.clientY + 10
    };
    visible.value = true;

    // 显示后开始自动隐藏倒计时
    startAutoHide();
  }, props.delay || 100);
};

// 保持tooltip可见（当鼠标移入tooltip时）
const keepTooltipVisible = () => {
  clearTimeout(hideTimer);
};

// 开始自动隐藏倒计时
const startAutoHide = () => {
  hideTimer = setTimeout(() => {
    visible.value = false;
  }, props.autoHideDelay || 1000);
};

// 隐藏tooltip
const hideTooltip = () => {
  clearTimers();
  visible.value = false;
};

// 清理所有定时器
const clearTimers = () => {
  if (enterTimer) {
    clearTimeout(enterTimer);
    enterTimer = null;
  }
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
};

// 组件卸载时清理定时器
onBeforeUnmount(() => {
  clearTimers();
});
</script>

<style scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.tooltip-content {
  position: fixed;
  z-index: 4000; /* 确保在其他元素上方 */
  padding: 6px;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
  font-size: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  pointer-events: auto;
  white-space: nowrap;
  transition: opacity 0.2s, transform 0.2s;
  transform-origin: left top;
  transform: translate(0, 0);
  opacity: 1;
}

/* 暗黑模式样式 */
.tooltip-content.app-dark {
  background-color: #2d2d2d;
  color: #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}
</style>
