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

export const pdfHandler = async (renderedMarkdown: any, mermaidInstance: any) => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = renderedMarkdown.value;

    // 异步渲染 Mermaid 图表
    const mermaidElements = tempElement.querySelectorAll('code.language-mermaid');

    for (const element of mermaidElements) {
        const content = element.textContent?.trim();
        if (!content) continue;

        try {
            const container = document.createElement('div');
            container.className = 'mermaid-container';
            container.style.margin = '20px 0';
            container.style.textAlign = 'center';
            container.style.backgroundColor = '#f5f5f5';
            container.style.borderRadius = '8px';
            container.style.padding = '15px';
            container.style.overflow = 'auto';

            element.parentNode?.replaceChild(container, element);

            const { svg } = await mermaidInstance.render(
                `mermaid-pdf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                content
            );
            container.innerHTML = svg;

        } catch (error) {
            console.error('Mermaid PDF 渲染错误:', error);
            const errorDiv = document.createElement('div');
            errorDiv.textContent = `Mermaid 图表: ${content.substring(0, 50)}...`;
            errorDiv.style.color = '#666';
            errorDiv.style.fontStyle = 'italic';
            element.parentNode?.replaceChild(errorDiv, element);
        }
    }

    // 清理数学公式节点中的冗余内容
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
