<template>
  <div class="ai-dialog-overlay" v-if="visible" @click.self="closeDialog">
    <div class="ai-dialog-container" :class="{ 'dark-mode': isDarkMode }">
      <div class="ai-dialog-header">
        <span>素笔AI</span>
        <button class="close-btn" @click="closeDialog">×</button>
      </div>
      <div class="ai-dialog-content">
        <div class="messages-container">
          <div
              v-for="(message, index) in messages.filter(message => message.content.trim()!== '')"
              :key="index"
              :class="['message', message.role]"
          >
            <!-- 使用 v-html 渲染 Markdown -->
            <div v-if="message.role === 'ai'" class="ai-message">
              <div v-html="marked.parse(message.content)"></div>
              <div class="message-btn">
                <button
                    class="copy-btn"
                    @click="handleCopy(message.content, index)"
                    :disabled="copyStatus[index] === 'copying'"
                >
                  <svg v-if="!copyStatus[index]" class="msg-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="14" height="14">
                    <path d="M703.351467 895.249067a63.8976 63.8976 0 0 1-63.965867 63.829333H127.931733a63.8976 63.8976 0 0 1-63.965866-63.829333V384.273067c0-35.293867 28.672-63.829333 63.965866-63.829334h63.8976v-63.8976h-63.8976A127.7952 127.7952 0 0 0 0 384.341333v510.976a127.658667 127.658667 0 0 0 127.863467 127.726934h511.3856a127.658667 127.658667 0 0 0 127.863466-127.658667v-63.8976h-63.8976v63.829333z m191.761066-894.293334H383.658667a127.7952 127.7952 0 0 0-127.863467 127.7952V639.658667c0 70.519467 57.207467 127.658667 127.863467 127.658666h511.522133c70.656 0 127.7952-57.207467 127.7952-127.658666V128.750933A127.7952 127.7952 0 0 0 895.112533 1.024z m63.965867 638.7712a63.829333 63.829333 0 0 1-63.8976 63.829334H383.658667a63.8976 63.8976 0 0 1-63.8976-63.829334V128.750933c0-35.2256 28.672-63.829333 63.8976-63.829333h511.522133c35.293867 0 63.8976 28.603733 63.8976 63.829333v510.976z" fill="#ffffff"></path>
                  </svg>
                  <span v-else-if="copyStatus[index] === 'copied'">
                    <svg class="msg-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="M681.856 366.165333a25.6 25.6 0 1 1 36.778667 35.669334l-252.672 260.437333a42.837333 42.837333 0 0 1-60.501334-2.773333l-104.362666-114.474667a25.6 25.6 0 0 1 37.802666-34.474667l98.346667 107.818667 244.608-252.16z" fill="#ffffff"></path></svg>
                  </span>
                </button>
                <button class="insert-btn" @click="handleInsert(message.content)">
                  <svg class="msg-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                    <path d="M255.89 128.17m36 0l632 0q36 0 36 36l0 0q0 36-36 36l-632 0q-36 0-36-36l0 0q0-36 36-36Z" fill="#ffffff"></path>
                    <path d="M108.25 468h573.93l-60.48-60.46a44 44 0 0 1 62.23-62.22l135.76 135.76a44 44 0 0 1 0 62.23L683.93 679.07a44 44 0 0 1-62.23-62.23L682.53 556H108.25a44 44 0 0 1-44-44 44 44 0 0 1 44-44zM923.89 823.83h-632a36 36 0 0 0-36 36 36 36 0 0 0 36 36h632a36 36 0 0 0 36-36 36 36 0 0 0-36-36z" fill="#ffffff"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div v-if="message.role === 'user'">{{ message.content }}</div>
          </div>

          <div v-if="isLoading">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <div class="input-container">
               <textarea
                   v-model="userInput"
                   placeholder="输入您的问题..."
                   @keydown="handleKeydown"
                   ref="textareaRef"
                   rows="1"
               ></textarea>
          <button
              @click="sendMessage"
              :disabled="isLoading || !userInput.trim()"
          >
            <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
              <path d="M346.88 582.4l-85.888 236.16 549.12-274.56-549.12-274.56L346.88 505.6H576q3.84 0 7.488 0.768 3.712 0.704 7.232 2.176 3.456 1.408 6.592 3.52 3.2 2.112 5.824 4.8 2.688 2.688 4.8 5.76 2.112 3.2 3.52 6.656 1.472 3.52 2.176 7.232 0.768 3.712 0.768 7.488 0 3.84-0.768 7.488-0.704 3.712-2.176 7.232-1.408 3.456-3.52 6.592-2.112 3.2-4.8 5.824-2.688 2.688-5.76 4.8-3.2 2.112-6.656 3.52-3.52 1.472-7.232 2.176Q579.776 582.4 576 582.4H346.88z m-67.712-38.4L155.904 205.12q-1.28-3.52-1.856-7.296-0.576-3.712-0.384-7.488 0.128-3.84 1.024-7.488 0.896-3.648 2.56-7.04 1.536-3.456 3.84-6.528 2.176-3.072 4.992-5.568 2.752-2.56 6.016-4.544 3.2-1.92 6.784-3.2 7.424-2.752 15.36-2.304 7.872 0.448 14.912 3.968l704 352q3.392 1.728 6.4 4.032 3.008 2.304 5.44 5.12 2.496 2.944 4.352 6.208 1.92 3.264 3.072 6.848 1.216 3.584 1.664 7.36 0.512 3.776 0.192 7.552-0.256 3.712-1.28 7.36-0.96 3.648-2.624 7.04-5.76 11.52-17.216 17.216l-704 352q-3.392 1.664-7.04 2.688-3.648 0.96-7.36 1.28-3.84 0.256-7.552-0.256-3.776-0.448-7.36-1.664-3.584-1.216-6.848-3.072t-6.144-4.352q-2.88-2.432-5.184-5.44-2.304-3.008-4.032-6.4-3.52-7.04-3.968-14.976-0.448-7.872 2.24-15.296L279.168 544z" fill="#ffffff"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, defineProps, nextTick, ref, watch} from 'vue';
