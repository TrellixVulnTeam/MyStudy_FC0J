const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractionPlugin = require('mini-css-extract-plugin');
const  webpack = require('webpack');
const isProduction = process.env.NODE_ENV === 'PRODUCTION';


module.exports  = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].js'
    },
    module: {
        rules: [
            {
                test: /\.s?css$/i,
                oneOf: [
                    {
                        test: /\.module\.s?css$/,
                        use: [
                            {
                                loader: MiniCssExtractionPlugin.loader
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    modules: true
                                }
                            },
                            'sass-loader'
                        ],
                    }, {
                        use: [
                            MiniCssExtractionPlugin.loader,
                            'css-loader',
                            'sass-loader'
                        ]
                    },
                ]
            },{
                test: /\.hbs$/,
                use: ['handlebars-loader']
            },{
                test: /\.(png|jpe?g|gif)$/i,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name() {
                            if (!isProduction){
                                return '[path][name].[ext]';
                            }
                            return '[contenthash].[ext]'
                        },
                        publicPath: 'assets/',
                        outputPath: 'assets/'
                    }
                }]
            }, {
                test: /\.svg$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192
                    }
                }]
            }
        ]
    },
    plugins: [
        new MiniCssExtractionPlugin({
            filename: '[contenthash].css'
        }),
      
        new HtmlWebpackPlugin({
            title: 'Webpack',
            template: './template.hbs',
            meta: {
                viewport: 'width=device-width, initial-scale=1.0'
            },
            minify: isProduction ? {
                collapseWhitespace: true,
                useShortDoctype: true,
                removeScriptTypeAttributes: true
            } : false
        }),
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            IS_PRODUCTION: isProduction
        })
    ],  
}