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
            container.style.backgroundColor = 'rgba(232,232,232, 0.8)';
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

// export const pdfHandler = async (renderedMarkdown: any, mermaidInstance: any) => {
//     const tempElement = document.createElement('div');
//     tempElement.innerHTML = renderedMarkdown.value;
//
//     // 1. 处理KaTeX公式：确保SVG内加载样式并正确渲染
//     const katexElements = tempElement.querySelectorAll('.katex');
//     console.log(katexElements);
//     for (const element of katexElements) {
//         try {
//             // 复制KaTeX元素并保留必要样式
//             const clone = element.cloneNode(true) as HTMLElement;
//             clone.style.fontSize = '16px';
//             clone.style.display = 'inline-block';
//
//             // 核心修复：在SVG中嵌入KaTeX样式（必须包含，否则无法渲染）
//             const katexStyle = `
//                 <style xmlns="http://www.w3.org/1999/xhtml">
//                     @import url('https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css');
//                     .katex { font-size: 16px !important; }
//                     .katex-mathml { display: none !important; } /* 隐藏冗余的MathML */
//                 </style>
//             `;
//
//             // 生成包含样式和内容的SVG
//             const svgString = `
//                 <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
//                     <foreignObject width="100%" height="100%" xmlns:xhtml="http://www.w3.org/1999/xhtml">
//                         <div xmlns="http://www.w3.org/1999/xhtml">
//                             ${katexStyle}
//                             ${clone.outerHTML}
//                         </div>
//                     </foreignObject>
//                 </svg>
//             `.trim().replace(/\s+/g, ' ');
//
//             // 创建容器并替换原始元素
//             const svgContainer = document.createElement('div');
//             svgContainer.innerHTML = svgString;
//             svgContainer.style.display = element.closest('.math-display') ? 'block' : 'inline-block';
//             svgContainer.style.margin = element.closest('.math-display') ? '1em auto' : '0 4px';
//             svgContainer.style.maxWidth = '100%';
//             svgContainer.style.height = 'auto';
//
//             element.parentNode?.replaceChild(svgContainer, element);
//
//         } catch (error) {
//             console.error('KaTeX转SVG失败:', error);
//             // 失败时保留原始元素
//             element.style.color = '#333';
//         }
//     }
//
//     // 2. 处理Mermaid图表（保持不变）
//     const mermaidElements = tempElement.querySelectorAll('code.language-mermaid');
//     for (const element of mermaidElements) {
//         const content = element.textContent?.trim();
//         if (!content) continue;
//
//         try {
//             const container = document.createElement('div');
//             container.className = 'mermaid-container';
//             container.style.margin = '20px 0';
//             container.style.textAlign = 'center';
//             container.style.backgroundColor = 'rgba(232,232,232, 0.8)';
//             container.style.borderRadius = '8px';
//             container.style.padding = '15px';
//             container.style.overflow = 'auto';
//
//             element.parentNode?.replaceChild(container, element);
//
//             const { svg } = await mermaidInstance.render(
//                 `mermaid-pdf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//                 content
//             );
//             container.innerHTML = svg;
//
//         } catch (error) {
//             console.error('Mermaid PDF 渲染错误:', error);
//             const errorDiv = document.createElement('div');
//             errorDiv.textContent = `Mermaid 图表: ${content.substring(0, 50)}...`;
//             errorDiv.style.color = '#666';
//             errorDiv.style.fontStyle = 'italic';
//             element.parentNode?.replaceChild(errorDiv, element);
//         }
//     }
//
//     // 3. 清理冗余元素
//     const cleanNodes = () => {
//         tempElement.querySelectorAll('.katex-mathml, [data-katex-error]').forEach(el => el.remove());
//         tempElement.querySelectorAll('p, div').forEach(parent => {
//             [...parent.childNodes].forEach(node => {
//                 if (node.nodeType === 3 && !node.textContent?.trim()) {
//                     parent.removeChild(node);
//                 }
//             });
//         });
//     };
//     cleanNodes();
//
//     // 4. 注入全局样式
//     const style = document.createElement('style');
//     style.textContent = `
//         ${pdfConfig}
//         /* 确保SVG内的KaTeX样式生效 */
//         svg { overflow: visible !important; }
//         .katex-html { display: block !important; }
//     `;
//     tempElement.appendChild(style);
//
//     // 5. 代码高亮
//     tempElement.querySelectorAll('pre code').forEach((block) => {
//         if (!block.classList.contains('language-mermaid')) {
//             Prism.highlightElement(block as HTMLElement);
//         }
//     });
//
//     // 6. 基础样式设置
//     tempElement.style.maxWidth = '800px';
//     tempElement.style.margin = '0 auto';
//     tempElement.style.padding = '40px';
//     tempElement.style.backgroundColor = '#ffffff';
//     tempElement.style.boxSizing = 'border-box';
//     return tempElement;
// };
