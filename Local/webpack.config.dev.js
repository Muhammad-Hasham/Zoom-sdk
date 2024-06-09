const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: {
    index: './js/index.js',
    meeting: './js/meeting.js'
  },
  output: {
    path: path.resolve(__dirname, 'static'), // Changed to resolve to an absolute path
    publicPath: '/static/',
    hashDigestLength: 5,
    filename: '[name].min.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(jpg|png|svg)$/,
        type: 'asset'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new webpack.ProvidePlugin({
      _: 'lodash' 
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.BABEL_ENV': JSON.stringify('production'),
    })
  ],
  context: __dirname,
  target: 'web',
  mode: 'production',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 9999,
    allowedHosts: 'all',
    disableHostCheck: true, // Add this line if needed
  }
};
