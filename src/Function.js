/*
 * c 2016.04.01
 * u 2018.07.23
 * wushufen: 404315887@qq.com
 */

!(function(Function, prototype) {

    prototype.bind = prototype.bind || function(ctx) {
        var fn = this;
        return function() {
            fn.apply(ctx || this, arguments)
        }
    }

    prototype.once = function() {
        var fn = this;
        return function() {
            if (!fn._called) {
                fn._called = true;
                fn.apply(this, arguments)
            }
        }
    }

    prototype.delay = function(time) {
        var fn = this;
        return function() {
            setTimeout(function() {
                fn.apply(this, arguments)
            }.bind(this), time)
        }
    }

    prototype.debounce = function(time) {
        var fn = this;
        return function(){
            var now = new Date();
            var lastTime = fn._lastTime || 0;
            if (Number(now) > Number(lastTime) + time) {
                fn.apply(this, arguments);
                fn._lastTime = now;
            }
        }
    }

})(Function, Function.prototype)