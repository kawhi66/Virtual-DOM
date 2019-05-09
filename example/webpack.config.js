'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const generateHtmlWebpackPluginOption = chunk => {
    return {
        chunks: [chunk],
        favicon: './public/favicon.ico',
        filename: `${chunk}.html`,
        template: './public/index.html'
    }
};

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
        index: './src/index.js',
        case1: './src/case-1.js',
        case2: './src/case-2.js',
        case3: './src/case-3.js',
        case4: './src/case-4.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
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
        new HtmlWebpackPlugin(generateHtmlWebpackPluginOption("index")),
        new HtmlWebpackPlugin(generateHtmlWebpackPluginOption("case1")),
        new HtmlWebpackPlugin(generateHtmlWebpackPluginOption("case2")),
        new HtmlWebpackPlugin(generateHtmlWebpackPluginOption("case3")),
        new HtmlWebpackPlugin(generateHtmlWebpackPluginOption("case4")),
        new webpack.HotModuleReplacementPlugin()
    ]
};