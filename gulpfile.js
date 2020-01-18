'use strict';

const gulp = require('gulp'),
      stylus = require('gulp-stylus'),
      htmlImport = require('gulp-html-import'),
      sourcemaps = require('gulp-sourcemaps'),
      concat = require('gulp-concat'),
      del = require('del'),
      newer = require('gulp-newer'),
      browserSync = require('browser-sync').create(),
      notify = require('gulp-notify'),
      multipipe = require('multipipe'),
      uglify  = require('gulp-uglify-es').default,
      rename = require('gulp-rename'),
      babel = require('gulp-babel');

gulp.task('styles-min', function(){
  return multipipe(
    gulp.src('src/styles/base.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(rename('style.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'))
  ).on('error', notify.onError());
});

gulp.task('styles-min-prod', function(){
  return multipipe(
    gulp.src('src/styles/base.styl')
    .pipe(stylus())
    .pipe(rename('style.css'))
    .pipe(gulp.dest('dist'))
  ).on('error', notify.onError());
});

gulp.task('clean', function(){
  return del('dist');
});

gulp.task('import', function () {
  gulp.src('src/index.html')
      .pipe(htmlImport('src/'))
      .pipe(gulp.dest('dist'));
});

gulp.task('assets', function(){
  return gulp.src([
    'src/**', 
    'src/index.html',  
    '!src/components/**', 
    '!src/styles/**', 
    '!src/fonts/font-face.styl',
    '!src/js/**',
    '!src/js/siema.js'], {since: gulp.lastRun('assets')})
  .pipe(newer('dist'))
  .pipe(gulp.dest('dist'));
});

gulp.task('compress-js', function () {
  return gulp.src('src/js/script.js')
  .pipe(rename('script.js'))
  .pipe(gulp.dest('dist'));
});

gulp.task('build', gulp.series('clean', gulp.parallel('styles-min', 'assets', 'compress-js')));
gulp.task('build-prod', gulp.series('clean', gulp.parallel('styles-min-prod', 'assets', 'compress-js')));

gulp.task('watch', function(){
  gulp.watch('src/styles/**/*.*', gulp.series('styles-min'));
  gulp.watch('src/**/*.*', gulp.series('assets'));
  gulp.watch('src/js/**/*.*', gulp.series('compress-js'));
});

gulp.task('serve', function(){
  browserSync.init({
    server: 'dist'
  });

  browserSync.watch('src/**/*.*').on('change', browserSync.reload);
});


gulp.task('dev', gulp.series('build', gulp.parallel('import', 'watch', 'serve')));
gulp.task('prod', gulp.series('build-prod', gulp.parallel('import', 'serve')));