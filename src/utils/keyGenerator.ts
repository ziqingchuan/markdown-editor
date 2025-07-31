/**
 * 生成唯一且固定的key（创建后不变）
 * 格式：时间戳-随机数-随机字符串（共32位左右）
 */
export const keyGenerator = (): string => {
    // 1. 取当前时间戳（毫秒级），确保时间维度唯一
    const timestamp = Date.now().toString(36); // 转为36进制缩短长度

    // 2. 生成随机数（0-1）并转为36进制，取后6位
    const randomNum = Math.random().toString(36).slice(-6);

    // 3. 生成随机字符（a-z0-9），取8位
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randomStr = '';
    for (let i = 0; i < 8; i++) {
        randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // 拼接为最终key（格式：时间戳-随机数-随机字符串）
    return `${timestamp}-${randomNum}-${randomStr}`;
};
