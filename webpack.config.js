const path = require("path");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

let mode = "development";

const plugins = [
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin(),
  new HtmlWebpackPlugin({
    template: "./public/index.html",
  }),
];

if (process.env.NODE_ENV === "production") {
  mode = "production";
}

if (process.env.FAST_REFRESH) {
  plugins.push(new ReactRefreshWebpackPlugin());
}

module.exports = {
  mode,
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "images/[hash][ext][query]",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader, options: { publicPath: "" } },
          "css-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset",
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: [
              process.env.FAST_REFRESH &&
                require.resolve("react-refresh/babel"),
            ].filter(Boolean),
          },
        },
      },
    ],
  },
  plugins,

  resolve: {
    extensions: [".js", ".jsx"],
  },

  devtool: "source-map",
  devServer: {
    hot: true, // not necessary in the latest version of webpack by default true
  },
};
