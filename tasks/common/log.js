const gutil = require('gulp-util')

function log (color, label, ...message) {
  gutil.log(gutil.colors[color](`[${label}]`), ...message)
}

module.exports = log
