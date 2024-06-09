const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: {
    index: './js/index.js',
    meeting: './js/meeting.js'
  },
  output: {
    path: path.resolve(__dirname, 'static'),
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
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.BABEL_ENV': JSON.stringify('development'),
    })
  ],
  context: __dirname,
  target: 'web',
  mode: 'development',
  devServer: {
    allowedHosts: 'all', // Add this line
    host: '0.0.0.0', // Allow access from external IPs
    port: 9999, // Ensure this matches the port your app uses
    proxy: {
      '/meeting.html': {
        target: 'http://127.0.0.1:9998/',
        secure: false
      }
    }
  }
};
