import { defineStore } from 'pinia';

export const useImageStore = defineStore('image', {
    state: () => ({
        imageMap: {} as Record<string, string>,
    }),

    actions: {
        // 从localStorage获取图片映射数据
        getImageMap() {
            const storedMap = localStorage.getItem('imageMap');
            if (storedMap) {
                try {
                    this.imageMap = JSON.parse(storedMap);
                } catch (error) {
                    console.error('解析localStorage中的imageMap失败:', error);
                    this.imageMap = {};
                }
            }
            return this.imageMap;
        },

        // 设置图片映射并同步到localStorage
        setImageMap(onlineMarkdownLink: string, base64MarkdownLink: string) {
            this.imageMap[onlineMarkdownLink] = base64MarkdownLink;
            localStorage.setItem('imageMap', JSON.stringify(this.imageMap));
        },

        // 清空图片映射并同步到localStorage
        clearImageMap() {
            this.imageMap = {};
            localStorage.removeItem('imageMap');
        },
    },
});
