/**
 *通用滚动同步函数
 * @param sourceRef 滚动源的DOM引用（触发滚动的元素）
 * @param targetRef 目标的DOM引用（需要同步滚动的元素）
 * @param isSyncing 同步标志，用于避免快速滚动冲突
 */
export const syncScroll = (
    sourceRef: any,
    targetRef: any,
    isSyncing: any
) => {
    if (isSyncing.value) return; // 避免循环触发
    if (!sourceRef.value || !targetRef.value) return;

    // 计算滚动源的滚动比例
    const sourceScrollTop = sourceRef.value.scrollTop;
    const sourceScrollHeight = sourceRef.value.scrollHeight;
    const sourceClientHeight = sourceRef.value.clientHeight;
    const scrollRatio = sourceScrollTop / (sourceScrollHeight - sourceClientHeight || 1);

    // 根据比例计算目标元素的滚动位置
    const targetScrollHeight = targetRef.value.scrollHeight;
    const targetClientHeight = targetRef.value.clientHeight;
    const targetScrollTop = scrollRatio * (targetScrollHeight - targetClientHeight || 1);

    // 同步目标元素的滚动位置
    isSyncing.value = true;
    targetRef.value.scrollTop = targetScrollTop;

    // 延迟重置同步标志，避免快速滚动冲突
    setTimeout(() => {
        isSyncing.value = false;
    }, 10);
};