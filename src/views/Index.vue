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
    <!-- 富文本操作工具栏 -->
    <div
        class="text-toolbar"
        ref="toolbarRef"
        :style="{ left: toolbarLeft + 'px', top: toolbarTop + 'px' }"
        @mousedown="startDrag"
    >
      <button class="toolbar-btn" @click="formatText('bold')" title="加粗">
        <img src="../assets/bold.svg" alt="加粗">
      </button>
      <button class="toolbar-btn" @click="formatText('italic')" title="斜体">
        <img src="../assets/italic.svg" alt="斜体">
      </button>
      <button class="toolbar-btn" @click="formatText('underline')" title="下划线">
        <img src="../assets/underline.svg" alt="下划线">
      </button>
      <button class="toolbar-btn" @click="formatText('link')" title="链接">
        <img src="../assets/link.svg" alt="链接">
      </button>
      <button class="toolbar-btn" @click="formatText('code')" title="代码">
        <img src="../assets/code.svg" alt="代码">
      </button>
      <button class="toolbar-btn" @click="formatText('quote')" title="引用">
        <img src="../assets/quote.svg" alt="引用">
      </button>
      <button class="toolbar-btn" @click="formatText('list')" title="列表">
        <img src="../assets/list.svg" alt="列表">
      </button>
    </div>
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
          <div class="upload-btn" @click="addCodeBlock" title="代码块">
            <img class="upload-icon" src="/code-block.svg" alt="代码块">
          </div>
          <div class="upload-btn" @click="addTable" title="表格">
            <img class="upload-icon" src="/table.svg" alt="表格">
          </div>
        </div>

        <textarea
            v-model="markdownContent"
            class="editor-textarea"
            placeholder="在此输入内容..."
            ref="editorRef"
            @scroll="handleEditorScroll"
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

  <!-- 表格配置弹窗 -->
  <div class="table-modal-mask" v-if="showTableModal">
    <div class="table-modal" :class="{ 'app-dark': isDarkMode }">
      <div class="modal-header">
        <h3>插入表格</h3>
        <button class="modal-close" @click="showTableModal = false">×</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>行数：</label>
          <input
              type="number"
              v-model.number="tableRows"
              min="1"
              max="20"
              class="number-input"
          >
        </div>
        <div class="form-group">
          <label>列数：</label>
          <input
              type="number"
              v-model.number="tableCols"
              min="1"
              max="10"
              class="number-input"
          >
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-btn" @click="showTableModal = false">取消</button>
        <button class="confirm-btn" @click="confirmTable">确认插入</button>
      </div>
    </div>
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
import {syncScroll} from "../utils/handleScroll.ts";
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

> 这是一个基于Vue3的简易Markdown编辑器，提供如下功能：

- 实时预览
- 明暗模式切换
- 同步跟随滚动
- 导出md/pdf文件
- 图片本地上传
- 文件内容解析读取
- 代码高亮
- 快捷工具栏
- 后续持续更新...

