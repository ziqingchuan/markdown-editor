export const pdfConfig =  `
    h1, h2, h3 {
        margin: 1.5rem 0 1rem;
        font-weight: 600;
    }
    h1 {
        font-size: 1.8rem;
        border-bottom: 1px solid #ddd;
        padding-bottom: 0.3rem;
    }
    
    h2 {
        font-size: 1.5rem;
        border-bottom: 1px solid #ddd;
        padding-bottom: 0.3rem;
    }
    
    h3 {
        font-size: 1.25rem;
    }
    
    p {
        margin-bottom: 1rem;
        line-height: 1.7;
    }
    
    ul, ol {
        margin-bottom: 1rem;
        padding-left: 2rem;
    }
    
    :ul {
        list-style-type: disc;
    }
    
    ol {
        list-style-type: decimal;
    }
    
    li {
        margin-bottom: 0.5rem;
    }
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
        font-family: 'Consolas', 'Monaco', monospace;
        font-size: 0.8rem;
        padding: 0.2rem 0.4rem;
        border-radius: 5px;
        background-color: rgba(231, 231, 231, 0.89);
        color: #3a7bde;
    }
    /* 代码块样式 */
    pre {
      padding: 1rem;
      border-radius: 6px;
      overflow-x: auto;
      margin: 1rem 0;
    }
    pre code {
      padding: 0;
    }
    blockquote {
        border-left: 6px solid #3183ee;
        border-top: 1px solid #ddd;
        border-right: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        background-color: #f6f6f6;
        padding: 0.5rem;
        margin: 0 0 1rem 0;
        color: #666;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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
    /* 防止被横向截断 */
    pre code, p, table, li {
        page-break-inside: avoid;
    }
  `;

export const pdfOptions = {
    margin: 10,
    filename: '素笔Mark导出文档.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 3, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
};
