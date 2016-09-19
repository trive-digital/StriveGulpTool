/*
REQUIRED
========
*/

var gulp = require('gulp');
    browserSync = require('browser-sync').create();
    postcss = require('gulp-postcss');
    simplevars = require('postcss-simple-vars');
    nestedcss = require('postcss-nested');
    autoprefixer = require('autoprefixer');
    cssnano = require('cssnano');
    mqpacker = require('css-mqpacker');
    atImport = require('postcss-import');
    atExtend = require('postcss-extend');
    mixins = require('postcss-mixins');

/*
FILE PATHS
==========
*/

var paths = {
    bsProxy: 'localhost/m2/',
    rootPath: '/srv/http/m2/',
    cssSrc: 'app/design/frontend/JakeSharp/blank/web',
    cssParent: 'wip',
    cssDest: 'pub/static/frontend/JakeSharp/blank/',
    lang: 'en_US'
}

/*

CSS
===
*/

gulp.task('css', function () {
    var processors = [
        atImport,
        atExtend,
        mixins,
        autoprefixer,
        simplevars,
        mqpacker,
        nestedcss,
        //cssnano
    ];
    return gulp.src(paths.rootPath + paths.cssSrc + '/src/preCSS/style.css')
        .pipe(postcss(processors))
        .pipe(browserSync.stream())
        .pipe(gulp.dest(paths.rootPath + paths.cssDest + paths.lang + '/css'));
});

/*
BROWSERSYNC
===========
*/

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: paths.bsProxy,
        notify: true,
        port: 8080
    });
});

/*
WATCH
=====
*/

gulp.task('watch', ['browser-sync'], function() {
    // Watch .css files
    gulp.watch(paths.rootPath + paths.cssSrc + '/src/preCSS/**/*.css', ['css']);
});

gulp.task('default', ['css', 'watch'], function() {
});
