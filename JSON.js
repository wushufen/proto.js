/*
 * c 2016.04.01
 * u 2017.11.29
 * wushufen: 404315887@qq.com
 */

(function(global) {

    global.JSON = global.JSON || {
        parse: function(json) {
            // 安全校验
            // todo

            return global.eval('(' + json + ')')
        },
        stringify: function(obj) {
            return (function loop(obj) {
                var type = Object.getType(obj)
                if (type == 'null' || type == 'number' || type == 'boolean') {
                    return String(obj)
                } else
                if (type == 'string') {
                    return '"' + obj + '"'
                } else
                if (type == 'regexp') {
                    return '{}'
                } else
                if (type == 'date') {
                    return '"' + obj.toISOString() + '"'
                } else
                if (type == 'array') {
                    var arr = []
                    for (var i = 0; i < obj.length; i++) {
                        arr.push(loop(obj[i]))
                    }
                    return '[' + arr.join(',') + ']'
                } else
                if (type == 'object') {
                    var arr = []
                    for (var key in obj) {
                        var s = loop(obj[key])
                        s && arr.push('"' + key + '":' + s)
                    }
                    return '{' + arr.join(',') + '}'
                }
            })(obj)
        }
    }
})(new Function('return this')())

/*
require('./type.js')

console.log(JSON.parse(JSON.stringify({
    un: undefined,
    nu: null,
    s: 'string',
    n: 1,
    b: true,
    o: { n: 1 },
    a: [1, 2, 3],
    f: function() {},
    d: new Date,
    r: /reg/,
})))
*/