var gulp = require('gulp'),
    concat = require('gulp-concat');

gulp.task('concat', function(){
  return gulp.src('src/*.js')
    .pipe(concat('leaflet.polylineDecorator.js'))
    .pipe(gulp.dest('.'));
});

gulp.task('default', ['concat']);
