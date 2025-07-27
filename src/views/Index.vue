<template>
  <div class="app-container" :class="{ 'app-dark': isDarkMode }">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <i class="logo-icon">
            <img src="/logo.svg" alt="logo">
          </i>
          <span>素笔 Mark</span>
        </div>

        <div class="header-actions">
          <!-- 主题切换按钮 -->
          <div class="theme-toggle" @click="isDarkMode = !isDarkMode">
            <div class="toggle-thumb" :class="{ 'toggle-thumb-dark': isDarkMode }"></div>
            <span class="sun-icon">☀</span>
            <span class="moon-icon">☪</span>
          </div>

          <!-- 下载按钮组 -->
          <div class="download-btn-group">
            <button class="primary-btn" @click.stop="showDropdown = !showDropdown">
              <span>导出</span>
            </button>
            <div class="dropdown-menu" :class="{ 'dropdown-show': showDropdown }" @click.stop>
              <button class="dropdown-btn" @click.stop="showDropdown = !showDropdown">
                ▼
              </button>
              <!-- 下载选项 -->
              <div class="dropdown-options">
                <div class="dropdown-item" @click="downloadMarkdown">
                  <img class="file-icon" src="/markdown.svg" alt="md">
                  <span>Markdown文件</span>
                </div>
                <div class="dropdown-item" @click="downloadPdf">
                  <img class="file-icon" src="/pdf.svg" alt="pdf">
                  <span>PDF文件</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 编辑器区域 -->
      <div class="editor-container">

        <div class="panel-header editor-header">
          <img class="panel-icon" src="/editor.svg" alt="编辑">
          <span>编辑区域</span>

          <!-- 功能按钮组 -->
          <div class="upload-btn" @click="openFileSelect('image/*')" title="上传图片" style="margin-left: auto">
            <img class="upload-icon" src="/upload-picture.svg" alt="上传图片">
          </div>
          <div class="upload-btn" @click="openFileSelect('.html,.md,.pdf,.txt,.doc,.docx')" title="解析文件">
            <img class="upload-icon" src="/upload-file.svg" alt="解析文件">
          </div>
          <div class="upload-btn" @click="addCodeBlock" title="代码块">
            <img class="upload-icon" src="/code-block.svg" alt="代码块">
          </div>
          <div class="upload-btn" @click="showTableModal = true" title="表格">
            <img class="upload-icon" src="/table.svg" alt="表格">
          </div>
        </div>

        <textarea
            v-model="markdownContent"
            class="editor-textarea"
            placeholder="在此输入内容..."
            ref="editorRef"
            @scroll="handleEditorScroll"
            @keydown="handleKeyDown"
        ></textarea>
      </div>

      <!-- 预览区域 -->
      <div class="preview-container">
        <div class="panel-header preview-header">
          <img class="panel-icon" src="/preview.svg" alt="预览">
          <span>预览区域</span>
        </div>
        <div class="preview-content"
             v-html="renderedMarkdown"
             ref="previewRef"
             @scroll="handlePreviewScroll"
        ></div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <p>© 2025    <a target="_blank" href="https://try-catch.life/">try-catch.life</a></p>
    </footer>

    <!-- 加载提示 -->
    <div class="loading-mask" v-if="isLoading">
      <div class="loading-content">
        <div class="spinner"></div>
        <p class="loading-text">处理中，请稍候...</p>
      </div>
    </div>
  </div>
  <TextToolbar
      :editor-ref="editorRef"
      @format="addContentToEditor"
      :is-dark-mode="isDarkMode"
  />
  <!-- 自定义弹窗 -->
  <CustomToast
      :show-toast="showToast"
      :toast-message="toastMessage"
      :toast-type="toastType"
      @close="showToast = false"
  />

  <!-- 表格配置弹窗 -->
  <TableModal
      :visible="showTableModal"
      :is-dark-mode="isDarkMode"
      @close="showTableModal = false"
      @confirm="handleTableConfirm"
      @error="(msg: any) => showCustomToast(msg, 'error')"
  />
</template>

