const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const path = require('path');
const deps = require('./package.json').dependencies;

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const LoadablePlugin = require('@loadable/webpack-plugin');
const { BundleStatsWebpackPlugin } = require('bundle-stats-webpack-plugin');

const defaultWebpackSplit = {
  chunks: 'all',
  minSize: 50000,
  minRemainingSize: 0,
  minChunks: 1,
  // maxAsyncRequests: 30,
  // maxInitialRequests: 30,
  enforceSizeThreshold: 50000,
  cacheGroups: {
      'vendor-core-components': {
        // test: /[\\/]node_modules[\\/](@mui\/material)[\\/]/,
        test: (te, teee) =>{
          if(te.resource?.includes('date-fns')){
            
            // console.log('31', te?.rawRequest)
            // console.log('🚀 ~ file: webpack.config.js:24 ~ te.resource', te.resource)

            return true
          }
          // if(te.resource?.includes('@mui') && te?.canBeInitial && te.canBeInitial()){

          //   console.log(te.resource)

          //   return true
          // }

          return false
          

          // return te.resource?.includes('@mui')
        },
        name: (module, chunks, cacheGroupKey) =>{
          const identifier = module.identifier()
          // debugger;
          // console.log(te)
          // console.log(te.identifier())
          // return te.identifier()

          // if(identifier?.includes('addDays')){

          //   return 'addDays'

          // }
          return 'daysToWeeks'
        },
        chunks(chunk, te) {
          debugger;

          // if(chunk){
          //   console.log('🚀 ~ file: webpack.config.js:47 ~ chunks ~ chunk', chunk.canBeInitial())
          // }

          // console.log('🚀 ~ file: webpack.config.js:53 ~ chunks ~ chunk?.canBeInitial()', chunk)
          // console.log('🚀 ~ file: webpack.config.js:53 ~ chunks ~ chunk?.canBeInitial()', chunk)
          // console.log('🚀 ~ file: webpack.config.js:53 ~ chunks ~ chunk?.canBeInitial()', chunk?.entryModule && chunk?.entryModule())
          // console.log('🚀 ~ file: webpack.config.js:53 ~ chunks ~ chunk?.canBeInitial()', chunk?.getChunkMaps && chunk?.getChunkMaps() && )

          return true
          // return false
          // return chunk?.canBeInitial()
        },
        // chunks: 'all',
        priority: 10,
        enforce: true
      },
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
        reuseExistingChunk: true,
    },
    default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true,
    },
  },
};

module.exports = {
  entry: './src/index',
  mode: 'development',
  target: 'web',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3001,
  },
  output: {
    publicPath: 'auto',
  },
  optimization: {
    splitChunks: defaultWebpackSplit
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-react'],
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'app1',
      // adds react as shared module
      // version is inferred from package.json
      // there is no version check for the required version
      // so it will always use the higher version found
      shared: {
        react: {
          requiredVersion: deps['react'],
          version: deps['react'],
          singleton: true, // only a single version of the shared module is allowed,
          eager: true
        },
        'react-dom': {
          requiredVersion: deps['react-dom'],
          version: deps['react-dom'],
          singleton: true,
          eager: true
        },
        // '@mui/material/': {
        //     version: deps['@mui/material'],
        //     singleton: true,
        //     eager: true
        // },
        'date-fns/': {
            version: deps['date-fns'],
            singleton: true,
            // eager: true
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new BundleStatsWebpackPlugin({
      assets: true,
      chunks: true,
      modules: true,
      builtAt: true,
      hash: true,
      silent: false
    }),
    new LoadablePlugin(),
    new BundleAnalyzerPlugin({defaultSizes: 'stat'}),
  ],
};
