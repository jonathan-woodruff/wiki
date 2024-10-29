'use strict'

const path = require('path')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development', //'production', //'development',
  externals: {
    stripe: 'stripe',
  },
  entry: {
    'home': './src/pages/index.js',
    'create-wiki': './src/pages/create-wiki.js',
    'wiki': './src/pages/wiki.js',
    'register': './src/pages/register.js',
    'login': './src/pages/login.js',
    'edit-profile': './src/pages/edit-profile.js',
    'search-results': './src/pages/search-results.js',
    'history': './src/pages/history.js',
    'view-profile': './src/pages/view-profile.js',
    'view-historical-wiki': './src/pages/view-historical-wiki.js',
    'community': './src/pages/community.js',
    'buy-me-a-beer': './src/pages/buy-me-a-beer.js',
    'beer-pay': './src/pages/beer-pay.js',
    'beer-complete': './src/pages/beer-complete.js',
    'change-password': './src/pages/change-password.js',
    'change-email': './src/pages/change-email.js',
    'password-reset-start': './src/pages/password-reset-start.js',
    'password-reset': './src/pages/password-reset.js',
    'success': './src/pages/success.js',
    'create-profile': './src/pages/create-profile.js',
    'email-reset': './src/pages/email-reset.js',
    'fail': './src/pages/fail.js',
    'my-wikis': './src/pages/my-wikis.js'
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
        template: './src/pages/index.html',
        filename: 'index.html',
        chunks: ['home'],
        favicon: './public/favicon.ico'
      }),
      new HtmlWebpackPlugin({
        template: './src/pages/create-wiki.html',
        filename: 'create-wiki.html',
        chunks: ['create-wiki'],
        favicon: './public/favicon.ico'
      }),
      new HtmlWebpackPlugin({
        template: './src/pages/wiki.html',
        filename: 'wiki.html',
        chunks: ['wiki'],
        favicon: './public/favicon.ico'
      }),
      new HtmlWebpackPlugin({
        template: './src/pages/register.html',
        filename: 'register.html',
        chunks: ['register'],
        favicon: './public/favicon.ico'
      }),
      new HtmlWebpackPlugin({
        template: './src/pages/login.html',
        filename: 'login.html',
        chunks: ['login'],
        favicon: './public/favicon.ico'
      }),
      new HtmlWebpackPlugin({
        template: './src/pages/edit-profile.html',
        filename: 'edit-profile.html',
        chunks: ['edit-profile'],
        favicon: './public/favicon.ico'
      }),
      new HtmlWebpackPlugin({
        template: './src/pages/search-results.html',
        filename: 'search-results.html',
        chunks: ['search-results'],
        favicon: './public/favicon.ico'
      }),
      new HtmlWebpackPlugin({
        template: './src/pages/history.html',
        filename: 'history.html',
        chunks: ['history'],
        favicon: './public/favicon.ico'
      }),
      new HtmlWebpackPlugin({
        template: './src/pages/view-profile.html',
        filename: 'view-profile.html',
        chunks: ['view-profile'],
        favicon: './public/favicon.ico'
      }),
      new HtmlWebpackPlugin({
        template: './src/pages/view-historical-wiki.html',
        filename: 'view-historical-wiki.html',
        chunks: ['view-historical-wiki'],
        favicon: './public/favicon.ico'
      }),
      new HtmlWebpackPlugin({
        template: './src/pages/community.html',
        filename: 'community.html',
        chunks: ['community'],
        favicon: './public/favicon.ico'
      }),
      new HtmlWebpackPlugin({
        template: './src/pages/buy-me-a-beer.html',
        filename: 'buy-me-a-beer.html',
        chunks: ['buy-me-a-beer'],
        favicon: './public/favicon.ico'
      }),
      new HtmlWebpackPlugin({
        template: './src/pages/beer-pay.html',
        filename: 'beer-pay.html',
        chunks: ['beer-pay'],
        favicon: './public/favicon.ico'
      }),
      new HtmlWebpackPlugin({
        template: './src/pages/beer-complete.html',
        filename: 'beer-complete.html',
        chunks: ['beer-complete'],
        favicon: './public/favicon.ico'
      }),
      new HtmlWebpackPlugin({
        template: './src/pages/change-password.html',
        filename: 'change-password.html',
        chunks: ['change-password'],
        favicon: './public/favicon.ico'
      }),
      new HtmlWebpackPlugin({
        template: './src/pages/change-email.html',
        filename: 'change-email.html',
        chunks: ['change-email'],
        favicon: './public/favicon.ico'
      }),
      new HtmlWebpackPlugin({
        template: './src/pages/password-reset-start.html',
        filename: 'password-reset-start.html',
        chunks: ['password-reset-start'],
        favicon: './public/favicon.ico'
      }),
      new HtmlWebpackPlugin({
        template: './src/pages/password-reset.html',
        filename: 'password-reset.html',
        chunks: ['password-reset'],
        favicon: './public/favicon.ico'
      }),
      new HtmlWebpackPlugin({
        template: './src/pages/success.html',
        filename: 'success.html',
        chunks: ['success'],
        favicon: './public/favicon.ico'
      }),
      new HtmlWebpackPlugin({
        template: './src/pages/create-profile.html',
        filename: 'create-profile.html',
        chunks: ['create-profile'],
        favicon: './public/favicon.ico'
      }),
      new HtmlWebpackPlugin({
        template: './src/pages/email-reset.html',
        filename: 'email-reset.html',
        chunks: ['email-reset'],
        favicon: './public/favicon.ico'
      }),
      new HtmlWebpackPlugin({
        template: './src/pages/fail.html',
        filename: 'fail.html',
        chunks: ['fail'],
        favicon: './public/favicon.ico'
      }),
      new HtmlWebpackPlugin({
        template: './src/pages/my-wikis.html',
        filename: 'my-wikis.html',
        chunks: ['my-wikis'],
        favicon: './public/favicon.ico'
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