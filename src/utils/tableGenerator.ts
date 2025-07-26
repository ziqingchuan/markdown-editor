export const generateMarkdownTable = (rows: number, cols: number) => {
    // 表头行（如：| 列1 | 列2 | 列3 |）
    const header = `| ${Array(cols).fill('列').map((_, i) => `列${i+1}`).join(' | ')} |`;
    // 分隔行（如：| --- | --- | --- |）
    const separator = `| ${Array(cols).fill('---').join(' | ')} |`;
    // 内容行（如：| 内容 | 内容 | 内容 |）
    const contentRows = Array(rows - 1) // 减去表头行
        .fill('')
        .map(() => `| ${Array(cols).fill('内容').join(' | ')} |`);

    // 组合成完整表格（表头+分隔+内容行，每行换行）
    return `\n${header}\n${separator}\n${contentRows.join('\n')}\n`;
};