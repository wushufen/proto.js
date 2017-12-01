/*
 * c 2016.04.01
 * u 2017.12.01
 * wushufen: 404315887@qq.com
 */

(function(global) {
    // if (global.JSON) return

    var getType = function(obj) {
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
    }

    global.JSON = {
        parse: function(json) {
            // 安全校验，如在 "..." 外有 () = ，则可能有恶意执行代码
            var left = String(json).replace(/"(\\.|.)*?"/g, '') // "str\"ing" --
            if (left.match(/\(|=/)) {
                throw 'parse match "(..)" or "="'
            }

            return global.eval('(' + json + ')')
        },
        stringify: function(obj) {
            return (function loop(obj) {
                var type = getType(obj)
                if (type == 'null' || type == 'number' || type == 'boolean') {
                    return String(obj)
                }
                if (type == 'string') {
                    return '"' + obj + '"'
                }
                if (type == 'regexp') {
                    return '{}'
                }
                if (type == 'date') {
                    return '"' + obj.toISOString() + '"'
                }
                if (type == 'array') {
                    var arr = []
                    for (var i = 0; i < obj.length; i++) {
                        arr.push(loop(obj[i]))
                    }
                    return '[' + arr.join(',') + ']'
                }
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

})(Function('return this')())


/*
console.log(
    // JSON.parse('{"x":alert()}'),
    JSON.parse(
        JSON.stringify({
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
        })
    )
)
*/