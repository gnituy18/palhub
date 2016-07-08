var gulp = require('gulp')
var sass = require('gulp-sass')
var nodemon = require('gulp-nodemon')
var browserify = require('gulp-browserify')

gulp.task('watch', ['build'], function() {
  gulp.watch('./app/assets/styles/**/*.scss', ['scss'])
  gulp.watch('./app/assets/js/**/*.js', ['browserify'])
  nodemon({
    script: 'server.js'
  })
})

gulp.task('scss', function() {
  return gulp.src('./app/assets/styles/pages/*.scss')
    .pipe(sass({
      outputStyle: 'expanded',
      includePaths: require('node-normalize-scss').includePaths
    }).on('error', sass.logError))
    .pipe(gulp.dest('./public/css'))
  console.log(require('node-normalize-scss').includePaths)
})

gulp.task('browserify', function() {
  return gulp.src('./app/assets/js/*.js')
    .pipe(browserify())
    .pipe(gulp.dest('./public/js'))
})

gulp.task('copy', ['copy-adapter.js'])

gulp.task('copy-adapter.js', function() {
  return gulp.src('./node_modules/webrtc-adapter/out/adapter.js')
    .pipe(gulp.dest('./public/js'))
})

gulp.task('build', ['scss', 'browserify'])

gulp.task('default', ['copy', 'build', 'watch'])
