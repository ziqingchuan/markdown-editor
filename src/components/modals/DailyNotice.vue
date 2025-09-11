<template>
  <div class="daily-notice-overlay" v-if="visible" @click="onClose">
    <div class="daily-notice-container" @click.stop :class="{ 'dark-mode': isDarkMode }">
      <button class="daily-notice-close" @click="onClose">×</button>

      <div class="daily-notice-header">
        <h2>欢迎使用素笔编辑器！</h2>
        <div class="sub-title">截止到 {{ getCurrentDate() }}，本编辑器已支持以下功能：</div>
      </div>

      <div class="daily-notice-content">
        <div class="feature-item">
          <div class="feature-icon">
            <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M926.2 564.8l-365.5-0.1c-10.3 0.4-20 4.8-27 12.3-7 7.5-10.7 17.5-10.3 27.8v350.3c-0.9 21.4 15.7 39.4 37.1 40.4h365.6c21-0.7 37.5-18.3 36.9-39.4v-351c0.6-21.1-15.6-39-36.8-40.3zM897 929.7H589.3V630.6H897v299.1zM494.2 39.8c-7-7.6-16.7-12-26.9-12.4H101.9c-21 0.7-37.5 18.3-36.8 39.4v349.5c-1.2 21.1 14.9 39.1 36 40.3h366.2c10.3-0.4 20-4.8 27-12.3 7-7.5 10.7-17.5 10.3-27.8V67.7c0.3-10.3-3.4-20.3-10.4-27.9z m-55.6 350.9H130.9V93.3h307.6v297.4z" fill="#ffffff"></path><path d="M793.3 305h58.6c1 0 1.9-0.4 2.6-1.2 0.6-0.8 0.9-1.8 0.8-2.7-18.4-110.6-113-193.9-225-198-16.6-3.6-28.9-18.3-29.2-35.4 0.6-20.5 16-35.4 35-35.4 149 8.9 268.5 122.3 285.1 269.7 0.2 1.7 1.6 3 3.3 3H991l-98.9 147.2L793.3 305zM392.7 989.1c-1.2 0-2.4-0.1-3.6-0.2-162.6-9.9-288.5-145.2-286.7-308 0-0.9-0.3-1.8-1-2.4-0.6-0.6-1.5-1-2.4-1H35.5l98.9-147.2 98.9 147.2h-63.1c-1.9 0-3.4 1.5-3.4 3.4-0.3 129.1 100.6 233.3 229.6 237.3 19.3 1.9 33.5 19.4 31.6 38.9-1.9 18.3-17.1 32-35.3 32z" fill="#ffffff"></path></svg>
          </div>
          <div class="feature-info">
            <h3>编辑模式切换</h3>
            <p>支持沉浸式编辑/预览，以及全屏模式，让您随心所欲地编辑</p>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">
            <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M781.9 379.9L602.6 199.1l-3.4-3.4c-2.6-2.6-7.5-5.4-13.1-5.4H290.8c-28.8 0-53.1 25-53.1 54.6v532.9c0 28.3 24.8 53.1 53.1 53.1h444.1c29.3 0 53.1-23.8 53.1-53.1V396.3c1.5-6.6-0.7-12.7-6.1-16.4zM280.6 788.1c-0.8-0.8-1.3-1.9-1.3-3.2v-548c0-2.7 1.9-4.6 4.6-4.6h263.8v141.6c0 28.2 23 51.2 51.2 51.2h150v359.5c0 2.7-1.9 4.6-4.6 4.6H284.1c-1.4 0-2.6-0.3-3.5-1.1z m307.3-438.9V243.4l140.1 140H622.1c-9 0.2-17.5-3.2-23.9-9.5-6.6-6.5-10.3-15.3-10.3-24.7z" fill="#ffffff"></path><path d="M656.3 578.8c-23.5 0-42.9-19-42.9-42.9s19-42.9 42.9-42.9 42.9 19 42.9 42.9-19 42.9-42.9 42.9z m0-58.8c-9.1 0-16.3 7.2-16.3 16.3 0 9.1 7.2 16.3 16.3 16.3 9.1 0 16.3-7.2 16.3-16.3 0-9.1-7.2-16.3-16.3-16.3z m-180.7 58.8V493h85.8v85.8h-85.8z m59.2-26.5V520h-32.3v32.3h32.3z m-205.3 26.5l51.2-102.5L432 578.8H329.5z m64.5-21.2l-13.3-26.9-13.3 26.9H394z" fill="#ffffff"></path></svg>
          </div>
          <div class="feature-info">
            <h3>多格式导出</h3>
            <p>可将内容导出为Markdown、PDF和HTML等多种格式</p>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">
            <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M994.133333 518.4c0 262.741333-212.992 475.733333-475.733333 475.733333S42.666667 781.141333 42.666667 518.4 255.658667 42.666667 518.4 42.666667 994.133333 255.658667 994.133333 518.4z m-76.8 0a398.933333 398.933333 0 0 0-398.933333-398.933333 397.226667 397.226667 0 0 0-181.973333 43.818666 436.778667 436.778667 0 0 1 181.973333 355.114667c0 146.218667-71.765333 275.712-181.973333 355.114667A397.226667 397.226667 0 0 0 518.4 917.333333a398.933333 398.933333 0 0 0 398.933333-398.933333z" fill="#ffffff"></path></svg>
          </div>
          <div class="feature-info">
            <h3>日夜模式</h3>
            <p>支持明暗主题切换，保护您的眼睛，适应不同场景</p>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">
            <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M652.373333 905.088a1044.821333 1044.821333 0 0 1-22.997333-22.741333l-3.498667-3.712-58.752-58.581334a29.141333 29.141333 0 0 1-9.429333-22.485333 29.568 29.568 0 0 1 6.570667-19.2l-63.018667-62.762667-168.917333 169.130667a148.522667 148.522667 0 0 1-100.736 48.469333 103.978667 103.978667 0 0 1-38.4-7.466666 129.578667 129.578667 0 0 1-79.146667-93.866667 120.576 120.576 0 0 1 34.133333-110.592l181.248-181.546667-12.8-15.445333-39.168-45.397333-113.066666-37.248c-19.498667-6.570667-25.088-26.709333-29.866667-44.757334-0.896-3.285333-1.664-6.314667-2.602667-9.130666L88.106667 248.832a31.957333 31.957333 0 0 1 8.021333-30.72L152.789333 162.133333a30.805333 30.805333 0 0 1 22.229334-9.813333 26.581333 26.581333 0 0 1 8.533333 1.365333l165.674667 52.266667c23.850667 7.509333 30.933333 32.085333 36.992 53.632 1.408 4.693333 2.602667 8.917333 4.010666 13.141333l24.064 73.088 50.432 59.306667 1.152-1.152a275.456 275.456 0 0 1 6.997334-119.722667 172.842667 172.842667 0 0 1 72.533333-90.666666A1748.864 1748.864 0 0 1 704 91.904a31.872 31.872 0 0 1 16-4.266667 32.768 32.768 0 0 1 22.4 9.173334l52.992 53.162666a32.469333 32.469333 0 0 1 0 44.757334l-100.266667 100.010666 35.584 35.114667 99.754667-99.797333a32 32 0 0 1 44.757333 0l53.162667 53.205333a32.682667 32.682667 0 0 1 5.162667 38.613333 2280.533333 2280.533333 0 0 1-86.656 136.789334c-2.602667 3.541333-4.906667 7.296-7.509334 10.794666a211.114667 211.114667 0 0 1-58.752 65.578667 215.722667 215.722667 0 0 1-113.408 26.965333c-4.010667 0-7.978667 0-11.904-0.256l-18.730666 18.944 63.018666 63.061334a31.488 31.488 0 0 1 19.413334-6.570667 30.634667 30.634667 0 0 1 22.229333 9.386667l75.008 74.752a129.109333 129.109333 0 0 1 40.021333 73.984 122.112 122.112 0 0 1-63.146666 127.402666 138.837333 138.837333 0 0 1-59.349334 13.610667 117.888 117.888 0 0 1-81.408-31.232z m-18.090666-107.306667l11.733333 11.946667c4.266667 4.266667 9.088 9.386667 14.08 14.506667 21.333333 23.210667 46.08 49.408 75.818667 49.408a55.082667 55.082667 0 0 0 17.066666-2.773334 64 64 0 0 0 40.064-44.757333 52.48 52.48 0 0 0-12.16-49.877333c-8.149333-8.533333-16.682667-17.066667-26.24-26.496l-36.352-36.053334z m-12.586667-580.010666c-8.917333 5.888-13.824 8.533333-17.834667 10.794666a85.973333 85.973333 0 0 0-21.845333 16.384 203.648 203.648 0 0 0-55.466667 99.072 231.210667 231.210667 0 0 0 1.152 50.389334l0.768 5.162666a37.930667 37.930667 0 0 1-6.826666 37.717334l-9.813334 9.6-24.32 24.106666a16.554667 16.554667 0 0 1-2.602666 3.285334l-90.410667 89.941333a7.978667 7.978667 0 0 1-2.346667 2.133333l-170.666666 171.008c-3.072 3.029333-6.314667 6.101333-9.685334 9.344a106.922667 106.922667 0 0 0-36.48 49.92 62.293333 62.293333 0 0 0 13.824 52.010667 53.632 53.632 0 0 0 41.685334 21.333333 50.048 50.048 0 0 0 10.325333-1.194666 73.045333 73.045333 0 0 0 39.338667-21.76l121.984-122.282667 216.917333-216.917333a21.674667 21.674667 0 0 1 20.906667-10.282667h2.346666c9.6 0.725333 19.925333 1.152 30.933334 1.152a108.714667 108.714667 0 0 0 79.829333-22.485333 394.837333 394.837333 0 0 0 45.909333-60.202667l3.328-4.650667a2264.746667 2264.746667 0 0 0 63.658667-100.949333l-13.568-13.354667-99.754667 100.053334a31.701333 31.701333 0 0 1-22.485333 9.130666 32.298667 32.298667 0 0 1-22.229333-8.874666l-80.170667-80.128a32 32 0 0 1 0-44.757334l99.84-100.053333-13.184-13.098667c-26.154667 15.616-60.074667 36.224-93.056 58.496z m-75.52 453.034666l62.592 62.805334 45.653333-45.44-63.018666-62.805334zM154.325333 249.386667l43.349334 136.789333 101.418666 33.28a98.133333 98.133333 0 0 1 42.154667 36.053333 152.533333 152.533333 0 0 0 15.914667 18.517334l17.322666 20.864 45.013334-45.013334L363.264 383.573333a30.421333 30.421333 0 0 1-8.149333-12.8c0-0.469333-0.256-0.725333-0.256-0.896l-34.645334-106.112-136.832-43.349333z" fill="#ffffff"></path></svg>
          </div>
          <div class="feature-info">
            <h3>可拖拽工具栏</h3>
            <p>可以快捷的对文本内容进行样式修改，提升创作效率</p>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">
            <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M733.696 499.712c-16.896-20.48-43.008-28.16-69.12-24.064-16.896-18.432-43.008-28.16-69.12-24.064-22.528-26.112-59.392-33.28-91.136-14.848V321.024c0-38.912-31.744-70.656-70.656-70.656-38.912 0-70.656 31.744-70.656 70.656v253.44l-28.16-24.064c-35.328-33.28-91.136-33.28-126.464 0l-2.048 2.048c-29.696 31.744-28.16 81.92 5.632 110.08 29.696 28.16 53.76 55.808 72.704 85.504 44.544 74.24 57.856 110.08 87.552 134.144l2.048 2.048c29.696 24.064 65.024 37.376 104.448 37.376h178.688c89.6 0 161.792-70.656 161.792-158.208v-193.536c0-5.632 0-9.216-2.048-14.848-7.168-38.4-44.544-62.464-83.456-55.296z m0 0" fill="#ffffff"></path><path d="M781.824 103.424H223.232c-20.48 0-37.376 16.896-37.376 37.376v223.232c0 20.48 16.896 37.376 37.376 37.376H307.2V323.072c0-69.12 57.856-126.464 126.464-126.464a125.44 125.44 0 0 1 126.464 126.464v52.224c20.48 3.584 38.912 11.264 53.76 22.528 9.216 0 18.432 2.048 28.16 5.632h139.776c20.48 0 37.376-16.896 37.376-37.376v-225.28c0-20.992-16.896-37.376-37.376-37.376z m0 0" fill="#ffffff"></path></svg>
          </div>
          <div class="feature-info">
            <h3>独特的快捷功能</h3>
            <p>提供一键编辑公式、插入表格/代码块、插入表情/图片、渲染网页等功能</p>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">
            <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M276 505.61h170v48H276zM276 300.66h290v48H276z" fill="#ffffff"></path><path d="M639.45 112L848 320.55V852a60.07 60.07 0 0 1-60 60H236a60.07 60.07 0 0 1-60-60V172a60.07 60.07 0 0 1 60-60h403.45m19.89-48H236a108 108 0 0 0-108 108v680a108 108 0 0 0 108 108h552a108 108 0 0 0 108-108V300.66L659.34 64z" fill="#ffffff"></path><path d="M869.98 324.66H635.34V90.04h48v186.62h186.64v48zM483.763 788.286l179.174-179.174 33.941 33.941-179.173 179.174z" fill="#ffffff"></path><path d="M721.06 782.28h-48V632.92H523.71v-48h197.35v197.36z" fill="#ffffff"></path></svg>
          </div>
          <div class="feature-info">
            <h3>文件解析上传</h3>
            <p>支持.docx/.txt/.pdf/.html类型文件上传并解析，提高编辑效率</p>
          </div>
        </div>

      </div>
      <div class="daily-notice-footer">
        <p>关闭后，今天将不再显示此提示</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import {getCurrentDate} from "../../utils/dateHandler.ts";
