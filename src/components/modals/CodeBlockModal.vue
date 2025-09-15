<template>
  <div class="code-modal-mask" v-if="visible" @click="handleMaskClick">
    <div class="code-modal" :class="{ 'app-dark': isDarkMode }" @click.stop>
      <div class="modal-header">
        <h3>插入代码块</h3>
        <button class="modal-close" @click="handleClose">×</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>选择语言：</label>
          <select v-model="selectedLanguage" class="language-select">
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="bash">Bash</option>
            <option value="json">JSON</option>
            <option value="markdown">Markdown</option>
            <option value="plaintext">纯文本</option>
          </select>
        </div>

        <div class="form-group">
          <label>代码内容：</label>
          <textarea
              v-model="codeContent"
              class="code-preview"
              rows="15"
              placeholder="可输入代码块的初始内容..."
          ></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-btn" @click="handleClose">取消</button>
        <button class="confirm-btn" @click="handleConfirm">确认插入</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, defineEmits, watch } from 'vue';

// 接收父组件的参数
const props = defineProps<{
  visible: boolean; // 控制弹窗显示/隐藏
  isDarkMode: boolean; // 暗黑模式状态
  defaultLanguage?: string; // 默认选中的语言
  defaultContent?: string; // 默认代码内容
}>();

// 内部状态（使用props的默认值初始化）
const selectedLanguage = ref(props.defaultLanguage || 'javascript');
const codeContent = ref(props.defaultContent || '');

// 向父组件传递事件
const emit = defineEmits<{
  (e: 'close'): void; // 关闭弹窗
  (e: 'confirm', language: string, content: string): void; // 确认插入（传递语言和内容）
  (e: 'error', error: string): void; // 错误信息
}>();

// 点击遮罩层关闭弹窗
const handleMaskClick = () => {
  emit('close');
};

// 点击关闭按钮
const handleClose = () => {
  emit('close');
};

// 点击确认按钮
const handleConfirm = () => {
  // 简单校验（至少选择一种语言）
  if (!selectedLanguage.value) {
    emit('error', '请选择一种代码语言');
    return;
  }
  // 向父组件传递选中的语言和内容
  emit('confirm', selectedLanguage.value, codeContent.value);
};

// 监听props.visible变化（当弹窗重新显示时重置默认值）
watch(() => props.visible, (newVal) => {
  if (newVal) {
    selectedLanguage.value = props.defaultLanguage || 'javascript';
    codeContent.value = props.defaultContent || '';
  }
});
</script>

<style scoped>
@import '../../styles/codeBlockModal.css';
</style>
