'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    context: path.resolve(__dirname),
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        hot: true,
        open: true,
        port: 3001
    },
    entry: {
        main: './src/main.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
        publicPath: '/'
    },
    module: {
        rules: []
    },
    resolve: {
        alias: {
            VirtualDOM: path.resolve(__dirname, '..')
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            favicon: './public/favicon.ico',
            template: './public/index.html'
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};