const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin");
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin') // webpack4推荐使用terser，可以并行压缩
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const fs = require('fs-extra')
const safeParser = require('postcss-safe-parser')

const publickPath = '如果有cdn可以设置cdn路径，没有的话dev环境直接走dist/static，或者外部资源下载到本地，从本地引入'

const IS_DEV_ENV = process.env.NODE_ENV ===  'development'
const IS_PRD_ENV = process.env.NODE_ENV ===  'production'

module.exports = {
  mode: process.env.NODE_ENV ===  'development' ?  'development' : 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'static/js/[name].[hash:8].js',
    chunkFilename: 'static/js/[name].chunk.js'
  },
  optimization: {
    // usedExports: true,
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/] || src\//,
          chunks: 'all',
          name: 'vendor',
          minSize: 0,
          minChunks: 2,
          enforce: true,
        }
      }
    },
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: true,
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessorOptions: {
          parser: safeParser,
          discardComments: {
            removeAll: true,
          },
        },
      }),
    ]
  },
  devServer: {
    contentBase: './dist', //设置服务器访问的基本目录
    host: 'localhost',
    port: 3001,
    open: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, //配置要处理的文件格式，一般使用正则表达式匹配
        loader: 'babel-loader', //使用的加载器名称
        exclude: /node_modules/,
      },
      // {
      //     test: /\.js$/,
      //     enforce: 'pre', //加载器的执行顺序，不设置为正常执行，pre（前）|post（后），eslint是检查代码规范，应该在编译前就执行
      //     loader: 'eslint-loader',
      // },
      {
        test: /\.styl$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'stylus-loader']
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'less-loader',
        ],
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: 'static/img/[name].[hash:8].[ext]',
            limit: 1024 * 10,
          },
        }],
      },
    ]
  },
  resolve: {
    alias: {
      ASSETS: path.resolve(__dirname, 'src/assets')
    },
    extensions: ['.js', '.jsx', '.json']
  },
  externals: {
    antd: 'antd',
    moment: 'moment',
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].css',
      chunkFilename: '[name].chunk.css',
    }),
    new HtmlWebpackPlugin({
      template: IS_PRD_ENV ? './public/index.prd.html' : './public/index.html',
      filename: "index.html",
      favicon: path.resolve('public/favicon.ico')
    }),
  ]
}

if (IS_PRD_ENV) {
  const cleanPlugin = new CleanWebpackPlugin([path.join(__dirname, 'dist')])
  module.exports.plugins = module.exports.plugins.concat(cleanPlugin)
}

// 复制静态资源到打包目录dist
// function copyPublicFolder() {
//   fs.copySync('./cache', './dist', {
//     dereference: true,
//   });
// }
// copyPublicFolder()
