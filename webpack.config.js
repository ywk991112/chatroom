const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

var inProduction = (process.env.NODE_ENV === 'production');

module.exports = {
  entry: './src/index.js',

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      }, 
      {
        test: /\.s[ac]ss$/, 
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['sass-loader', 'css-loader'],
        })
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  
  plugins: [
    new ExtractTextPlugin('style.css'), // style.css ?
    new webpack.LoaderOptionsPlugin({
      minimize: inProduction,
    })
  ],
};

if(inProduction) {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin()
  );
}

