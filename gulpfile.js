const { src, dest, task, series, watch, parallel } = require('gulp');
const rm = require('gulp-rm');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const svgo = require('gulp-svgo');
const svgSprite = require('gulp-svg-sprite');
const gulpif = require('gulp-if');

const env = process.env.NODE_ENV;

const { SRC_PATH, DIST_PATH, STYLE_LIBS, JS_LIBS } = require('./gulp.config');

task('clean', () => {
  return src(`${DIST_PATH}/**/*`, { read: false })
    .pipe(rm())
});

task('copy:html', () => {
  return src(`${SRC_PATH}/*.html`)
    .pipe(dest(DIST_PATH))
    .pipe(reload({ stream: true }));
});

task('copy:image', () => {
  return src(`${SRC_PATH}/image/pics/**/*`)
    .pipe(dest(`${DIST_PATH}/image/pics`))
    .pipe(reload({ stream: true }));
});

task('copy:video', () => {
  return src(`${SRC_PATH}/video/*.mp4`,)
    .pipe(dest(`${DIST_PATH}/video`))
    .pipe(reload({ stream: true }));
});

task("copy:fancy", () => {
  return src([`${SRC_PATH}/libs/fancybox-master/dist/jquery.fancybox.min.css`, `${SRC_PATH}/libs/fancybox-master/dist/jquery.fancybox.min.js`])
    .pipe(dest(`${DIST_PATH}/libs/fancybox`))
    .pipe(reload({ stream: true }));
});

task('sass', () => {
  return src([`${SRC_PATH}/styles/main.scss`])
    .pipe(gulpif(env == "dev", sourcemaps.init()))
    .pipe(concat('main.min.scss'))
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(dest(DIST_PATH))
    .pipe(reload({ stream: true }));
});

task('styles', () => {
  return src([...STYLE_LIBS, 'src/styles/main.scss'])
    .pipe(gulpif(env === 'dev', sourcemaps.init()))
    .pipe(concat('main.min.scss'))
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(env === 'prod', autoprefixer({
      overrideBrowserslist: [
        'last 2 version',
        '> 5%',
        'not dead'
      ],
      cascade: false
    })))
    .pipe(gulpif(env === 'prod', gcmq()))
    .pipe(gulpif(env === 'prod', cleanCSS()))
    .pipe(gulpif(env === 'dev', sourcemaps.write()))
    // .pipe(dest(`${DIST_PATH}/styles`))
    .pipe(dest(DIST_PATH))
    .pipe(reload({ stream: true }));
});

task('scripts', () => {
  return src([...JS_LIBS, 'src/js/*.js'])
    .pipe(gulpif(env === 'dev', sourcemaps.init()))
    .pipe(concat('main.min.js', { newLine: ';' }))
    .pipe(gulpif(env === 'prod', babel({
      presets: [['@babel/env'], { compact: false }]
    })))
    .pipe(gulpif(env === 'prod', uglify()))
    .pipe(gulpif(env === 'dev', sourcemaps.write()))
    .pipe(dest(DIST_PATH))
    .pipe(reload({ stream: true }));
});

task('icons', () => {
  return src(`${SRC_PATH}/image/sprite/*.svg`)
    .pipe(svgo({
      plugins: [
        {
          removeAttrs: {
            attrs: '(fill|stroke|style|width|height|data.*)'
          }
        }
      ]
    }))
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(dest(`${DIST_PATH}/image/sprite`));
});

task('server', () => {
  browserSync.init({
    server: {
      baseDir: "./dist"
    },
    open: false
  });
});

task('watch', () => {
  watch('./src/styles/**/*.scss', series('sass', 'styles'));
  watch('./src/*.html', series('copy:html'));
  watch('./src/js/*.js', series('scripts'));
  watch('./src/image/sprite/*.svg', series('icons'));
});

task('default',
  series(
    'clean', 'sass',
    parallel('copy:html', 'styles', 'scripts', 'copy:fancy', 'icons', "copy:image", "copy:video"),
    parallel('watch', 'server')
  )
);

task('build',
  series(
    'clean',
    parallel('copy:html', 'styles', 'scripts', 'copy:fancy', 'icons', "copy:image", "copy:video",))
);