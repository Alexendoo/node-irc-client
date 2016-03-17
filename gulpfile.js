'use strict'

const gulp = require('gulp')
const util = require('gulp-util')
const runSequence = require('run-sequence')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer');
const del = require('del')

const browserify = require('browserify')
const vueify = require('vueify')
const watchify = require('watchify')
const babelify = require('babelify')

let opts = Object.assign({}, watchify.args, {
  entries: ['./client/main.js']
})
const b = watchify(browserify(opts))
b.transform(babelify)

gulp.task('default', cb => {
  runSequence(
    'clean',
    ['html', 'javascript'],
    'watch:html'
  )
})

gulp.task('clean', () => {
  return del('./build')
})

gulp.task('html', () => {
  return gulp.src('./client/index.html')
    .pipe(gulp.dest('build'))
})

gulp.task('watch:html', () => {
  gulp.watch('./client/index.html', ['html'])
})

gulp.task('javascript', bundle)
b.on('update', bundle)
b.on('log', util.log)

function bundle() {
  return b.bundle()
    .on('error', util.log.bind(util, ':('))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./build'))
}
