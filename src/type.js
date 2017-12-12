/*
 * c 2016.04.01
 * u 2017.12.11
 * wushufen: 404315887@qq.com
 */

!(function(Object, Array, Date, RegExp, Function, String, Number, Boolean, undefined) {

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
    Date.toDate = function(value) {
        if (!isNaN(value)) {
            value = +value
        } else
        if (typeof value == 'string') {
            value = String(value).replace(/-/g, '\/');
            value = value.replace(/年|月/g, '\/').replace('日', ' '); // '2017年10月12日' -> '2017/10/12'
        }
        return new Date(value)
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
    var _StringToString = String.toString
    String.toString = function(obj) {
        if (arguments.length>0) {
            return String(obj)
        }
        return _StringToString.call(String)
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
    Number.isInt = function(obj) {
        return typeof obj == 'number' && !String(obj).match(/\.|NaN|Infinity/)
    }
    Number.isNaN = function(obj) {
        return typeof obj == 'number' && isNaN(obj)
    }
    Object.isObject = function(obj) {
        return Object.isType('object', obj)
    }
    Object.isUndefined = function(obj) {
        return Object.isType('undefined', obj)
    }
    Object.isNull = function(obj) {
        return Object.isType('null', obj)
    }
    Object.isArrayLike = function(obj) {
        return Array.isArrayLike(obj)
    }
    Object.isEmpty = function(obj) {
        if (obj && typeof obj == 'object') {
            return !Object.keys(obj).length
        } else {
            return !obj
        }
    }

    Number.toInt = function(obj) {
        var n = parseInt(obj);
        n = isNaN(n) ? +obj : n;
        return isNaN(n) ? 0 : n
    }


    // *.getType
    // Object.getType
    // 
    // *.is[Type]
    // *.isType
    // [Type].is[Type]
    // Object.is[Type]
    // 
    // *.to[Type]
    // [Type].to[Type]


    // var types = [Object, Array, Date, RegExp, Function, String, Number, Boolean, undefined, null];
    var types = [Array, Date, RegExp, Function, String, Number, Boolean];
    for (var i = 0; i < types.length; i++) {
        (function() {
            var Type = types[i];
            var TypeName = Type.name;
            var prototype = Type.prototype;

            // *.getType
            prototype.getType = function() {
                return Object.getType(this)
            }

            // *.isType
            prototype.isType = function(type) {
                return Object.isType(type, this)
            }
            // *.is[Type]
            prototype['is' + TypeName] = function() {
                return Object.isType(TypeName, this)
            }
            // [Type].is[Type]
            Type['is' + TypeName] = function(obj) {
                return Object.isType(TypeName, obj)
            }
            // Object.is[Type]
            Object['is' + TypeName] = function(obj) {
                return Object.isType(TypeName, obj)
            }
            // *.isInt
            prototype.isInt = function() {
                return Number.isInt(this)
            }
            // *.isNaN
            prototype.isNaN = function() {
                return isNaN(this)
                // return Number.isNaN(this.valueOf())
            }
            // *.isArrayLike
            prototype.isArrayLike = function() {
                return Array.isArrayLike(this)
            }
            // *.isEmpty
            prototype.isEmpty = function() {
                return Object.isEmpty(this)
            }

            // *.to[Type]
            for (var j = 0; j < types.length; j++) {
                (function() {
                    var toType = types[j];
                    var toTypeName = 'to' + toType.name;
                    if (!prototype[toTypeName]) { // ! ''.toString
                        prototype[toTypeName] = function() {
                            return toType[toTypeName](this.valueOf()) // *valueOf this恒为对象
                        }
                    }
                })()
            }
            // *.toInt *.parseInt
            prototype['toInt'] = prototype['parseInt'] = function() {
                return Number.toInt(this)
            }



            // *.toJson
            prototype['toJson'] = function(space) {
                return JSON.stringify(this.valueOf(), null, space)
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

// // console.log(({}).toJson())
// console.log(1, ([]).toJson())
// console.log(2, ([1]).toJson())
// console.log(3, ('').toJson())
// console.log(4, ('str').toJson())
// console.log(5, ('2017-10-1').toJson())
// console.log(6, (0).toJson())
// console.log(7, (1).toJson())
// console.log(8, (false).toJson())
// console.log(9, (NaN).toJson())
// console.log(10, (/x/).toJson())
// console.log(11, (new Date).toJson())