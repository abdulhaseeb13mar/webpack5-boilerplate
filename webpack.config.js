const path = require("path");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");

let mode = "development";

const plugins = [
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin(),
  new HtmlWebpackPlugin({
    template: "./public/index.html",
  }),
  new webpack.ProvidePlugin({
    Buffer: ["buffer", "Buffer"],
  }),
  new webpack.ProvidePlugin({
    process: "process/browser.js",
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

  entry: {
    main: "src/index",
    background: "./src/background.ts",
    content: "./src/content.js",
    page: "./src/page.ts",
    notification: "./src/notification.js",
  },

  output: {
    filename: "[name].js",
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
        test: /\.(png|jpe?g|gif|svg|webp|woff2)$/i,
        type: "asset",
      },
      {
        test: /\.(j|t)sx?$/,
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

  optimization: {
    runtimeChunk: "single",
  },

  resolve: {
    fallback: {
      http: require.resolve("stream-http"),
      crypto: require.resolve("crypto-browserify"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify"),
      buffer: require.resolve("buffer"),
      stream: require.resolve("stream-browserify"),
    },
    preferRelative: true,
    alias: {
      abis: path.resolve(__dirname, "src/abis"),
      assets: path.resolve(__dirname, "src/assets/"),
      "background-related": path.resolve(__dirname, "src/background-related/"),
      components: path.resolve(__dirname, "src/components/"),
      hooks: path.resolve(__dirname, "src/hooks/"),
      interfaces: path.resolve(__dirname, "src/interfaces/"),
      popup: path.resolve(__dirname, "src/popup/"),
      "@redux": path.resolve(__dirname, "src/redux/"),
      routes: path.resolve(__dirname, "src/routes/"),
      scripts: path.resolve(__dirname, "src/scripts/"),
      theme: path.resolve(__dirname, "src/theme/"),
      utils: path.resolve(__dirname, "src/utils/"),
      api: path.resolve(__dirname, "src/api.ts"),
      "window-provider": path.resolve(__dirname, "src/window-provider/"),
      "@slices": path.resolve(__dirname, "src/redux/slices/"),
      "provider-bridge-shared": path.resolve(
        __dirname,
        "src/provider-bridge-shared/"
      ),
      "@constants": path.resolve(__dirname, "src/constants/"),
      "@styled": path.resolve(__dirname, "src/components/styled/"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },

  devtool: "source-map",

  devServer: {
    hot: true, // not necessary in the latest version of webpack by default true
  },
};
