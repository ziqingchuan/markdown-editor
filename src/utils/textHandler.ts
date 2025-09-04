import type {ContentType} from "../types/contentType.ts";

export const textHandler = (type: ContentType, selectedText: string) => {
    switch (type) {
        case 'bold':
            selectedText = `**${selectedText === '' ? '加粗内容' : selectedText}**`;
            break;
        case 'italic':
            selectedText = `*${selectedText === '' ? '斜体内容' : selectedText}*`;
            break;
        case 'underline':
            selectedText = `<u>${selectedText === '' ? '下划线内容' : selectedText}</u>`; // Markdown原生不支持下划线，用HTML标签
            break;
        case 'link':
            const linkText = selectedText || '链接文本';
            selectedText = `[${linkText}](https://example.com)`; // 默认链接地址，可改为prompt输入
            break;
        case 'code':
            selectedText = `\`${selectedText === '' ? 'code' : selectedText}\``; // 行内代码
            break;
        case 'quote':
            selectedText = `> ${selectedText === '' ? '引用内容' : selectedText}`;
            break;
        case 'list':
            selectedText = `- ${selectedText === '' ? '列表内容' : selectedText}`
            break;
        case 'math':
            selectedText = ` $${selectedText === '' ? 'a ^ 2 + b ^ 2 = c ^ 2' : selectedText}$ `;
            break;
    }
    return selectedText;
}
