const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const postcssNormalize = require('postcss-normalize')
const {proxy, antdThemeConfig} = require('./config/config-default')
const rewireReactHotLoader = require('react-app-rewire-hot-loader')

const {
  override,
  addWebpackAlias,
  disableEsLint,
  addLessLoader,
  addDecoratorsLegacy,
  setWebpackPublicPath,
  overrideDevServer
} = require('customize-cra')

const devServerConfig = () => config => {
  return {
    ...config,
    compress: true,
    disableHostCheck: true,
    proxy,
  }
}

const stylus = () => config => {
  const mode = process.env.NODE_ENV === 'development' ? 'dev' : 'prod'
  const shouldUseSourceMap = false
  const stylusLoader = {
    test: /\.styl$/,
    include: [path.resolve(__dirname, 'src')],
    exclude: /node_modules/,
    sideEffects: true,
    use: [
      mode === 'prod' ? MiniCssExtractPlugin.loader : require.resolve('style-loader'),
      {
        loader: 'css-loader',
        options: {
          importLoaders: 2,
          sourceMap: shouldUseSourceMap,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          sourceMap: shouldUseSourceMap,
          plugin: () => [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
              autoprefixer: {
                flexbox: 'no-2009',
              },
              stage: 3,
            }),
            postcssNormalize(),
          ],
        },
      },
      {
        loader: 'resolve-url-loader',
        options: {
          sourceMap: shouldUseSourceMap,
        },
      },
      {
        loader: 'stylus-loader',
        options: {
          sourceMap: true,
        },
      }

    ]
  }

  const oneOf = config.module.rules.find(rule => rule.oneOf).oneOf
  oneOf.unshift(stylusLoader)
  return config
}

// 加了publicPath = /admin，生产环境不要直接访问http://{ip}:{port}，因为生产环境有nginx转了一下
const publicPath = process.env.NODE_ENV === 'production' ? '/admin/' : ''

module.exports = {
  webpack:override(
    // use mobx 需要下面两个配置
    addDecoratorsLegacy(),
    disableEsLint(),

    // 修改antd主题色as0123456@@

    addLessLoader({
      javascriptEnabled: true,
      modifyVars: antdThemeConfig
    }),
    setWebpackPublicPath(publicPath),
    addWebpackAlias({
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@common': path.resolve(__dirname, 'src/common'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@router': path.resolve(__dirname, 'src/router'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@utils': path.resolve(__dirname, 'src/common/utils'),
      '@helper': path.resolve(__dirname, 'src/helper')
    }),
    stylus(),
    (config, env) => {
      config = rewireReactHotLoader(config, env)
      return {
        externals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          antd: 'antd',
          mobx: 'mobx',
          'react-router': 'ReactRouter',
          'react-router-dom': 'ReactRouterDOM',
          'mobx-react': 'mobxReact',
          'mobx-react-lite': 'mobxReactLite',
          moment: 'moment',
          _: '_'
        },
        ...config,
      }
    }
  ),
  devServer: overrideDevServer(devServerConfig()),
}
