const path = require("path");
const webpack = require("webpack");
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
  entry: "./src/index.tsx",
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

  resolve: {
    fallback: {
      http: require.resolve("stream-http"),
      crypto: require.resolve("crypto-browserify"),
      https: require.resolve("https-browserify"),
      // os: require.resolve("os-browserify"),
      // buffer: require.resolve("buffer"),
      stream: require.resolve("stream-browserify"),
      // asn1js: require.resolve("asn1.js"),
      // vm: require.resolve("vm-browserify"),
    },
    alias: {
      abis: path.resolve(__dirname, "src/abis"),
      assets: path.resolve(__dirname, "src/assets/"),
      components: path.resolve(__dirname, "src/components/"),
      hooks: path.resolve(__dirname, "src/hooks/"),
      popup: path.resolve(__dirname, "src/popup/"),
      routes: path.resolve(__dirname, "src/routes/"),
      scripts: path.resolve(__dirname, "src/scripts/"),
      theme: path.resolve(__dirname, "src/theme/"),
      utils: path.resolve(__dirname, "src/utils/"),
      api: path.resolve(__dirname, "src/api.ts"),
      interfaces: path.resolve(__dirname, "src/interfaces/"),
      "@redux": path.resolve(__dirname, "src/redux/"),
      "@slices": path.resolve(__dirname, "src/redux/slices/"),
      "@constants": path.resolve(__dirname, "src/constants/"),
      "@styled": path.resolve(__dirname, "src/components/styled/"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },

  devtool: "source-map",
  devServer: {
    port: 3001,
    hot: true, // not necessary in the latest version of webpack by default true
  },
};
