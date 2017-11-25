const ghpages = require('gh-pages')
const gulp = require('gulp')

gulp.task('publish', ['build'], done => {
  ghpages.publish('dist', err => {
    if (err) {
      throw err
      process.exit(1)
    }
    done()
  })
})