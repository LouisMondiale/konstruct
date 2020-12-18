const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const del = require('del');      //Удаляет файлы
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const gcmq = require('gulp-group-css-media-queries');
const less = require('gulp-less');
const smartgrid = require('smart-grid');
const webp = require('gulp-webp');

const isDev = (process.argv.indexOf('--dev') !== -1);
const isProd = !isDev;
const isSync = (process.argv.indexOf('--sync') !== -1);

function styles() {
   return gulp.src('./src/css/styles.less')
      .pipe(gulpif(isDev, sourcemaps.init()))
      .pipe(less())
      .pipe(gcmq())
      .pipe(autoprefixer())
      .pipe(gulpif(isProd, cleanCSS({
         level: 2
      })))   
      .pipe(gulpif(isDev, sourcemaps.write()))
      .pipe(gulp.dest('./build/css'))
      .pipe(gulpif(isSync, browserSync.stream()));
}

function img() {
   return gulp.src('./src/img/**/*')
      .pipe(gulp.dest('./build/img'))
}

function imgToWebp() {
   return gulp.src('./src/img/**/*')
      .pipe(webp())
      .pipe(gulp.dest('./build/img'))
}

function html() {
   return gulp.src('./src/**/*.html')
      .pipe(gulp.dest('./build'))
      .pipe(gulpif(isSync, browserSync.stream()));
}

function fonts() {
   return gulp.src('./src/fonts/**/*')
      .pipe(gulp.dest('./build/fonts'))
}

function js() {
   return gulp.src('./src/js/**/*')
      .pipe(gulp.dest('./build/js'))
      .pipe(gulpif(isSync, browserSync.stream()));
}

function watch() {
   if (isSync) {
      browserSync.init({
         server: {
            baseDir: "./build/",
         }
      });
   }

   gulp.watch('./src/css/**/*.less', styles);
   gulp.watch('./src/**/*.html', html);
   gulp.watch('./src/img/**/*', img);
   gulp.watch('./smartgrid.js', grid);
   gulp.watch('./src/js/script.js', js);
}

function clean(){
   return del('build/*')
}

function grid(done) {
   delete require.cache[require.resolve('./smartgrid.js')];
   let settings = require('./smartgrid.js');
   smartgrid('./src/css', settings);
   done();
}

let build = gulp.series(clean,
   gulp.parallel(styles, img, html, fonts, imgToWebp, js)
);

gulp.task('styles', styles);
gulp.task('build', gulp.series(grid, build));
gulp.task('watch', gulp.series(build, watch));
gulp.task('grid', grid);