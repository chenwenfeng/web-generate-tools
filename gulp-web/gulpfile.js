'use strict';


var path = require('path');
var bluebird = require('bluebird');
var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var argv = require('yargs').argv;
var dedupe = require('gulp-dedupe');
var fs = require('fs');

// load plugins
var plugins = require('gulp-load-plugins')();
var minifyHTML = require('gulp-minify-html');
var watch = plugins.watch;
var plumber = plugins.plumber;
var debug = plugins.debug;
var filter = plugins.filter;
var size = plugins.size;
var cache = plugins.cache;
var gulpif = plugins.if;
var rename = plugins.rename;
var dev = plugins.dev;
var useref = plugins.useref;

var data = plugins.data;
var jade = plugins.jade;
var less = plugins.less;
var jshint = plugins.jshint;
var uglify = plugins.uglify;
var sass = plugins.sass;
var compass = plugins.compass;
var prefix = plugins.autoprefixer;

var imagemin = plugins.imagemin;
var minifyCSS = plugins.minifyCss;
var rev = plugins.rev;
var revCollector = plugins.revCollector;

function version(name, suffix) {
  return name + '.' + (argv.ver||Date.now()) + '.' + suffix;
};


function webHTMLBuilder(watching, dev) {
  var jadeFilter = filter('**/*.jade');
  var htmlFilter = filter('**/*.html');
  var task = gulp.src('src/views/pages/**');
  if (watching) {
    task = task
      .pipe(debug())
      .pipe(watch())
      .pipe(plumber()); // This will keep pipes working after error event
  }
  task
    .pipe(htmlFilter)
    .pipe(htmlFilter.restore())
    .pipe(jadeFilter)
    .pipe(jade({
      locals: {
        dev: dev,
        version: argv.ver,
        vs: argv.vs
      },
      pretty: true
    }))
    .pipe(jadeFilter.restore())
    .pipe(gulp.dest('dist/web'));

  return task;
}

