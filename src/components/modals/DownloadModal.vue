<template>
  <div class="download-modal-mask" v-if="visible" @click="handleMaskClick">
    <div class="download-modal" :class="{ 'app-dark': isDarkMode }" @click.stop>
      <div class="modal-header">
        <h3>将文档保存为</h3>
        <button class="modal-close" @click="handleClose">×</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>文件名：</label>
          <input
              v-model="fileName"
              class="input-field"
              placeholder="请输入文件名..."
          />
        </div>
        <div class="form-group">
          <label>类型：</label>
          <div class="file-type">.{{ fileType }}</div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-btn" @click="handleClose">取消</button>
        <button class="confirm-btn" @click="handleConfirm">确认</button>
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
  fileType: string; // 文件类型
  defaultContent?: string; // 默认内容
}>();

const fileName = ref(props.defaultContent || '素笔导出文档');

// 向父组件传递事件
const emit = defineEmits<{
  (e: 'close'): void; // 关闭弹窗
  (e: 'confirm', fileName: string, fileType: string): void;
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
  if (!fileName.value) {
    emit('error', '请输入文件名');
    return;
  }
  // 向父组件传递选中的语言和内容
  emit('confirm', fileName.value, props.fileType);
};
// 监听props.visible变化（当弹窗重新显示时重置默认值）
watch(() => props.visible, (newVal) => {
  if (newVal) {
    fileName.value = '素笔导出文档';
  }
});
</script>

<style scoped>
@import '../../styles/downloadModal.css';
</style>
