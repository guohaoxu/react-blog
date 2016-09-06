var gulp = require('gulp'),
  concat = require('gulp-concat'),
  cleanCSS = require('gulp-clean-css'),
  uglify = require('gulp-uglify'),
  htmlreplace = require('gulp-html-replace'),
  rev = require('gulp-rev'),
  hash = require('gulp-hash'),
  imagemin = require('gulp-imagemin'),
  rename = require('gulp-rename'),
  revReplace = require('gulp-rev-replace'),
  revCollector = require('gulp-rev-collector'),
  htmlmin = require('gulp-htmlmin'),
  clean = require('gulp-clean'),
  mocha = require('gulp-mocha'),
  eslint = require('gulp-eslint'),
  webpack = require('webpack-stream'),
  addsrc = require('gulp-add-src'),
  less = require('gulp-less'),
  livereload = require('gulp-livereload'),
  cache = require('gulp-cached')

// code lint
gulp.task('lint', () => {
  return gulp.src(['**/*.js', '!./node_modules/**', '!./build/**', '!./public/bootstrap/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

// code test
gulp.task('test', ['lint'], () => {
  return gulp.src('./test/*.js')
    .pipe(mocha())
})

// clean build bir
gulp.task('cleanBuild', () => {
  return gulp.src('./build/*', {read: false})
    .pipe(clean())
})

// copy  un-modify files
gulp.task('copy', ['cleanBuild'], () => {
  // copy icon
  gulp.src('./public/favicon.ico')
    .pipe(gulp.dest('./build/'))
    // copy fonts
  gulp.src('./public/bootstrap/fonts/*')
    .pipe(gulp.dest('./build/fonts/'))
  // copy uploads
  gulp.src('./public/uploads/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./build/uploads/'))
})

// bundle webpack
gulp.task('webpack', () => {
  return gulp.src('./index.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('./public/javascripts/'))
})

// build images
gulp.task('build:images', ['cleanBuild'], () => {
  return gulp.src('./public/images/*')
    .pipe(cache('minimages'))
    .pipe(imagemin())
    .pipe(hash())
    .pipe(gulp.dest('./build/images/'))
    .pipe(hash.manifest('hash.json'))
    .pipe(gulp.dest('./build/'))
})

//build css
gulp.task('build:css', ['cleanBuild'], () => {
  return gulp.src(['./public/bootstrap/css/bootstrap.min.css', './public/stylesheets/*.css'])
    .pipe(concat('all.css'))
    .pipe(cleanCSS())
    .pipe(hash())
    .pipe(gulp.dest('./build/stylesheets/'))
    .pipe(hash.manifest('hash.json'))
    .pipe(gulp.dest('./build/'))
})

//build js
gulp.task('build:js', ['cleanBuild', 'webpack'], () => {
  return gulp.src(['./public/javascripts/bundle.js', './public/bootstrap/js/bootstrap.min.js'])
    .pipe(concat('all.js', {newLine: ';'}))
    .pipe(uglify())
    .pipe(hash())
    .pipe(gulp.dest('./build/javascripts/'))
    .pipe(hash.manifest('hash.json'))
    .pipe(gulp.dest('./build/'))
})

gulp.task('build', ['build:images', 'build:css', 'build:js'], () => {
  //
})

var staticDomain = process.env.staticDomain ? process.env.staticDomain : ''

// css replace hashed images
gulp.task('replace:css', ['build'], () => {
  return gulp.src(['./build/hash.json', './build/stylesheets/*.css'])
    .pipe(revCollector({
      replaceReved: true,
      dirReplacements: {
        '/static/images/': (manifest_value) => {
          return staticDomain + '/static/images/' + manifest_value
        }
      }
    }))
    .pipe(gulp.dest('./build/stylesheets/'))
})

// js replace hashed images
gulp.task('replace:js', ['build'], () => {
  return gulp.src(['./build/hash.json', './build/javascripts/*.js'])
    .pipe(revCollector({
      replaceReved: true,
      dirReplacements: {
        '/static/images/': (manifest_value) => {
          return staticDomain + '/static/images/' + manifest_value
        }
      }
    }))
    .pipe(gulp.dest('./build/javascripts/'))
})

// html replace hashed css js
gulp.task('replace:html', ['build'], () => {
  return gulp.src('./public/index.html')
    .pipe(htmlreplace({
      'css': '/static/stylesheets/all.css',
      'js': '/static/javascripts/all.js'
    }))
    .pipe(addsrc('./build/hash.json'))
    .pipe(revCollector({
      replaceReved: true,
      dirReplacements: {
        '/static/images/': (manifest_value) => {
          return staticDomain + '/static/images/' + manifest_value
        },
        '/static/stylesheets/': (manifest_value) => {
          return staticDomain + '/static/stylesheets/' + manifest_value
        },
        '/static/javascripts/': (manifest_value) => {
          return staticDomain + '/static/javascripts/' + manifest_value
        }
      }
    }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./build'))
})

gulp.task('replace', ['replace:css', 'replace:js', 'replace:html'], () => {
  //
})
gulp.task('default', ['copy', 'replace'], () => {
  //
})

// less
gulp.task('less', () => {
  return gulp.src('./public/stylesheets/*.less')
    .pipe(less())
    .pipe(gulp.dest('./public/stylesheets/'))
    .pipe(livereload())
})

gulp.task('watch', () => {
  livereload.listen()
  gulp.watch('./public/stylesheets/*.less', ['less'])

  gulp.watch(['./public/**', '!./public/uploads/*'], (file) => {
    livereload.changed(file.path)
  })
})
