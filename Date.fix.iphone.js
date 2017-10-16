/*
c 20170505
u 20170713

https://github.com/wusfen/pro.js
修复 iphone 支持 "yyyy-MM-dd" ，却不支持 "yyyy-MM-dd HH:mm:ss"
自动将 "-" 转换为 "/"

注意：因为修改了原生的 Date, 所以不可使用 date instanceof Date

*/
! function() {
    // if (new Date('2017-05-05 00:00:00') == 'Invalid Date') {
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
    for (var key in _Date) {
        Date[key] = _Date[key]
    }
    Date.UTC = _Date.UTC;
    Date.now = _Date.now;
    Date.parse = _Date.parse;
    // }
}();