[欢迎来我的博客看看：try-catch.life](https://try-catch.life/)

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
// 获取DOM引用
const editorRef = ref<HTMLTextAreaElement>();
const previewRef = ref<HTMLDivElement>();
// 用于防止滚动事件循环触发的标志
const isSyncing = ref(false);
// 工具栏相关状态
const toolbarRef = ref<HTMLDivElement>();
const isToolbarVisible = ref(false); // 工具栏是否显示
const toolbarLeft = ref(0); // 工具栏左侧定位
const toolbarTop = ref(0); // 工具栏顶部定位
const isDragging = ref(false); // 是否正在拖拽
const startX = ref(0); // 拖拽起始X坐标
const startY = ref(0); // 拖拽起始Y坐标
// 表格弹窗相关状态
const showTableModal = ref(false); // 控制弹窗显示
const tableRows = ref(3); // 默认3行
const tableCols = ref(3); // 默认3列

// 格式化选中文本（根据按钮类型添加对应的Markdown格式）
const formatText = (type: 'bold' | 'italic' | 'underline' | 'link' | 'code' | 'quote' | 'list') => {
  if (!editorRef.value) return;

  const editor = editorRef.value;
  const selection = window.getSelection();
  if (!selection) {
    isToolbarVisible.value = false;
    return;
  }

  // 获取选中的文本和位置
  const selectedText = selection.toString();
  const startPos = editor.selectionStart;
  const endPos = editor.selectionEnd;

  // 根据类型添加对应的Markdown格式
  let formattedText = '';
  switch (type) {
    case 'bold':
      formattedText = `**${selectedText}**`;
      break;
    case 'italic':
      formattedText = `*${selectedText}*`;
      break;
    case 'underline':
      formattedText = `<u>${selectedText}</u>`; // Markdown原生不支持下划线，用HTML标签
      break;
    case 'link':
      const linkText = selectedText || '链接文本';
      formattedText = `[${linkText}](https://example.com)`; // 默认链接地址，可改为prompt输入
      break;
    case 'code':
      formattedText = `\`${selectedText}\``; // 行内代码
      break;
    case 'quote':
      formattedText = `> ${selectedText}`;
      break;
    case 'list':
      formattedText = `- ${selectedText}`
      break;
  }

  // 更新编辑器内容
  markdownContent.value =
      markdownContent.value.substring(0, startPos) +
      formattedText +
      markdownContent.value.substring(endPos);
};

const addCodeBlock = () => {
  if (!editorRef.value) return;
  // 插入代码块到编辑器（光标位置）
  const editor = editorRef.value;
  const startPos = editor.selectionStart;
  const endPos = editor.selectionEnd;
  // 保留光标前后内容，插入表格
  markdownContent.value =
      markdownContent.value.substring(0, startPos) +
      `\n\`\`\`javascript\n\n\`\`\`` +
      markdownContent.value.substring(endPos);
}

// 打开表格弹窗
const addTable = () => {
  showTableModal.value = true;
  // 重置默认值（可选）
  tableRows.value = 3;
  tableCols.value = 3;
};

// 确认生成表格
const confirmTable = () => {
  if (!editorRef.value) return;

  // 校验输入（至少1行1列）
  if (tableRows.value < 1 || tableCols.value < 1) {
    showCustomToast('行数和列数必须大于0', 'error');
    return;
  }

  // 生成Markdown表格
  const tableContent = generateMarkdownTable(
      tableRows.value,
      tableCols.value
  );

  // 插入表格到编辑器（光标位置）
  const editor = editorRef.value;
  const startPos = editor.selectionStart;
  const endPos = editor.selectionEnd;
  // 保留光标前后内容，插入表格
  markdownContent.value =
      markdownContent.value.substring(0, startPos) +
      tableContent +
      markdownContent.value.substring(endPos);

  // 关闭弹窗并提示
  showTableModal.value = false;
  showCustomToast(`已插入 ${tableRows.value}行×${tableCols.value}列 表格`);
};

// 生成Markdown表格内容
const generateMarkdownTable = (rows: number, cols: number) => {
  // 表头行（如：| 列1 | 列2 | 列3 |）
  const header = `| ${Array(cols).fill('列').map((_, i) => `列${i+1}`).join(' | ')} |`;
  // 分隔行（如：| --- | --- | --- |）
  const separator = `| ${Array(cols).fill('---').join(' | ')} |`;
  // 内容行（如：| 内容 | 内容 | 内容 |）
  const contentRows = Array(rows - 1) // 减去表头行
      .fill('')
      .map(() => `| ${Array(cols).fill('内容').join(' | ')} |`);

  // 组合成完整表格（表头+分隔+内容行，每行换行）
  return `\n${header}\n${separator}\n${contentRows.join('\n')}\n`;
};

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
    a.download = '素笔Mark导出文档.md';
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
  // 1. 复制预览区内容
  tempElement.innerHTML = renderedMarkdown.value;

  // 2. 手动注入所需样式（关键步骤）
  const style = document.createElement('style');
  style.textContent = `
    /* 表格样式 */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
      border-radius: 6px;
      overflow: hidden;
    }
    th {
      background-color: #f8f9fa;
      color: #333;
      font-weight: 600;
      padding: 0.75rem 1rem;
      text-align: left;
      border: 1px solid #e9ecef;
    }
    td {
      padding: 0.75rem 1rem;
      border: 1px solid #e9ecef;
      line-height: 1.5;
    }
    tr:nth-child(even) {
      background-color: #f8f9fa;
    }

    /* 行内代码样式 */
    code {
      background-color: #f1f3f5;
      color: #3a7bde;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 0.8rem;
      padding: 0.2rem 0.4rem;
      border-radius: 5px;
    }

    /* 代码块样式 */
    pre {
      background-color: #transparent;
      padding: 1rem;
      border-radius: 6px;
      overflow-x: auto;
      margin: 1rem 0;
    }
    pre code {
      background-color: transparent;
      color: #333;
      padding: 0;
      font-size: 0.9em;
      line-height: 1.5;
    }

    blockquote {
      border-left: 4px solid #0d6ae3;
      border-top: 1px solid #ddd;
      border-right: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      background-color: #f5f5f5;
      padding: 1rem;
      margin: 0 0 1rem 0;
      color: #666;
      border-radius: 0 6px 6px 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    a {
      color: #1a73e8;
      text-decoration: none;
    }
    /* 基础样式 */
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
    }
  `;
  tempElement.appendChild(style);

  // 3. 代码高亮（保持现有逻辑）
  tempElement.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightElement(<HTMLElement>block);
  });

  // 4. 设置临时元素基础样式（移除强制白色背景的冲突代码）
  tempElement.style.maxWidth = '800px';
  tempElement.style.margin = '0 auto';
  tempElement.style.padding = '40px';
  tempElement.style.backgroundColor = '#ffffff'; // 保持白色背景便于打印
  tempElement.style.color = '#333333';

  document.body.appendChild(tempElement);

  // 5. PDF配置（保持现有逻辑）
  const opt = {
    margin: 10,
    filename: '素笔Mark导出文档.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // 6. 生成并下载PDF
  html2pdf().from(tempElement).set(opt).save()
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

// 开始拖拽（鼠标按下时）
const startDrag = (e: MouseEvent) => {
  // 为 event.target 指定类型为 HTMLElement
  const target = e.target as HTMLElement;

  // 只有点击工具栏或拖拽手柄时才触发拖拽
  if (e.target === toolbarRef.value || (target && target.classList.contains('drag-handle'))) {
    isDragging.value = true;
    startX.value = e.clientX - toolbarLeft.value;
    startY.value = e.clientY - toolbarTop.value;

    // 添加鼠标移动和释放事件监听
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
  }
};
// 拖拽中（鼠标移动时）
const handleDrag = (e: MouseEvent) => {
  if (!isDragging.value || !editorRef.value) return;

  // 计算新位置（相对于编辑器容器）
  let newLeft = e.clientX - startX.value;
  let newTop = e.clientY - startY.value;
  // 更新工具栏位置
  toolbarLeft.value = newLeft;
  toolbarTop.value = newTop;
};

// 结束拖拽（鼠标释放时）
const stopDrag = () => {
  if (isDragging.value) {
    isDragging.value = false;
    // 移除事件监听
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
  }
};

// 计算工具栏初始位置（屏幕右下角）
const initToolbarPosition = () => {

  // 否则计算屏幕右下角位置
  const toolbarWidth = 310;
  const toolbarHeight = 140;
  const margin = 0; // 距离屏幕边缘的间距

  // 屏幕可用宽度和高度（减去滚动条和边缘间距）
  const screenWidth = window.innerWidth - margin - toolbarWidth;
  const screenHeight = window.innerHeight - margin - toolbarHeight;

  // 设置初始位置为右下角
  toolbarLeft.value = screenWidth;
  toolbarTop.value = screenHeight;
};

onMounted(() => {
  hljs.highlightAll();
  // 加载保存的主题设置
  isDarkMode.value = localStorage.getItem('darkMode') === 'true';
  // 监听点击事件关闭下拉菜单
  document.addEventListener('click', handleClickOutside);

  // 初始化位置
  initToolbarPosition();

  // 监听窗口大小变化，重新调整位置（可选）
  window.addEventListener('resize', initToolbarPosition);
});

// 记得在组件卸载时移除事件监听
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', initToolbarPosition); // 新增
});
</script>

<style scoped>
@import '../styles/editor.css';
@import '../styles/preview_global.css';
@import '../styles/common.css';
@import '../styles/header.css';
@import '../styles/toast.css';
</style>