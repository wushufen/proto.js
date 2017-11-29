! function() {
    var pro = Function.prototype;
    // bind
    if (!pro.bind) {
        pro.bind = function(ctx) {
            var fn = this;
            return function() {
                fn.apply(ctx || this, arguments)
            }
        }
    }
    // once
    pro.once = function() {
        var fn = this;
        var called = false;
        return function() {
            if (!called) {
                called = true;
                fn.apply(this, arguments)
            }
        }
    };
    // first
    // firstLast
    pro.firstLast = function(time) {
        time = time || 41;
        var fn = this;
        var t, lastDate = 0;
        return function() {
            var self = this;
            var args = arguments;
            var now = new Date;
            if (now - time > lastDate) {
                fn.apply(self, args);
                lastDate = now;
            } else {
                clearTimeout(t);
                t = setTimeout(function() {
                    fn.apply(self, args);
                }, time)
            }
        }
    };
    // first
    pro.first = function(time) {
        time = time || 41;
        var fn = this;
        var t;
        var runing = false;
        return function() {
            if (runing) return;

            var self = this;
            var args = arguments;

            fn.apply(self, args);
            runing = true;

            t = setTimeout(function() {
                runing = false;
            }, time);
        }
    };
    // last
    pro.last = function(time) {
        time = time || 41;
        var fn = this;
        var t;
        var runing = false;
        var args;
        return function() {
            args = arguments;
            if (runing) return;

            var self = this;

            runing = true;
            t = setTimeout(function() {
                fn.apply(self, args);
                runing = false;
            }, time);
        }
    };
}();


var fn = function(n) {
    console.log('run', n)
}.last(1000);

console.time(1)
console.log('==')
fn(1);
fn(2);
fn(3);
fn(4);
fn(5);
fn(6);
setTimeout(function(){
	fn('x')
}, 500)
setTimeout(function(){
	fn('tout')
}, 1000)
console.timeEnd(1)
