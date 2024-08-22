'use strict'

const path = require('path')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    'home': './src/index.js',
    'create-wiki': './src/create-wiki.js',
    'view-wiki': './src/view-wiki.js'
  },
  output: {
    filename: '[name]/output.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 8080,
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({ 
        template: './src/index.html',
        filename: 'index.html',
        chunks: ['home']
      }),
      new HtmlWebpackPlugin({
        template: './src/create-wiki.html',
        filename: 'create-wiki.html',
        chunks: ['create-wiki']
      }),
      new HtmlWebpackPlugin({
        template: './src/view-wiki.html',
        filename: 'view-wiki.html',
        chunks: ['view-wiki']
      })
  ],
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [
          {
            // Adds CSS to the DOM by injecting a `<style>` tag
            loader: 'style-loader'
          },
          {
            // Interprets `@import` and `url()` like `import/require()` and will resolve them
            loader: 'css-loader'
          },
          {
            // Loader for webpack to process CSS with PostCSS
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  autoprefixer
                ]
              }
            }
          },
          {
            // Loads a SASS/SCSS file and compiles it to CSS
            loader: 'sass-loader'
          }
        ]
      }
    ]
  }
}