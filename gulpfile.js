const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const cleanCSS = require('gulp-clean-css')
const autoprefixer = require('gulp-autoprefixer')
const concat = require('gulp-concat')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const imagemin = require('gulp-imagemin')
const browserSync = require('browser-sync').create()

// Compile Sass to CSS
const compileSass = () => {
  return gulp
    .src('src/scss/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))

    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 2 versions'],
        cascade: false,
      }),
    )

    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('public/css/'))
    .pipe(browserSync.stream())
}

// Compile third-party CSS libraries
const compileLibCSS = () => {
  return gulp
    .src('src/css/**/*.css')
    .pipe(concat('lib.min.css'))

    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('public/css/'))
    .pipe(browserSync.stream())
}

// Compile JavaScript
const compileJs = () => {
  return gulp
    .src('src/js/*.js')
    .pipe(concat('main.min.js'))

    .pipe(babel({ presets: ['@babel/env'] }).on('error', console.error))
    .pipe(uglify().on('error', console.error))
    .pipe(gulp.dest('public/js/'))
    .pipe(browserSync.stream())
}

// Compile third-party JavaScript libraries
const compileLibJs = () => {
  return gulp
    .src([
      'src/js/lib/svg-inject.js',
      'src/js/lib/axios.js',
      'src/js/lib/swiper-bundle.js',
    ])

    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('public/js/'))
    .pipe(browserSync.stream())
}

// Initialize Browsersync
const startServer = () => {
  browserSync.init({
    server: {
      baseDir: './',
    },
    port: 4040,
  })
}

// Optimize image files
function optimizeImg() {
  return gulp
    .src('src/img/**/*.{jpg,png}')
    .pipe(
      imagemin([
        imagemin.mozjpeg({ quality: 80, progressive: true }),
        imagemin.optipng({ optimizationLevel: 2 }),
      ]),
    )
    .pipe(gulp.dest('public/img'))
}

// Optimize SVG files
function optimizeSvg() {
  return gulp
    .src('src/svg/**/*.svg')
    .pipe(
      imagemin(
        [
          imagemin.svgo({
            plugins: [{ removeViewBox: false }, { cleanupIDs: false }],
          }),
        ],
        {
          verbose: true,
        },
      ),
    )
    .pipe(gulp.dest('public/svg')) // change to your final/public directory
}

// Watch files for changes
const watch = () => {
  gulp.watch('src/scss/**/*.scss', gulp.series(compileSass))
  gulp.watch('src/css/**/*.css', gulp.series(compileLibCSS))
  gulp.watch('src/js/*.js', gulp.series(compileJs))
  gulp.watch('src/js/lib/**/*.js', gulp.series(compileLibJs))
  gulp.watch('src/img/**/*.{jpg,png}', gulp.series(optimizeImg))
  gulp.watch('src/svg/**/*.svg', gulp.series(optimizeSvg))
  gulp.watch('*.html').on('change', browserSync.reload)
}

// Define Gulp tasks
gulp.task('sass', compileSass)
gulp.task('libcss', compileLibCSS)
gulp.task('js', compileJs)
gulp.task('libjs', compileLibJs)
gulp.task('img', optimizeImg)
gulp.task('svg', optimizeSvg)
gulp.task('server', startServer)
gulp.task('watch', watch)

// Default task to run all tasks in parallel
gulp.task(
  'default',
  gulp.parallel(
    'sass',
    'libcss',
    'js',
    'libjs',
    'img',
    'svg',
    'server',
    'watch',
  ),
)
