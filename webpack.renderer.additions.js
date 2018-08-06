module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/react'],
          plugins: ['@babel/plugin-proposal-class-properties']
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
}
