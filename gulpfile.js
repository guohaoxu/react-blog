var gulp = require('gulp'),
  concat = require('gulp-concat'),
  cleanCSS = require('gulp-clean-css'),
  uglify = require('gulp-uglify'),
  htmlreplace = require('gulp-html-replace'),
  rev = require('gulp-rev'),
  imagemin = require('gulp-imagemin'),
  rename = require('gulp-rename'),
  revCollector = require('gulp-rev-collector'),
  revReplace = require('gulp-rev-replace')
  minifyHTML = require('gulp-minify-html'),

  mocha = require('gulp-mocha'),
  eslint = require('gulp-eslint'),
  hash = require('gulp-hash')

gulp.task('lint', () => {
  gulp.src(['**/*.js', '!node_modules/**', '!build/**', '!dist/bootstrap/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})
gulp.task('build', () => {
  gulp.src('./dist/images/*')
    // .pipe(imagemin())
    .pipe(hash())
    .pipe(gulp.dest('./build/images/'))
    .pipe(hash.manifest('hash.json'))
    .pipe(gulp.dest('./build/'))

    gulp.src(['./dist/bootstrap/css/bootstrap.min.css', './dist/css/*.css'])
      .pipe(concat('all.css'))
      .pipe(cleanCSS())
      .pipe(hash())
      .pipe(gulp.dest('./build/stylesheets/'))
      .pipe(hash.manifest('hash.json'))
      .pipe(gulp.dest('./build/'))

    gulp.src(['./dist/js/bundle.js', './dist/js/jquery-1.12.1.min.js', './dist/bootstrap/js/bootstrap.min.js'])
      .pipe(concat('all.js', {newLine: ';'}))
      .pipe(uglify())
      .pipe(hash())
      .pipe(gulp.dest('./build/javascripts/'))
      .pipe(hash.manifest('hash.json'))
      .pipe(gulp.dest('./build/'))

    gulp.src('./dist/favicon.ico')
      .pipe(gulp.dest('./build/'))

    gulp.src('./dist/bootstrap/fonts/*')
      .pipe(gulp.dest('./build/fonts/'))

    gulp.src('./dist/uploads/*')
      // .pipe(imagemin())
      .pipe(gulp.dest('./build/uploads/'))

  gulp.src('./index_dev.ejs')
    .pipe(rename('./index.ejs'))
    .pipe(htmlreplace({
      'css': '/static/stylesheets/all.css',
      'js': '/static/javascripts/all.js'
    }))
    .pipe(gulp.dest('./'))

})


gulp.task('default', ['build'], () => {
  gulp.src(['./build/hash.json', './build/stylesheets/*.css'])
    .pipe(revCollector())
    .pipe(gulp.dest('./'))

  gulp.src(['./build/hash.json', './index.ejs'])
    .pipe(revCollector({
      // dirReplacements: {
      //   '/static/stylesheets/': (manifest_value) => {
      //     return '//localhost:3000' + '/static/stylesheets/' + manifest_value
      //   },
      //   '/static/javascripts/': (manifest_value) => {
      //     return '//localhost:3000' + '/static/javascripts/' + manifest_value
      //   }
      // }
    }))
    .pipe(gulp.dest('./'))


    // gulp.watch(['**/*.js', '!node_modules/**', '!build/**', '!dist/bootstrap/**'], ['lint'])
})

gulp.task('test', () => {
  gulp.src('./test/*.js')
    .pipe(mocha())
})
