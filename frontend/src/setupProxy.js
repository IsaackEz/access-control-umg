const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: '//64.227.108.195:5000/',
      changeOrigin: true,
    }),
  )
}
