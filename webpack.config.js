const path = require("path");
require("dotenv").config();
const Dotenv = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const getEnvFile = () => {
  const mode = process.env.NODE_ENV;
  switch (mode) {
    case "development":
      return ".env.dev";
    case "qa":
      return ".env.qa";
    case "staging":
      return ".env.stage";
    case "production":
      return ".env.prod";
    default:
      return ".env.local";
  }
};

module.exports = {
  mode: "development",
  entry: {
    main: path.resolve(__dirname, "./src/index.js"),
  },
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    assetModuleFilename: "[name][ext]",
  },
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    port: "3172",
    open: false,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.js&/,
        exclude: /node_module/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp|ico)$/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new Dotenv({
      path: `./${getEnvFile()}`, // load this now instead of the ones in '.env'
      safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
      allowEmptyValues: true, // allow empty variables (e.g. `FOO=`) (treat it as empty string, rather than missing)
      systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
      silent: false, // hide any errors
      defaults: false, // load '.env.defaults' as the default values if empty.
      prefix: "import.meta.env.", // reference your env variables as 'import.meta.env.ENV_VAR'.
    }),
    new HtmlWebpackPlugin({
      title: "Webpack Demo",
      filename: "index.html",
      inject: "body",
      template: "public/template.html",
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "src/assets", to: "assets" }],
    }),
    // new BundleAnalyzerPlugin(), // analytic bundle files
  ],
};
