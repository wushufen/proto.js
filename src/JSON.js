/*
 * c 2016.04.01
 * u 2017.12.01
 * wushufen: 404315887@qq.com
 */

(function(global) {
    if (global.JSON) return

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
        stringify: function(obj, replacer, space) {
            if (getType(space) == 'number') {
                space = Array(space + 1).join(' ')
            }
            space = space ? space : ''

            return (function stringify(key, obj, deep) {
                deep = deep || 0
                if (deep > 10) {
                    // return '...'
                }

                // 转换器
                if (getType(replacer) == 'function') {
                    obj = replacer(key, obj)
                    if (obj === undefined) {
                        return
                    }
                }

                // 
                var type = getType(obj)
                if (obj && getType(obj.toJSON) == 'function') {
                    return stringify(key, obj.toJSON(), deep + 1)
                }
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

                var brSpacePop = space ? '\n' + Array(deep + 1).join(space) : '' // 2 换行缩进跳上一级
                var brSpace = space ? brSpacePop + space : '' // 1 换行缩进

                if (type == 'array') {
                    var arr = []
                    for (var i = 0; i < obj.length; i++) {
                        var s = stringify(i, obj[i], deep + 1)
                        s = s ? s : 'null' //转 null
                        arr.push(s)
                    }
                    return '[' +
                        (arr.length ? // 没子元素则不换行缩进
                            brSpace +
                            arr.join(',' + brSpace) +
                            brSpacePop : ''
                        ) +
                        ']'
                }
                if (type == 'object') {
                    var arr = []
                    for (var key in obj) {
                        var s = stringify(key, obj[key], deep + 1)
                        // replacer [keys]
                        if (getType(replacer) == 'array') {
                            replacer.indexOf(key) != -1 && arr.push('"' + key + '":' + s)
                        } else {
                            s && arr.push('"' + key + '":' + s) // && 忽略
                        }
                    }
                    return '{' +
                        (arr.length ?
                            brSpace +
                            arr.join(',' + brSpace) +
                            brSpacePop : ''
                        ) +
                        '}'
                }
            })('""', obj)
        }
    }

})(Function('return this')())


/*
console.log(
    // JSON.parse('{"x":alert()}'),
    // JSON.parse(
    JSON.stringify({
        un: undefined,
        nu: null,
        s: 'string',
        n: 1,
        b: true,
        o: { n: 1 },
        e: {},
        a: [undefined, null, 'string', 1, true, { n: 1 },
            [], Function, new Date, /reg/
        ],
        f: function() {},
        d: new Date,
        r: /reg/,
    }, ['a'], 4)
    // )
)*/