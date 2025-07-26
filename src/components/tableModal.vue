<template>
  <div class="table-modal-mask" v-if="visible" @click="handleMaskClick">
    <div class="table-modal" :class="{ 'app-dark': isDarkMode }" @click.stop>
      <div class="modal-header">
        <h3>插入表格</h3>
        <button class="modal-close" @click="handleClose">×</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>行数：</label>
          <input
              type="number"
              v-model.number="rows"
              min="1"
              max="20"
              class="number-input"
          >
        </div>
        <div class="form-group">
          <label>列数：</label>
          <input
              type="number"
              v-model.number="cols"
              min="1"
              max="10"
              class="number-input"
          >
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
import {defineProps, ref, defineEmits, watch} from 'vue';

// 接收父组件的参数
const props = defineProps<{
  visible: boolean; // 控制弹窗显示/隐藏
  isDarkMode: boolean; // 暗黑模式状态
  defaultRows?: number; // 默认行数
  defaultCols?: number; // 默认列数
}>();

// 内部状态（使用props的默认值初始化）
const rows = ref(props.defaultRows || 3);
const cols = ref(props.defaultCols || 3);

// 向父组件传递事件
const emit = defineEmits<{
  (e: 'close'): void; // 关闭弹窗
  (e: 'confirm', rows: number, cols: number): void; // 确认插入（传递行数和列数）
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
  // 校验输入
  if (rows.value < 1 || cols.value < 1) {
    emit('error', '行数和列数不能小于1');
    return;
  }
  if (rows.value > 14 || cols.value > 14) {
    emit('error', '行数(列数)请控制在14以内');
    return;
  }
  // 向父组件传递选中的行数和列数
  emit('confirm', rows.value, cols.value);
};

// 监听props.visible变化（当弹窗重新显示时重置默认值）
watch(() => props.visible, (newVal) => {
  if (newVal) {
    rows.value = props.defaultRows || 3;
    cols.value = props.defaultCols || 3;
    console.log(props.isDarkMode);
  }
});
</script>

<style scoped>
@import '../styles/tableModal.css';
</style>