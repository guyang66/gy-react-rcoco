const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin') // webpack4推荐使用terser，可以并行压缩
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const safeParser = require('postcss-safe-parser');
const webpack = require('webpack')

// const publickPath = '如果有cdn可以设置cdn路径，没有的话dev环境直接走dist/static，或者外部资源下载到本地，从本地引入';

const IS_DEV_ENV = process.env.NODE_ENV === 'development';
const IS_PRD_ENV = process.env.NODE_ENV === 'production';

module.exports = {
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
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
        },
      },
    },
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: true,
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
        },
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
    ],
  },
  devServer: {
    contentBase: './dist', // 设置服务器访问的基本目录
    compress: true,
    inline: true,
    hot: true, // 热替换，无需刷新整个页面，只需要更新改动的视图
    // host: 'localhost',
    host: '192.168.10.42',
    // host: '192.168.3.10',
    port: 3001,
    open: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // 配置要处理的文件格式，一般使用正则表达式匹配
        loader: 'babel-loader', // 使用的加载器名称
        exclude: /node_modules/,
      },
      // 使用extract-text-webpack-plugin 将样式提取，此组件并不支持热更新。只会重新打包但是并不会刷新页面,但是styleloader可以享受热更新
      {
        test: /\.styl$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'stylus-loader']
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
      // 图片不要超过244 kb 看看怎么优化
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
    ],
  },
  resolve: {
    alias: {
      ASSETS: path.resolve(__dirname, 'src/assets')
    },
    extensions: ['.js', '.jsx', '.json'],
  },
  externals: {
    antd: 'antd',
    moment: 'moment',
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].css',
      chunkFilename: '[name].chunk.css',
    }),
    new HtmlWebpackPlugin({
      template: IS_PRD_ENV ? './public/index.prd.html' : './public/index.html',
      filename: 'index.html',
      favicon: path.resolve('public/favicon.ico')
    }),
  ],
};

if (IS_PRD_ENV) {
  const cleanPlugin = new CleanWebpackPlugin([path.join(__dirname, 'dist')])
  module.exports.plugins = module.exports.plugins.concat(cleanPlugin)
} else {
  const HotModulePlugin = new webpack.HotModuleReplacementPlugin()
  module.exports.plugins = module.exports.plugins.concat(HotModulePlugin)
}

// 复制静态资源到打包目录dist
// function copyPublicFolder() {
//   fs.copySync('./cache', './dist', {
//     dereference: true,
//   });
// }
// copyPublicFolder()
