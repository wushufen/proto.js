/**
 * date format
 *
 * @author wushufen
 * @example
 * 
 * console.log(new Date(2017,11-1,30, 12,30,40).format('yyyy-MM-dd HH:mm:ss'))
 * 
 * @param  {String} format 'yyyy-MM-dd HH:mm:ss E'
 * @return {String}
 */
Date.prototype.format = function(format) {
    format = format || 'yyyy-MM-dd HH:mm:ss E';
    var date = this;
    var map = {
        y: date.getFullYear(),
        M: date.getMonth() + 1,
        d: date.getDate(),
        H: date.getHours(),
        h: function() {
            var h = date.getHours();
            return h > 12 ? h - 12 : h
        }(),
        m: date.getMinutes(),
        s: date.getSeconds(),
        S: date.getMilliseconds()
    };
    for (var key in map) {
        format = format.replace(RegExp(key + '+', 'g'), function($) {
            var v = map[key] + '',
                x = (Array($.length).join(0) + v).slice(-$.length);
            return v.length > x.length ? v : x;
        })
    }

    return format.replace(/E+/g, function() {
        return (date + '').match('中国') ?
            '星期' + '日一二三四五六'.charAt(date.getDay()) : date.getDay();
    })
}
