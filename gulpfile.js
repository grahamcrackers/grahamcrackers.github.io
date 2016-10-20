var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');
//var sourcemaps = require('gulp-sourcemaps');
var ghPages = require('gulp-gh-pages');

// Running sass commands
gulp.task('sass', function(){
	return gulp.src('public/scss/**/*.scss')
		//.pipe(sourcemaps.init())
		.pipe(sass())
		//.pipe(sourcemaps.write('.'))
		.pipe(autoprefixer())
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

// Sync with server
gulp.task('browserSync', function(){
	browserSync.init({
		server: {
			baseDir: 'public'
		}
	});
});

gulp.task('useref', function(){
	return gulp.src('public/*.html')
		.pipe(useref())
		.pipe(gulpIf('*.js', uglify()))
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
	return gulp.src('public/img/**/*.+(png|jpg|jpeg|gif|svg)')
		.pipe(cache(imagemin()))
		.pipe(gulp.dest('dist/img'))
});

// dont need this right now
gulp.task('fonts', function(){
	return gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'))
})


gulp.task('clean:dist', function(){
	return del.sync('dist');
})

// Copy vendor libraries from node_modules to vendor folder
gulp.task('vendor', function(){
    gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulpIf('!public/vendor/bootstrap', gulp.dest('public/vendor/bootstrap')))

    gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulpIf('!public/vendor/jquery' ,gulp.dest('public/vendor/jquery')))

    gulp.src(['node_modules/devicon/**/*'])
        .pipe(gulpIf('!public/vendor/devicon' ,gulp.dest('public/vendor/devicon')))

    /*gulp.src(['node_modules/magnific-popup/dist/*'])
        .pipe(gulp.dest('public/vendor/magnific-popup'))

    gulp.src(['node_modules/scrollreveal/dist/*.js'])
        .pipe(gulp.dest('public/vendor/scrollreveal'))
	*/
    gulp.src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(gulpIf('!public/vendor/font-awesome', gulp.dest('public/vendor/font-awesome')))
})

gulp.task('watch', ['browserSync', 'sass'], function(){
	gulp.watch('public/scss/**/*.scss', ['sass']);
	gulp.watch('public/*.html', browserSync.reload);
	gulp.watch('public/js/**/*.js', browserSync.reload);
});

// build project for master branch
gulp.task('build', function(callback){
	runSequence('clean:dist', ['sass','useref','images','fonts'], callback)
})

// push project to master branch
gulp.task('deploy', function(callback){
	return gulp.src('./dist/**/*')
		.pipe(ghPages());
})

gulp.task('default', function(callback){
	runSequence(['vendor','sass','browserSync','watch'], callback)
})
