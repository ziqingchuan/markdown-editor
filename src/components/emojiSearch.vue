<template>
  <div class="emoji-modal-mask" v-if="visible" @click="handleMaskClick">
    <div class="emoji-modal" :class="{ 'app-dark': isDarkMode }" @click.stop>
      <!-- 模态框头部 -->
      <div class="modal-header">
        <h3>选择 Emoji</h3>
        <button class="modal-close" @click="handleClose">×</button>
      </div>

      <!-- 模态框主体内容 -->
      <div class="modal-body">
        <!-- 搜索框 -->
        <div class="search-container">
          <div class="search-wrapper">
            <input
                type="text"
                v-model="searchTerm"
                placeholder="搜索 emoji (按 shortcode)"
                class="search-input"
                :class="{ 'dark-input': isDarkMode }"
            >
            <div class="search-icon">🔍</div>
          </div>
        </div>

        <!-- Emoji 网格 -->
        <div class="emoji-grid">
          <div
              v-for="emoji in filteredEmojis"
              :key="emoji.shortcode"
              class="emoji-card"
              :class="{ 'dark-card': isDarkMode }"
              @click="handleSelect(emoji.unicode)"
          >
            <div class="emoji-char">{{ emoji.unicode }}</div>
            <div class="emoji-code">:{{ formatShortcode(emoji.shortcode) }}:</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, watch } from 'vue';
import { emojis } from '../consts/emojiData.ts';

// 接收父组件参数
const props = defineProps<{
  visible: boolean;       // 控制弹窗显示/隐藏
  isDarkMode: boolean;    // 暗黑模式状态
  defaultSearch?: string; // 默认搜索关键词
}>();

// 内部状态
const emojiData = ref(emojis);
const searchTerm = ref(props.defaultSearch || '');

// 过滤emoji
const filteredEmojis = computed(() => {
  if (!searchTerm.value) return emojiData.value;

  const term = searchTerm.value.toLowerCase();
  return emojiData.value.filter(emoji =>
      emoji.shortcode.toLowerCase().includes(term)
  );
});

// 格式化shortcode
const formatShortcode = (shortcode) => {
  if (shortcode.length <= 2) return shortcode;
  return shortcode.length > 12 ? shortcode.substring(0, 9) + '...' : shortcode;
};

// 向父组件传递事件
const emit = defineEmits<{
(e: 'close'): void;                  // 关闭弹窗
(e: 'select-emoji', unicode: string): void; // 选中emoji
(e: 'error', message: string): void; // 错误信息
}>();

// 处理emoji选择
const handleSelect = (unicode) => {
  if (!unicode) {
    emit('error', '无效的表情符号');
    return;
  }
  emit('select-emoji', unicode);
};

// 点击遮罩层关闭
const handleMaskClick = () => {
  emit('close');
};

// 点击关闭按钮
const handleClose = () => {
  emit('close');
};

// 监听弹窗显示状态重置
watch(() => props.visible, (newVal) => {
  if (newVal) {
    searchTerm.value = props.defaultSearch || '';
  }
});
</script>

<style scoped>
@import '../styles/emojiModal.css';
</style>