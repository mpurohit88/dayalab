import 'babel-polyfill'
import webpack      from 'webpack'
import path         from 'path'
import merge        from 'webpack-merge'
import autoprefixer from 'autoprefixer'
import development  from './dev.config.babel'
import production   from './prod.config.babel'
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin'; 

const TARGET = process.env.npm_lifecycle_event

const PATHS = {
  app: path.join(__dirname, '../src')
}

process.env.BABEL_ENV = TARGET

const common = {
  entry: [
    'babel-polyfill',
    './src/webpack-public-path',
    'react-hot-loader/patch',
    'webpack-hot-middleware/client?reload=true',
    path.resolve(PATHS.app, 'index.js')
  ],

  resolve: {
    extensions: ['.jsx', '.js', '.json', '.scss'], /* Enables devs to leave off extension when importing */
    modules: ['node_modules', PATHS.app] /* Tell Wepback what directories to search when resolving modules */
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/,
        loader: 'file-loader'
      }
    ]
  },
  
  devServer: {
    historyApiFallback: true,
  },

  plugins: [
    // new HardSourceWebpackPlugin(),
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname,
        postcss: [
          autoprefixer()
        ]
      }
    })
  ],
  node: {
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  }

}

if (TARGET === 'start' || !TARGET) {
  module.exports = merge(development, common)
}

if (TARGET === 'build' || !TARGET) {
  module.exports = merge(production, common)
}
