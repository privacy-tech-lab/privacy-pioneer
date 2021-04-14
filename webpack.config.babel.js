import HtmlWebpackPlugin from "html-webpack-plugin"
import TerserPlugin from "terser-webpack-plugin"
import CopyPlugin from "copy-webpack-plugin"
import { resolve as _resolve } from "path"

const bundleFrontendScripts = (env, argv) => {
  const isDev = argv.mode === "development"
  return {
    name: "frontend",
    stats: "errors-warnings",
    entry: {
      popup: "./src/popup/index.js",
      options: "./src/options/index.js",
    },
    output: {
      filename: "bundle.[name].js",
      path: _resolve(__dirname, isDev ? "dev" : "dist"),
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "popup.html",
        template: "./src/popup/index.html",
        chunks: ["popup"],
      }),
      new HtmlWebpackPlugin({
        filename: "options.html",
        template: "./src/options/index.html",
        chunks: ["options"],
      }),
    ],
    resolve: {
      modules: [__dirname, "src", "node_modules"],
      extensions: ["*", ".js", ".jsx", ".tsx", ".ts"],
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: require.resolve("babel-loader"),
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: ["file-loader"],
        },
      ],
    },
    devServer: {
      hot: true,
      contentBase: false,
      writeToDisk: true,
      disableHostCheck: true,
      stats: "errors-only",
      port: 8000,
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    },
  }
}

const bundleBackgroundScripts = (env, argv) => {
  const isDev = argv.mode === "development"
  return {
    name: "background",
    cache: false,
    stats: "errors-warnings",
    devtool: isDev ? "eval-source-map" : "source-map",
    entry: { background: "./src/background/background.js" },
    resolve: {
      modules: [__dirname, "src", "node_modules"],
      extensions: ["*", ".js", ".jsx", ".tsx", ".ts"],
    },
    output: {
      filename: "bundle.[name].js",
      path: _resolve(__dirname, isDev ? "dev" : "dist"),
    },
    plugins: [
      new CopyPlugin({
        patterns: [{ context: _resolve(__dirname, "src"), from: "assets", to: "assets" }],
      }),
      new CopyPlugin({
        patterns: [{ context: _resolve(__dirname, "src"), from: "manifest.json" }],
      }),
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    },
  }
}

module.exports = [bundleFrontendScripts, bundleBackgroundScripts]
