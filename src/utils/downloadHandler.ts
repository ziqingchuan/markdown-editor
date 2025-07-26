import {pdfConfig} from "../consts/pdfConfig.ts";
import hljs from "highlight.js";

export const markdownHandler = (markdown: string) => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '素笔Mark导出文档.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export const pdfHandler = (renderedMarkdown: any) => {
    const tempElement = document.createElement('div');
    // 1. 复制预览区内容
    tempElement.innerHTML = renderedMarkdown.value;

    // 2. 手动注入所需样式（关键步骤）
    const style = document.createElement('style');
    style.textContent = pdfConfig;
    tempElement.appendChild(style);

    // 3. 代码高亮
    tempElement.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(<HTMLElement>block);
    });

    // 4. 设置临时元素基础样式（移除强制白色背景的冲突代码）
    tempElement.style.maxWidth = '800px';
    tempElement.style.margin = '0 auto';
    tempElement.style.padding = '40px';
    tempElement.style.backgroundColor = '#ffffff'; // 保持白色背景便于打印
    tempElement.style.color = '#333333';

    return tempElement;
}