// 定义属性，接收isDarkMode状态
defineProps<{
  visible: boolean;
  isDarkMode: boolean; // 新增：接收暗黑模式状态
}>();

// 定义事件
const emit = defineEmits<{
  (e: 'close'): void;
}>();

// 关闭弹窗
const onClose = () => {
  emit('close');
};
</script>

<style scoped>
/* 遮罩层 */
.daily-notice-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-in-out;
}

/* 弹窗容器 - 基础样式 */
.daily-notice-container {
  width: 90%;
  max-width: 700px;
  background-color: #fff;
  color: #333;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative; /* 用于关闭按钮定位 */
}

/* 暗黑模式样式 - 通过动态class切换 */
.daily-notice-container.dark-mode {
  background-color: #515151;
  color: #f8fafc;
}

/* 关闭按钮 */
.daily-notice-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #252525;
  transition: color 0.2s;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  z-index: 1001;
}

.daily-notice-close:hover {
  color: #0f172a;
  background-color: #f1f5f9;
}

.daily-notice-container.dark-mode .daily-notice-close {
  color: #fff;
}

.daily-notice-container.dark-mode .daily-notice-close:hover {
  color: #ffffff;
  background-color: #393939;
}

/* 头部样式 */
.daily-notice-header {
  padding: 20px 24px;
  position: relative;
}

