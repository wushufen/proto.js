/*
 * c 2016.04.01
 * u 2017.11.29
 * wushufen: 404315887@qq.com
 */

!(function(Object, prototype) {

    Object.assign = Object.assign || function(obj, objn) {
        for (var i = 1; i < arguments.length; i++) {
            var obj2 = arguments[i];
            for (var key in obj2) {
                if (!obj2.hasOwnProperty(key)) continue;
                obj[key] = obj2[key];
            }
        }
        return obj
    }
    Object.keys = Object.keys || function(obj) {
        var keys = [];
        for (var key in obj) {
            if (!obj.hasOwnProperty(key)) continue;
            keys.push(key);
        }
        return keys
    }
    Object.values = function(obj) {
        var values = [];
        for (var key in obj) {
            if (!obj.hasOwnProperty(key)) continue;
            values.push(obj[key]);
        }
        return values
    }

    Object.copy = function(obj, max) {
        var list = []
        var count = 0
        max = max || 1000

        var _obj = copyFirst(obj)

        function copyFirst(obj) {
            // console.log(count, obj)
            var type = typeof obj

            count += 1
            if (count > max) {
                // return '...'
                return obj
            }
            if (obj === null || type != 'object') {
                return obj
            } else {
                var _obj = obj instanceof Array ? [] : {}
                list.push({
                    obj: obj,
                    _obj: _obj
                })
                return _obj
            }
        }

        while (list.length) {
            (function() {

                var info = list.shift()
                var obj = info.obj
                var _obj = info._obj

                if (obj instanceof Array) {
                    for (var key = 0; key < obj.length; key++) {
                        _obj[key] = copyFirst(obj[key])
                    }
                } else {
                    for (var key in obj) {
                        _obj[key] = copyFirst(obj[key])
                    }
                }

            })()
        }

        return _obj
    }

})(Object, Object.prototype)
