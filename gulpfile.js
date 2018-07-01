var gulp        = require('gulp');
// 伺服器瀏覽
var browserSync = require('browser-sync').create();
// SASS -> CSS
var sass        = require('gulp-sass');
// JS壓縮
var gulpUglify  = require('gulp-uglify');
// CSS打包
var concat      = require('gulp-concat');
// CSS - minify
var minifyCSS  = require('gulp-minify-css');
// autoprefixer 
var autoprefixer = require('autoprefixer');
// postcss 
var postcss = require('gulp-postcss');
// 改名字
var rename      = require("gulp-rename");
// 壓縮圖片
var gulpImagemin = require('gulp-imagemin');
// 服務
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "."  
    });

    gulp.watch("*.html").on('change', browserSync.reload);
});
// 監看工作
gulp.task('watch', ['sass'] ,function () {

    // SASS -> CSS
    gulp.watch("./asset/scss/*.scss", ['sass']);
    // CSS  -> 打包
    gulp.watch("./asset/css/original/*.css", ['concat']);
    // CSS  -> 打包
    gulp.watch("./asset/css/build/*.css", ['minify-css']);
    // 壓縮 JS -> JS.min
    gulp.watch(['./asset/js/original/*.js'], ['script']);

    gulp.watch("*.html").on('change', browserSync.reload);
});

// 編譯 SASS 檔案 -> CSS 檔案
gulp.task('sass', function() {
    var processors = [
        autoprefixer({browsers: ['last 2 versions'], grid: true })
    ];
    return gulp.src("./asset/scss/*.scss")
        .pipe(sass(
            {outputStyle: 'expanded'}
        ).on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(gulp.dest("./asset/css/original"))
        .pipe(browserSync.stream());             
});
//  打包CSS
gulp.task('concat', function() {
    gulp.src('./asset/css/original/*.css')
        .pipe(concat('all.css'))
        .pipe(gulp.dest('./asset/css/build'))
        .pipe(browserSync.stream());
        
    gulp.watch("*.html").on('change', browserSync.reload);       
});
//  打包CSS -> CSS - minify
gulp.task('minify-css',['concat'], function() {
    return gulp.src('./asset/css/build/all.css')
        .pipe(minifyCSS({
            keepBreaks: true,
        }))
        .pipe(rename(function(path) {
            path.basename += ".min";
            path.extname = ".css";
        }))
        .pipe(gulp.dest('./asset/css/build'))
        .pipe(browserSync.stream());       
        
});
//  壓縮 JS -> JS.min
gulp.task('script', function () {
    gulp.src('./asset/js/original/*.js')        
        .pipe(gulpUglify()) 
        .pipe(rename(function(path) {
            path.basename += ".min";
            path.extname = ".js";
        }))                    
        .pipe(gulp.dest('asset/js/minify'));  
        
    gulp.watch("*.html").on('change', browserSync.reload);    
});

//  壓縮圖片
gulp.task('image', function () {
    gulp.src('./asset/images/**')
        .pipe(gulpImagemin())
        .pipe(gulp.dest('images'));
});

gulp.task('default', ['serve', 'watch', 'script']);