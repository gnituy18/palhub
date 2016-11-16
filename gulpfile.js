var gulp = require('gulp')
var sass = require('gulp-sass')
var nodemon = require('gulp-nodemon')
var browserify = require('gulp-browserify')
var uglify = require('gulp-uglify')
var pump = require('pump')
var babel = require('gulp-babel')

gulp.task('watch', ['build'], function() {
  gulp.watch('./app/assets/styles/**/*.scss', ['scss'])
  gulp.watch('./app/assets/js/**/*.js', ['js'])
  nodemon({
    script: 'server.js',
    ignore: ['./public/', ['./app/assets/js/']]
  })
})

gulp.task('scss', function() {
  return gulp.src(['./app/assets/styles/pages/*.scss', './app/assets/styles/main.scss'])
    .pipe(sass({
        outputStyle: 'expanded',
        includePaths: require('node-normalize-scss').includePaths
      })
      .on('error', sass.logError))
    .pipe(gulp.dest('./public/css'))
  console.log(require('node-normalize-scss').includePaths)
})

gulp.task('js', function() {
  return gulp.src('./app/assets/js/widgets/**/*.js')
    .pipe(browserify({
      debug: !gulp.env.production
    }))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'))
}).on('error', function(err) {
  console.log(err)
})

gulp.task('copy', ['copy-adapter.js'])

gulp.task('copy-adapter.js', function() {
  return gulp.src('./node_modules/webrtc-adapter/out/adapter.js')
    .pipe(gulp.dest('./public/js'))
})

gulp.task('build', ['scss', 'js'])

gulp.task('default', ['copy', 'build', 'watch'])
