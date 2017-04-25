var gulp = require('gulp')
var browserify = require('browserify')
var babelify = require('babelify')
var source = require('vinyl-source-stream')
var nodemon = require('nodemon')

gulp.task('build', function () {
  return browserify('./tour/tour.js')
  .transform(babelify, {'presets': ['es2015']})
  .bundle()
  .pipe(source('tour.js'))
  .pipe(gulp.dest('./public/js'))
})

gulp.task('watch', ['build'], function () {
  nodemon({
    'script': 'server/index.js',
    'ignore': [ 'gulpfile.js', 'app/!(index.js)' ],
    'env': {'PORT': '3000'}
  })
})

gulp.task('default', [ 'build', 'watch' ])

