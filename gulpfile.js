const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const purgecss = require('gulp-purgecss');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;

gulp.task('html', () => {
    return gulp.src('src/*.html')
        .pipe(htmlmin({ collapseWhitespace: true, minifyJS: true, minifyCSS: true, minifyURLs: true, removeComments: true }))
        .pipe(gulp.dest('dist'));
});

gulp.task('styles', () => {
    return gulp.src('src/css/*.css')
        .pipe(purgecss({
            content: ['src/*.html']
        }))
        .pipe(concat('all.css'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('scripts', () => {
    return gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', gulp.series('scripts', 'styles', 'html'));
