<template>
  <div class="math-modal-mask" v-if="visible">
    <div class="math-modal" :class="{ 'app-dark': isDarkMode }" @click.stop>
      <div class="modal-header">
        <h3>插入数学公式</h3>
        <button class="modal-close" @click="handleClose">×</button>
      </div>
      <div class="modal-body">
        <!-- 公式输入区和预览区（左右分布） -->
        <div class="input-preview-container">
          <!-- 公式输入区 -->
          <div class="form-group input-section">
            <label>公式内容：</label>
            <textarea
                v-model="formulaContent"
                class="code-preview"
                rows="6"
                placeholder="请输入LaTeX格式的数学公式（例如：a^2 + b^2 = c^2）"
                spellcheck="false"
                ref="formulaInput"
            ></textarea>
          </div>

          <!-- 预览区 -->
          <div class="form-group preview-section">
            <label>实时预览：</label>
            <div class="preview-container">
              <div v-if="formulaContent" class="math-preview">
                <span v-html="renderedMarkdown"></span>
              </div>
              <div v-else class="preview-placeholder">
                公式预览将显示在这里
              </div>
            </div>
          </div>
        </div>

        <!-- 公式可视化工具栏（下方） -->
        <div class="formula-toolbar">
          <!-- 循环渲染所有工具栏部分 -->
          <div class="toolbar-section" v-for="(section, index) in formulaSections" :key="index">
            <h4>{{ section.title }}</h4>
            <div class="toolbar-buttons">
              <!-- 循环渲染每个部分的按钮 -->
              <button
                  @click="insertSymbol(symbol.code)"
                  v-for="(symbol, symIndex) in section.symbols"
                  :key="symIndex"
              >
                <span class="math-symbol" v-html="marked.parse('$$' + symbol.code + '$$')"></span>
              </button>
            </div>
          </div>
        </div>
      <div class="modal-footer">
        <button class="cancel-btn" @click="handleClose">取消</button>
        <button class="confirm-btn" :disabled="isBadKatex" @click="handleConfirm">确认插入</button>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineProps, ref, defineEmits, watch, nextTick, computed, onMounted} from 'vue';
import {marked} from 'marked';
import DOMPurify from 'dompurify';
import markedKatex from 'marked-katex-extension';
import {formulaSections} from '../../consts/formulaSections';
const props = defineProps<{
  visible: boolean;
  isDarkMode: boolean;
  defaultContent?: string;
}>();

marked.use(markedKatex({
  // @ts-ignore
  katexOptions: {
    throwOnError: true,
    displayMode: false,
    strict: 'ignore',
    trust: true
  }
}));

const formulaContent = ref(props.defaultContent || '');
const formulaInput = ref<HTMLTextAreaElement>();
const isBadKatex = ref(false);

const renderedMarkdown = computed(() => {
  let markdown;
  try{
    isBadKatex.value = false;
    // @ts-ignore
    markdown = DOMPurify.sanitize(marked.parse('$$' + formulaContent.value + '$$'));
  } catch(e: any){
    markdown = '公式语法错误，请检查公式内容！';
    console.error(e.message);
    isBadKatex.value = true;
  }
  return markdown;
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm', mathContent: string): void;
  (e: 'error', error: string): void;
}>();

const insertSymbol = (symbol: string) => {
  formulaContent.value += symbol;
  focusInput();
};

const focusInput = async () => {
  await nextTick();
  if (formulaInput.value) {
    formulaInput.value.focus();
    const length = formulaContent.value.length;
    formulaInput.value.setSelectionRange(length, length);
  }
};

const handleClose = () => {
  emit('close');
};

const handleConfirm = () => {
  if (!formulaContent.value.trim()) {
    emit('error', '请输入公式内容');
    return;
  }

  const mathContent = `\n$$\n ${formulaContent.value}\n$$\n`;
  console.log(mathContent);
  emit('confirm', mathContent);
};

watch(() => props.visible, (newVal) => {
  if (newVal) {
    formulaContent.value = props.defaultContent || '';
    nextTick(() => focusInput());
  }
});

// 解决 Firefox 下公式渲染问题
onMounted(() => {
  // if (navigator.userAgent.includes('Firefox')) {
    const cleanMathNodes = () => {
      document.querySelectorAll('math').forEach(math => {
        [...math.childNodes]
            .filter(node => node.nodeType === 3)
            .forEach(node => math.removeChild(node));
      });
    };

    // 初始清理
    cleanMathNodes();

    // 使用 MutationObserver 监听动态添加的内容
    const observer = new MutationObserver(cleanMathNodes);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  // }
});
</script>

<style scoped>
@import '../../styles/mathModal.css';
</style>
