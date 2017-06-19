const gulp = require('gulp')
const browserify = require('browserify')
const babelify = require('babelify')
const source = require('vinyl-source-stream')
const tap = require('gulp-tap')
const path = require('path')
const nodemon = require('nodemon')
const sass = require('gulp-sass')

const features = require('./config').features
const featureGlobStr = '(' + features.join('|') + ')'

gulp.task('javascript', function () {
  return gulp.src(['./web/**/*' + featureGlobStr + '.js'], {'read': false})
  .pipe(tap(function (file) {
    file.contents = browserify(file.path, {'debug': true})
      .transform(babelify, {'presets': [ 'es2015', 'react' ]})
      .bundle()
      .pipe(source(path.basename(file.path)))
      .pipe(gulp.dest('./public/js'))
  }))
})

gulp.task('sass', function () {
  return gulp.src([ '.web/**/*' + featureGlobStr + '.scss', './web/scss/main.scss' ])
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('./public/css'))
})

gulp.task('watch', ['build'], function () {
  gulp.watch([ './web/*' + featureGlobStr + '/!(index).js*(x)', './web/!' + featureGlobStr + '**/*.js' ], ['javascript'])
  gulp.watch([ '.web/**/*' + featureGlobStr + '.scss', './web/scss/*.scss' ], ['sass'])
  nodemon({
    'script': 'server/index.js',
    'ignore': [ 'public/**/*', 'gulpfile.js', './web/*' + featureGlobStr + '/!(index).js*(x)', './web/!' + featureGlobStr + '**/*.js' ],
    'env': {'PORT': '3000'}
  })
})

gulp.task('build', [ 'javascript', 'sass' ])

gulp.task('default', [ 'build', 'watch' ])

