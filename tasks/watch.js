const gulp = require('gulp')
const gutil = require('gulp-util')
const path = require('path')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const common = require('./common')

gulp.task('watch', done => {
  const config = require(path.join(global.__base, 'webpack.config'))
  new WebpackDevServer(webpack(config), config.devServer)
    .listen(config.devServer.port, config.devServer.host, err => {
      if (err) {
        common.log('red', 'webpack-dev-server', err)
        throw new gutil.PluginError('webpack-dev-server', err)
      }
      common.log('blue', 'webpack-dev-server', `${config.devServer.https ? 'https' : 'http'}://${config.devServer.host}:${config.devServer.port}`)
    })
})
