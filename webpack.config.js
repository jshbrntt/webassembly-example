const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const path = require('path')
const process = require('process')

let config = {}

config.context = path.resolve(__dirname, 'src')

config.entry = {
  main: './main'
}

config.output = {
  path: path.resolve(__dirname, 'dist'),
  filename: `[name].bundle.js`,
  sourceMapFilename: `[name].bundle.js.map`
}

config.externals = {
  fs: true,
  path: true,
  window: 'window'
}

config.module = {
  rules: [
    {
      enforce: 'pre',
      exclude: /(node_modules|bower_components)/,
      test: /\.js$/,
      use: 'standard-loader'
    },
    {
      exclude: /(node_modules|bower_components)/,
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      }
    },
    {
      test: /\.rs$/,
      use: {
        loader: 'rust-wasm-loader',
        options: {
          path: ''
        }
      }
    }
  ]
}

config.devtool = 'source-map'

config.devServer = {
  contentBase: path.resolve(__dirname, 'dist'),
  host: '0.0.0.0',
  port: process.env.PORT || 80,
  stats: {
    colors: true,
    chunks: false
  },
  inline: true,
  mimeTypes: {
    'application/wasm': ['wasm']
  }
}

config.plugins = [
  new CleanWebpackPlugin([
    'dist',
    'target'
  ]),
  new HtmlWebpackPlugin({
    title: 'Webassembly Example',
    devServer: config.devServer,
    template: 'index.ejs'
  })
]

module.exports = config