<script setup lang="ts">
import {computed, nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue';
import {marked} from 'marked';
import DOMPurify from 'dompurify';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import hljs from 'highlight.js';
import 'highlight.js/styles/rainbow.css';
import {FileUploadHandler} from "../utils/uploadHandler.ts";
import {syncScroll} from "../utils/scrollHandler.ts";
import {initialMarkdownContent} from "../consts/markdownContent.ts";
import {pdfOptions} from "../consts/pdfConfig.ts";
import {generateMarkdownTable} from "../utils/tableGenerator.ts";
import CustomToast from "../components/customToast.vue";
import TableModal from "../components/tableModal.vue";
import TextToolbar from "../components/textToolbar.vue";
import {markdownHandler, pdfHandler} from "../utils/downloadHandler.ts";
import {keyboardHandler} from "../utils/keyboardHandler.ts";

// 状态管理
const isDarkMode = ref(true); // 暗黑模式
const isLoading = ref(false);
const showDropdown = ref(false);
const showToast = ref(false);// 弹窗状态
const toastMessage = ref('');
const toastType = ref('success'); // success/error
// 获取DOM引用
const editorRef = ref<HTMLTextAreaElement>();
const previewRef = ref<HTMLDivElement>();
// 用于防止滚动事件循环触发的标志
const isSyncing = ref(false);
// 表格弹窗相关状态
const showTableModal = ref(false); // 控制弹窗显示

// 配置marked使用highlight.js高亮代码
marked.setOptions({
  // @ts-ignore
  highlight: function (code: any, language: any) {
    const validLanguage = hljs.getLanguage(language) ? language : 'javascript';
    return hljs.highlight(code, {language: validLanguage}).value;
  },
});
// 初始化Markdown内容
const markdownContent = ref(initialMarkdownContent);

// 渲染后的HTML
const renderedMarkdown = computed(() => {
  // @ts-ignore
  return DOMPurify.sanitize(marked.parse(markdownContent.value));
});

// 添加代码块
const addCodeBlock = () => {
  addContentToEditor(`\n\`\`\`javascript\n\n\`\`\``);
};

// 处理确认插入表格
const handleTableConfirm = (rows: number, cols: number) => {
  // 关闭弹窗
  showTableModal.value = false;
  // 生成表格内容（复用原有的generateMarkdownTable方法）
  const tableContent = generateMarkdownTable(rows, cols);
  // 插入到编辑器
  addContentToEditor(tableContent);
  // 显示成功提示
  showCustomToast(`已插入 ${rows}行×${cols}列 表格`);
};

const openFileSelect = (accept: string) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = accept;
  const fileType = accept === 'image/*' ? 'img' : 'file';
  input.onchange = (e) => handleFileSelect(e, fileType);

  input.click();
};

// 处理文件选择（接收事件和文件类型）
const handleFileSelect = async (e: Event, fileType: 'img' | 'file') => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  try {
    isLoading.value = true;
    // 根据文件类型处理
    let content: string;
    if (fileType === 'img') {
      // 处理图片
      content = await FileUploadHandler.handleImage(file);
    } else {
      content = await FileUploadHandler.handleFile(file);
    }

    showCustomToast('上传成功！', 'success');
    addContentToEditor(`\n${content}`);
  } catch (error) {
    console.error('上传失败:', error);
    showCustomToast('上传失败，请重试', 'error');
  } finally {
    isLoading.value = false;
    target.value = ''; // 允许重复选择同一文件
  }
};

// 点击空白处关闭下拉菜单
const handleClickOutside = (e: any) => {
  const dropdown = document.querySelector('.dropdown-menu');
  if (dropdown && !dropdown.contains(e.target)) {
    showDropdown.value = false;
  }
};

// 下载Markdown文件
const downloadMarkdown = () => {
  showDropdown.value = false;
  try {
    markdownHandler(markdownContent.value);
    showCustomToast('Markdown文件下载成功'); // 替换alert
  } catch (error: any) {
    showCustomToast('下载失败：' + error.message, 'error'); // 替换alert
  }
};

// 下载PDF文件
const downloadPdf = () => {
  showDropdown.value = false;
  isLoading.value = true;
  const tempElement = pdfHandler(renderedMarkdown);
  document.body.appendChild(tempElement);
  // 生成并下载PDF
  html2pdf().from(tempElement).set(pdfOptions).save()
      .then(() => showCustomToast('PDF文件下载成功'))
      .catch((error: any) => showCustomToast('PDF生成失败：' + error.message, 'error'))
      .finally(() => {
        document.body.removeChild(tempElement);
        isLoading.value = false;
      });
};
// 编辑器滚动时同步到预览区（绑定到编辑器的scroll事件）
const handleEditorScroll = () => {
  syncScroll(editorRef, previewRef, isSyncing);
};

// 预览区滚动时同步到编辑器（绑定到预览区的scroll事件）
const handlePreviewScroll = () => {
  syncScroll(previewRef, editorRef, isSyncing);
};


// 解决Tab按键冲突
const handleKeyDown = async (e: KeyboardEvent) => {
  // 传递依赖的响应式变量和DOM引用
  await keyboardHandler(e, editorRef, markdownContent);
};

// 工具类：显示自定义弹窗
const showCustomToast = (message: any, type = 'success') => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  // 3秒后自动关闭
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

// 工具类：插入内容到光标处
const addContentToEditor = (content: string) => {
  if (!editorRef.value) return;
  // 插入表格到编辑器（光标位置）
  const editor = editorRef.value;
  const startPos = editor.selectionStart;
  const endPos = editor.selectionEnd;

  markdownContent.value =
      markdownContent.value.substring(0, startPos) +
      content+
      markdownContent.value.substring(endPos);
}

// 监听代码块的高亮
watch(markdownContent, () => {
  nextTick(() => {
    // 只高亮预览区域内的代码块
    const previewContainer = document.querySelector('.preview-content');
    if (previewContainer) {
      previewContainer.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(<HTMLElement>block);
      });
    }
  });
});

onMounted(() => {
  hljs.highlightAll();
  // 监听点击事件关闭下拉菜单
  document.addEventListener('click', handleClickOutside);
});

// 记得在组件卸载时移除事件监听
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
@import '../styles/edit_area.css';
@import '../styles/preview_area.css';
@import '../styles/common.css';
@import '../styles/header.css';
@import '../styles/toast.css';
</style>