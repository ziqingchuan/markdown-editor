import { createProxyMiddleware } from 'http-proxy-middleware';

export default (req, res) => {
    let target = '';
    if (req.url.startsWith('/upload')) {
        target = 'https://www.picgo.net';
    }
    if (req.url.startsWith('/loadImg')) {
        target = 'https://www.picgo.net';
    }
    else if (req.url.startsWith('/chat')) {
        target = 'https://spark-api-open.xf-yun.com';
    }
    // 创建代理对象并转发请求
    const proxy = createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: {
            '^/chat': '',
            '^/upload': '',
            '^/loadImg': ''
        },
    });

    return proxy(req, res);
};
