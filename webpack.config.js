const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

const { DEV, DEBUG } = process.env;

process.env.BABEL_ENV = DEV ? 'development' : 'production';
process.env.NODE_ENV = DEV ? 'development' : 'production';

module.exports = {
    entry: './src/index.tsx',
    output: {
        path: path.join(__dirname, '/public'),
        filename: 'bundle.js'
    },
    // devServer: {
    //     port: 8080,
    //     client: {
    //       logging: 'error',
    //       progress: true,
    //       overlay: true,
    //       webSocketURL: {
    //         hostname: 'dev.joystreamstats.live',
    //         pathname: '/ws',
    //         port: 443,
    //         protocol: 'wss'
    //       }
    //     }
    // },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                type: 'javascript/auto',
            },
            {
                test: /\.tsx?$/,
                use: [
                  {
                    loader: 'ts-loader',
                    options: {
                      transpileOnly: true,
                    },
                  },
                ],
                exclude: [/node_modules/],
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ],
            },
            {
                test: /\.(png|jpg|gif|woff|woff2|eot|ttf|otf|svg)$/,
                exclude: /node_modules/,
                use: ['file-loader'],
            },
            {
                test: /\.md$/,
                use: 'raw-loader',
            },
            {
              test: /\.(less)$/,
              exclude: /\.module\.less$/,
              use: [
                {
                  loader: 'css-loader',
                  options: {
                    importLoaders: 2,
                    sourceMap: !!DEV,
                  },
                },
                {
                  loader: 'less-loader',
                  options: {
                    sourceMap: !!DEV,
                  },
                },
              ],
            },
            {
              test: /\.(sass|scss)$/,
              use: [
                {
                  loader: 'css-loader',
                  options: {
                    importLoaders: 2,
                    sourceMap: !!DEV,
                  },
                },
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: !!DEV,
                  },
                },
              ],
            },
        ]
    },
    resolve: {
        modules: ['node_modules'],
        extensions: [ '.tsx', '.ts', '.js', '.jsx'],
        fallback: {
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
            path: require.resolve("path-browserify"),
            fs: false,
        },
        plugins: [ new TsconfigPathsPlugin({ configFile: "./tsconfig.json" }) ]
      },
    plugins:[
      new HtmlWebpackPlugin({
        inject: false,
        template: path.resolve(__dirname, "public/index.html"),
      }),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser.js',
        "React": "react",
      }),
      new NodePolyfillPlugin()
    ]
}