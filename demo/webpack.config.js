var path = require("path");

module.exports = {
  entry: {
    "app": "./js/index"
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
  }
};
