var path = require("path");
var webpack = require("webpack");
var CleanWebpackPlugin = require("clean-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    app: ["babel-polyfill", path.resolve(__dirname, "src/main.js")]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "./",
    filename: "js/bundle.js"
  },
  plugins: [
    definePlugin,
    new CleanWebpackPlugin(["build"]),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new HtmlWebpackPlugin({
      filename: "index.html", // path.resolve(__dirname, 'build', 'index.html'),
      template: "./src/index.html",
      chunks: ["vendor", "app"],
      chunksSortMode: "manual",
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        html5: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
        removeComments: true,
        removeEmptyAttributes: true
      },
      hash: true
    }),
    new CopyWebpackPlugin([{from: "assets", to: "assets"}])
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader"],
        include: path.join(__dirname, "src")
      },
      {test: /phaser-split\.js$/, use: "raw-loader"},
      {test: [/\.vert$/, /\.frag$/], use: "raw-loader"}
    ]
  },
  optimization: {
    minimize: true
  }
};
