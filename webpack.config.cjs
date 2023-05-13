"use strict";

const path = require('path');
module.exports = {
  mode: 'development',
  entry: { app: './src/App.jsx' },
  output: {
    filename: 'app.bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: 'babel-loader'
    }]
  }
};