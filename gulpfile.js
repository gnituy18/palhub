var gulp = require('gulp')
   var sass = require('gulp-sass')

    gulp.task('scss', function() {
     return gulp.src('./app/assets/styles/pages/*.scss')
       .pipe(sass().on('error', sass.logError))
       .pipe(gulp.dest('./public/css'))
   })

    gulp.task('scss:watch', function() {
     gulp.watch('./app/assets/styles/**/*.scss', ['scss'])
   })
