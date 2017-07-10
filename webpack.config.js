var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
process.traceDeprecation = true;



module.exports = {
    // 入口文件
    entry: './src/main.js',
    output: {
        // 打包后输出的目录
        path: path.resolve(__dirname, 'dist'),
        // 打包后资源文件的前缀
        publicPath: '/dist/',
        filename: 'build.js'
    },
    resolve: {
        alias: {
          'vue': 'vue/dist/vue.js'
        }
    },
    // 处理不同后缀的文件
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.(png|jpg|jpeg|gif)$/,
            loader: 'file-loader?name=assets/[name].[hash:8].[ext]'
        },{
            test: /\.(eot|woff|ttf|gif|svg)$/,
            loader: 'file-loader?name=assets/fonts/[name].[ext]'
        }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: './src/assets',
                to: './copy'
            }
        ]),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
          })
    ],
    // webpack-dev-server配置
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    performance: {
        hints: false
    },
    // 开启source-map，webpack有多种source-map，在官网文档可以查到
    devtool: '#eval-source-map'
}

// 生产环境，运行npm run build则执行这里
if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        // 环境变量
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        // 压缩代码
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
          minimize: true
        })
    ])
}