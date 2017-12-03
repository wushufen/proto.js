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
        var count = 0;
        return (function copy(parent, key, obj, depth) {
            // console.log(count, parent, key)
            // console.log(Array(depth+1).join('--'), key, typeof obj)
            var type = typeof obj;

            max = max || 10000;
            if (count > max) {
                // return '...'
                // console.log(count, parent, key)
                return obj
            }

            // todo 广度优先
            if (obj === null || type !== 'object') {
                count += 1;
                return obj
            } else if (obj instanceof Array) {
                var _arr = [];
                for (var i = 0, length = obj.length; i < length; i++) {
                    var item = obj[i];
                    var type = typeof item;
                    if (obj === null || type !== 'object') {
                        _arr[i] = copy(obj, i, item, depth+1)
                    }
                }
                for (var i = 0, length = obj.length; i < length; i++) {
                    var item = obj[i];
                    var type = typeof item;
                    if (obj !== null && type == 'object') {
                        _arr[i] = copy(obj, i, item, depth+1)
                    }
                }
                return _arr
            } else if (type == 'object') {
                var _obj = {}
                for (var key in obj) {
                    var item = obj[key];
                    var type = typeof item;
                    if (obj === null || type !== 'object') {
                        _obj[key] = copy(obj, key, item, depth+1)
                    }
                }
                for (var key in obj) {
                    var item = obj[key];
                    var type = typeof item;
                    if (obj !== null && type == 'object') {
                        _obj[key] = copy(obj, key, item, depth+1)
                    }
                }
                return _obj
            }
        })('root', '', obj, 0, 0)
    }

})(Object, Object.prototype)
