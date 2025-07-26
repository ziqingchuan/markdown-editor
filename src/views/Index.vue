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
import {computed, nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue';
import {marked} from 'marked';
import DOMPurify from 'dompurify';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import hljs from 'highlight.js';
import 'highlight.js/styles/rainbow.css';
import compressImage from "../utils/imageCompressor.ts";
import {FileUploadHandler} from "../utils/fileUploadHandler.ts";
import {syncScroll} from "../utils/scrollHandler.ts";
import {initialMarkdownContent} from "../consts/markdownContent.ts";
import {pdfConfig, pdfOptions} from "../consts/pdfConfig.ts";
import {generateMarkdownTable} from "../utils/tableGenerator.ts";
import type {ContentType} from "../types/contentType.ts";
import {textHandler} from "../utils/textHandler.ts";

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
const formatText = (type: ContentType) => {
  if (!editorRef.value) return;
  // 获取选中的文本和位置
  const selectedText = window.getSelection()?.toString() || '';

  // 根据类型添加对应的Markdown格式
  let formattedText = textHandler(type, selectedText);

  addContentToEditor(formattedText);
};


// 添加代码块
const addCodeBlock = () => {
  addContentToEditor(`\n\`\`\`javascript\n\n\`\`\``);
};

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
    showCustomToast('行数和列数不能小于1哦', 'error');
    return;
  }
  if (tableRows.value > 14 || tableCols.value > 14) {
    showCustomToast('行数(列数)太多啦，请控制在14以内', 'error');
    return;
  }


  // 生成Markdown表格
  const tableContent = generateMarkdownTable(
      tableRows.value,
      tableCols.value
  );

  addContentToEditor(tableContent);

  // 关闭弹窗并提示
  showTableModal.value = false;
  showCustomToast(`已插入 ${tableRows.value}行×${tableCols.value}列 表格`);
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
    const content = await FileUploadHandler.handleFile(file);
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
  style.textContent = pdfConfig;
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

  // 5. 生成并下载PDF
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
  if (!isDragging.value || !toolbarRef.value) return;

  // 获取工具栏自身尺寸
  const toolbarWidth = toolbarRef.value.offsetWidth;
  const toolbarHeight = toolbarRef.value.offsetHeight;

  // 获取屏幕可视区域尺寸（减去滚动条宽度，避免超出）
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // 计算新位置（基于鼠标移动）
  let newLeft = e.clientX - startX.value;
  let newTop = e.clientY - startY.value;

  // 边界限制：左侧不小于0，右侧不超过屏幕宽度 - 工具栏宽度
  newLeft = Math.max(0, Math.min(newLeft, screenWidth - toolbarWidth));

  // 边界限制：顶部不小于0，底部不超过屏幕高度 - 工具栏高度
  newTop = Math.max(0, Math.min(newTop, screenHeight - toolbarHeight - 10));

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

// 解决Tab按键冲突
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const editor = editorRef.value;
    if (!editor) return;

    // 保存当前滚动位置
    const scrollTop = editor.scrollTop;

    // 获取光标位置
    const startPos = editor.selectionStart;
    const endPos = editor.selectionEnd;

    // 保存原始内容引用
    const originalContent = markdownContent.value;

    // 计算新内容
    markdownContent.value = originalContent.substring(0, startPos) +
        '    ' +  // 插入4个空格
        originalContent.substring(endPos);

    // 使用$nextTick确保DOM更新后再设置光标
    nextTick(() => {
      if (editor) {
        // 设置新光标位置（原位置 + 4个空格）
        const newCursorPos = startPos + 4;
        editor.selectionStart = newCursorPos;
        editor.selectionEnd = newCursorPos;

        // 恢复滚动位置
        editor.scrollTop = scrollTop;
      }
    });
  }
};

//  初始化工具栏位置
const initToolbarPosition = () => {
  if (!toolbarRef.value) return;

  const toolbarWidth = toolbarRef.value.offsetWidth;
  const toolbarHeight = toolbarRef.value.offsetHeight;
  const marginLeft = 10; // 距离屏幕边缘的间距（可选，增加留白）
  const marginTop = 60;

  // 屏幕可用宽度和高度（减去工具栏尺寸和边缘间距）
  const maxLeft = window.innerWidth - marginLeft - toolbarWidth;
  const maxTop = window.innerHeight - marginTop - toolbarHeight;

  // 确保初始位置在屏幕内（取计算值和0的最大值，避免负数）
  toolbarLeft.value = Math.max(marginLeft, maxLeft);
  toolbarTop.value = Math.max(marginTop, maxTop);
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

  // 初始化位置
  initToolbarPosition();

  // 监听窗口大小变化，重新调整位置
  window.addEventListener('resize', initToolbarPosition);
});

// 记得在组件卸载时移除事件监听
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', initToolbarPosition);
});
</script>

<style scoped>
@import '../styles/edit_area.css';
@import '../styles/preview_area.css';
@import '../styles/common.css';
@import '../styles/header.css';
@import '../styles/toast.css';
</style>