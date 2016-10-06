/*

REQUIRED
========
*/

var gulp = require('gulp');
    browserSync = require('browser-sync').create();
    postcss = require('gulp-postcss');
    atImport = require('postcss-import');
    simplevars = require('postcss-simple-vars');
    atExtend = require('postcss-extend');
    nestedcss = require('postcss-nested');
    autoprefixer = require('autoprefixer');
    cssnano = require('cssnano');
    mqpacker = require('css-mqpacker');
    mixins = require('postcss-mixins');
    sourcemaps = require('gulp-sourcemaps');
    lost = require('lost');
    type = require('postcss-responsive-type');
    customMedia = require("postcss-custom-media");
    colorFunction = require("postcss-color-function");

/*

FILE PATHS
==========
*/

var paths = {
    bsProxy: '127.0.0.1/m2/',
    rootPath: '/Applications/AMPPS/www/m2/',
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
        customMedia,
        mixins, /* Needs to go before postcss-simple-vars & postcss-nested! */
        autoprefixer,
        simplevars,
        nestedcss,
        mqpacker, /* Needs to go after nestedcss! */
        atExtend, /* Needs to go after nestedcss! */
        lost,
        type,
        colorFunction
        //cssnano
    ];
    return gulp.src(paths.rootPath + paths.cssSrc + '/src/preCSS/style.css')
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.rootPath + paths.cssSrc + '/css'))
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
