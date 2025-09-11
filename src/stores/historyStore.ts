import {defineStore} from 'pinia';

type Timer = ReturnType<typeof setTimeout>;

export const useHistoryStore = defineStore('history', {
    state: () => ({
        undoStack: [] as string[], // 撤销栈
        redoStack: [] as string[], // 重做栈
        historyLimit: 10, // 最大历史记录数
        debounceTimer: null as Timer | null, // 使用自定义Timer类型
    }),

    actions: {
        // 记录内容变更（防抖处理）
        recordChange(content: string) {
            // 清除之前的计时器
            if (this.debounceTimer) {
                clearTimeout(this.debounceTimer);
            }
            // 防抖处理
            this.debounceTimer = setTimeout(() => {
                // 避免连续相同内容重复记录
                if (this.undoStack[this.undoStack.length - 1] !== content) {
                    this.undoStack.push(content);
                    // console.log('入栈内容：', content);
                    // console.log('当前栈容量：', this.undoStack.length);
                    // 超过限制则移除最早的记录
                    if (this.undoStack.length > this.historyLimit) {
                        this.undoStack.shift();
                    }
                    // 每次新操作清空重做栈
                    // this.redoStack = [];
                }
                this.debounceTimer = null;
            }, 100);
        },

        // 撤销操作
        undo(currentContent: string): string | null {
            if (this.undoStack.length === 1) return null;

            // 将当前内容存入重做栈
            this.redoStack.push(currentContent);

            this.undoStack.pop();
            // console.log('当前undoStack栈容量：', this.undoStack.length);
            // console.log('当前redoStack栈容量：', this.redoStack.length);
            // 从撤销栈取出上一个状态
            return this.undoStack[this.undoStack.length - 1];
        },

        // 重做操作
        redo(currentContent: string): string | null {
            if (this.redoStack.length === 0) return null;

            // 将当前内容存入撤销栈
            this.undoStack.push(currentContent);
            // console.log('当前undoStack栈容量：', this.undoStack.length);
            // console.log('当前redoStack栈容量：', this.redoStack.length);
            // 从重做栈取出下一个状态
            return this.redoStack.pop()!;
        },

        // 清空历史记录（如新建文档时）
        // clearHistory() {
        //     this.undoStack = [];
        //     this.redoStack = [];
        //     if (this.debounceTimer) {
        //         clearTimeout(this.debounceTimer);
        //         this.debounceTimer = null;
        //     }
        // }
    }
});
