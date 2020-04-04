const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const path = require('path')
const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
  mode: devMode ? 'development' : 'production',
  entry: devMode ? ['webpack-hot-middleware/client?reload=true', './src/index.js'] : './src/index.js',
  optimization: {
    minimizer: devMode ? undefined : [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
  },
  output: {
    filename: devMode ? '[name].js' : '[chunkhash].[name].js'
  },
  devServer: devMode
    ? {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
      }
    : undefined,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development'
            }
          },
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
    }),
    ...(devMode ? [new webpack.HotModuleReplacementPlugin()] : [])
  ]
}
