export const pdfConfig =  `
    /* 表格样式 */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
      border-radius: 6px;
      overflow: hidden;
    }
    th {
      background-color: #f8f9fa;
      color: #333;
      font-weight: 600;
      padding: 0.75rem 1rem;
      text-align: left;
      border: 1px solid #e9ecef;
    }
    td {
      padding: 0.75rem 1rem;
      border: 1px solid #e9ecef;
      line-height: 1.5;
    }
    tr:nth-child(even) {
      background-color: #f8f9fa;
    }
    /* 行内代码样式 */
    code {
      background-color: #f1f3f5;
      color: #3a7bde;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 0.8rem;
      padding: 0.2rem 0.4rem;
      border-radius: 5px;
    }
    /* 代码块样式 */
    pre {
      background-color: #transparent;
      padding: 1rem;
      border-radius: 6px;
      overflow-x: auto;
      margin: 1rem 0;
    }
    pre code {
      background-color: transparent;
      color: #333;
      padding: 0;
      font-size: 0.9em;
      line-height: 1.5;
    }
    blockquote {
      border-left: 4px solid #0d6ae3;
      border-top: 1px solid #ddd;
      border-right: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      background-color: #f5f5f5;
      padding: 1rem;
      margin: 0 0 1rem 0;
      color: #666;
      border-radius: 0 6px 6px 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    img {
      max-width: 100%;
      height: auto;
    }
    a {
      color: #1a73e8;
      text-decoration: none;
    }
    /* 基础样式 */
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
    }
  `;

export const pdfOptions = {
    margin: 10,
    filename: '素笔Mark导出文档.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
};