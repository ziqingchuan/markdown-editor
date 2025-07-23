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
          <div class="theme-toggle" @click="toggleDarkMode">
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
          <div class="upload-btn" @click="openImageDialog" title="上传图片" style="margin-left: auto">
            <img class="upload-icon" src="/upload-picture.svg" alt="上传图片">
          </div>
          <div class="upload-btn" @click="openFileDialog" title="解析文件">
            <img class="upload-icon" src="/upload-file.svg" alt="解析文件">
          </div>
        </div>

        <textarea
            v-model="markdownContent"
            class="editor-textarea"
            placeholder="在此输入内容..."></textarea>
      </div>

      <!-- 预览区域 -->
      <div class="preview-container">
        <div class="panel-header preview-header">
          <img class="panel-icon" src="/preview.svg" alt="预览">
          <span>预览区域</span>
        </div>
        <div class="preview-content" v-html="renderedMarkdown"></div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <p>使用 Vue3 构建的简易 Markdown 编辑器</p>
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
  <!-- 自定义弹窗 -->
  <div
      class="custom-toast"
      :class="{
        'toast-show': showToast,
        'toast-success': toastType === 'success',
        'toast-error': toastType === 'error'
      }"
  >
    <div class="toast-icon">
      <span v-if="toastType === 'success'">✓</span>
      <span v-if="toastType === 'error'">✕</span>
    </div>
    <div class="toast-message">{{ toastMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import hljs from 'highlight.js';
import 'highlight.js/styles/rainbow.css';
import { watch, nextTick } from 'vue';
import compressImage from "../utils/compressor.ts";
import {FileHandler} from "../utils/fileHandler.ts";

// 配置marked使用highlight.js高亮代码
marked.setOptions({
  // @ts-ignore
  highlight: function (code: any, language: any) {
    const validLanguage = hljs.getLanguage(language) ? language : 'javascript';
    return hljs.highlight(code, {language: validLanguage}).value;
  },
});
// 初始化Markdown内容
const markdownContent = ref(`# 欢迎来到素笔 Mark !

这是一个基于Vue3的简易Markdown编辑器，支持：

- 实时预览
- 明暗模式切换
- 下载为Markdown文件
- 下载为PDF文件
- 图片本地上传
- 文件内容识别
- 代码高亮

[欢迎来我的博客看看](https://try-catch.life/)

\`\`\`javascript
function greet() {
  console.log("Hello, World!");
}
\`\`\`
`);

// 渲染后的HTML
const renderedMarkdown = computed(() => {
  // @ts-ignore
  return DOMPurify.sanitize(marked.parse(markdownContent.value));
});

// 状态管理
const isDarkMode = ref(true); // 暗黑模式
const isLoading = ref(false);
const showDropdown = ref(false);
const showToast = ref(false);// 弹窗状态
const toastMessage = ref('');
const toastType = ref('success'); // success/error

// 显示自定义弹窗
const showCustomToast = (message: any, type = 'success') => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  // 3秒后自动关闭
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

// 打开图片选择
const openImageDialog = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = handleImageSelect;
  input.click();
};

// 打开文件选择
const openFileDialog = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.html,.md,.pdf,.txt,.doc,.docx';
  input.onchange = handleFileSelect;
  input.click();
};

// 处理图片选择
const handleImageSelect = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  try {
    // 显示加载状态
    isLoading.value = true;
    showCustomToast('正在压缩图片...', 'success');

    // 调用压缩函数
    const compressedFile = await compressImage(
        file,
        0.7,    // 初始质量
        1200,   // 最大宽度
        100,    // 最小压缩尺寸(KB)
        200     // 目标尺寸(KB)
    );

    // 读取压缩后的文件为DataURL
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const imageUrl = event.target?.result as string;
      // 插入Markdown内容
      const fileName = compressedFile.name.replace(/\.[^/.]+$/, '');
      const imageMarkdown = `![${fileName}](${imageUrl})`;
      markdownContent.value += `\n${imageMarkdown}`;
      showCustomToast(`图片压缩成功，大小: ${(compressedFile.size / 1024).toFixed(2)}KB`);
    };
    reader.readAsDataURL(compressedFile);

  } catch (error) {
    console.error('图片处理失败:', error);
    showCustomToast('图片压缩失败，请重试', 'error');
  } finally {
    // 关闭加载状态
    isLoading.value = false;
    // 清空input值，允许重复选择同一文件
    target.value = '';
  }
};

// 处理文件选择
const handleFileSelect = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  try {
    // 显示加载状态
    isLoading.value = true;
    const content = await FileHandler.handleFile(file);
    showCustomToast('文件内容解析完成！', 'success');
    markdownContent.value += content;

  } catch (error) {
    console.error('文件内容读取失败:', error);
    showCustomToast('文件内容读取失败，请重试', 'error');
  } finally {
    // 关闭加载状态
    isLoading.value = false;
    // 清空input值，允许重复选择同一文件
    target.value = '';
  }
};


