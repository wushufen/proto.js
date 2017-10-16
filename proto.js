// ## type

Object.getType = function(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
};

Object.isType = function(obj, type) {
    return type.toLowerCase() == Object.getType(obj)
};

String.toString = function(obj) {
    return obj + '';
};

Number.toNumber = function(obj) {
    var n = Number(obj);
    n = isNaN(n) ? Number(String(obj).match(/\d+/)) : n;
    n = isNaN(n) ? +obj : n;
    return n
};

Number.toInt = function(obj) {
    var n = parseInt(obj);
    n = isNaN(n) ? +obj : n;
    return isNaN(n) ? 0 : n
};

Number.isInt = function(obj) {
    return typeof obj == 'number' && !String(obj).match(/\.|NaN|Infinity/)
};

Number.isNaN = function (obj) {
    return typeof obj == 'number' && isNaN(obj)
};

Boolean.toBoolean = function(obj) {
    if (obj == 'true') {
        return true
    }
    if (obj == 'false') {
        return false
    }
    return !!obj
};

Object.toObject = function(obj) {
    return Object(obj)
};

Array.toArray = function(list) {
    if (list && list.length != undefined) {
        var arr = [];
        var i = list.length;
        while (i--) {
            arr[i] = list[i]
        }
        return arr
    }
    return [list]
};

Array.isArrayLike = function(list) {
    return 'length' in Object(list)
};

Date.toDate = function(str) {
    str = String(str).replace(/-/g, '\/');
    return new Date(str)
};

RegExp.toRegExp = function(obj) {
    return RegExp(obj)
};

Function.toFunction = function(str) {
    try {
        return Function(str)
    } catch (e) {
        return function() {}
    }
};

// Object.isObject, Array.isArray, ...
// Object.toObject, Array.toArray, ...
// string.toNumber, string.toBoolean, ...
(function() {
    var list = [String, Number, Boolean, Object, Array, Date, RegExp, Function];
    for (var i = 0; i < list.length; i++) {
        (function() {
            var Fn = list[i];
            var FnName = Fn.name;
            // is
            if (!Fn['is' + FnName]) {
                Fn['is' + FnName] = function(obj) {
                    return Object.isType(obj, FnName)
                }
            }
            // prototype.to
            for (var j = 0; j < list.length; j++) {
                (function() {
                    var toFn = list[j];
                    var toFnName = toFn.name;
                    var to = 'to' + toFn.name;
                    if (Fn != Object && !Fn.prototype[to]) {
                        Fn.prototype[to] = function() {
                            return toFn[to](this.valueOf()) // *valueOf this恒为对象
                        }
                    }
                })()
            }
            // prototype.toInt
            if (Fn != Object) {
                Fn.prototype['toInt'] = Fn.prototype['parseInt'] = function() {
                    return Number.toInt(this)
                }
            }
            // prototype.isNaN
            if (Fn != Object) {
                Fn.prototype['isNaN'] = function() {
                    return isNaN(this)
                    // return Number.isNaN(this.valueOf())
                }
            }
        })()
    }
})();



// ## Object

Object.assign ? 0 : Object.assign = function(obj, objn) {
    for (var i = 1; i < arguments.length; i++) {
        var obj2 = arguments[i];
        for (var key in obj2) {
            if (!obj2.hasOwnProperty(key)) continue;
            obj[key] = obj2[key];
        }
    }
    return obj;
};
Object.keys ? 0 : Object.keys = function(obj) {
    var keys = [];
    for (var key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        keys.push(key);
    }
    return keys;
};
Object.values = function(obj) {
    var values = [];
    for (var key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        values.push(obj[key]);
    }
    return values;
};