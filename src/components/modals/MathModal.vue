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
          <!-- 基础运算 -->
          <div class="toolbar-section">
            <h4>基础运算</h4>
            <div class="toolbar-buttons">
              <button @click="insertSymbol('+')">
                <span class="math-symbol" v-html="marked.parse('$$' + '+' + '$$')"></span>
              </button>
              <button @click="insertSymbol('-')">
                <span class="math-symbol" v-html="marked.parse('$$' + '-' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\times')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\times' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\div')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\div' + '$$')"></span>
              </button>
              <button @click="insertSymbol('=')">
                <span class="math-symbol" v-html="marked.parse('$$' + '=' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\neq')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\neq' + '$$')"></span>
              </button>
              <button @click="insertSymbol('<')">
                <span class="math-symbol" v-html="marked.parse('$$' + '<' + '$$')"></span>
              </button>
              <button @click="insertSymbol('>')">
                <span class="math-symbol" v-html="marked.parse('$$' + '>' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\leq')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\leq' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\geq')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\geq' + '$$')"></span>
              </button>
            </div>
          </div>
          <!-- 上下标 -->
          <div class="toolbar-section">
            <h4>上下标</h4>
            <div class="toolbar-buttons">
              <button @click="insertTemplate('a^2')">
                <span class="math-symbol" v-html="marked.parse('$$' + 'a^2' + '$$')"></span>
              </button>
              <button @click="insertTemplate('a_1')">
                <span class="math-symbol" v-html="marked.parse('$$' + 'a_1' + '$$')"></span>
              </button>
              <button @click="insertTemplate('e^{x+y}')">
                <span class="math-symbol" v-html="marked.parse('$$' + 'e^{x+y}' + '$$')"></span>
              </button>
              <button @click="insertTemplate('x_{i=1}')">
                <span class="math-symbol" v-html="marked.parse('$$' + 'x_{i=1}' + '$$')"></span>
              </button>
            </div>
          </div>
          <!-- 分式与根号 -->
          <div class="toolbar-section">
            <h4>分式与根号</h4>
            <div class="toolbar-buttons">
              <button @click="insertTemplate('\\frac{a}{b}')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\frac{a}{b}' + '$$')"></span>
              </button>
              <button @click="insertTemplate('\\sqrt{x}')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\sqrt{x}' + '$$')"></span>
              </button>
              <button @click="insertTemplate('\\sqrt[3]{x}')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\sqrt[3]{x}' + '$$')"></span>
              </button>
            </div>
          </div>
          <!-- 三角函数 -->
          <div class="toolbar-section">
            <h4>三角函数</h4>
            <div class="toolbar-buttons">
              <button @click="insertSymbol('\\sin')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\sin' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\cos')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\cos' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\tan')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\tan' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\cot')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\cot' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\sec')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\sec' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\csc')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\csc' + '$$')"></span>
              </button>
            </div>
          </div>
          <!-- 微积分 -->
          <div class="toolbar-section">
            <h4>微积分</h4>
            <div class="toolbar-buttons">
              <button @click="insertSymbol('\\int')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\int' + '$$')"></span>
              </button>
              <button @click="insertTemplate('\\int_{a}^{b}')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\int_{a}^{b}' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\sum')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\sum' + '$$')"></span>
              </button>
              <button @click="insertTemplate('\\sum_{i=1}^{n}')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\sum_{i=1}^{n}' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\lim')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\lim' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\infty')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\infty' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\partial')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\partial' + '$$')"></span>
              </button>
            </div>
          </div>
          <!-- 矩阵与集合 -->
          <div class="toolbar-section">
            <h4>矩阵与集合</h4>
            <div class="toolbar-buttons">
              <button @click="insertTemplate('\\begin{bmatrix}a & b \\\\ c & d\\end{bmatrix}')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\begin{bmatrix}a & b \\\\ c & d\\end{bmatrix}' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\in')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\in' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\notin')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\notin' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\subset')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\subset' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\supset')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\supset' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\cup')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\cup' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\cap')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\cap' + '$$')"></span>
              </button>
            </div>
          </div>
          <!-- 希腊字母 -->
          <div class="toolbar-section">
            <h4>希腊字母</h4>
            <div class="toolbar-buttons">
              <button @click="insertSymbol('\\alpha')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\alpha' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\beta')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\beta' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\gamma')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\gamma' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\delta')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\delta' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\epsilon')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\epsilon' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\pi')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\pi' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\theta')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\theta' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\lambda')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\lambda' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\mu')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\mu' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\omega')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\omega' + '$$')"></span>
              </button>
            </div>
          </div>
          <!-- 逻辑符号 -->
          <div class="toolbar-section">
            <h4>逻辑符号</h4>
            <div class="toolbar-buttons">
              <button @click="insertSymbol('\\forall')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\forall' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\exists')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\exists' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\Rightarrow')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\Rightarrow' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\Leftrightarrow')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\Leftrightarrow' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\land')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\land' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\lor')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\lor' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\neg')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\neg' + '$$')"></span>
              </button>
            </div>
          </div>
          <!-- 箭头符号 -->
          <div class="toolbar-section">
            <h4>箭头符号</h4>
            <div class="toolbar-buttons">
              <button @click="insertSymbol('\\rightarrow')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\rightarrow' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\leftarrow')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\leftarrow' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\uparrow')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\uparrow' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\downarrow')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\downarrow' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\leftrightarrow')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\leftrightarrow' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\mapsto')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\mapsto' + '$$')"></span>
              </button>
            </div>
          </div>
          <!-- 特殊函数 -->
          <div class="toolbar-section">
            <h4>特殊函数</h4>
            <div class="toolbar-buttons">
              <button @click="insertSymbol('\\log')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\log' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\ln')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\ln' + '$$')"></span>
              </button>
              <button @click="insertSymbol('!')">
                <span class="math-symbol" v-html="marked.parse('$$' + '!' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\Gamma')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\Gamma' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\beta')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\beta' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\max')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\max' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\min')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\min' + '$$')"></span>
              </button>
            </div>
          </div>
          <!-- 向量与矩阵符号 -->
          <div class="toolbar-section">
            <h4>向量与矩阵符号</h4>
            <div class="toolbar-buttons">
              <button @click="insertTemplate('\\vec{a}')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\vec{a}' + '$$')"></span>
              </button>
              <button @click="insertTemplate('A^T')">
                <span class="math-symbol" v-html="marked.parse('$$' + 'A^T' + '$$')"></span>
              </button>
              <button @click="insertTemplate('|A|')">
                <span class="math-symbol" v-html="marked.parse('$$' + '|A|' + '$$')"></span>
              </button>
              <button @click="insertSymbol('\\nabla')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\nabla' + '$$')"></span>
              </button>
              <button @click="insertTemplate('\\mathbf{A}')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\mathbf{A}' + '$$')"></span>
              </button>
            </div>
          </div>
          <!-- 括号类 -->
          <div class="toolbar-section">
            <h4>括号类</h4>
            <div class="toolbar-buttons">
              <button @click="insertTemplate('(a + b)')">
                <span class="math-symbol" v-html="marked.parse('$$' + '(a + b)' + '$$')"></span>
              </button>
              <button @click="insertTemplate('[a + b]')">
                <span class="math-symbol" v-html="marked.parse('$$' + '[a + b]' + '$$')"></span>
              </button>
              <button @click="insertTemplate('\\{a + b\\}')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\{a + b\\}' + '$$')"></span>
              </button>
              <button @click="insertTemplate('|a + b|')">
                <span class="math-symbol" v-html="marked.parse('$$' + '|a + b|' + '$$')"></span>
              </button>
              <button @click="insertTemplate('\\|a + b\\|')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\|a + b\\|' + '$$')"></span>
              </button>
              <button @click="insertTemplate('\\left( \\frac{a}{b} \\right)')">
                <span class="math-symbol" v-html="marked.parse('$$' + '\\left( \\frac{a}{b} \\right)' + '$$')"></span>
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

const insertTemplate = (example: string) => {
  formulaContent.value += example;
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
  if (navigator.userAgent.includes('Firefox')) {
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
  }
});
</script>

<style scoped>
@import '../../styles/MathModal.css';
</style>
