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
    rename = require('gulp-rename');
    rimraf = require('gulp-rimraf');
    watch = require('gulp-watch');
    exec = require('child_process').exec;

/*

FILE PATHS
==========
*/

var paths = {
    bsProxy: '127.0.0.1/m2/',
    rootPath: '/Applications/AMPPS/www/m2/',
    cssSrc: 'app/design/frontend/Trive/blank',
    cssParentSrc: 'app/design/frontend/Trive/blank',
    cssDest: 'pub/static/frontend/Trive/blank/',
    lang: 'en_US'
}

/*

CSS
===
*/

gulp.task('css', function () {
    var processors = [
        atImport({path: [paths.rootPath + paths.cssParentSrc + "/web/src/preCSS"]}),
        customMedia,
        mixins, /* Needs to go before postcss-simple-vars & postcss-nested! */
        autoprefixer({browsers: ['last 2 versions', '> 5%']}),
        simplevars,
        nestedcss,
        mqpacker, /* Needs to go after nestedcss! */
        atExtend, /* Needs to go after nestedcss! */
        lost,
        type,
        colorFunction
        //cssnano
    ];
    return gulp.src([paths.rootPath + paths.cssSrc + '/web/src/preCSS/style.css',
                     paths.rootPath + paths.cssSrc + '/web/src/preCSS/print.css'])
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.rootPath + paths.cssSrc + '/web/css'))
        .pipe(browserSync.stream())
        .pipe(gulp.dest(paths.rootPath + paths.cssDest + paths.lang + '/css'));
});

/*

IMAGES, HTML, CSS & JS
======================
*/

var filesDir = paths.cssSrc.replace("vendor/trive/", "");
    /* remove 'vendor/trive/' from file path if the theme is installed through composer,
      strive-gulp dir shares the same parent dir like theme-frontend-strive dir */
    files = ['../' + filesDir + '/**/*.{gif,jpg,png,svg,html,css,js}'];

gulp.task('static', function() {
    gulp.src(files)
    .pipe(watch(files))
    .pipe(rename(function (path) {
        path.dirname = path.dirname.replace("web/", "/");
    }))
    .pipe(gulp.dest(paths.rootPath + paths.cssDest + paths.lang));
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

CLEAN
=====
*/

gulp.task('clean', function(cb) {
    return gulp.src([
        paths.rootPath + 'pub/static/*',
        '!' + paths.rootPath + 'pub/static/.htaccess',
        '!' + paths.rootPath + 'pub/static/frontend/',
        paths.rootPath + 'pub/static/frontend/*',
        '!' + paths.rootPath + 'pub/static/frontend/Magento/',
        paths.rootPath + 'var/cache/*',
        paths.rootPath + 'var/generation/*',
        paths.rootPath + 'var/view_preprocessed/*'
    ], {read: false})
    .pipe(rimraf({ force: true }));
});

/*

DEPLOY
======
*/

gulp.task('deploy', function (cb) {
    exec(paths.rootPath + 'bin/magento setup:static-content:deploy',
        function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            cb(err);
    });
})

/*

WATCH
=====
*/

gulp.task('watch', ['browser-sync'], function() {
    // Watch css files
    watch(paths.rootPath + paths.cssSrc + '/web/src/preCSS/**/*.css', function() {
        gulp.start('css');
    });
});

gulp.task('default', ['css', 'static', 'watch'], function() {
});
