var gulp = require('gulp'),
  concat = require('gulp-concat'),
  cleanCSS = require('gulp-clean-css'),
  uglify = require('gulp-uglify'),
  htmlreplace = require('gulp-html-replace'),
  rev = require('gulp-rev'),
  imagemin = require('gulp-imagemin'),
  rename = require('gulp-rename'),
  revCollector = require('gulp-rev-collector'),
  minifyHTML = require('gulp-minify-html'),

  mocha = require('gulp-mocha'),
  eslint = require('gulp-eslint')

gulp.task('lint', () => {
  gulp.src(['**/*.js', '!node_modules/**', '!build/**', '!dist/bootstrap/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})
gulp.task('build', ['lint'], () => {

  gulp.src('./dist/uploads/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./build/uploads/'))

  gulp.src('./index_dev.ejs')
    .pipe(rename('./index.ejs'))
    .pipe(htmlreplace({
      'css': '/static/stylesheets/all.css',
      'js': '/static/javascripts/all.js'
    }))
    .pipe(gulp.dest('./'))

  gulp.src('./dist/favicon.ico')
    .pipe(gulp.dest('./build/'))

  gulp.src(['./dist/bootstrap/css/bootstrap.min.css', './dist/css/main.css'])
    .pipe(concat('all.css'))
    .pipe(cleanCSS())
    .pipe(rev())
    .pipe(gulp.dest('./build/stylesheets/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./build/stylesheets/'))

  gulp.src(['./dist/js/bundle.js', './dist/js/jquery-1.12.1.min.js', './dist/bootstrap/js/bootstrap.min.js'])
    .pipe(concat('all.js', {newLine: ';'}))
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./build/javascripts/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./build/javascripts/'))

  gulp.src('./dist/bootstrap/fonts/*')
    .pipe(gulp.dest('./build/fonts/'))

})

gulp.task('default', ['build'], () => {
  gulp.src(['./build/**/*.json', './index.ejs'])
    .pipe(revCollector({
      replaceReved: true,
      dirReplacements: {
        '/static/stylesheets/': (manifest_value) => {
          return '//localhost:3000' + '/static/stylesheets/' + manifest_value
        },
        '/static/javascripts/': (manifest_value) => {
          return '//localhost:3000' + '/static/javascripts/' + manifest_value
        }
      }
    }))
    .pipe(gulp.dest('./'))
})

gulp.task('test', () => {
  gulp.src('./test/*.js')
    .pipe(mocha())
})