function webCSSBuilder(watching) {
  var mallScssFilter = filter('css/sass/**/*.scss');
  var mallLessFilter = filter('css/less/*.less');
  var mallCssFilter = filter('css/css/*.css');
  var libFilter = filter('lib/*.css');
  var task = gulp.src('src/css/**');
  if (watching) {
    task = watch({ glob: 'src/css/**', emit: 'all'})
    // task = task
      .pipe(debug())
      // .pipe(watch({ emit: 'all' }, function () {console.log(233)}))
      .pipe(plumber()) // This will keep pipes working after error event
      .pipe(mallLessFilter)
      .pipe(less())
      .pipe(gulp.dest('dist/web/css/'))
      .pipe(mallLessFilter.restore())
      .pipe(mallScssFilter)
      .pipe(debug())
      .pipe(plumber()) // This will keep pipes working after error event
      .pipe(compass({
        css: 'dist/web/css/mall/sass',
        sass: 'src/css/css/sass',
        comments: true,
        style: "nested"
      }))
      .pipe(plumber()) // This will keep pipes working after error event
      .pipe(prefix('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'ff 17', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(gulp.dest('dist/web/css'))
      .pipe(mallScssFilter.restore())
      .pipe(mallCssFilter)
      .pipe(gulp.dest('dist/web/css/'))
      .pipe(mallCssFilter.restore())
      .pipe(libFilter)
      .pipe(gulp.dest('dist/web/css/'))
      .pipe(libFilter.restore());
  } else {
    task = task
      .pipe(mallLessFilter)
      .pipe(less())
      .pipe(gulp.dest('dist/web/css/tmp/'))
      .pipe(mallLessFilter.restore())
      .pipe(mallScssFilter)
      .pipe(compass({
        css: 'dist/web/css/tmp/',
        sass: 'src/css/css/sass',
        comments: false,
        style: "compressed"
      }))
      .pipe(mallScssFilter.restore())
      .pipe(mallCssFilter)
      .pipe(gulp.dest('dist/web/css/tmp/'))
      .pipe(mallCssFilter.restore())
      .pipe(libFilter)
      .pipe(gulp.dest('dist/web/css/'))
      .pipe(libFilter.restore());
  }
  return task;
}

function minifyHtml() {
  return gulp.src('dist/web/*.html')
    .pipe(minifyHTML({empty: true, conditionals: true, comments: true, spare: true, }))
    .pipe(gulp.dest('dist/web/'));
};

gulp.task('minify:web:html', function() {
  return minifyHtml();
});

function compileCss() {
  return gulp.src(['dist/web/css/tmp/css/less/*.css', 'dist/web/css/tmp/css/css/*.css'])
      .pipe(prefix('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'ff 17', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(concat(version('compiled.min', 'css')))
      .pipe(minifyCSS({compatibility: 'ie7'}))
      // .pipe(dedupe())
      .pipe(gulp.dest('dist/web/css/'));
};

gulp.task('compile:web:css', function () {
  return compileCss();
});

function webIMGBuilder(watching) {
  var task = gulp.src('src/images/**/*');

  if (watching) {
    task = task
      // .pipe(debug())
      .pipe(watch())
      .pipe(plumber()); // This will keep pipes working after error event
  }

  task
    // .pipe(cache(imagemin({ progressive: true, interlaced: true })))
    // .pipe(size({title: 'images'}))
    .pipe(gulp.dest('dist/web/images'));

  return task;
}

function webJSBuilder(watching) {
  var task = gulp.src('src/js/**/*');
  if (watching) {
    task = task
      .pipe(debug())
      .pipe(watch())
      .pipe(plumber()) // This will keep pipes working after error event
      .pipe(jshint())
      //.pipe(jshint.reporter('default'));
      // .pipe(jshint.reporter('jshint-stylish'))
      .pipe(plumber()) // This will keep pipes working after error event
      .pipe(gulp.dest('dist/web/js'));
  } else {
    var libFilter = filter('lib/*');
    var mallFilter = filter('js/*.js')
    task = task
      .pipe(mallFilter)
      // .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(concat(version('compiled.min', 'js')))
      // .pipe(sourcemaps.write())
      .pipe(gulp.dest('dist/web/js/'))
      .pipe(mallFilter.restore())
      .pipe(libFilter)
      .pipe(gulp.dest('dist/web/js/'));
  }

  return task;
}

gulp.task('web:jade', function () {
  return webHTMLBuilder();
});

gulp.task('web:less', function () {
  return webCSSBuilder();
});

gulp.task('web:img', function () {
  return webIMGBuilder();
});

gulp.task('web:js', function () {
  return webJSBuilder();
});


gulp.task('watch:web:jade', function () {
  gulp.src(['src/views/includes/**', 'src/views/layouts/**'], { read: false })
    .pipe(debug())
    .pipe(watch({ emit: 'all' }, function () {
      //gulp.start('web:jade');
      webHTMLBuilder(false, true);
    }));
  return webHTMLBuilder(true, true);
});

gulp.task('watch:web:less', function () {
  return webCSSBuilder(true);
});

gulp.task('watch:web:img', function () {
  return webIMGBuilder(true);
});

gulp.task('watch:web:js', function () {
  return webJSBuilder(true);
});


gulp.task('lint:web:js', function () {
  return gulp.src('src/js/mall/**/*.js')
    .pipe(jshint())
    //.pipe(jshint.reporter('default'));
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(plumber()); // This will keep pipes working after error event
});


gulp.task('clean:web', function (cb) {
  del(['dist/web/*', 'release/*'], {force: true}, cb);
});

gulp.task('copy:web:js', ['web:js'], function () {
  return gulp.src('dist/web/js/**/*').pipe(gulp.dest('release/js'))
});

gulp.task('copy:web:css', ['web:less'], function () {
  return gulp.src(['dist/web/css/**/*.css', '!dist/web/css/tmp/**/*']).pipe(gulp.dest('release/css'))
});

gulp.task('copy:web:img', ['web:img'], function () {
  return gulp.src('dist/web/images/**/*').pipe(gulp.dest('release/images'));
});

gulp.task('copy:web:html', ['minify:web:html'], function () {
  return gulp.src('dist/web/**/*.html').pipe(gulp.dest('release'));
});

gulp.task('watch:web', function () {
  return gulp.start('watch:web:jade', 'watch:web:less', 'watch:web:js', 'watch:web:img');
});

gulp.task('build:web', function () {
  runSequence('clean:web', ['web:jade', 'web:less', 'web:js', 'web:img'], ['compile:web:css', 'minify:web:html'], ['copy:web:css', 'copy:web:js', 'copy:web:img', 'copy:web:html']);
});

gulp.task('default', []);
