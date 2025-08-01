// src/utils/keyboardHandler.ts
import { nextTick } from 'vue';
import type { Ref } from 'vue';

/**
 * 处理Tab键事件，插入4个空格
 * @param e 键盘事件对象
 * @param editorRef 编辑器DOM引用
 * @param markdownContent 编辑器内容的响应式变量
 */
export const handleTabKey = async (
    e: KeyboardEvent,
    editorRef: Ref<HTMLTextAreaElement | undefined>,
    markdownContent: Ref<string>
) => {
    // 仅处理Tab键
    if (e.key !== 'Tab') return;

    // 阻止默认行为（避免焦点切换）
    e.preventDefault();

    const editor = editorRef.value;
    if (!editor) return;

    // 保存当前滚动位置（避免插入后滚动跳动）
    const scrollTop = editor.scrollTop;

    // 获取光标位置
    const startPos = editor.selectionStart;
    const endPos = editor.selectionEnd;

    // 保存原始内容
    const originalContent = markdownContent.value;

    // 插入4个空格（替换Tab）
    markdownContent.value =
        originalContent.substring(0, startPos) +
        '    ' +  // 4个空格代替Tab
        originalContent.substring(endPos);

    // 等待DOM更新后调整光标位置
    await nextTick();

    // 恢复光标位置和滚动条
    if (editor) {
        const newCursorPos = startPos + 4; // 原位置 + 4个空格
        editor.selectionStart = newCursorPos;
        editor.selectionEnd = newCursorPos;
        editor.scrollTop = scrollTop; // 恢复滚动位置
    }
};

/**
 * 统一的键盘事件处理入口
 * @param e 键盘事件对象
 * @param editorRef 编辑器DOM引用
 * @param markdownContent 编辑器内容的响应式变量
 */
export const keyboardHandler = async (
    e: KeyboardEvent,
    editorRef: Ref<HTMLTextAreaElement | undefined>,
    markdownContent: Ref<string>
) => {
    // 根据按键类型分发处理
    switch (e.key) {
        case 'Tab':
            await handleTabKey(e, editorRef, markdownContent);
            break;
        // 可扩展：添加其他按键处理（如Enter、Backspace等）
        // case 'Enter': ...
    }
};
