const common = require('./common')
const express = require('express')
const gulp = require('gulp')
const gutil = require('gulp-util')
const path = require('path')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')

gulp.task('watch', done => {
  const app = express()
  const config = require(path.join(global.__base, 'webpack.config'))
  const compiler = webpack(config)
  app.use(webpackDevMiddleware(compiler))
  app.listen(config.devServer.port, config.devServer.host, () => {
    common.log('blue', 'webpack-dev-server', `${config.devServer.https ? 'https' : 'http'}://${config.devServer.host}:${config.devServer.port}`)
  })
})
