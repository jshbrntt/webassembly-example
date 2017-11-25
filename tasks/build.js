const gulp = require('gulp')
const gutil = require('gulp-util')
const path = require('path')
const process = require('process')
const webpack = require('webpack')

const common = require('./common')

gulp.task('build', done => {
  const config = require(path.join(global.__base, 'webpack.config'))
  webpack(config, (err, stats) => {
    if (!common.handleOutput(err, stats)) process.exit(1)
    done()
  })
})
