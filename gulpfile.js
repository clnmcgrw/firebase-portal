//required modules
var gulp = require('gulp'),
		gulpif = require('gulp-if'),
		yargs = require('yargs').argv,
		sass = require('gulp-sass'),
		sourcemaps = require('gulp-sourcemaps'),
		concat = require('gulp-concat'),
		uglify = require('gulp-uglify'),
		jshint = require('gulp-jshint'),
		browser = require('browser-sync').create();


var PATHS = {
	inject: 'app/assets/css/*.css',
	scss: '_scss/**/*.scss',
	site: ['app/**/*.php','app/**/*.html'],
	imports: [
		'bower_components/bourbon/app/assets/stylesheets',
		'bower_components/neat/app/assets/stylesheets'
	],
	jslibs: [
		'bower_components/dropzone/dist/dropzone.js'
	],
	js: ['_js/app.js'],
	dest: {
		css: 'app/assets/css',
		js: 'app/assets/js'
	}
};

//Check for production flag
var isProduction = yargs.production ? true : false;



// Start a browsersync server
gulp.task('server', [], function() {
	browser.init({
    server: 'app',
    files: PATHS.inject
  });
});


// Compile SCSS
gulp.task('sass', function() {
	gulp.src(PATHS.scss)
	  .pipe(gulpif(!isProduction, sourcemaps.init()))
		.pipe(sass({
			includePaths: PATHS.imports,
			outputStyle: isProduction ? 'compressed' : 'nested'
		}))
		.pipe(gulpif(!isProduction, sourcemaps.write('./')))
		.pipe(gulp.dest(PATHS.dest.css));
});


// Concat/minify/lint JS
gulp.task('jslibs', function() {
	gulp.src(PATHS.jslibs)
	  .pipe(concat('plugins.js'))
	  .pipe(uglify())
	  .pipe(gulp.dest(PATHS.dest.js));
});

gulp.task('js', function() {
	gulp.src(PATHS.js)
	  .pipe(jshint())
	  .pipe(jshint.reporter('jshint-stylish'))
	  .pipe(gulpif(!isProduction, sourcemaps.init()))
		.pipe(concat('app.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(PATHS.dest.js));
});


//default task starts watchers
gulp.task('default', ['js', 'sass', 'server'], function() {
	gulp.watch(PATHS.scss, ['sass']);
	gulp.watch(PATHS.js, ['js']).on('change', browser.reload);
	gulp.watch(PATHS.site).on('change', browser.reload);
});
