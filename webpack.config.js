const path = require('path');

module.exports = {
  entry: [
    './index.js'
  ],
  output: {
    filename: 'bundle.js',
    path: '/'
  },
  module: {
    rules: [{
      test: /\.js/,
      loaders: ['babel-loader'],
    },{
      test: /\.css/,
      loaders: ['style-loader', 'css-loader'],
    }]
  }
}