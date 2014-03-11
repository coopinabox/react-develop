var gulp = require('gulp');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var less = require('gulp-less');
var refresh = require('gulp-livereload');
var lr = require('tiny-lr')();

var SERVER_PORT = 5000;
var LIVERELOAD_PORT = 35729;
var SERVER_ROOT = __dirname + "/static/"
 
gulp.task('server', function (cb) {
  var connect = require('connect');
  var app = connect();
  app.use(require('connect-livereload')());
  app.use(require('ecstatic')({
    root: SERVER_ROOT,
    cache: 0,
  }));
  app.listen(SERVER_PORT, cb);
});

gulp.task('js', function () {
  var bundler = watchify('./static/render.js')
  var rebundle = function () {
    return bundler.bundle({ debug: true })
    .pipe(source('index.js'))
    .pipe(gulp.dest('./static'))
    .pipe(refresh(lr));
  }
  bundler.on('update', rebundle);
  return rebundle();
});

gulp.task('css', function () {
  return gulp.src('../../index.less')
    .pipe(less())
    .pipe(gulp.dest('./static'))
    .pipe(refresh(lr));
});

gulp.task('lr', function (cb) {
  lr.listen(LIVERELOAD_PORT, cb);
});
 
gulp.task('watch', function () {
  gulp.watch('../../**/*.less', ['css']);
});

gulp.task('default', ['lr', 'js', 'css', 'server', 'watch']);
