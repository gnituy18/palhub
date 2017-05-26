var gulp = require('gulp')
var browserify = require('browserify')
var babelify = require('babelify')
var source = require('vinyl-source-stream')
var nodemon = require('nodemon')
var sass = require('gulp-sass')

const features = [ 'app', 'lobby' ]

for (let x = 0;x < features.length;x++) {
  const feature = features[x]
  gulp.task(feature, function () {
    return browserify('./web/' + feature + '/' + feature + '.jsx')
    .transform(babelify, {'presets': [ 'es2015', 'react' ]})
    .bundle()
    .pipe(source(feature + '.js'))
    .pipe(gulp.dest('./public/js'))
  })
}

gulp.task('build', features)

gulp.task('sass', function () {
  return gulp.src([ './web/app/app.scss', './web/scss/main.scss' ])
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('./public/css'))
})

gulp.task('watch', [ 'sass', 'build' ], function () {
  gulp.watch([ './web/app/app.jsx', './web/components/*.jsx', './web/lib/**/*.js' ], ['build'])
  gulp.watch([ './web/app/app.scss', './web/scss/**/*.scss' ], ['sass'])
  nodemon({
    'script': 'server/index.js',
    'ignore': [ 'gulpfile.js', 'app/!(index.js)' ],
    'env': {'PORT': '3000'}
  })
})

gulp.task('default', [ 'sass', 'build', 'watch' ])

