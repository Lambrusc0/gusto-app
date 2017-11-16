// //////////////////////////////////////////////////////////
// Required
// //////////////////////////////////////////////////////////
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    compass = require('gulp-compass'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename');


// //////////////////////////////////////////////////////////
// Scripts Task
// //////////////////////////////////////////////////////////
gulp.task('scripts', function(){
    gulp.src(['www/js/**/*.js', '!www/js/**/*.min.js'])
        .pipe(plumber())
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('www/js'))
        .pipe(reload({stream:true}));
});


// //////////////////////////////////////////////////////////
// Compass / Sass Task
// //////////////////////////////////////////////////////////
gulp.task('compass', function(){
    gulp.src('www/scss/style.scss')
        .pipe(plumber())
        .pipe(compass({
            config_file: './config.rb',
            css: 'www/css',
            sass: 'www/scss',
            require: ['susy']
        }))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest('www/css/'))
        .pipe(reload({stream:true}))
    })


// //////////////////////////////////////////////////////////
// HTML Task
// //////////////////////////////////////////////////////////
gulp.task('html', function(){
    gulp.src('www/**/*.html')
    .pipe(reload({stream:true}));
})


// //////////////////////////////////////////////////////////
// Browser-Sync Task
// //////////////////////////////////////////////////////////
gulp.task('browser-sync', function(){
    browserSync({
        server:{
            baseDir: "./www/"
        }
    })
})


// //////////////////////////////////////////////////////////
// Watch Task
// //////////////////////////////////////////////////////////
gulp.task('watch', function(){
    gulp.watch('www/js/**/*.js', ['scripts']);
    gulp.watch('www/scss/**/*.scss', ['compass']);
    gulp.watch('www/**/*.html', ['html']);
})


// //////////////////////////////////////////////////////////
// Default Task
// //////////////////////////////////////////////////////////

gulp.task('default', ['scripts', 'compass', 'html', 'browser-sync', 'watch']);