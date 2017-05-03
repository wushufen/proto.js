/*!
 * Array 补丁 与 增强
 * https://github.com/wusfen/pro.js
 * 2017.04.26 u
 * 2016.04.01 c
 */
(function() {
    function orExtend(obj, obj2) {
        for (var i in obj2) {
            obj[i] || (obj[i] = obj2[i]);
        }
        return obj;
    }

    // extend Array.prototype
    var selectOne;
    var aprox = {
        // 循环
        forEach: function(fn, contex) {
            for (var i = 0; i < this.length; i++) {
                fn.call(contex, this[i], i, this);
            }
            return this;
        },
        map: function(fn) {
            var rs = [];
            this.each(function(item) {
                rs.push(fn(item));
            });
            return rs;
        },
        // 返回列表中所有对象的键
        // keys, values 已存在，迭代器相关，与这里不一样
        ks: function() {
            var keys = [];
            this.each(function(obj) {
                for (var key in obj) {
                    if (!obj.hasOwnProperty(key)) continue;
                    keys.ensure(key);
                }
            })
            return keys;
        },
        // 返回列表每个对象的某字段值
        vs: function(key) {
            return this.map(function(item) {
                return item[key]
            })
        },
        // 分页
        limit: function(start, count) {
            var rs = [];
            for (var i = start; i < start + count; i++) {
                rs.push(this[i])
            }
            return rs;
        },
        page: function(pageIndex, pageSize) {
            pageSize = pageSize || this.pageSize();
            pageIndex = pageIndex < 1 ? 1 : pageIndex || this.pageIndex();
            this._pageIndex = pageIndex;
            var start = Math.min((pageIndex - 1) * pageSize, this.length);
            var end = Math.min(start + pageSize, this.length);

            var rs = [];
            for (var i = start; i < end; i++) {
                rs.push(this[i])
            }
            return rs;
        },
        pageIndex: function(n) {
            if (n) {
                var count = this.pageCount();
                n = n > count ? count : n;
                n = n < 1 ? 1 : n;
                this._pageIndex = n
            }
            return this._pageIndex || 1
        },
        pageSize: function(n) {
            if (n) { this._pageSize = n }
            return this._pageSize || window.pageSize || 10
        },
        pageCount: function(n) {
            return Math.ceil(this.length / (n || this.pageSize()))
        },
        count: function() {
            return this.length
        },
        // 查
        // select(id) // => select({id:id})
        // select({key:value, key2:value2})
        // select('key===value && key2<value2')
        // select(function(item){ return Boolean })
        select: function(where) {
            var findArr = [];
            for (var i = 0; i < this.length; i++) {
                var obj = this[i];
                var eq = false;

                if (!isNaN(+where)) { // Number
                    where = { id: where };
                }

                if (obj === where) {
                    eq = true;
                } else if (typeof where == 'string') {
                    with(obj) {
                        eq = eval(where);
                    }
                } else if (typeof where == 'function') {
                    if (!where(obj, i, this)) {
                        eq = false;
                    }
                } else if (obj !== null && where !== null) {
                    eq = true;
                    for (var key in where) {
                        if (obj[key] != where[key]) { // ==
                            eq = false;
                            break;
                        }
                    }
                }

                if (eq) {
                    findArr.push(obj);
                    if (selectOne) break;
                }
            }
            return findArr;
        },
        // select one
        get: function(where) {
            selectOne = 1;
            var obj = this.select(where)[0];
            selectOne = 0;
            return obj;
        },
        indexOf: function(obj) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] === obj) {
                    return i;
                }
            }
            return -1;
        },
        // 判断是否存在，如果指定主键，只根据主键判断
        contains: function(item, pk) {
            if (typeof item == 'object') {
                var where = {};
                where[pk] = item[pk];
                return this.get(pk ? where : item);
            } else {
                return this.indexOf(item) != -1
            }
        },
        // 改
        update: function(kvs, where) {
            this.select(where).each(function(item) {
                for (var key in kvs) {
                    if (item.hasOwnProperty(key)) {
                        item[key] = kvs[key]
                    }
                }
            })
            return this;
        },
        set: function(fiels) {
            for (var i = 0; i < this.length; i++) {
                var obj = this[i];
                for (var key in fiels) {
                    obj[key] = fiels[key];
                }
            }
            return this;
        },
        save: function(obj, pk) {
            pk = pk || 'id';
            if (pk in Object(obj)) {
                var kv = {};
                kv[pk] = obj[pk];
                var findObj = this.get(kv);
                if (findObj) {
                    for (var key in obj) {
                        findObj[key] = obj[key];
                    }
                    return this;
                }
            }

            this.push(obj);
            return this;
        },
        // 删
        // 根据条件删除
        'delete': function(where) {
            var findArr = this.select(where);
            for (var i = 0; i < findArr.length; i++) {
                for (var j = 0; j < this.length; j++) {
                    if (findArr[i] == this[j]) {
                        this.splice(j--, 1);
                    }
                }
            }
            return this;
        },
        // 移除所有这个对象
        remove: function(item) {
            for (var i = 0; i < this.length; i++) {
                if (item === this[i]) {
                    this.splice(i--, 1);
                }
            }
            return this;
        },
        removeIndex: function(i) {
            return this.splice(i--, 1), this;
        },
        // 去重
        uniq: function(pk) {
            for (var i = 0; i < this.length; i++) {
                var item = this[i];
                for (var j = 0; j < i; j++) {
                    var pre = this[j];
                    var eq = pk ? item[pk] == pre[pk] : item === pre;
                    if (eq) {
                        this.splice(i--, 1), i--, j--
                    }
                }
            }
            return this
        },
        // 增
        // 唯一增
        ensure: function(item, pk) {
            !this.contains(item, pk) && this.push(item);
            return this;
        },
        // 其它
        orderBy: function(field, desc) {
            // number 'number' 'string' obj
            return this.sort(function(a, b) {
                a = field ? a[field] : a;
                b = field ? b[field] : b;
                return desc ?
                    (a < b ? 1 : (a == b ? 0 : -1)) :
                    (a > b ? 1 : (a == b ? 0 : -1))
            });
        },
        shuffle: function() {
            return this.sort(function(a, b) {
                return Math.random() - .5
            })
        },
        toArray: function() {
            return this;
        },
        copy: function() {
            return this.select()
        },
        // 不要写 toJSON。 JSON.stringify 会先调用对象的 toJSON
        toJson: function() {
            return JSON.stringify(this);
        }
    };

    aprox.filter = aprox.select;
    aprox.where = aprox.select;
    aprox.each = aprox.forEach;
    aprox.has = aprox.contains;
    aprox.one = aprox.get;
    aprox.order = aprox.orderBy;

    orExtend(Array.prototype, aprox);

}());
