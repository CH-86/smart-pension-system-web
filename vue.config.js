module.exports = {
  // 配置跨域请求
  devServer: {
    port: 8080,
    host: 'localhost',
    open: true,
    https: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8088',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/api1': {
        target: 'http://localhost:5000',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api1': ''
        }
      }
    }
  },
  configureWebpack(config) {
    // ...

    config.externals = {
        'AMap': 'AMap' // 高德地图配置
    }
}
}