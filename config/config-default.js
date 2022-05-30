module.exports = {
  /**
   * 配置本地开发代理，如果代理到不同的机器，可配置多个，在下面添加即可
   * 格式如下：
   * proxy: {
   *    '/xxx': {
   *      target: 'http://xxx.xxx.xxx:8080/' 代理的目标
   *      xxxx 其他设置
   *    }，
   * }
   */
  proxy: [
    {
      context: ['/admin/api'],
      // 直接和kcoco挂钩
      target: 'http://localhost:8090/api',
      changeOrigin: true,
      pathRewrite: {
        '^/admin/api': '',
      },
    },
    // mock服务（如果需要）
    // {
    //   context: ['/admin/mock'],
    //   target: 'http://localhost:8092/api',
    //   changeOrigin: true,
    //   pathRewrite: {
    //     '^/admin/api': '',
    //   },
    // },
  ],
  // antd 主题配置
  antdThemeConfig: {
    '@primary-color': '#4169E1', // 全局主色
    '@link-color': '#4169E1', // 链接色
    '@font-size-base': '12px',
  },

  // 外部资源地址(找了一圈网上免费cdn，资源都不稳定。这里用kcoco项目的静态资源来模仿cdn)
  resources: [
    '//localhost:8090/fakeCdn/babel-polyfill/6.26.0/polyfill.min.js',
    '//localhost:8090/fakeCdn/react/16.13.1/react.min.js',
    '//localhost:8090/fakeCdn/react-dom/16.13.1/react-dom.min.js',
    '//localhost:8090/fakeCdn/react-router/5.2.0/react-router.min.js',
    '//localhost:8090/fakeCdn/react-router-dom/5.2.0/react-router-dom.min.js',
    '//localhost:8090/fakeCdn/mobx/5.15.4/mobx.umd.min.js',
    '//localhost:8090/fakeCdn/mobx-react-lite/2.0.6/mobxreactlite.umd.production.min.js',
    '//localhost:8090/fakeCdn/mobx-react/6.2.2/mobxreact.umd.production.min.js',
    '//localhost:8090/fakeCdn/moment/2.24.0/moment.min.js',
    '//localhost:8090/fakeCdn/moment/2.24.0/zh-cn.js',
    '//localhost:8090/fakeCdn/antd/4.16.0/antd.min.js',
    '//localhost:8090/fakeCdn/lodash/4.17.11/lodash.min.js',
  ],

  // 测试环境deploy相关配置
  deployConfig: {
    serverIp: '',
    targetDir: '',
    localTarDir: '',
    tarDirName: '',
    user: 'deploy',
    pwd: '*',
  },
}
