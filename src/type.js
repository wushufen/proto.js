/*
 * c 2016.04.01
 * u 2017.11.29
 * wushufen: 404315887@qq.com
 */

(function(Object, Array, Date, RegExp, Function, String, Number, Boolean, undefined) {

    Object.getType = function(obj) {
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
    }

    Object.isType = function(type, obj) {
        return type.toLowerCase() == Object.getType(obj)
    }

    // X.toX

    Object.toObject = function(obj) {
        return Object(obj)
    }

    Array.toArray = function(list) {
        if (list && 'length' in list) {
            var arr = [];
            var i = list.length;
            while (i--) {
                arr[i] = list[i]
            }
            return arr
        }
        return [list]
    }

    Date.toDate = function(str) {
        str = String(str).replace(/-/g, '\/');
        str = str.replace(/年|月/g, '\/').replace('日', ' '); // '2017年10月12日' -> '2017/10/12'
        return new Date(str)
    }

    RegExp.toRegExp = function(obj) {
        return RegExp(obj)
    }

    Function.toFunction = function(str) {
        try {
            return Function(str)
        } catch (e) {
            return function() {}
        }
    }

    String.toString = function(obj) {
        return obj + ''
    }

    Number.toNumber = function(obj) {
        var n = Number(obj);
        n = isNaN(n) ? Number(String(obj).match(/\d+/)) : n;
        n = isNaN(n) ? +obj : n;
        return n
    }

    Boolean.toBoolean = function(obj) {
        if (obj == 'true') {
            return true
        }
        if (obj == 'false') {
            return false
        }
        return !!obj
    }

    // ..

    Array.isArrayLike = function(list) {
        return 'length' in Object(list)
    }

    Number.toInt = function(obj) {
        var n = parseInt(obj);
        n = isNaN(n) ? +obj : n;
        return isNaN(n) ? 0 : n
    }

    Number.isInt = function(obj) {
        return typeof obj == 'number' && !String(obj).match(/\.|NaN|Infinity/)
    }

    Number.isNaN = function(obj) {
        return typeof obj == 'number' && isNaN(obj)
    }


    // Object.isX
    // X.isX
    // X.toX
    // *.toX
    Object.isObject = function(obj) {
        return Object.isType('object', obj)
    }
    Object.isUndefined = function(obj) {
        return Object.isType('undefined', obj)
    }
    Object.isNull = function(obj) {
        return Object.isType('null', obj)
    }
    // var list = [Object, Array, Date, RegExp, Function, String, Number, Boolean, undefined, null];
    var list = [Array, Date, RegExp, Function, String, Number, Boolean];
    for (var i = 0; i < list.length; i++) {
        (function() {
            var Fn = list[i];
            var FnName = Fn.name;
            var prototype = Fn.prototype;

            // Object.isX
            Object['is' + FnName] = Fn['is' + FnName];

            // X.isX
            if (!Fn['is' + FnName]) {
                Fn['is' + FnName] = function(obj) {
                    return Object.isType(FnName, obj)
                }
            }

            // *.toX
            for (var j = 0; j < list.length; j++) {
                (function() {
                    var toFn = list[j];
                    var toX = 'to' + toFn.name;
                    if (!prototype[toX]) {
                        prototype[toX] = function() {
                            return toFn[toX](this.valueOf()) // *valueOf this恒为对象
                        }
                    }
                })()
            }
            // *.toInt
            prototype['toInt'] = prototype['parseInt'] = function() {
                return Number.toInt(this)
            }
            // *.isNaN
            prototype['isNaN'] = function() {
                return isNaN(this)
                // return Number.isNaN(this.valueOf())
            }

            // *.toJSON
            prototype['toJSON'] = prototype['toJSON'] || function () {
                var obj = Object.copy(this);
                obj.toJSON = null;
                return JSON.stringify(obj)
            }

        })()
    }

})(Object, Array, Date, RegExp, Function, String, Number, Boolean)
// console.log(Object.isArray([]))

// console.log(new Date('0'))

// console.log(0, Function.toFunction({}))
// console.log(1, Function.toFunction([]))
// console.log(2, Function.toFunction([1]))
// console.log(3, Function.toFunction(''))
// console.log(4, Function.toFunction('str'))
// console.log(5, Function.toFunction('2017-10-1'))
// console.log(6, Function.toFunction(0))
// console.log(7, Function.toFunction(1))
// console.log(8, Function.toFunction(false))
// console.log(9, Function.toFunction(true))
// console.log(10, Function.toFunction(/8/))
// console.log(11, Function.toFunction(null))
// console.log(12, Function.toFunction(undefined))
// console.log(13, Function.toFunction(new Function))

// // console.log(({}).toBoolean())
// console.log(1, ([]).isNaN())
// console.log(2, ([1]).isNaN())
// console.log(3, ('').isNaN())
// console.log(4, ('str').isNaN())
// console.log(5, ('2017-10-1').isNaN())
// console.log(6, (0).isNaN())
// console.log(7, (1).isNaN())
// console.log(8, (false).isNaN())
// console.log(9, (NaN).isNaN())
// console.log(10, (/x/).isNaN())
// console.log(11, (new Boolean).isNaN())