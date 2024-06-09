const webpack = require('webpack');
const fs = require('fs');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config.dev');

const args = process.argv.slice(2);
let https = false;
if (args.includes('--https')) https = true;

function runFunc(err) {
  if (err) {
    console.log(err);
  }
  console.log(`Listening at ${https ? 'https' : 'http'}://localhost:9999/index.html`);
}

const devServerOptions = {
  port: 9999,
  host: 'localhost', // Change '0.0.0.0' to 'localhost'
  open: true, // Use 'true' to open the default browser
  https: https ? {
    cert: fs.readFileSync('./localhost.crt'),
    key: fs.readFileSync('./localhost.key')
  } : false,
  headers: {
    'Cross-Origin-Resource-Policy': 'cross-origin',
    'Access-Control-Allow-Origin': '*'
  },
  historyApiFallback: true,
  client: {
    overlay: false,
  },
  proxy: {
    '/meeting.html': {
      target: 'http://localhost:9998/', // Update the target to use 'localhost'
      secure: false, // If using HTTPS, set this to 'true'
      changeOrigin: true,
    }
  },
  static: './',
  allowedHosts: 'all'
};

new WebpackDevServer(devServerOptions, webpack(webpackConfig)).start(9999, 'localhost', runFunc);

const proxyServerOptions = {
  port: 9998,
  host: 'localhost', // Change '0.0.0.0' to 'localhost'
  headers: {
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'cross-origin',
    'Access-Control-Allow-Origin': '*'
  },
  historyApiFallback: true,
  static: './',
  client: {
    overlay: false,
  },
};

new WebpackDevServer(proxyServerOptions, webpack(webpackConfig)).start(9998, 'localhost', runFunc);