// 点击空白处关闭下拉菜单
const handleClickOutside = (e: any) => {
  const dropdown = document.querySelector('.dropdown-menu');
  if (dropdown && !dropdown.contains(e.target)) {
    showDropdown.value = false;
  }
};

// 切换暗黑模式
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('darkMode', isDarkMode.value ? 'true' : 'false');
};

// 下载Markdown文件
const downloadMarkdown = () => {
  showDropdown.value = false;
  try {
    const blob = new Blob([markdownContent.value], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showCustomToast('Markdown文件下载成功'); // 替换alert
  } catch (error: any) {
    showCustomToast('下载失败：' + error.message, 'error'); // 替换alert
  }
};

// 下载PDF文件
const downloadPdf = () => {
  showDropdown.value = false;
  isLoading.value = true;

  const tempElement = document.createElement('div');
  tempElement.innerHTML = renderedMarkdown.value;
  tempElement.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightElement(<HTMLElement>block);
  });
  tempElement.classList.add('hljs', 'rainbow');
  tempElement.style.maxWidth = '800px';
  tempElement.style.margin = '0 auto';
  tempElement.style.padding = '40px';
  // tempElement.style.backgroundColor = isDarkMode.value ? '#1a1a1a' : '#ffffff'; // 调整pdf的背景色
  tempElement.style.backgroundColor = '#ffffff'
  // tempElement.style.color = isDarkMode.value ? '#e0e0e0' : '#333333'; // 调整pdf的字体色
  tempElement.style.color = '#333333'
  document.body.appendChild(tempElement);

  const opt = {
    margin: 10,
    filename: 'document.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().from(tempElement).set(opt).save()
      .then(() => showCustomToast('PDF文件下载成功')) // 替换alert
      .catch((error: any) => showCustomToast('PDF生成失败：' + error.message, 'error')) // 替换alert
      .finally(() => {
        document.body.removeChild(tempElement);
        isLoading.value = false;
      });
};

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
  // 加载保存的主题设置
  isDarkMode.value = localStorage.getItem('darkMode') === 'true';
  // 监听点击事件关闭下拉菜单
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>


/* 应用容器 */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s, color 0.3s;
  background-color: #f5f5f5;
  color: #333333;
  overflow-x: auto;
}

/* 暗黑模式 */
.app-dark {
  background-color: #1a1a1a;
  color: #e0e0e0;
}

/* 头部样式 */
.header {
  border-bottom: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s;
  background-color: #ffffff;
  width: 100%;
}

.app-dark .header {
  border-bottom-color: #444;
  background-color: #2d2d2d;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
  font-weight: bold;
}

.logo-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  padding: 5px;
  border-radius: 50%;
  background-color: #ffffff;
  font-weight: bold;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 主题切换按钮 */
.theme-toggle {
  position: relative;
  width: 50px;
  height: 26px;
  border-radius: 13px;
  background-color: #e0e0e0;
  cursor: pointer;
  transition: background-color 0.3s;
  overflow: hidden;
}

.app-dark .theme-toggle {
  background-color: #444;
}

.toggle-thumb {
  position: absolute;
  left: 3px;
  top: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.34);
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

.toggle-thumb-dark {
  transform: translateX(24px);
}

/* 模式切换按钮图标 */
.sun-icon, .moon-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: opacity 0.3s;
}

.sun-icon {
  left: 5px;
  color: rgba(238, 156, 35, 0.89);
}

.moon-icon {
  right: 5px;
  color: #e7d17f;
}

/* 图标显示控制 */
.theme-toggle .sun-icon {
  opacity: 1;
}

.theme-toggle .moon-icon {
  opacity: 0;
}

.app-dark .theme-toggle .sun-icon {
  opacity: 0;
}

.app-dark .theme-toggle .moon-icon {
  opacity: 1;
}

/* 下载按钮样式 */
.download-btn-group {
  display: flex;
  align-items: center;
  position: relative;
}

.primary-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: #679ef8;
  color: white;
  border: none;
  border-radius: 8px 0 0 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
  height: 32px;
}

.primary-btn:hover {
  background-color: #2855b3;
}

