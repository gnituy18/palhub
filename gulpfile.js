var gulp = require('gulp')
var browserify = require('browserify')
var babelify = require('babelify')
var source = require('vinyl-source-stream')
var nodemon = require('nodemon')

gulp.task('build', function () {
  return browserify('./app/app.js')
  .transform(babelify, {'presets': ['es2015']})
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('./public/js'))
})

gulp.task('watch', ['build'], function () {
  gulp.watch('./app/app.js', ['build'])
  nodemon({
    'script': 'server/index.js',
    'ignore': [ 'gulpfile.js', 'app/!(index.js)' ],
    'env': {'PORT': '3000'}
  })
})

gulp.task('default', [ 'build', 'watch' ])

