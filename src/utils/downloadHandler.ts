import {pdfConfig} from "../consts/pdfConfig.ts";
// @ts-ignore
import Prism from 'prismjs';

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

export const htmlHandler = (html: string) => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '素笔Mark导出html.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export const pdfHandler = (renderedMarkdown: any) => {
    const tempElement = document.createElement('div');
    // 1. 复制预览区内容
    tempElement.innerHTML = renderedMarkdown.value;

    // 新增：清理数学公式节点中的冗余内容
    const cleanMathNodes = () => {
        // 移除所有katex-html类元素
        tempElement.querySelectorAll('.katex-html').forEach(el => {
            el.remove();
        });

        // 清理math节点中的冗余文本节点
        tempElement.querySelectorAll('math').forEach(math => {
            [...math.childNodes]
                .filter(node => node.nodeType === 3) // 过滤文本节点
                .forEach(node => math.removeChild(node));
        });
    };
    // 执行清理
    cleanMathNodes();

    // 2. 手动注入所需样式
    const style = document.createElement('style');
    style.textContent = pdfConfig;
    tempElement.appendChild(style);

    // 3. 代码高亮
    tempElement.querySelectorAll('pre code').forEach((block) => {
        Prism.highlightElement(block as HTMLElement);
    });

    // 4. 设置临时元素基础样式
    tempElement.style.maxWidth = '800px';
    tempElement.style.margin = '0 auto';
    tempElement.style.padding = '40px';
    tempElement.style.backgroundColor = '#ffffff';
    tempElement.style.color = '#333333';

    return tempElement;
}
