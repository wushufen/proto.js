/*
 * c 2016.04.01
 * u 2017.11.29
 * wushufen: 404315887@qq.com
 */

!(function(global) {
    // if (global.JSON) return

    global.JSON = {
        parse: function(json) {
            // 安全校验，如在 "..." 外有 () = ，则可能有恶意执行代码
            var left = String(json).replace(/"(\\.|.)*?"/g, '') // "str\"ing" --
            if (left.match(/\(|=/)) {
                throw 'parse match "(..)" or "="'
            }

            return global.eval('(' + json + ')') // 直接写 eval 会影响 uglify 压缩
        },
        stringify: function(obj, replacer, space) {
            if (typeof(space) == 'number') {
                space = Array(space + 1).join(' ')
            }
            space = space ? space : ''

            return (function stringify(key, obj, deep) {
                deep = deep || 0
                if (deep > 10) {
                    // return '...'
                }

                // 过滤转换器
                if (typeof(replacer) == 'function') {
                    obj = replacer(key, obj)
                    if (obj === undefined) {
                        return
                    }
                }

                // 
                var type = typeof obj
                if (obj === null || type == 'boolean') {
                    return String(obj)
                }
                if (type == 'number') {
                    return isFinite(obj) ? String(obj) : 'null'
                }
                if (type == 'string') {
                    return '"' + obj // 转义
                        .replace(/\\/g, '\\\\')
                        .replace(/\n/g, '\\n')
                        .replace(/"/g, '\\"')
                        + '"'
                }

                if (obj && typeof(obj.toJSON) == 'function') {
                    return stringify(key, obj.toJSON(), deep + 1) // date.toJSON
                }

                var brSpacePop = space ? '\n' + Array(deep + 1).join(space) : '' // 2 换行缩进跳上一级
                var brSpace = space ? brSpacePop + space : '' // 1 换行缩进

                if (obj instanceof Array) {
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
                        if (replacer instanceof Array) {
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
        a: [undefined, null, 'string', 1, true, { n: 1 }, [], Function, new Date, /reg/ ],
        f: function() {},
        d: new Date,
        r: /reg/,
    }, null, 4)
    // )
)*/

// console.log(global)
// console.log(this)
// console.log(eval('this'))
// console.log(function(){return this}()) // webpack 打包前加了 "use strict" this 为 undefined
// console.log(Function('return this')()) // 不会有以上情况