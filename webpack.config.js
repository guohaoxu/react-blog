module.exports = {
  entry: [
    './index.js'
  ],
  output: {
    path: __dirname + '/public/javascripts',
    publicPath: '/static/javascripts',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  }
}
