const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { DEV, DEBUG } = process.env;

process.env.BABEL_ENV = DEV ? 'development' : 'production';
process.env.NODE_ENV = DEV ? 'development' : 'production';

module.exports = {
    entry: './src/index.tsx',
    output: {
        path: path.join(__dirname, '/public'),
        filename: 'bundle.js'
    },
    devServer: {
        port: 8080
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
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
            path: false,
            fs: false,
        }
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: path.join(__dirname,'/public/index.html')
        }) 
    ]
}