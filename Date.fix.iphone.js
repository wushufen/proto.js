/*
修复 ios 系统不支持日期使用 "-" 的 bug
*/
if (new Date('2017-05-05') == 'Invalid Date') {
    var _Date = Date;
    window.Date = function(y, M, d, h, m, s, S) {
        if (this instanceof Date) {
            return [
                new _Date,
                (function() {
                    return new _Date(
                        typeof y == 'string' ? y.replace(/-/g, '\/') : y
                    )
                })(),
                new _Date(y, M),
                new _Date(y, M, d),
                new _Date(y, M, d, h),
                new _Date(y, M, d, h, m),
                new _Date(y, M, d, h, m, s),
                new _Date(y, M, d, h, m, s, S)
            ][arguments.length]
        } else {
            return _Date()
        }
    }
}
