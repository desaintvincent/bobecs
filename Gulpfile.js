const gulp = require('gulp');
const babel = require('gulp-babel');

const browserify = require('browserify');
const source = require('vinyl-source-stream');
const babelify = require('babelify');

gulp.task('build', function() {
    return gulp.src('./src/**/*.jsx')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./lib/'));
});

gulp.task('build:exemples', function() {
    const exemples = ['basic'];
    exemples.forEach(function(ex) {
        return browserify({entries: ['./exemples/es6/' + ex + '.js']})
            .transform(babelify.configure({
                presets: ['es2015']
            }))
            .bundle()
            .pipe(source(ex + '.js'))
            .pipe(gulp.dest('exemples/dist/'));
    });
});

gulp.task('watch', function() { gulp.watch('./src/**/*.jsx', ['build', 'build:exemples']); });
gulp.task('watch:exemples', function() { gulp.watch('./exemples/es6/**/*.js', ['build:exemples']); });

gulp.task('build:all', ['build', 'build:exemples']);
gulp.task('watch:all', ['build:all', 'watch', 'watch:exemples']);
gulp.task('default', ['build:all']);

