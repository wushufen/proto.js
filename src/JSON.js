/*
 * c 2016.04.01
 * u 2017.11.29
 * wushufen: 404315887@qq.com
 */

!(function(global) {
    if (global.JSON) return

    var typeOf = function(value){
        return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
    }

    global.JSON = {
        parse: function(json) {
            // 简单安全校验，如在 "..." 外有 () = ，则可能有恶意执行代码
            var left = String(json).replace(/"(\\.|.)*?"/g, '') // "str\"ing" --
            if (left.match(/\(|=/)) {
                throw 'parse match "(..)" or "="'
            }

            return global.eval('(' + json + ')') // 直接写 eval 会影响 uglify 压缩
        },
        stringify: function(value, replacer, space) {
            // space
            if (typeOf(space) == 'number') {
                space = Array(space + 1).join(' ')
            }
            space = space ? space : ''

            // loop
            return (function handler(key, value, deep) {
                deep = deep || 0
                if (deep > 10) {
                    // return '...'
                }

                // replacer
                if (typeOf(replacer) == 'function') {
                    value = replacer(key, value)
                }
                if (typeOf(value) == 'undefined') {
                    return undefined
                }
                if (typeOf(value) == 'null') {
                    return 'null'
                }
                if (typeOf(value) == 'boolean') {
                    return String(value)
                }
                if (typeOf(value) == 'number') {
                    return isFinite(value) ? String(value) : 'null'
                }
                // string \\\\
                if (typeOf(value) == 'string') {
                    return '"' + value
                        .replace(/\\/g, '\\\\')
                        .replace(/\n/g, '\\n')
                        .replace(/"/g, '\\"')
                        + '"'
                }
                // .toJSON
                if (value && typeOf(value.toJSON) == 'function') {
                    return handler(key, value.toJSON(), deep + 1)
                }

                // indent
                var brSpacePop = space ? '\n' + Array(deep + 1).join(space) : '' // 2 换行缩进跳上一级
                var brSpace = space ? brSpacePop + space : '' // 1 换行缩进

                // array
                if (typeOf(value) == 'array') {
                    var arr = []
                    for (var i = 0; i < value.length; i++) {
                        var item = handler(i, value[i], deep + 1)
                        if (typeOf(item) == 'undefined') {
                            item = 'null'
                        }
                        arr.push(item)
                    }
                    return '[' +
                        (arr.length ? // 没子元素则不换行缩进
                            brSpace +
                            arr.join(',' + brSpace) +
                            brSpacePop : ''
                        ) +
                        ']'
                }
                // object
                if (typeof value == 'object') {
                    // `"key": value`
                    var arr = []
                    for (var key in value) {
                        var item = handler(key, value[key], deep + 1)
                        // replacer [keys]
                        if (typeOf(replacer) == 'array') {
                            if (replacer.indexOf(key) != -1) {
                                arr.push('"' + key + '":' + item)
                            }
                        } else {
                            if (typeOf(item) != 'undefined') {
                                arr.push('"' + key + '":' + item)
                            }
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
            })('""', value)
        }
    }

})(Function('return this')())



console.log(
    // JSON.parse('{"x":alert()}'),
    JSON.parse(
    JSON.stringify({
        un: undefined,
        nu: null,
        s: "string\"a\nb\\c",
        S: new String('S'),
        n: 1,
        N: new Number(0),
        b: true,
        B: new Boolean(false),
        o: { n: 1 },
        e: {},
        a: [undefined, null, 'string', 1, true, { n: 1 }, [], Function, new Date, /reg/ ],
        f: function() {},
        d: new Date,
        r: /reg/,
        sb: Symbol(''),
        set: new Set([1])
    }, null, 4)
    )
)

// console.log(global)
// console.log(this)
// console.log(eval('this'))
// console.log(function(){return this}()) // webpack 打包前加了 "use strict" this 为 undefined
// console.log(Function('return this')()) // 不会有以上情况