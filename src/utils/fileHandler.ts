/**
 * @Description 文件处理器，用于解析不同格式的文件的文本内容
 * @Author: Qingchuan Zi
 */
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.mjs';
export const FileHandler = {
    async handleFile(file: File): Promise<string> {
        const extension = file.name.split('.').pop()?.toLowerCase();

        switch (extension) {
            case 'html':
                return this.parseHTML(file);
            case 'md':
                return this.parseMarkdown(file);
            case 'pdf':
                return this.parsePDF(file);
            case 'txt':
                return this.parseText(file);
            case 'docx':
            case 'doc':
                return this.parseDoc(file);
            default:
                throw new Error('不支持的文件类型');
        }
    },

    async parseHTML(file: File): Promise<string> {
        const text = await file.text(); // 读取 HTML 文件内容
        const doc = new DOMParser().parseFromString(text, "text/html"); // 解析 HTML 文件为 DOM
        if (!doc.body) {
            console.warn("HTML 文件无有效内容");
            return '';
        }
        // 提取纯文本内容
        const rawText = doc.body.textContent || '';
        return rawText
            .split('\n') // 按行分割
            .map(line => line.trim()) // 去除每行的首尾空格
            .filter(line => line.length > 0) // 过滤掉空行
            .join('\n');
    },

    async parseMarkdown(file: File): Promise<string> {
        const text = await file.text(); // 读取 Markdown 文件内容
        return text
            .split('\n') // 按行分割
            .map(line => line.trim()) // 去除每行的首尾空格
            .filter(line => line.length > 0) // 过滤掉空行
            .join('\n');
    },

    async parsePDF(file: File): Promise<string> {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const numPages = pdf.numPages;
            const pageTexts: string[] = [];

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                const { items, styles } = content;

                // 存储当前页的文本行
                const lines: string[] = [];
                // 存储当前行的文本和位置信息
                let currentLine: { text: string, y: number } | null = null;

                // 按y坐标排序文本片段，确保从上到下处理
                const sortedItems = (items as any[]).sort((a, b) => b.transform[5] - a.transform[5]);

                for (const item of sortedItems) {
                    if (!item.str) continue;

                    // 获取文本片段的y坐标（transform数组的第6个元素）
                    const y = item.transform[5];
                    // 计算行高阈值（基于字体大小）
                    const fontSize = 12;
                    const lineHeightThreshold = fontSize * 0.5; // 根据实际情况调整

                    if (!currentLine) {
                        // 初始化第一行
                        currentLine = { text: item.str, y };
                    } else {
                        // 计算与上一个文本片段的y坐标差
                        const yDiff = Math.abs(currentLine.y - y);

                        if (yDiff < lineHeightThreshold) {
                            // y坐标差小于阈值，视为同一行
                            currentLine.text += ' ' + item.str;
                        } else {
                            // 超过阈值，视为新行
                            lines.push(currentLine.text);
                            currentLine = { text: item.str, y };
                        }
                    }
                }

                // 添加最后一行
                if (currentLine) {
                    lines.push(currentLine.text);
                }

                // 将当前页的所有行添加到结果中，页之间添加分隔符
                pageTexts.push(lines.join('\n\n'));
                if (i < numPages) {
                    pageTexts.push('\n---\n');
                }
            }

            return pageTexts.join('\n\n')
                .split('\n\n')
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .join('\n\n');
        } catch (error) {
            console.error('PDF解析失败:', error);
            return '无法解析 PDF 文件，请检查文件内容！';
        }
    },


    async parseText(file: File): Promise<string> {
        const text = await file.text(); // 直接读取 .txt 文件内容
        return text
            .split('\n') // 按行分割
            .map(line => line.trim()) // 去除每行的首尾空格
            .filter(line => line.length > 0) // 过滤掉空行
            .join('\n');
    },

    async parseDoc(file: File): Promise<string> {
        try {
            const arrayBuffer = await file.arrayBuffer(); // 读取文件内容为 ArrayBuffer
            const result = await mammoth.extractRawText({ arrayBuffer });
            return result.value
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .join('\n');
        } catch (error) {
            console.error('DOC/DOCX 解析失败:', error);
            return '无法解析 DOC/DOCX 文件，请检查文件内容！';
        }
    }
};