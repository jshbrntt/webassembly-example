const log = require('./log')

function handleOutput (err, stats) {
  if (err) {
    log('red', 'webpack', err.stack || err)
    if (err.details) {
      log('red', 'webpack', err.details)
    }
    return
  }

  const info = stats.toJson()

  if (stats.hasErrors()) {
    info.errors.map(error => error.split('\n').map(line => {
      log('red', 'webpack', line)
    }))
  }

  if (stats.hasWarnings()) {
    info.warnings.map(warning => warning.split('\n').map(line => {
      log('yellow', 'webpack', line)
    }))
  }

  stats.toString({colors: true}).split('\n').map((line) => {
    log('blue', 'webpack', line)
  })

  if (stats.hasErrors()) {
    return false
  }
  return true
}

module.exports = handleOutput
