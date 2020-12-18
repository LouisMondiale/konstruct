/* Подключаем модуль */

const gulp = require('gulp');    //Сам Gulp
const autoprefixer = require('gulp-autoprefixer');    //Создает префиксы
const cleanCSS = require('gulp-clean-css');     //Сжимает CSS код
const del = require('del');      //Удаляет файлы
const browserSync = require('browser-sync').create();    //Автоматически обновляет браузер при изменениях 
const sourcemaps = require('gulp-sourcemaps');     //Создает карту кода, чтоб отследить строчку после его сжатия
const gulpif = require('gulp-if');     //Помогает задать условия
const gcmq = require('gulp-group-css-media-queries');    //Группирует медиа-запросы
const less = require('gulp-less');     //Препроцессор LESS
const smartgrid = require('smart-grid');     //Smart-Grid
const webp = require('gulp-webp');     //Конвертирует картинки в формат *.webp

/* Создаем флажки для запуска */

const isDev = (process.argv.indexOf('--dev') !== -1);
const isProd = !isDev;
const isSync = (process.argv.indexOf('--sync') !== -1);

/* Объявляем функции (обработчики) */

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

/* Запуск задач из консоли */

gulp.task('styles', styles);  //Событие (команда в консоли) и обработчик события, т.е. функция
gulp.task('build', gulp.series(grid, build));
gulp.task('watch', gulp.series(build, watch));
gulp.task('grid', grid);