var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
//var babel = require("gulp-babel");
var concat = require("gulp-concat");
var browserSync = require('browser-sync');
var fs = require('fs');
var yargs = require('yargs').argv;
var less = require('gulp-less');
var header = require('gulp-header');
var tap = require('gulp-tap');
var nano = require('gulp-cssnano');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var rename = require('gulp-rename');
var rollup = require('rollup').rollup;
var commonjs = require('rollup-plugin-commonjs');
var nodeResolve = require('rollup-plugin-node-resolve');
var babel = require('rollup-plugin-babel');

var pkg = require('./package.json');
var option = {base: 'src'};
var dist = __dirname + '/dist';
var path = require('path');


gulp.task('build:style', function (){
    gulp.src('src/style/main.less', option)
      .pipe(sourcemaps.init())
      .pipe(less().on('error', function (e) {
          console.error(e.message);
          return;
      }))
      .pipe(postcss([autoprefixer]))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(dist))
      .pipe(browserSync.reload({stream: true}))
      .pipe(nano())
      .pipe(rename(function (path) {
          path.basename += '.min';
      }))
      .pipe(gulp.dest(dist));
});

gulp.task('build:other', function (){
  gulp.src("src/img/**/*", option)
    .pipe(gulp.dest(dist))
});

gulp.task('build:js', function () {
  rollup({
    entry: 'src/js/index.js',
    plugins: [
      nodeResolve({ jsnext: true }),
      babel()
    ]
  }).then(function (bundle) {
    bundle.write({
     format: 'iife',
     dest: 'dist/js/index.js',
     sourceMap: true
    });
    gulp.src("src/js/polyfill.js", option)
      .pipe(gulp.dest(dist));
    browserSync.reload();
  }).catch(function(error){
    console.log(error);
  });
  gulp.src("src/js/config.js", option)
    .pipe(gulp.dest(dist));
/*
    gulp.src("src/js/!**!/!*", option)
        .pipe(sourcemaps.init())
        .pipe(babel())
        .on("error",function(err){
            console.log(err);
            return ;
        })
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(dist))
        .pipe(browserSync.reload({stream: true}));
    gulp.src("src/js/!**!/!*.(map)", option)
        .pipe(gulp.dest(dist))
*/
});

gulp.task('build:html', function (){
    gulp.src('src/*.html', option)
        .pipe(gulp.dest(dist))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', function () {
    gulp.watch('src/img/**/*', ['build:other']);
    gulp.watch('src/style/**/*', ['build:style']);
    gulp.watch('src/js/**/*', ['build:js']);
    gulp.watch('src/*.html', ['build:html']);
});

gulp.task('server', function () {
    var port = 8080;
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        ui: {
            port: port + 1,
            weinre: {
                port: port + 2
            }
        },
        port: port,
        startPath: '/'
    });
});

gulp.task('release', ['build:style', 'build:js', 'build:html','build:other']);

gulp.task("default", function () {
  gulp.start('release');
  gulp.start('server');
  gulp.start('watch');
});