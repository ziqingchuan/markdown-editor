import { createProxyMiddleware } from 'http-proxy-middleware';

export default (req, res) => {
    let target = '';
    console.log(req.url);
    if (req.url.startsWith('/upload')) {
        console.log(req.url);
        target = 'https://www.picgo.net';
    }
    else if (req.url.startsWith('/proxy')) {
        target = 'https://spark-api-open.xf-yun.com';
    }
    // 创建代理对象并转发请求
    const proxy = createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: {
            '^/proxy': '',
            '^/upload': ''
        },
    });

    return proxy(req, res);
};
