import { createProxyMiddleware } from 'http-proxy-middleware';

export default (req, res) => {
    let target = '';
    if (req.url.startsWith('/proxy/picgo')) {
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
        },
    });

    return proxy(req, res);
};
