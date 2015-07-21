var path = require("path"),
    webpack = require("webpack");

module.exports = {
  entry: {
    "common": [],
    "app": "./js/index",
    "starfleet": "./js/starfleet/index",
    "captainsLog": "./js/captainsLog/index"
  },
  output: {
    path: "./dist",
    filename: "[name].js"
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: "babel-loader"
    }]
  },
  plugins: [new webpack.optimize.CommonsChunkPlugin({
    name: "common",
    minChunks: 2
  })]
};
