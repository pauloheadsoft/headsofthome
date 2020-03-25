var gulp      = require('gulp'),
	gutil       = require( 'gulp-util' ),
	sass        = require( 'gulp-sass' ),
	sourcemaps  = require('gulp-sourcemaps'),
	wait        = require('gulp-wait'),
	gulpIf      = require('gulp-if'),
	runSequence = require('run-sequence');

var autoprefixer = require('gulp-autoprefixer'),
	plumber        = require('gulp-plumber'),
	browserSync    = require('browser-sync').create(),
	reload         = browserSync.reload;

var config = {
	isProd: false
};

var AUTOPREFIXER_BROWSERS = [
	'last 2 version',
	'> 2%',
	'ie >= 10',
	'ie_mob >= 10',
	'ff >= 30',
	'chrome >= 34',
	'safari >= 7',
	'opera >= 23',
	'ios >= 7',
	'android >= 4',
	'bb >= 10'
	];

var build_includes 	= [
		'app/**/*.*',
		// exclude files and folders
		'!app/css/scss/**/*',
		'!app/css/source-maps/**/*'
	];

gulp.task( 'browser-sync', function() {
	browserSync.init( {
		server: {
						baseDir: "./app/"
				},
		// proxy: 'http://localhost/cargo-html/app/',
		open: true,
		injectChanges: true,
		// Use a specific port (instead of the one auto-detected by Browsersync).
		// port: 7000,
		options: {
			reloadDelay: 250
		}
	} );
});



// 1. Compile sass
gulp.task('build-css', function() {
	return gulp.src('app/css/scss/template.scss')
		.pipe(plumber({
					errorHandler: function (err) {
						console.log(err);
						this.emit('end');
					}
				}))
		.pipe(wait(300))
		.pipe( gulpIf(!config.isProd, sourcemaps.init() ) )
		.pipe( sass( {
			errLogToConsole: true,
			outputStyle: 'compact',
			outputStyle: 'compressed',
			outputStyle: 'nested',
			outputStyle: 'expanded',
			precision: 10
		}) )
		.pipe( gulpIf(config.isProd, autoprefixer( AUTOPREFIXER_BROWSERS ) ) )
		.on('error', gutil.log)
		.pipe( gulpIf( ! config.isProd, sourcemaps.write ( '/source-maps/' ) ) )// Create non-minified sourcemap
		.pipe(gulp.dest('app/css/'))
		.pipe(browserSync.reload({stream: true}));
});

// 2. Compile JS plugins
// 3. BrowserSync
gulp.task('default', ['build-css', 'browser-sync'],  function(){
	gulp.watch( 'app/css/scss/**/*.scss', [ 'build-css' ] ); // Reload on SCSS file changes.
	gulp.watch( 'app/*.html', [ 'reload' ] ); // Reload on HTML file changes.
});


gulp.task('reload', function(){
	browserSync.reload();
})

gulp.task('copy-files', function(){
	return gulp.src(build_includes)
		.pipe(gulp.dest( 'dist' ));
});

// 4. Build
gulp.task('build', function(callback) {
	config.isProd = false;
	runSequence('build-css', 'copy-files', callback);
});
