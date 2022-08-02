module.exports = {
  presets: [
    "@babel/preset-env",
    ["@babel/preset-react", { runtime: "automatic" }],
    // [
    //   "babel-preset-react-app",
    //   {
    //     flow: false,
    //     typescript: true,
    //     runtime: "automatic",
    //     polyfill: false,
    //   },
    // ],
    "@babel/preset-typescript",
  ],
  // plugins: ["react-refresh/babel"],
};
