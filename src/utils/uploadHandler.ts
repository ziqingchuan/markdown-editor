/**
 * @Description 文件处理器，用于解析不同格式的文件的文本内容
 * @Author: Qingchuan Zi
 */
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import compressImage from "./imageCompressor.ts";
import { useImageStore } from '../stores/useImageStore';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.mjs';
const imageStore = useImageStore();
export const FileUploadHandler = {
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
                const { items } = content;

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
    },
    async handleImage(file: File): Promise<string> {
        // 使用Promise包装异步操作
        return new Promise(async (resolve, reject) => {
            try {
                // 1. 第一步：保持原有逻辑，先压缩图片
                const compressedFile = await compressImage(
                    file,
                    0.7,    // 初始质量
                    1200,   // 最大宽度
                    100,    // 最小压缩尺寸(KB)
                    200     // 目标尺寸(KB)
                );

                // 2. 第二步：读取压缩后的图片，转为「无前缀的Base64」（接口要求source参数格式）
                const reader = new FileReader();
                reader.onload = async (event: ProgressEvent<FileReader>) => {
                    try {
                        // 从FileReader结果中提取Base64，并去掉前缀（如"data:image/png;base64,"）
                        const fullBase64 = event.target?.result as string;
                        // 3. 第三步：构造PicGo接口的请求体（含key和source参数）
                        const picGoApiKey = 'chv_ScAYu_34c5279ae9c6ecfc4ef9324ea289b57fe6c5b6f1d54c9664863efe44a156b2181228f3606890670652c60002610a8f44ef950e89253cf25b8e3f62987590bff4'; // 替换为你自己的PicGo API Key
                        const requestBody = new FormData();
                        requestBody.append('key', picGoApiKey); // 接口要求的「key」参数（API密钥）
                        requestBody.append('source', file);
                        requestBody.append('album_id', 'kdQyG');
                        requestBody.append('title', compressedFile.name); // 可选：自定义图片文件名（接口若支持）
                        requestBody.append('format', 'json');
                        // 4. 第四步：发起POST请求到PicGo上传接口
                        const response = await fetch('/upload/api/1/upload', {
                            method: 'POST',
                            body: requestBody,
                        });

                        // 5. 第五步：处理接口响应（根据PicGo接口返回格式解析）
                        if (!response.ok) {
                            const errorText = await response.text(); // 读取错误响应内容
                            throw new Error(`上传请求失败，HTTP状态码: ${response.status}，详情: ${errorText}`);
                        }

                        // 解析JSON响应（假设接口返回JSON格式，如{ "success": true, "data": { "url": "在线链接" } }）
                        const responseData = await response.json();
                        // 根据接口实际返回的「成功标识」判断（需参考PicGo接口文档，此处为通用示例）
                        if (!responseData.success || !responseData.image?.url) {
                            throw new Error(`图片上传失败，接口返回: ${JSON.stringify(responseData)}`);
                        }
                        // 6. 第六步：生成最终的Markdown链接（用接口返回的在线URL）
                        const fileName = compressedFile.name.replace(/\.[^/.]+$/, ''); // 去掉文件后缀作为Markdown图片alt
                        const markdownLink = `![${fileName}](${responseData.image.url})`;
                        imageStore.setImageMap(responseData.image.url, fullBase64);
                        resolve(markdownLink); // 返回最终的Markdown链接

                    } catch (uploadError) {
                        // 捕获「读取Base64/发起请求/解析响应」过程中的错误
                        reject(new Error(`图片上传过程出错: ${uploadError}`));
                    }
                };

                // 7. 处理FileReader读取图片失败的情况
                reader.onerror = () => {
                    reject(new Error('图片读取失败，请检查文件是否损坏'));
                };

                // 8. 开始读取压缩后的图片文件（转为DataURL，用于提取Base64）
                reader.readAsDataURL(compressedFile);

            } catch (compressError) {
                // 捕获「图片压缩」过程中的错误
                reject(compressError);
            }
        });
    }
    // async handleImage(file: File): Promise<string> {
    //     // 使用Promise包装异步操作
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             const compressedFile = await compressImage(
    //                 file,
    //                 0.7,    // 初始质量
    //                 1200,   // 最大宽度
    //                 100,    // 最小压缩尺寸(KB)
    //                 200     // 目标尺寸(KB)
    //             );
    //
    //             const reader = new FileReader();
    //
    //             // 异步读取完成后执行
    //             reader.onload = (event: ProgressEvent<FileReader>) => {
    //                 const imageUrl = event.target?.result as string;
    //                 const fileName = compressedFile.name.replace(/\.[^/.]+$/, '');
    //                 const result = `![${fileName}](${imageUrl})`;
    //                 resolve(result); // 将结果通过Promise返回
    //             };
    //
    //             // 读取失败处理
    //             reader.onerror = () => {
    //                 reject(new Error('图片读取失败'));
    //             };
    //
    //             // 开始读取文件
    //             reader.readAsDataURL(compressedFile);
    //         } catch (error) {
    //             // 压缩过程出错时 reject
    //             reject(error);
    //         }
    //     });
    // }
};
