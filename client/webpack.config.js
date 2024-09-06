'use strict'

const path = require('path')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    'home': './src/index.js',
    'create-wiki': './src/create-wiki.js',
    'wiki': './src/wiki.js',
    'register': './src/register.js',
    'login': './src/login.js',
    'edit-profile': './src/edit-profile.js',
    'search-results': './src/search-results.js',
    'history': './src/history.js',
    'view-profile': './src/view-profile.js',
    'view-historical-wiki': './src/view-historical-wiki.js'
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
        template: './src/wiki.html',
        filename: 'wiki.html',
        chunks: ['wiki']
      }),
      new HtmlWebpackPlugin({
        template: './src/register.html',
        filename: 'register.html',
        chunks: ['register']
      }),
      new HtmlWebpackPlugin({
        template: './src/login.html',
        filename: 'login.html',
        chunks: ['login']
      }),
      new HtmlWebpackPlugin({
        template: './src/edit-profile.html',
        filename: 'edit-profile.html',
        chunks: ['edit-profile']
      }),
      new HtmlWebpackPlugin({
        template: './src/search-results.html',
        filename: 'search-results.html',
        chunks: ['search-results']
      }),
      new HtmlWebpackPlugin({
        template: './src/history.html',
        filename: 'history.html',
        chunks: ['history']
      }),
      new HtmlWebpackPlugin({
        template: './src/view-profile.html',
        filename: 'view-profile.html',
        chunks: ['view-profile']
      }),
      new HtmlWebpackPlugin({
        template: './src/view-historical-wiki.html',
        filename: 'view-historical-wiki.html',
        chunks: ['view-historical-wiki']
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
      },
      {
        test: /\.(png|jpg|jpeg|svg)$/i,
        type: 'asset/resource'
      }
    ]
  }
}