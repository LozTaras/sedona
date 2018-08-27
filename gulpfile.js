//Main
var gulp = require('gulp');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var del = require('del');
var run = require('run-sequence');
var server = require('browser-sync').create();
//HTML
var svgstore = require('gulp-svgstore');
var posthtml = require('gulp-posthtml');
var include = require('posthtml-include');
var htmlmin = require('gulp-htmlmin');
var srcset = require('posthtml-sugar-srcset');
//CSS
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
//JS
var uglify = require('gulp-uglify');
//IMG
var imagemin = require('gulp-imagemin');
var webp = require('gulp-webp');

var src = {
    spite: 'sources/img/icon-*.svg',
    html: 'sources/*.html',
    fonts: 'sources/fonts/**/*.{woff,woff2}',
    css: 'sources/sass/style.scss',
    js: {
        global: 'sources/js/global/**/*.js',
        index: 'sources/js/index/**/*.js',
        foto: 'sources/js/foto/**/*.js',
        form: 'sources/js/form/**/*.js',
    },
    img: ['sources/img/*.{png,jpg,jpeg,svg}', '!sources/img/icon-*.svg', '!sources/img/sprite.svg'],
    webp: 'sources/img/*.{png,jpg,jpeg}',
};

var dest = {
    html: 'build/',
    fonts: 'build/fonts',
    css: 'build/css',
    js: 'build/js',
    img: 'build/img',
};

/* HTML */

gulp.task('sprite', function() {
    return gulp.src(src.spite)
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('sources/img'));
});

gulp.task('html', ['sprite'], function() {
    return gulp.src(src.html)
    .pipe(posthtml([
      include(),
      srcset()
    ]))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(dest.html))
    .pipe(server.stream());
});

/* Fonts */

gulp.task('fonts', function() {
    return gulp.src(src.fonts)
    .pipe(gulp.dest(dest.fonts));
});

/* CSS */

gulp.task('css', function() {
    return gulp.src(src.css)
    .pipe(plumber())
    .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest(dest.css))
        .pipe(csso())
    .pipe(sourcemaps.write())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest(dest.css))
    .pipe(server.stream());
});

/* JS */

gulp.task('js', function() {
    gulp.src(src.js.global)
    .pipe(plumber())
    .pipe(concat('global.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dest.js));

    gulp.src(src.js.index)
    .pipe(plumber())
    .pipe(sourcemaps.init())
        .pipe(concat('index.js'))
        .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest.js));

    gulp.src(src.js.foto)
    .pipe(plumber())
    .pipe(sourcemaps.init())
        .pipe(concat('foto.js'))
        .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest.js));

    gulp.src(src.js.form)
    .pipe(plumber())
    .pipe(sourcemaps.init())
        .pipe(concat('form.js'))
        .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest.js));
});

/* IMG */

gulp.task('img', function() {
    gulp.src(src.img)
    .pipe(imagemin([
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 3}),
        imagemin.svgo()
        ]))
    .pipe(gulp.dest(dest.img));

    gulp.src(src.webp)
    .pipe(webp())
    .pipe(gulp.dest(dest.img));
});

/* Build */

gulp.task('clean', function() {
    return del('build');
});

gulp.task('build', ['clean'], function(done) {
    run(
        'html',
        'fonts',
        'css',
        'js',
        'img',
        done
    );
});

/* Default */

gulp.task('default', ['build'], function() {
    server.init({
        server: "build",
        notify: false,
    });

    gulp.watch('sources/sass/**/*.scss', ['css']);
    gulp.watch('sources/**/*.html', ['html']);
    gulp.watch('sources/js/**/*.js', ['js'])
        .on('change', server.reload);
});
