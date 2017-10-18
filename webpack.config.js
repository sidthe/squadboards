const webpack = require('webpack');

module.exports = {
  entry: "./client.js",
  output: {
    filename: "public/bundle.js"
  },
  module: {
    loaders: [
      {
        exclude: /(node_modules|server.js)/,
        loader: "babel-loader",
        query: {
            presets: ['react', 'es2015']
        }
      }
    ]
  },
  plugins:[
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
};
