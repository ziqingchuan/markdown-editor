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
          <div class="toolbar-section">
            <h4>基础运算</h4>
            <div class="toolbar-buttons">
              <button @click="insertSymbol('+')">加</button>
              <button @click="insertSymbol('-')">减</button>
              <button @click="insertSymbol('×')">乘</button>
              <button @click="insertSymbol('÷')">除</button>
              <button @click="insertSymbol('=')">等于</button>
              <button @click="insertSymbol('≠')">不等于</button>
              <button @click="insertSymbol('<')">小于</button>
              <button @click="insertSymbol('>')">大于</button>
              <button @click="insertSymbol('≤')">小于等于</button>
              <button @click="insertSymbol('≥')">大于等于</button>
            </div>
          </div>

          <div class="toolbar-section">
            <h4>上下标</h4>
            <div class="toolbar-buttons">
              <button @click="insertTemplate('a^2')">上标</button>
              <button @click="insertTemplate('a_1')">下标</button>
              <button @click="insertTemplate('e^{x+y}')">指数</button>
              <button @click="insertTemplate('x_{i=1}')">下标集</button>
            </div>
          </div>

          <div class="toolbar-section">
            <h4>分式与根号</h4>
            <div class="toolbar-buttons">
              <button @click="insertTemplate('\\frac{a}{b}')">分式</button>
              <button @click="insertTemplate('\\sqrt{x}')">平方根</button>
              <button @click="insertTemplate('\\sqrt[3]{x}')">n次方根</button>
            </div>
          </div>

          <div class="toolbar-section">
            <h4>三角函数</h4>
            <div class="toolbar-buttons">
              <button @click="insertSymbol('\\sin')">正弦</button>
              <button @click="insertSymbol('\\cos')">余弦</button>
              <button @click="insertSymbol('\\tan')">正切</button>
              <button @click="insertSymbol('\\cot')">余切</button>
              <button @click="insertSymbol('\\sec')">正割</button>
              <button @click="insertSymbol('\\csc')">余割</button>
            </div>
          </div>

          <div class="toolbar-section">
            <h4>微积分</h4>
            <div class="toolbar-buttons">
              <button @click="insertSymbol('\\int')">积分</button>
              <button @click="insertTemplate('\\int_{a}^{b}')">定积分</button>
              <button @click="insertSymbol('\\sum')">求和</button>
              <button @click="insertTemplate('\\sum_{i=1}^{n}')">限定求和</button>
              <button @click="insertSymbol('\\lim')">极限</button>
              <button @click="insertSymbol('\\infty')">无穷大</button>
              <button @click="insertSymbol('\\partial')">偏导数</button>
            </div>
          </div>

          <div class="toolbar-section">
            <h4>矩阵与集合</h4>
            <div class="toolbar-buttons">
              <button @click="insertTemplate('\\begin{bmatrix}a & b \\\\ c & d\\end{bmatrix}')">矩阵</button>
              <button @click="insertSymbol('\\in')">属于</button>
              <button @click="insertSymbol('\\notin')">不属于</button>
              <button @click="insertSymbol('\\subset')">子集</button>
              <button @click="insertSymbol('\\supset')">超集</button>
              <button @click="insertSymbol('\\cup')">并集</button>
              <button @click="insertSymbol('\\cap')">交集</button>
            </div>
          </div>

          <div class="toolbar-section">
            <h4>希腊字母</h4>
            <div class="toolbar-buttons">
              <button @click="insertSymbol('\\alpha')">α</button>
              <button @click="insertSymbol('\\beta')">β</button>
              <button @click="insertSymbol('\\gamma')">γ</button>
              <button @click="insertSymbol('\\delta')">δ</button>
              <button @click="insertSymbol('\\epsilon')">ε</button>
              <button @click="insertSymbol('\\pi')">π</button>
              <button @click="insertSymbol('\\theta')">θ</button>
              <button @click="insertSymbol('\\lambda')">λ</button>
              <button @click="insertSymbol('\\mu')">μ</button>
              <button @click="insertSymbol('\\omega')">ω</button>
            </div>
          </div>

          <div class="toolbar-section">
            <h4>逻辑符号</h4>
            <div class="toolbar-buttons">
              <button @click="insertSymbol('\\forall')">∀</button>
              <button @click="insertSymbol('\\exists')">∃</button>
              <button @click="insertSymbol('\\Rightarrow')">⇒</button>
              <button @click="insertSymbol('\\Leftrightarrow')">⇔</button>
              <button @click="insertSymbol('\\land')">∧</button>
              <button @click="insertSymbol('\\lor')">∨</button>
              <button @click="insertSymbol('\\neg')">¬</button>
            </div>
          </div>

          <div class="toolbar-section">
            <h4>箭头符号</h4>
            <div class="toolbar-buttons">
              <button @click="insertSymbol('\\rightarrow')">→</button>
              <button @click="insertSymbol('\\leftarrow')">←</button>
              <button @click="insertSymbol('\\uparrow')">↑</button>
              <button @click="insertSymbol('\\downarrow')">↓</button>
              <button @click="insertSymbol('\\leftrightarrow')">↔</button>
              <button @click="insertSymbol('\\mapsto')">↦</button>
            </div>
          </div>

          <div class="toolbar-section">
            <h4>特殊函数</h4>
            <div class="toolbar-buttons">
              <button @click="insertSymbol('\\log')">log</button>
              <button @click="insertSymbol('\\ln')">ln</button>
              <button @click="insertSymbol('!')">阶乘</button>
              <button @click="insertSymbol('\\Gamma')">Γ</button>
              <button @click="insertSymbol('\\beta')">β</button>
              <button @click="insertSymbol('\\max')">max</button>
              <button @click="insertSymbol('\\min')">min</button>
            </div>
          </div>

          <div class="toolbar-section">
            <h4>向量与矩阵符号</h4>
            <div class="toolbar-buttons">
              <button @click="insertTemplate('\\vec{a}')">向量</button>
              <button @click="insertTemplate('A^T')">转置</button>
              <button @click="insertTemplate('|A|')">行列式</button>
              <button @click="insertSymbol('\\nabla')">nabla</button>
              <button @click="insertTemplate('\\mathbf{A}')">加粗矩阵</button>
            </div>
          </div>

          <div class="toolbar-section">
            <h4>括号类</h4>
            <div class="toolbar-buttons">
              <button @click="insertTemplate('(a + b)')">小括号</button>
              <button @click="insertTemplate('[a + b]')">中括号</button>
              <button @click="insertTemplate('\\{a + b\\}')">大括号</button>
              <button @click="insertTemplate('|a + b|')">单竖线</button>
              <button @click="insertTemplate('\\|a + b\\|')">双竖线</button>
              <button @click="insertTemplate('\\left( \\frac{a}{b} \\right)')">自适应括号</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-btn" @click="handleClose">取消</button>
        <button class="confirm-btn" :disabled="isBadKatex" @click="handleConfirm">确认插入</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineProps, ref, defineEmits, watch, nextTick, computed} from 'vue';
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
</script>

<style scoped>
@import '../../styles/MathModal.css';
</style>
