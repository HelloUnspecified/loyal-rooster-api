// const webpack = require('webpack');
const path = require('path');
// const SentryCliPlugin = require('@sentry/webpack-plugin');

module.exports = {
  target: 'webworker',
  entry: './src/index.js',
  resolve: {
    alias: {
      fs: path.resolve(__dirname, './null.js'),
    },
  },
  mode: 'production',
  optimization: {
    usedExports: true,
  },
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: 'dist',
    filename: 'worker.js',
    sourceMapFilename: 'worker.js.map',
  },

  // plugins: [
  //   new webpack.DefinePlugin({
  //     'process.env.RAVEN_DSN': JSON.stringify(process.env.RAVEN_DSN),
  //   }),
  //   new SentryCliPlugin({
  //     include: './dist',
  //     ignore: ['node_modules', 'webpack.config.js'],
  //     release: process.env.RELEASE,
  //   }),
  // ],
};
