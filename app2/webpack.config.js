const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');
const deps = require('./package.json').dependencies;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const defaultWebpackSplit = {
  chunks: 'async',
  minSize: 20000,
  minRemainingSize: 0,
  minChunks: 1,
  maxAsyncRequests: 30,
  maxInitialRequests: 30,
  enforceSizeThreshold: 50000,
  cacheGroups: {
      'mui-widget-mobile': {
        // test: /[\\/]node_modules[\\/](@mui\/material)[\\/]/,
        test: (module, chunks) =>{
          
          if(module.resource?.includes('@mui')){
            // console.log('test', module.resource)
            debugger
            return true
          }

          return false
        },
        chunks: (chunk) => {
          console.log('🚀 ~ file: webpack.config.js:34 ~ chunk', chunk?.name)
          // return chunk?.name === 'mobile'
          return chunk?.name === 'mobile_remote'
        },
        priority: 10,
        name: 'mui-widget-mobile',
        enforce: true,
        reuseExistingChunk: true,
      },
      'mui-widget-desktop': {
        // test: /[\\/]node_modules[\\/](@mui\/material)[\\/]/,
        test: (module, chunks) =>{
          
          if(module.resource?.includes('@mui')){
            // console.log('test', module.resource)
            debugger
            return true
          }

          return false
        },
        chunks: (chunk) => {

          // return chunk?.name === 'desktop'
          return chunk?.name === 'desktop_remote'
        },
        priority: 10,
        name: 'mui-widget-desktop',
        enforce: true,
        reuseExistingChunk: true,
      },
      // 'vendor-core-components': {
      //   // test: /[\\/]node_modules[\\/](@mui\/material)[\\/]/,
      //   test: (te) =>{
      //     console.log('test', te.resource)

      //     return te.resource?.includes('@mui')
      //   },
      //   chunks: 'all',
      //   priority: 10,
      //   name: 'vendor-core-components'
      // },
      'remote-venor': {
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
  // entry: undefined,
  // entry:  './src/index',
  entry:  {
    mobile: './src/mobile/index',
    desktop: './src/desktop/index'
  },
  // entry:  {
  //   mobile: './src/mobile/remote/index',
  //   desktop: './src/desktop/remote/index',
  // },
//   entry: {
//     'index': './src/index',
//     // 'index': './src/remotes/index',
//     // 'desktop': './src/remotes/desktop/index',
//     // 'mobile': './src/remotes/mobile/index',
// },
  mode: 'development',
  // mode: 'production',
  target: 'web',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3002,
  },
  output: {
    publicPath: 'auto',
  },
  optimization: {
    splitChunks: defaultWebpackSplit
    // splitChunks: undefined
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
      name: 'app2',
      filename: 'remoteEntry.js',
      exposes: {
        './desktop': './src/desktop/remote/index',
        './mobile': './src/mobile/remote/index',
      },
      shared: {
        react: {
          requiredVersion: deps.react,
          version: deps.react,
          singleton: true,
        },
        'react-dom': {
          requiredVersion: deps['react-dom'],
          version: deps['react-dom'],
          singleton: true, 
        },
        // '@mui/material/': {
        //   requiredVersion: deps['@mui/material'],
        //   version: deps['@mui/material'],
        //   singleton: true,
        // },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new BundleAnalyzerPlugin({analyzerHost: '127.0.0.1', analyzerPort: 8080, defaultSizes: 'stat'})
  ],
};
