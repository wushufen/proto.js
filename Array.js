!(function() {

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

    Object.defineProperty && Object.defineProperty(Array.prototype, '__noforin__', {
        configurable: true,
        enumerable: true,
        get: function() {
            console.warn('勿用 for...in 遍历数组');
            console.trace()
            return '__noforin__'
        }
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
        // if (!Array.prototype[key]) {
        Array.prototype[key] = polyfill[key]
        // }
    }

    function getType(obj) {
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
    };

    // 'a<'.isMatch(/(.*?)(>|>=|<|<=|==|===)$/)
    function isMatch(obj, condition, deep) {
        deep = deep || 0;
        if (deep > 10) {
            // console.log('deep')
            return false;
        }

        // ===
        if (obj === condition) {
            // console.log('eq: ===')
            return true
        }
        // 0:'0', NaN:NaN, false:'false', null:'null'
        if ((typeof obj != 'object' || obj === null) && (typeof condition != 'object' || condition === null)) {
            return String(obj) === String(condition)
        }
        // [..] [..]
        if (getType(obj) == 'array' && getType(condition) == 'array') {
            // console.log('eq: []')
            if (obj.length != condition.length) {
                return false
            }
            for (var i = 0, length = condition.length; i < length; i++) {
                if (!isMatch(obj[i], condition[i], deep + 1)) {
                    return false
                }
            }
            return true
        }
        // {} {}
        if (getType(obj) == 'object' && getType(condition) == 'object') {
            // console.log('eq: {}')
            if (Object.keys(obj).length && !Object.keys(condition).length) {
                return false
            }
            for (var key in condition) {
                if (!isMatch(obj[key], condition[key], deep + 1)) {
                    return false
                }
            }
            return true
        }
        return false
    }
    Object.isMatch = isMatch;
    // console.log(isMatch([{a:1}], [{a:1}]))
    // console.log(isMatch({a:1},{}))
    // console.log(isMatch('str','str'))
    // console.log(isMatch('',[]))

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
        where: function(condition, one) {},
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
        update: function(condition, map) {
            if (!map) {
                map = condition;
                var isAll = true;
            }
            for (var i = 0, length = this.length; i < length; i++) {
                var item = this[i];
                if (isAll || isMatch(item, condition)) {
                    for (var key in map) {
                        if (map.hasOwnProperty(key)) {
                            item[key] = map[key]
                        }
                    }
                }
            }
            return this
        },
        remove: function(args) {
            if (arguments.length == 0) {
                return this.empty()
            }

            var list = arguments;
            if (arguments.length == 1 && args && args.length) {
                list = args
            }

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
        insert: function(list, index) {
            index = index === undefined ? this.length : index;
            this.splice.apply(this, [index, 0].concat(list));
            return this
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
        limit: function(start, count) {
            return this.slice(start, start + count)
        },
        top: function(n) {
            return this.slice(0, n)
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
        nth: function(index) {
            return index >= 0 ? this[index] : this[this.length + index]
        },
        first: function() {
            return this[0]
        },
        last: function() {
            return this[this.length - 1]
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
        has: function(list) {
            list = Array.isArray(list) ? list : [list];
            var find = true;
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                if (!this.select(item).length) {
                    find = false;
                    break
                }
            }
            return find
        },
        eq: function(list) {
            return this.length == list.length && this.has(list) && list.has(this)
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
        empty: function() {
            return this.splice(0), this
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
        copy: function() {
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
        Array.prototype[key] = extend[key]
    }

})();


var list = [
    0, 1, 2, NaN,
    true, false,
    undefined, null,
    '', '0', '1', 'NaN', 'true', 'null', 'undefined', 'string', [],
    [0, 1, 2],
    {},
    { id: 1, name: 'wsf' },
    { id: 2, name: 'wsf2' },
];

for (var i = 0; i < list.length; i++) {
    var item = list[i];
    for (var j = 0; j < list.length; j++) {
        var _item = list[j];
        // console.log(typeof item, item, _item, typeof _item, Object.isMatch(item, _item) ? '*********************** match' : '')
    }
}

console.log(
    // list.remove([''])
    list.remove()
    // list.remove(0,1,2)
    // Object.isMatch(0,0)
)

// console.log([0,1,{id:1}].getIndex({id:1}))