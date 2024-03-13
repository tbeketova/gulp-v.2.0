/* 1 */   const {src, dest, watch, parallel, series} = require('gulp'); //src используется для выбора файлов, а dest - для указания места, куда нужно сохранить результаты обработки файлов., watch уже установлен в галп
/* 6 используем "сторожа" watch */
/* 8.1 используем parallel чтобьi одновременно watch и browserSync  */
/*11.4 series отвечает отвечает за последов виполнение таскоб. Нам важно чтоби папка dist самоудалилась, а потом файльi перенеслись*/

/* 2 */   const scss = require('gulp-sass')(require('sass'));
/* 4.1 */ const concat = require('gulp-concat'); //плагин npm i gulp-concat -D для объединения файлов, умеет переименовьiвать
/* 5.1 */ const uglify = require('gulp-uglify-es').default; //минифиц. js код, .default потому что ето ES модуль.
/* 7.1 */ const browserSync = require('browser-sync').create(); //чтобьi обновлять страницу браузера
/* 9 */   const autoprefixer = require('gulp-autoprefixer'); //обеспечивает совместимость с различными браузерами
/* 11.1 */const clean = require('gulp-clean');



/* 5.2 */ function scripts() { //функция scripts() берет файл main.js из папки source/js
            return src('source/js/main.js')

            /* если в проект инсталируем swiper через команду git init swiper -D, то добавляем еще один файл js
                return src([
                  'node_modules/swiper/swiper-bundle.js' 
                  'source/js/main.js'
                ])*/
              
              /*  'app/js/*.js',
                  '!app/js/main.min.js'  //исключаем етот файл из отслеживания изменений
              */
            
              .pipe(concat('main.min.js')) //с помощью плагина gulp-concat Объединяет все выбранные файлы JavaScript в один файл с именем main.min.js.
              .pipe(uglify()) //с помощью плагина gulp-uglify-es Применяет минификацию к файлу JavaScript.
              .pipe(dest('source/js'))
/* 7.3 */     .pipe(browserSync.stream()) //чтобьi страница браузера обновлялась после того как обновился main.js
          }

/* 3.1 */ function styles() {
            return src('source/scss/style.scss')
  /* 9.2 */   .pipe(autoprefixer({overrideBrowserslist: ['last 10 version']})) //принимает объект опций, где overrideBrowserslist - это список браузеров, к которым должны применяться префиксы. В данном случае указано 'last 10 version', что означает, что должны применяться префиксы для последних 10 версий каждого браузера.
  /* 4.2 */   .pipe(concat('style.min.css'))
  /* 3.2 */   .pipe(scss({outputStyle: 'compressed'})) //компрессор для style.css, т.е. результат должен бьiть минифицированньiм(сжатьiм)
  /* 3.3 */   .pipe(dest('source/css'))
  /* 7.4 */   .pipe(browserSync.stream()) //чтобьi страница браузера обновлялась после того как обновился style.css
            }

  /* 6.1 */  function watching() {
              watch(['source/scss/style.scss'], styles); //отслеживай source/scss/style.scss и запускай функцию styles
              watch(['source/js/main.js'], scripts);
  /* 7.5 */   watch('source/*.html').on('change', browserSync.reload); //слежение за всеми файлами html и потом обновление браузера
            }

/* 7.2 */function browsersync() { //
          browserSync.init({
            server: {
                baseDir: "source/"
            }
        });
        }

/* 11.2 */function cleanDist () {
  return src ('dist')
    .pipe(clean())
}        

/* 10.1 */function building() {    //для продакшена
  return src([
    'source/css/style.min.css',
    'source/js/main.min.js',
    'source/**/*.html'      //если в папке html есть еще папки

  ], {base: 'source'})  //чтобьi структура папок source осталась такая же как и в dist (для продакшена)
    .pipe(dest('dist'))
}        

/* 3.4 */exports.styles = styles; //делает эту функцию доступной для использования в других частях кода, когда она импортируется в другие файлы с помощью require или import
/* 5.3 */exports.scripts = scripts;
/* 6.2 */exports.watching = watching;
/* 7.6 */exports.browsersync = browsersync;
/* 10.2 */  //exports.building = building;  //удаляем для п.

/* 11.3 */exports.building = series(cleanDist, building)
/* 8.2 */ exports.default = parallel(styles, scripts, browsersync, building, watching); //т.к.написано default можно просто запустить в терминале gulp