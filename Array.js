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

    // 'a<'.isMatch(/(.*?)(>|>=|<|<=|==|===)$/)
    function isMatch(obj, condition, deep) {
        deep = deep || 0;
        if (deep > 10) {
            // console.log('deep')
            return false;
        }

        // obj obj
        if (obj === condition) {
            // console.log('eq: ===')
            return true
        }
        // 0:'0', NaN:NaN, false:'false'
        if (typeof obj != 'object' || typeof condition != 'object') {
            return String(obj) === String(condition)
        }
        // [..] [..]
        if (obj && condition && condition.push) {
            // console.log('eq: []')
            var eq = true;
            for (var i = 0, length = condition.length; i < length; i++) {
                if (!isMatch(obj[i], condition[i]), deep + 1) {
                    eq = false;
                    break
                }
            }
            return eq
        }
        // {} {}
        if (obj && Object.prototype.toString.call(condition) == '[object Object]') {
            // console.log('eq: {}')
            var eq = true;
            for (var key in condition) {
                if (!isMatch(obj[key], condition[key], deep + 1)) {
                    eq = false;
                    break
                }
            }
            return eq
        }
        return false
    }
    Object.isMatch = isMatch;
    // console.log(isMatch(1, {}))

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
        where: function (condition, one) {
            return this.select(condition, one)
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
        update: function(condition, map) {
            if (!map) {
                map = condition;
                condition = {};
            }
            for (var i = 0, length = this.length; i < length; i++) {
                var item = this[i];
                if (isMatch(item, condition)) {
                    for (var key in map) {
                        if (map.hasOwnProperty(key)) {
                            item[key] = map[key]
                        }
                    }
                }
            }
            return this
        },
        remove: function(condition) {
            if (Array.isArray(condition)) {
                var list = condition.concat();
                for (var i = 0; i < list.length; i++) {
                    this.remove(list[i])
                }
                return this
            }
            for (var i = 0, length = this.length; i < length; i++) {
                var item = this[i];
                if (isMatch(item, condition)) {
                    this.splice(i, 1);
                    i--, length--;
                }
            }
            return this
        },
        'delete': function(list) {
            return this.remove(list)
        },
        del: function(list) {
            return this.remove(list)
        },
        removeIndex: function(i) {
            return this.splice(i, 1), this
        },
        deleteIndex: function(i) {
            return this.removeIndex(i)
        },
        delIndex: function(i) {
            return this.removeIndex(i)
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
        uniq: function() {
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
        contains: function(list) {
            return this.has(list)
        },
        eq: function(list) {
            return this.length == list.length && this.has(list) && list.has(this)
        },
        add: function(item, i) {
            return this.insert(item, i)
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
        union: function(list) {
            return this.ensure(list)
        },
        difference: function(list) {
            return this.remove(list)
        },
        without: function(list) {
            return this.remove(list)
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
            return Math.max.apply(Math, field ? this.column(field) : this)
        },
        min: function(field) {
            return Math.min.apply(Math, field ? this.column(field) : this)
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

    for (var key in extend) {
        Array.prototype[key] = extend[key]
    }

})();


/*var arr = [
    1, 3, 5, 4,
    { id: 1, name: 'wsf' },
    { id: 2, name: 'wsf' },
    { id: 2, name: 'wsf' },
    { id: 1, name: 'wsf1' },
    2, 9, 0, 8,
    2, 9, 0, 8,
];
console.log(
    arr.remove([1, {id:1}])
)*/

// console.log([0,1,{id:1}].getIndex({id:1}))