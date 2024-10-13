'use strict'

const path = require('path')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  externals: {
    stripe: 'stripe',
  },
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
    'view-historical-wiki': './src/view-historical-wiki.js',
    'community': './src/community.js',
    'buy-me-a-beer': './src/buy-me-a-beer.js',
    'beer-pay': './src/beer-pay.js',
    'beer-complete': './src/beer-complete.js',
    'change-password': './src/change-password.js',
    'change-email': './src/change-email.js',
    'password-reset-start': './src/password-reset-start.js',
    'password-reset': './src/password-reset.js',
    'success': './src/success.js',
    'create-profile': './src/create-profile.js',
    'email-reset': './src/email-reset.js'
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
      }),
      new HtmlWebpackPlugin({
        template: './src/community.html',
        filename: 'community.html',
        chunks: ['community']
      }),
      new HtmlWebpackPlugin({
        template: './src/buy-me-a-beer.html',
        filename: 'buy-me-a-beer.html',
        chunks: ['buy-me-a-beer']
      }),
      new HtmlWebpackPlugin({
        template: './src/beer-pay.html',
        filename: 'beer-pay.html',
        chunks: ['beer-pay']
      }),
      new HtmlWebpackPlugin({
        template: './src/beer-complete.html',
        filename: 'beer-complete.html',
        chunks: ['beer-complete']
      }),
      new HtmlWebpackPlugin({
        template: './src/change-password.html',
        filename: 'change-password.html',
        chunks: ['change-password']
      }),
      new HtmlWebpackPlugin({
        template: './src/change-email.html',
        filename: 'change-email.html',
        chunks: ['change-email']
      }),
      new HtmlWebpackPlugin({
        template: './src/password-reset-start.html',
        filename: 'password-reset-start.html',
        chunks: ['password-reset-start']
      }),
      new HtmlWebpackPlugin({
        template: './src/password-reset.html',
        filename: 'password-reset.html',
        chunks: ['password-reset']
      }),
      new HtmlWebpackPlugin({
        template: './src/success.html',
        filename: 'success.html',
        chunks: ['success']
      }),
      new HtmlWebpackPlugin({
        template: './src/create-profile.html',
        filename: 'create-profile.html',
        chunks: ['create-profile']
      }),
      new HtmlWebpackPlugin({
        template: './src/email-reset.html',
        filename: 'email-reset.html',
        chunks: ['email-reset']
      })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader','css-loader']
      },
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