.dropdown-btn {
  width: 32px;
  height: 32px;
  background-color: #4e8aee;
  color: white;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.dropdown-btn:hover {
  background-color: #2855b3;
}

.dropdown-menu {
  position: relative;
}

.dropdown-options {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  width: 150px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  overflow: hidden;
  transform-origin: top right;
  transform: scale(0.95);
  opacity: 0;
  pointer-events: none;
  transition: transform 0.2s, opacity 0.2s;
  z-index: 10;
}

.app-dark .dropdown-options {
  background-color: #2d2d2d;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.dropdown-show .dropdown-options {
  transform: scale(1);
  opacity: 1;
  pointer-events: auto;
}
/* 下拉菜单选项 */
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 3px 7px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.app-dark .dropdown-item:hover {
  background-color: #3a3a3a;
}
/* 导出文件类型图标 */
.file-icon {
  width: 20px;
}

/* 主内容区 */
.main-content {
  flex: 1;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding-top: 20px;
  padding-bottom: 20px;
  display: flex;
  gap: 20px;
  height: calc(100vh - 300px);
}

/* 编辑器和预览容器 */
.editor-container, .preview-container {
  width: 50%;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: background-color 0.3s;
  overflow: hidden;
}

.app-dark .editor-container,
.app-dark .preview-container {
  background-color: #2d2d2d;
}

/* 面板头部 */
.panel-header {
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  font-weight: 500;
  font-size: 20px;
  display: flex;
  height: 50px;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}
/* 面板头部图标 */
.panel-icon {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
/* 上传按钮 */
.upload-btn {
  border-radius: 8px;
  border: 2px solid #aaaaaa;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 上传按钮图标 */
.upload-icon {
  width: 16px;
  height: 16px;
  padding: 0;
  margin: 5px;
}

.upload-btn:hover {
  background-color: #d9d9d9;
}
/* 编辑器文本区域 */
.editor-textarea {
  flex: 1;
  width: 100%;
  padding: 15px;
  border: none;
  resize: none;
  outline: none;
  font-family: 'Consolas', 'Monaco', monospace;
  line-height: 1.6;
  font-size: 14px;
  background-color: transparent;
  color: inherit;
}

/* 预览区域 */
.preview-content {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome/Safari/Opera */
  }
  background-color: #fafafa;
  transition: background-color 0.3s;
}

.app-dark .preview-content {
  background-color: #2c2c2c;
}

/* 预览区域Markdown样式 */
:deep(h1), :deep(h2), :deep(h3) {
  margin: 1.5rem 0 1rem;
  font-weight: 600;
}

:deep(h1) {
  font-size: 1.8rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.3rem;
}

:deep(h2) {
  font-size: 1.5rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.3rem;
}

.app-dark :deep(h1),
.app-dark :deep(h2) {
  border-color: #444;
}

:deep(h3) {
  font-size: 1.25rem;
}

:deep(p) {
  margin-bottom: 1rem;
  line-height: 1.7;
}

:deep(ul), :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 2rem;
}

:deep(ul) {
  list-style-type: disc;
}

:deep(ol) {
  list-style-type: decimal;
}

:deep(li) {
  margin-bottom: 0.5rem;
}

:deep(blockquote) {
  border-left: 4px solid #ddd;
  padding-left: 1rem;
  margin: 0 0 1rem 0;
  color: #666;
}

.app-dark :deep(blockquote) {
  border-color: #555;
  color: #aaa;
}

:deep(pre) {
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome/Safari/Opera */
  }
  margin-bottom: 1rem;
}

.app-dark :deep(pre) {
  background-color: #333;
}

:deep(code) {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.9rem;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
}

.app-dark :deep(code) {
  background-color: #333;
}

:deep(pre code) {
  padding: 0;
  background-color: transparent;
}

:deep(a) {
  color: #1a73e8;
  text-decoration: none;
}

.app-dark :deep(a) {
  color: #8ab4f8;
}

:deep(a:hover) {
  text-decoration: underline;
}

:deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 1rem 0;
}

/* 页脚样式 */
.footer {
  text-align: center;
  font-size: 14px;
  border-top: 1px solid #eee;
  background-color: white;
  transition: all 0.3s;
}

.app-dark .footer {
  border-top-color: #444;
  background-color: #2d2d2d;
  color: #aaa;
}

/* 加载提示样式 */
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}

.loading-mask:not([v-if="false"]) {
  opacity: 1;
  pointer-events: auto;
}

.loading-content {
  text-align: center;
  color: white;
}
/* 加载动画 */
.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 12px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

.loading-text {
  font-size: 14px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
    height: auto;
  }

  .editor-container, .preview-container {
    width: 100%;
    height: 50vh;
  }
}
/* 弹窗样式 */
.custom-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(-100px);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  border-radius: 8px;
  background-color: #f0f0f0;
  color: #333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 14px;
  z-index: 1000;
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* 弹窗显示状态 */
.toast-show {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

/* 成功状态 */
.toast-success {
  background-color: #e6f4ea;
  border-left: 4px solid #36d399;
}

.toast-success .toast-icon {
  color: #36d399;
}

/* 错误状态 */
.toast-error {
  background-color: #fee2e2;
  border-left: 4px solid #f87272;
}

.toast-error .toast-icon {
  color: #f87272;
}

/* 弹窗图标 */
.toast-icon {
  font-size: 18px;
  font-weight: bold;
}

/* 暗黑模式适配 */
.app-dark .custom-toast {
  background-color: #333;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.app-dark .toast-success {
  background-color: #1e3a3a;
  border-left-color: #36d399;
}

.app-dark .toast-error {
  background-color: #3a1e1e;
  border-left-color: #f87272;
}
</style>