.sub-title {
  margin-top: 20px;
}

.daily-notice-header h2 {
  margin: 0 0 8px 0;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.daily-notice-header p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

/* 内容区域 */
.daily-notice-content {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  scrollbar-width: thin; /* Firefox：设置滚动条宽度（thin/auto/none） */
  scrollbar-color: rgba(209, 209, 209, 0.5) transparent; /* Firefox：滚动条滑块颜色 + 轨道颜色 */
}

/* 功能项样式 */
.feature-item {
  display: flex;
  margin-bottom: 24px;
  align-items: flex-start;
}

.feature-item:last-child {
  margin-bottom: 0;
}

.feature-icon {
  background-color: rgba(59, 130, 246, 0.1);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
  color: #3b82f6;
}
.daily-notice-container.dark-mode .daily-notice-header {
  background-color: #515151;
}

.daily-notice-container.dark-mode .feature-icon {
  background-color: rgba(59, 130, 246, 0.2);
}

.feature-info h3 {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: #1e293b;
}

.daily-notice-container.dark-mode .feature-info h3 {
  color: #e2e8f0;
}

.feature-info p {
  margin: 0;
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.5;
}

.daily-notice-container.dark-mode .feature-info p {
  color: #f8fafc;
}

/* 底部样式 */
.daily-notice-footer {
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
  text-align: center;
}

.daily-notice-container.dark-mode .daily-notice-footer {
  border-top: 1px solid #334155;
}

.daily-notice-footer p {
  margin: 0;
  font-size: 0.85rem;
  color: #94a3b8;
}

/* 动画 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
