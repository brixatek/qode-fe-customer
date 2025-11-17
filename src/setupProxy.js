const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://onboarding.zephapay.com',
      changeOrigin: true,
      secure: true,
    })
  );
};