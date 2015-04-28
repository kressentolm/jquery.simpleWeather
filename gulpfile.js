var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	jshint = require('gulp-jshint'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	bump = require('gulp-bump'),
	notify = require('gulp-notify'),
	git = require('gulp-git'),
	size = require('gulp-size'),
	pkg = require('./package.json');

var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var reload = browserSync.reload;

var source = "jquery.simpleWeather.js",
	sourceMin = "jquery.simpleWeather.min.js";

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function () {

	browserSync.init({
		server: "./"
	});

	gulp.watch("scss/*.scss", ['sass']);
	gulp.watch("*.html").on('change', reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
	return gulp.src("scss/*.scss")
		.pipe(sass())
		.pipe(gulp.dest("css"))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('default', ['serve']);

gulp.task('lint', function () {
	return gulp.src(source)
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('jshint-stylish'));
});

// Static server
gulp.task('browser-sync', function () {
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});
});

gulp.task('build', ['lint'], function () {
	return gulp.src(source)
		.pipe(rename(sourceMin))
		.pipe(uglify({
			preserveComments: 'some'
		}))
		.pipe(size())
		.pipe(gulp.dest('./'));
});

gulp.task('bump', function () {
	return gulp.src(['./bower.json', './component.json', 'simpleweather.jquery.json'])
		.pipe(bump({
			version: pkg.version
		}))
		.pipe(gulp.dest('./'));
});

gulp.task('tag', ['bump'], function () {
	return gulp.src('./')
		.pipe(git.commit('Version ' + pkg.version))
		.pipe(git.tag(pkg.version, 'Version ' + pkg.version))
		.pipe(git.push('monkee', 'master', '--tags'))
		.pipe(gulp.dest('./'));
});