Object.keys = function(obj) {
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
Object.extend = function(obj, objn) {
    for (var i = 1; i < arguments.length; i++) {
        var obj2 = arguments[i];
        for (var key in obj2) {
            if (!obj2.hasOwnProperty(key)) continue;
            obj[key] = obj2[key];
        }
    }
    return obj;
};
Object.assign = Object.extend;
