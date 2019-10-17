const path = require("path");
const merge = require("webpack-merge");
const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// const dotenv = require('dotenv').config();
// console.log(dotenv.parsed);
const buildPath = path.join(__dirname, "build");

const baseConfig = {
  mode: process.env.BUILD_ENV || "development",
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: require.resolve("babel-loader")
      }
    ]
  },
  resolve: {
    alias: {
      svelte: path.resolve("node_modules", "svelte")
    },
    extensions: [".ts", ".js", ".svelte"]
  },
  plugins: [new Dotenv()]
};

const appConfig = merge(baseConfig, {
  entry: path.join(__dirname, "game/index.ts"),
  output: {
    filename: "game.js",
    path: buildPath
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: "svelte-loader",
          options: {
            emitCss: true,
            hotReload: false
          }
        }
      },
      {
        test: /\.s?css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader"
          },
          {
            loader: "postcss-loader"
          }
        ]
      },
      { test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/, loader: "file-loader" }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "game/index.ejs")
    }),
    new CopyPlugin([
      {
        from: path.join(__dirname, "game/assets"),
        to: path.resolve(__dirname, "build/assets")
      }
    ]),
    new MiniCssExtractPlugin({
      filename: "./styles.css"
    })
  ],
  target: "electron-renderer"
});

const mainConfig = merge(baseConfig, {
  entry: path.join(__dirname, "./main.ts"),
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "build")
  },
  node: {
    __dirname: false,
    __filename: false
  },
  target: "electron-main"
});

module.exports = [mainConfig, appConfig];
