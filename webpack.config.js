var webpack = require('webpack')
module.exports = {
  entry: [
    './index.js'
  ],
  output: {
    path: __dirname + '/public/javascripts',
    publicPath: '/public/javascripts', //webpack-dev-server bnudle path
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: require.resolve('jquery'),
        loader: 'expose?$!expose?jQuery'
      }
    ]
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    //   output: {
    //     comments: false,
    //   },
    //   compress: {
    //     warnings: false
    //   }
    // }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
}
