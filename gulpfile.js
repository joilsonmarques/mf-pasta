var gulp        	= require('gulp');
var browserSync 	= require('browser-sync').create();
var less        	= require('gulp-less');
var minifyCSS 		= require('gulp-minify-css');
var postcss      	= require('gulp-postcss');
var uncss 			= require('gulp-uncss');
var concat 			= require('gulp-concat');
var csso 			= require('gulp-csso');
var sourcemaps   	= require('gulp-sourcemaps');
var autoprefixer 	= require('autoprefixer-core');
var gzip 			= require('gulp-gzip');
var uglify 			= require('gulp-uglify');
var rename 			= require("gulp-rename");
var useref 			= require('gulp-useref');
var gulpif 			= require('gulp-if');
var reload      	= browserSync.reload;

gulp.task('compress', function() {
    gulp.src('./src/js/**/*.js')
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gzip())
    .pipe(gulp.dest('./dest/js'));
});


// Static Server + watching less/html files
gulp.task('serve', ['less'], function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch("src/less/*.less", ['less']);
    gulp.watch("**/*.html").on('change', reload);
});

// Compile less into CSS & auto-inject into browsers
gulp.task('less', function() {
    return gulp.src("src/less/*.less")
        .pipe(less())
        .pipe(gulp.dest("dest/assets/css"))
        .pipe(csso())
        .pipe(gulp.dest("dest/assets/css"))
        .pipe(sourcemaps.init())
        .pipe(postcss([ autoprefixer({ browsers: ['last 2 version'] }) ]))
        .pipe(sourcemaps.write('.'))
        .pipe(minifyCSS()).pipe(minifyCSS())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest("dest/assets/css"))
        .pipe(reload({stream: true}));
});

gulp.task('default', ['serve', 'compress']);