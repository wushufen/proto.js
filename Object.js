/*
 * c 2016.04.01
 * u 2017.11.29
 * wushufen: 404315887@qq.com
 */
Object.assign = Object.assign || function(obj, objn) {
    for (var i = 1; i < arguments.length; i++) {
        var obj2 = arguments[i];
        for (var key in obj2) {
            if (!obj2.hasOwnProperty(key)) continue;
            obj[key] = obj2[key];
        }
    }
    return obj;
};
Object.keys = Object.keys || function(obj) {
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
Object.isEmpty = function(obj) {
    if (obj && typeof obj == 'object') {
        return !Object.keys(obj).length
    } else {
        return !obj
    }
};
Object.getType = function(obj) {
    return {}.toString.call(obj).slice(8, -1).toLowerCase()
};
Object.copy = function(arg, maxDeep, deep) {
    maxDeep = maxDeep || 10;
    deep = deep || 0;
    if (deep > maxDeep) {
        return '...'
    }
    var type = Object.getType(arg);
    if (type != 'object' && type != 'array') {
        return arg
    } else if (type == 'array') {
        var arr = [];
        for (var i = 0, length = arg.length; i < length; i++) {
            arr[i] = Object.copy(arg[i], maxDeep, deep + 1)
        }
        return arr
    } else if (type == 'object') {
        var obj = {};
        for (var key in arg) {
            obj[key] = Object.copy(arg[key], maxDeep, deep + 1)
        }
        return obj
    }
};