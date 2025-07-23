/**
 * 加载并读取外部CSS文件内容
 * @param url CSS文件路径
 * @returns CSS内容字符串
 */
export const loadCssContent = async (url: string): Promise<string> => {
    try {
        const response = await fetch(url);
        console.log('加载CSS成功:', response);
        if (!response.ok) {
            throw new Error(`无法加载CSS文件: ${response.statusText}`);
        }
        return await response.text();
    } catch (error) {
        console.error('加载CSS失败:', error);
        return ''; // 失败时返回空字符串，避免阻断PDF生成
    }
};
