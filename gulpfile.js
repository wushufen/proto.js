var gulp = require('gulp');




// $ gulp 
gulp.task('default'); // gulp 命令行必须有 default 才执行，虽然这里什么也没干。。
// $ node thisfile
// 延时执行，任务在后面定义，并且 gulp 命令行和 node 直接执行都支持
setTimeout(function() {
    // ！！！执行任务
    gulp.run('js');
});





// js
gulp.task('js', function() {
    var uglify = require('gulp-uglify');
    var concat = require('gulp-concat');

    gulp.src('{license,{Object,Array,Date,Function,String,Number,Boolean,type}.js}')
        .pipe(uglify({
            output: {
                comments: /license/,
            }
        }))
        .pipe(concat('proto.js'))
        .pipe(gulp.dest('dest'))

})