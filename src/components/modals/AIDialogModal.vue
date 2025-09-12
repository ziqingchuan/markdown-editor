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
            <!-- 直接渲染提前处理好的 HTML，不再临时 parse -->
            <div v-if="message.role === 'ai'" v-html="message.content"></div>
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
            <svg t="1755070731790" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10095" width="20" height="20"><path d="M346.88 582.4l-85.888 236.16 549.12-274.56-549.12-274.56L346.88 505.6H576q3.84 0 7.488 0.768 3.712 0.704 7.232 2.176 3.456 1.408 6.592 3.52 3.2 2.112 5.824 4.8 2.688 2.688 4.8 5.76 2.112 3.2 3.52 6.656 1.472 3.52 2.176 7.232 0.768 3.712 0.768 7.488 0 3.84-0.768 7.488-0.704 3.712-2.176 7.232-1.408 3.456-3.52 6.592-2.112 3.2-4.8 5.824-2.688 2.688-5.76 4.8-3.2 2.112-6.656 3.52-3.52 1.472-7.232 2.176Q579.776 582.4 576 582.4H346.88z m-67.712-38.4L155.904 205.12q-1.28-3.52-1.856-7.296-0.576-3.712-0.384-7.488 0.128-3.84 1.024-7.488 0.896-3.648 2.56-7.04 1.536-3.456 3.84-6.528 2.176-3.072 4.992-5.568 2.752-2.56 6.016-4.544 3.2-1.92 6.784-3.2 7.424-2.752 15.36-2.304 7.872 0.448 14.912 3.968l704 352q3.392 1.728 6.4 4.032 3.008 2.304 5.44 5.12 2.496 2.944 4.352 6.208 1.92 3.264 3.072 6.848 1.216 3.584 1.664 7.36 0.512 3.776 0.192 7.552-0.256 3.712-1.28 7.36-0.96 3.648-2.624 7.04-5.76 11.52-17.216 17.216l-704 352q-3.392 1.664-7.04 2.688-3.648 0.96-7.36 1.28-3.84 0.256-7.552-0.256-3.776-0.448-7.36-1.664-3.584-1.216-6.848-3.072t-6.144-4.352q-2.88-2.432-5.184-5.44-2.304-3.008-4.032-6.4-3.52-7.04-3.968-14.976-0.448-7.872 2.24-15.296L279.168 544z" fill="#ffffff" p-id="10096"></path></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, nextTick, ref } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import markedKatex from 'marked-katex-extension';
import Prism from 'prismjs';
// 1. 补全 Prism 依赖：导入核心样式 + 常用语言定义
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript'; // JS
import 'prismjs/components/prism-typescript'; // TS
import 'prismjs/components/prism-css'; // CSS
import 'prismjs/components/prism-python'; // Python
import 'prismjs/components/prism-json'; // JSON

interface Message {
  role: 'ai' | 'user';
  content: string; // 存储「渲染后的 HTML」，不再是原始文本
}

// 2. 配置 marked：整合 Katex + Prism 高亮，逻辑和第一个写法对齐
marked.use(markedKatex({
  // @ts-ignore
  katexOptions: {
    throwOnError: false,
    displayMode: false,
    strict: 'ignore',
    trust: true
  }
}));

marked.setOptions({
  // @ts-ignore
  highlight: function (code: string, lang: string | undefined) {
    // 处理 lang 为 undefined 的情况（无指定语言）
    if (!lang) lang = 'plaintext';
    // 检查 Prism 是否支持该语言，不支持则用 plaintext
    const validLang = Prism.languages[lang as keyof typeof Prism.languages]
        ? lang
        : 'plaintext';
    // 调用 Prism 生成高亮 HTML（和第一个写法的 hljs 逻辑一致）
    return Prism.highlight(code, Prism.languages[validLang as keyof typeof Prism.languages], validLang);
  },
  breaks: true,
  gfm: true
});

const props = defineProps<{
  visible: boolean;
  isDarkMode: boolean;
}>();
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'error', error: string): void;
}>();

const messages = ref<Message[]>([
  {
    role: 'ai',
    // 初始化消息也提前渲染成 HTML
    content: '你好！我是素笔 Mark的AI助手，有什么可以帮您的吗？',
  },
]);
const userInput = ref('');
const isLoading = ref(false);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

const closeDialog = () => {
  emit('close');
};

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return;

  // 添加用户消息（纯文本，无需渲染）
  messages.value.push({
    role: 'user',
    content: userInput.value
  });

  const question = userInput.value;
  userInput.value = '';
  isLoading.value = true;

  // 添加 AI 消息占位（初始为空 HTML）
  const aiMessageIndex = messages.value.push({
    role: 'ai',
    content: ''
  }) - 1;

  try {
    const response = await fetch('/proxy/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer RYgyOdUtHftbMIUzLGYn:GHYPENAGGxzUADAarZRc',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'lite',
        messages: [{ role: 'user', content: question }],
        stream: true
      })
    });

    if (!response.ok) {
      const error = `HTTP error! status: ${response.status}`;
      emit('error', error);
      return;
    }
    if (!response.body) return;

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
              // 流式过程中：临时渲染（可选，也可只在结束后渲染）
              // @ts-ignore
              const tempHtml = DOMPurify.sanitize(marked.parse(fullResponse));
              messages.value[aiMessageIndex].content = tempHtml;
              messages.value = [...messages.value];

              // 滚动到底部
              nextTick(() => {
                const container = document.querySelector('.messages-container');
                if (container) container.scrollTop = container.scrollHeight;
              });
            }
          } catch (e) {
            console.error('解析 JSON 失败:', e);
          }
        }
      }
    }

    // 3. 回复完成后：一次性渲染成带高亮的 HTML（和第一个写法逻辑对齐）
    // @ts-ignore
    const finalHtml = DOMPurify.sanitize(marked.parse(fullResponse));
    messages.value[aiMessageIndex].content = finalHtml;
    messages.value = [...messages.value];

  } catch (error) {
    console.error('API 调用失败:', error);
    // @ts-ignore
    const errorHtml = DOMPurify.sanitize(marked.parse(`抱歉，处理您的请求时出错: ${error}`));
    messages.value[aiMessageIndex].content = errorHtml;
  } finally {
    isLoading.value = false;
  }
};

// 处理键盘事件
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.shiftKey)) {
    e.preventDefault();
    sendMessage();
  }
};
</script>

<style scoped>
@import "../../styles/ChatModal.css";
</style>