import {marked} from 'marked';
import markedKatex from 'marked-katex-extension';
// @ts-ignore
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css'; // 选择一个喜欢的主题


interface Message {
  role: 'ai' | 'user';
  content: string;
}
// 配置 marked 以支持数学公式
marked.use(markedKatex({
  // @ts-ignore
  katexOptions: {
    throwOnError: false,
    displayMode: false,
    strict: 'ignore',
    trust: true
  }
}));
// 配置marked高亮代码
marked.setOptions({
  // @ts-ignore
  highlight: function(code, lang) {
    // 如果指定了语言且该语言被支持，则使用指定语言高亮
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    // 否则使用自动检测
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true
});

const props = defineProps<{
  visible: boolean;       // 控制弹窗显示/隐藏
  isDarkMode: boolean;    // 暗黑模式状态
}>();

const emit = defineEmits<{
  (e: 'close'): void; // 关闭弹窗
  (e: 'insert-msg', message: string): void; // ai回复
  (e: 'error', error: string): void; // 错误信息
}>();

const messages = ref<Message[]>([
  { role: 'ai', content: '你好！我是素笔 Mark的AI助手，有什么可以帮您的吗？' }
]);
const userInput = ref('');
const isLoading = ref(false);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
// 复制状态管理：记录每个消息的复制状态
const copyStatus = ref<Record<number, '' | 'copying' | 'copied'>>({});

const closeDialog = () => {
  emit('close');
};

// 重置复制状态
const resetCopyStatus = (index: number) => {
  setTimeout(() => {
    copyStatus.value[index] = '';
  }, 2000);
};

// 处理复制到剪贴板功能
const handleCopy = async (content: string, index: number) => {
  try {
    // 设置复制中状态
    copyStatus.value[index] = 'copying';

    // 使用Clipboard API复制文本
    await navigator.clipboard.writeText(content);

    // 复制成功
    copyStatus.value[index] = 'copied';
    resetCopyStatus(index);
  } catch (error) {
    console.error('复制失败:', error);
    copyStatus.value[index] = '';
    emit('error', '复制失败，请手动复制');

    // 降级方案：使用input元素复制
    const tempInput = document.createElement('input');
    tempInput.value = content;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  }
};

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return;

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: userInput.value
  });

  const question = userInput.value;
  userInput.value = '';
  isLoading.value = true;

  // 添加一个空的 AI 消息占位
  const aiMessageIndex = messages.value.push({
    role: 'ai',
    content: ''
  }) - 1;

  try {
    const response = await fetch('/chat/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_CHAT_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'lite',
        messages: [{
          role: 'user',
          content: question
        }],
        stream: true
      })
    });

    if (!response.ok) alert(`HTTP error! status: ${response.status}`);
    if (!response.body) return '';

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        if (line.startsWith('data:')) {
          const jsonStr = line.substring(5).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const data = JSON.parse(jsonStr);
            if (data.choices && data.choices[0].delta.content) {
              fullResponse += data.choices[0].delta.content;
              // 实时更新内容
              messages.value[aiMessageIndex].content = fullResponse;
              messages.value = [...messages.value];

              // 滚动到底部
              setTimeout(() => {
                const container = document.querySelector('.messages-container');
                if (container) container.scrollTop = container.scrollHeight;
              }, 50);
            }
          } catch (e) {
            console.error('解析 JSON 失败:', e);
          }
        }
      }
    }

    // 完整响应后，处理公式
    const handleInlineFormula = (content: string) => {
      const inlineFormulaReg = /(?<!\$)\$((?:[^$\n]|\$[^$\n])+?)\$(?!\$)/g;
      return content.replace(inlineFormulaReg, (match, p1) => {
        const hasLeadingSpace = match.startsWith(' $');
        const hasTrailingSpace = match.endsWith('$ ');
        return `${hasLeadingSpace ? '' : ' '}$${p1}$${hasTrailingSpace ? '' : ' '}`;
      });
    };
    messages.value[aiMessageIndex].content = handleInlineFormula(fullResponse);
    messages.value = [...messages.value];

  }

  catch (error) {
    console.error('API 调用失败:', error);
    messages.value[aiMessageIndex].content = `抱歉，处理您的请求时出错: ${error}`;
  } finally {
    isLoading.value = false;
  }
};

const handleInsert = (message: string) => {
  if (!message) {
    emit('error', '插入内容失败');
    return;
  }
  emit('insert-msg', message);
};

// 处理键盘事件
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.shiftKey)) {
    e.preventDefault();
    sendMessage();
  }
  // Shift+Enter 会自然换行
};

watch([messages, () => props.visible], () => {
  nextTick(() => {
    // 高亮预览区域内的代码块
    const previewContainer = document.querySelector('.messages-container');
    if (previewContainer) {
      previewContainer.querySelectorAll('pre code').forEach((block) => {
        const langClass = Array.from(block.classList).find(c => c.startsWith('language-'));
        const lang = langClass ? langClass.split('-')[1] : null;

        if (lang && hljs.getLanguage(lang)) {
          hljs.highlightElement(block as HTMLElement);
        } else {
          // @ts-ignore
          hljs.highlightAuto(block as HTMLElement);
        }
      });
    }
  });
}, { immediate: true });

</script>

<style scoped>
@import "../../styles/ChatModal.css";
</style>
