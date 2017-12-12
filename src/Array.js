/*
 * c 2016.04.01
 * u 2017.12.11
 * wushufen: 404315887@qq.com
 */

!(function(Array, prototype) {

    Array.range = function(start, end, step) {
        if (end == undefined) {
            end = start;
            start = 0;
        }
        step = step || 1;
        var arr = [];
        for (var i = 0; true; i++) {
            var item = start + i * step;
            if (item >= end) {
                break
            }
            arr[i] = item
        }
        return arr
    };

    var hasWarnForIn = false;
    Object.defineProperty && Object.defineProperty(Array.prototype, '__noforin__', {
        configurable: true,
        enumerable: true,
        get: function() {
            if (!hasWarnForIn) {
                hasWarnForIn = true;
                console.trace('勿用 for...in 遍历数组')
            }
            return '__noforin__'
        },
        set: function() {}
    });

    var polyfill = {
        forEach: function(fn, thisArg) {
            for (var i = 0, length = this.length; i < length && i < this.length; i++) {
                fn.call(thisArg, this[i], i, this);
            }
        },
        map: function(fn, thisArg) {
            var arr = [];
            this.forEach(function(item) {
                arr.push(fn.apply(thisArg, arguments));
            });
            return arr
        },
        fliter: function(fn, thisArg) {
            var arr = [];
            this.forEach(function(item) {
                fn.apply(thisArg, arguments) && arr.push(item);
            });
            return arr
        },
        indexOf: function(item, fromIndex) {
            var start = fromIndex || 0;
            start = start < 0 ? this.length + start : start;
            var end = this.length - 1;
            for (var i = start; i <= end; i++) {
                if (this[i] === item) {
                    return i;
                }
            }
            return -1
        },
        lastIndexOf: function(item, fromIndex) {
            var start = 0;
            var end = fromIndex || this.length - 1;
            end = end < 0 ? this.length + end : end;
            for (var i = end; i >= start; i--) {
                if (this[i] === item) {
                    return i
                }
            }
            return -1
        },
        includes: function(item, fromIndex) {
            return this.indexOf(item, fromIndex) != -1
        }
    };

    for (var key in polyfill) {
        // if (!prototype[key]) {
        prototype[key] = polyfill[key]
        // }
    }

    function getType(obj) {
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
    };

    // 'a<'.isMatch(/(.*?)(>|>=|<|<=|==|===)$/)
    function isMatch(obj, _obj, compare, deep) {
        // console.log(obj, _obj, deep, compare)

        deep = deep || 0;
        // console.log('deep', deep)
        if (deep > 10) {
            return false;
        }

        // compare
        // == === != !== > >= < <=
        // list.select({'age>': 18})
        if (compare) {
            switch (compare) {
                case '==':
                    return obj == _obj;
                case '===':
                    return obj === _obj;
                case '!=':
                    return obj != _obj;
                case '!==':
                    return obj !== _obj;
                case '>':
                    return obj > _obj;
                case '>=':
                    return obj >= _obj;
                case '<':
                    return obj < _obj;
                case '<=':
                    return obj <= _obj;
            }
        }

        // reg
        if (getType(_obj) == 'regexp') {
            return _obj.test(obj)
        }

        // ===
        if (obj === _obj) {
            // console.log('eq: ===')
            return true
        }
        // 0:'0', NaN:NaN, false:'false', null:'null'
        if ((typeof obj != 'object' || obj === null) && (typeof _obj != 'object' || _obj === null)) {
            return String(obj) === String(_obj)
        }
        // [..] [..]
        if (getType(obj) == 'array' && getType(_obj) == 'array') {
            // console.log('eq: []')
            if (obj.length != _obj.length) {
                return false
            }
            for (var i = 0, length = _obj.length; i < length; i++) {
                if (!isMatch(obj[i], _obj[i], '', deep + 1)) {
                    return false
                }
            }
            return true
        }
        // {id:1,name:'wsf'} {id:1,age:18} 共同字段相等则视为相等
        if (getType(obj) == 'object' && getType(_obj) == 'object') {
            // console.log('eq: {}')
            if (!Object.keys(obj).length && !Object.keys(_obj).length) {
                return true
            }
            var eq = false;
            for (var _key in _obj) {
                var key_compare = _key.match(/(.+?)\s*(===|!==|==|!=|>=|>|<=|<)?\s*$/) || [];
                var compare = key_compare[2];
                var key = key_compare[1];
                // console.log('key_compare', key_compare, key, compare)

                if (key in obj) {
                    eq = true;
                    if (!isMatch(obj[key], _obj[_key], compare, deep + 1)) {
                        return false
                    }
                }
            }
            return eq
        }
        return false
    }
    Object.isMatch = isMatch;
    // console.log(isMatch([{a:1}], [{a:1}]))
    // console.log(isMatch({a:1},{}))
    // console.log(isMatch('str','str'))
    // console.log(isMatch('',[]))
    // console.log(isMatch(1, 2, null, '>'))

    // ([1]) => [1]
    // ([1,2]) => [1,2]
    // ([]) => [[]]
    // (1) => [1]
    // (1,2) => [1,2]
    // () => []
    function getArguments(list, start) {
        start = start || 0
        var first = list[start || 0]
        if (list.length == start + 1 && getType(first) == 'array' && first.length) { // ([1,2])
            return first
        } else { // () (1) (1,2) ([])
            var arr = [];
            var li = list.length;
            var ai;
            while (ai = li - start) {
                li--, ai--;
                arr[ai] = list[li]
            }
            return arr
        }
    }
    // console.log( getArguments(  [ [1] ]  ) ) //=> [1]
    // console.log( getArguments(  [ [1,2] ]  ) ) //=> [1,2]
    // console.log( getArguments(  [ [] ]  ) ) //=> [[]]
    // console.log( getArguments(  [ 1 ]  ) ) //=> [1]
    // console.log( getArguments(  [ 1,2 ]  ) ) //=> [1,2]
    // console.log( getArguments(  [  ]  ) ) //=> []
    // console.log(getArguments(['x', 1, 2], 1)) //=> [1,2]
    // console.log(getArguments([-1, 1, 2], 1)) //=> [1,2]


    var extend = {
        each: function(fn, thisArg) {
            this.forEach.apply(this, arguments);
            return this
        },
        select: function(condition, one) {
            var arr = [];
            for (var i = 0, length = this.length; i < length; i++) {
                var item = this[i];
                if (isMatch(item, condition)) {
                    arr.push(item);
                    if (one) {
                        break
                    }
                }
            }
            return arr
        },
        get: function(condition) {
            return this.select(condition, true)[0] || false
        },
        getIndex: function(condition) {
            for (var i = 0, length = this.length; i < length; i++) {
                var item = this[i];
                if (isMatch(item, condition)) {
                    return i
                }
            }
            return -1
        },
        has: function(args) {
            var list = getArguments(arguments);

            var isFind = true;
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                if (!this.select(item).length) {
                    isFind = false;
                    break
                }
            }
            return isFind
        },
        insert: function(args) {
            var list = getArguments(arguments);

            return this.push.apply(this, list), this
        },
        insertIndex: function(index, args) {
            var list = getArguments(arguments, 1);
            if (index < 0) { // splice -1 代表倒数第1之前
                index = this.realIndex(index) + 1
            }

            this.splice.apply(this, [index, 0].concat(list));
            return this
        },
        ensure: function(list) {
            list = Array.isArray(list) ? list : [list];
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                if (!this.has(item)) {
                    this.push(item)
                }
            }
            return this
        },
        update: function(condition, map) {
            if (!map) {
                map = condition;
                var isAll = true;
            }
            for (var i = 0, length = this.length; i < length; i++) {
                var item = this[i];
                if (isAll || isMatch(item, condition)) {
                    if (getType(item) == 'object' && getType(map) == 'object') {
                        for (var key in map) {
                            if (!map.hasOwnProperty(key)) continue;
                            item[key] = map[key]
                        }
                    } else {
                        this[i] = map
                    }
                }
            }
            return this
        },
        updateIndex: function(index, map) {
            index = this.realIndex(index);
            var item = this.nth(index);

            if (getType(item) == 'object' && getType(map) == 'object') {
                for (var key in map) {
                    item[key] = map[key]
                }
            } else {
                this[index] = map
            }
            return this
        },
        remove: function(args) {
            if (arguments.length == 0) {
                return this.empty()
            }

            var list = getArguments(arguments);

            for (var i = 0, length = this.length; i < length; i++) {
                var item = this[i];
                for (var j = 0; j < list.length; j++) {
                    var _item = list[j];
                    if (isMatch(item, _item)) {
                        this.splice(i, 1);
                        i--, length--;
                    }
                }
            }
            return this
        },
        removeIndex: function(i) {
            return this.splice(i, 1), this
        },
        empty: function() {
            return this.splice(0), this
        },
        orderBy: function(field, desc) {
            // number 'number' 'string' obj
            return this.sort(function(a, b) {
                a = field ? a[field] : a;
                b = field ? b[field] : b;
                return desc ?
                    (a < b ? 1 : (a == b ? 0 : -1)) :
                    (a > b ? 1 : (a == b ? 0 : -1))
            })
        },
        groupBy: function(field) {
            var map = {};
            for (var i = 0; i < this.length; i++) {
                var item = this[i];
                var value = item[field];
                var arr = map[value] || (map[value] = []);
                arr.push(item);
            }
            return map
        },
        groupCount: function(field) {
            return Object.keys(this.groupBy(field)).length
        },
        fields: function() {
            var map = {};
            for (var i = 0; i < 50; i++) {
                if (i > this.length - 1) {
                    break
                }
                var index = i < 40 ? i : parseInt(Math.random() * (this.length - 40)) + 40;
                var item = this[index];
                // console.log(this.length, index, ':', item)
                for (var key in item) {
                    if (item.hasOwnProperty(key)) {
                        map[key] = 1;
                    }
                }
            }
            return Object.keys(map);
        },
        column: function(field) {
            return this.map(function(item) {
                return item[field]
            })
        },
        page: function(pageIndex, pageSize) {
            pageSize = pageSize || 10;
            var start = (pageIndex - 1) * pageSize;
            if (pageIndex < 0) {
                start = pageIndex * pageSize
            }
            var end = start + pageSize;
            if (pageIndex == -1) {
                end = undefined;
            }
            return this.slice(start, end)
        },
        pageCount: function(pageSize) {
            return Math.ceil(this.length / (pageSize || 10))
        },
        top: function(n) {
            return this.slice(0, n)
        },
        limit: function(start, count) {
            return this.slice(start, start + count)
        },
        realIndex: function(index) {
            return index >= 0 ? index : this.length + index
        },
        nth: function(index) {
            return this[this.realIndex(index)]
        },
        first: function() {
            return this[0]
        },
        last: function() {
            return this[this.length - 1]
        },
        index: function(index, value) {
            if (index === null) {
                return this.insert(getArguments(arguments, 1))
            }
            if (value === null) {
                return this.removeIndex(index)
            }
            if (arguments.length == 1) {
                return this.nth(index)
            } else {
                return this.updateIndex(index, value)
            }
        },
        unique: function() {
            var length = this.length;
            for (var i = 0; i < length; i++) {
                for (var j = i + 1; j < length; j++) {
                    if (isMatch(this[i], this[j])) {
                        this.splice(j--, 1), length--
                    }
                }
            }
            return this
        },
        eq: function(list) {
            return this.length == list.length && this.has(list) && list.has(this)
        },
        same: function(list) {
            var arr = [];
            for (var i = 0, length = this.length; i < length; i++) {
                var item = list[i];
                if (this.has(item)) {
                    arr.push(item)
                }
            }
            return arr
        },
        xor: function(list) {
            return this.copy().remove(list)
                .concat(list.copy().remove(this))
        },
        max: function(field) {
            if (arguments.length) {
                var max = this[0];
                this.each(function(item) {
                    if (item[field] > max[field]) {
                        max = item;
                    }
                });
                return max
            } else {
                return Math.max.apply(Math, field ? this.column(field) : this)
            }
        },
        min: function(field) {
            if (arguments.length) {
                var min = this[0];
                this.each(function(item) {
                    if (item[field] < min[field]) {
                        min = item;
                    }
                });
                return min
            } else {
                return Math.min.apply(Math, field ? this.column(field) : this)
            }
        },
        sum: function(field) {
            var list = field ? this.column(field) : this;
            var sum = 0;
            for (var i = 0, length = this.length; i < length; i++) {
                var item = list[i];
                if (!isNaN(item)) {
                    sum += +item
                }
            }
            return sum
        },
        avg: function(field) {
            return this.sum(field) / this.length
        },
        copy: function(deep) {
            if (deep) {
                return Object.copy(this)
            }
            return this.concat()
        },
        shuffle: function() {
            return this.sort(function(a, b) {
                return Math.random() - .5
            })
        },
        random: function(start, end) {
            start = start || 0;
            end = end || this.length - 1;
            var index = parseInt(Math.random() * (end - start + 1) + start);
            return this[index]
        },
        toMap: function(field) {
            var map = {};
            for (var i = 0, length = this.length; i < length; i++) {
                var item = this[i];
                var value = item[field];
                map[value] = item;
            }
            return map
        },
        key: function(path) {
            var obj = this[0];
            return obj ? obj[path] : undefined
        }
    };

    extend.where = extend.select;

    extend['delete'] = extend.remove;
    extend.del = extend.remove;
    extend.difference = extend.remove;
    extend.without = extend.remove;

    extend.deleteIndex = extend.removeIndex;
    extend.delIndex = extend.removeIndex;

    extend.col = extend.column;
    extend.contains = extend.has;
    extend.add = extend.insert;
    extend.union = extend.ensure;
    extend.uniq = extend.unique;

    for (var key in extend) {
        prototype[key] = extend[key]
    }

})(Array, Array.prototype)


// var list = [
//     0, 1, 2, NaN,
//     true, false,
//     undefined, null,
//     '', '0', '1', 'NaN', 'true', 'null', 'undefined', 'string', [],
//     [0, 1, 2],
//     {},
//     { id: 1, name: 'wsf' },
//     { id: 2, name: 'wsf2' },
// ];

// isMatch test
// for (var i = 0; i < list.length; i++) {
//     var item = list[i];
//     for (var j = 0; j < list.length; j++) {
//         var _item = list[j];
//         console.log(typeof item, item, _item, typeof _item, Object.isMatch(item, _item) ? '*********************** match' : '')
//     }
// }

// list.splice(50,0,'xxoo')
// console.log(
//     // list.remove([''])
//     // list.remove()
//     // list.remove(0,1,2)
//     // [1, 2, 3].insertIndex(-1, ['x', 'y', 'z'])
//     // [1,2,3].realIndex(-1)
//     // list.index(null, 'x', 'y')
//     // [{ id: 2 }].select({ 'id>=': 2 })
// )

// console.log([0,1,{id:1}].getIndex(1))

// console.log([{ name: 'wsf' }, { name: 'wyb' }].select({ name: /ws/ }))