(function(Function, prototype) {

    prototype.bind = prototype.bind || function(ctx) {
        var fn = this;
        return function() {
            fn.apply(ctx || this, arguments)
        }
    }

    prototype.once = function() {
        var fn = this;
        var called = false;
        return function() {
            if (!called) {
                called = true;
                fn.apply(this, arguments)
            }
        }
    }

    prototype.delay = function(time) {
        var fn = this;
        return function() {
            setTimeout(function() {
                fn.apply(this, arguments)
            }, time)
        }
    }

    prototype.debounce = function(time) {

    }

})(Function, Function.prototype)