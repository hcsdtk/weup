const path = require('path');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');

module.exports = {
  entry: {
    index: path.resolve(__dirname, './src/index.js')
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'lib')
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
};