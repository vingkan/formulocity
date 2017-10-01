const fs = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const WebpackOnBuildPlugin = require('on-build-webpack')
const packageJson = require('./package.json')

module.exports = {
  entry: './src/index.js',
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: packageJson.name,
      template: './src/index.html'
    }),
    new WebpackOnBuildPlugin(stats => {
      const unlinked = []
      fs.readdir(path.resolve('dist'), (err, files) => {
        files.forEach(file => {
          if (!stats.compilation.assets[file]) {
            fs.unlink(path.join('dist', file), () => {})
            unlinked.push(file)
          }
        })
        if (unlinked.length > 0) {
          console.log('Removed old assets:', unlinked)
        }
      })
    })
  ],
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: { presets: [ 'env' ] }
      }
    }, {
      test: /\.css$/,
      exclude: /node_modules/,
      use: [ 'style-loader', 'css-loader' ]
    }]
  }
}
