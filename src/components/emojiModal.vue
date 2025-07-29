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

        <!-- 加载状态 -->
        <div v-if="isLoading" class="emoji-loading">
          <div class="spinner"></div>
          <p>加载表情中...</p>
        </div>

        <!-- Emoji 网格 -->
        <div v-else class="emoji-grid">
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

          <!-- 无结果提示 -->
          <div v-if="filteredEmojis.length === 0" class="no-results">
            没有找到匹配的表情符号
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, watch } from 'vue';

// 接收父组件参数
const props = defineProps<{
  visible: boolean;       // 控制弹窗显示/隐藏
  isDarkMode: boolean;    // 暗黑模式状态
  defaultSearch?: string; // 默认搜索关键词
}>();

// 内部状态
const emojiData = ref<any[]>([]);
const searchTerm = ref(props.defaultSearch || '');
const isLoading = ref(false);
let hasLoaded = false; // 标记是否已加载过数据

// 过滤emoji
const filteredEmojis = computed(() => {
  if (!searchTerm.value) return emojiData.value;
  const term = searchTerm.value.toLowerCase();
  return emojiData.value.filter(emoji =>
      emoji.shortcode.toLowerCase().includes(term)
  );
});

// 格式化shortcode
const formatShortcode = (shortcode: string) => {
  if (shortcode.length <= 2) return shortcode;
  return shortcode.length > 12 ? shortcode.substring(0, 9) + '...' : shortcode;
};

// 向父组件传递事件
const emit = defineEmits<{
  (e: 'close'): void;                  // 关闭弹窗
  (e: 'select-emoji', unicode: string): void; // 选中emoji
  (e: 'error', message: string): void; // 错误信息
}>();

// 按需加载emoji数据
const loadEmojiData = async () => {
  if (hasLoaded || isLoading.value) return; // 避免重复加载

  try {
    isLoading.value = true;
    // 动态导入emoji数据，只有在需要时才加载
    const { emojis } = await import('../consts/emojiData.ts');
    emojiData.value = emojis;
    hasLoaded = true; // 标记为已加载
  } catch (error) {
    console.error('Emoji数据加载失败:', error);
    emit('error', '表情数据加载失败，请重试');
  } finally {
    isLoading.value = false;
  }
};

// 处理emoji选择
const handleSelect = (unicode: string) => {
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

// 监听弹窗显示状态，当弹窗显示时加载数据
watch(() => props.visible, (newVal) => {
  if (newVal) {
    searchTerm.value = props.defaultSearch || '';
    loadEmojiData(); // 弹窗显示时加载数据
  }
});
</script>

<style scoped>
@import '../styles/emojiModal.css';

/* 加载状态样式 */
.emoji-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #ddd;
  border-top-color: #333;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.dark-card .spinner {
  border-color: #555;
  border-top-color: #fff;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 无结果提示 */
.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
  color: #888;
}

.dark-card .no-results {
  color: #aaa;
}
</style>
