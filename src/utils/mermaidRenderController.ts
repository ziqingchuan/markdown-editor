import mermaid from "mermaid";

export const renderMermaidCharts = (previewRef: any) => {
    if (!previewRef.value) return;

    const mermaidElements = previewRef.value.querySelectorAll('code.language-mermaid');

    mermaidElements.forEach((element: any) => {
        const content = element.textContent?.trim();
        if (!content) return;

        // 检查是否已经渲染过
        if (element.parentElement?.classList.contains('mermaid-processed')) {
            return;
        }

        try {
            // 隐藏原始的代码块
            // @ts-ignore
            element.style.display = 'none';

            // 标记父元素已处理
            if (element.parentElement) {
                element.parentElement.classList.add('mermaid-processed');
            }

            // 创建容器用于渲染
            const container = document.createElement('div');
            container.className = 'mermaid-container';

            // 插入到代码块前面
            element.parentNode?.insertBefore(container, element);

            // 使用 Mermaid 渲染
            mermaid.render(`mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, content)
                .then(({ svg }) => {
                    container.innerHTML = svg;
                })
                .catch((error) => {
                    console.error('Mermaid 渲染错误:', error);
                    // 显示错误信息，同时恢复原始代码块显示
                    // @ts-ignore
                    element.style.display = 'block';
                    container.innerHTML = `<div class="mermaid-error">
            <span>Mermaid 图表渲染错误，请打开控制台查看错误信息</span>
          </div>`;
                    // 找到元素并删除
                    document.querySelectorAll('[id^="dmermaid"]').forEach(el => el.remove());
                });
        } catch (error) {
            console.error('Mermaid 处理错误:', error);
            // 出错时恢复显示原始代码块
            // @ts-ignore
            element.style.display = 'block';
        }
    });
};

export const unRenderMermaidCharts = (previewRef: any) => {
    if (!previewRef.value) return;

    // 1. 先移除所有渲染出的mermaid容器和错误提示
    previewRef.value.querySelectorAll('.mermaid-container, .mermaid-error').forEach((el: any) => {
        el.remove();
    });

    // 2. 处理所有已标记的代码块父元素
    const processedElements = previewRef.value.querySelectorAll('pre.mermaid-processed');

    processedElements.forEach((parent: any) => {
        // 找到原始的code元素
        const codeElement = parent.querySelector('code.language-mermaid');
        if (!codeElement) return;

        // 恢复原始代码块的显示
        // @ts-ignore
        codeElement.style.display = ''; // 清除inline样式，恢复默认显示

        // 移除已处理标记
        parent.classList.remove('mermaid-processed');
    });

    // 3. 额外清理可能残留的mermaid生成元素（如之前提到的dmermaid前缀元素）
    previewRef.value.querySelectorAll('[id^="dmermaid"]').forEach((el: any) => {
        el.remove();
    });
};
