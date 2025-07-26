import type {ContentType} from "../types/contentType.ts";

export const textHandler = (type: ContentType, selectedText: string) => {
    switch (type) {
        case 'bold':
            selectedText = `**${selectedText}**`;
            break;
        case 'italic':
            selectedText = `*${selectedText}*`;
            break;
        case 'underline':
            selectedText = `<u>${selectedText}</u>`; // Markdown原生不支持下划线，用HTML标签
            break;
        case 'link':
            const linkText = selectedText || '链接文本';
            selectedText = `[${linkText}](https://example.com)`; // 默认链接地址，可改为prompt输入
            break;
        case 'code':
            selectedText = `\`${selectedText}\``; // 行内代码
            break;
        case 'quote':
            selectedText = `> ${selectedText}`;
            break;
        case 'list':
            selectedText = `- ${selectedText}`
            break;
    }
    return selectedText;
}