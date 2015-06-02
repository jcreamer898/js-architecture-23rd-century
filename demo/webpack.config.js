var path = require("path");

module.exports = {
  entry: {
    "main": "index"
  },
  context: path.join(__dirname, "js"),
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js"
  },
  resolve: {
    root: [path.join(__dirname, "js")],
    extensions: [".js"]
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: "babel-loader"
    }]
  }
};
