global <<<< require \prelude-ls
require! <[gulp gulp-plumber gulp-webserver gulp-watch gulp-babel gulp-pug run-sequence]>
{exec} = require \child_process
K = (x, y)--> x
arg = (n)-> -> &.(n)
act = (f, x)--> x |> f |> (K x)

gulp.task \dev, ->
  run-sequence \build, <[watch serve]>

gulp.task \serve, ->
  gulp.src \./dist/ .pipe gulp-webserver(
    host: process.env.IP
    port: process.env.PORT || 3000
  )

gulp.task \build, (next)->
  run-sequence <[es6 pug copy]>, next

gulp.task \watch, ->
  <[es6 pug]>
  |> map (ext)->
    gulp-watch "#__dirname/../src/**/*.#ext", (K ext) >> gulp~start
  gulp-watch "#__dirname/../src/**/*.{png,jpg}", (K \copy) >> gulp~start

gulp.task \es6, ->
  gulp
    .src "#__dirname/../src/**/*.es6"
    .pipe gulp-plumber!
    .pipe gulp-babel presets: <[es2015 stage-2]>
    .pipe gulp.dest "#__dirname/../dist/"

gulp.task \pug, ->
  gulp
    .src "#__dirname/../src/**/*.pug"
    .pipe gulp-plumber!
    .pipe gulp-pug!
    .pipe gulp.dest "#__dirname/../dist/"

gulp.task \copy, ->
  gulp
    .src "#__dirname/../src/**/*.{png,jpg}"
    .pipe gulp-plumber!
    .pipe gulp.dest "#__dirname/../dist/"
