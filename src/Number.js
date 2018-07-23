/*
 * c 2016.04.01
 * u 2017.11.29
 * wushufen: 404315887@qq.com
 */

!(function(Number, prototype) {
    /*
    js小数运算精度问题解决方案

    0.1+0.2 //=> 0.30000000000000004
    (0.1)['+'](0.2) //=> 0.3

    0.3-0.1 //=> 0.19999999999999998
    (0.3)['-'](0.1) //=> 0.2

    0.1*0.2 //=> 0.020000000000000004
    (0.1)['*'](0.2) //=> 0.02

    0.3/0.1 //=> 2.9999999999999996
    (0.3)['/'](0.1) //=> 3

    0.5025*100 //=> 50.24999999999999
    (0.5025)['*'](100) //=> 50.25

    0.282*100 //=> 28.199999999999996
    (0.282)['*'](100) //=> 28.2
    */
    '+-*/'.replace(/./g, function($) { // each
        prototype[$] = function(n) {
            return fun(this, $, n)
        }
    })
    prototype.add = prototype['+'];
    prototype.subtrack = prototype['-'];
    prototype.multiply = prototype['*'];
    prototype.divide = prototype['/'];

    function fun(a, p, b) {
        var adl = (String(a).split('.')[1] || '').length;
        var bdl = (String(b).split('.')[1] || '').length;
        var mdl = Math.max(adl, bdl); // .123 .1234 => 4
        var pow = Math.pow(10, mdl); // 10^4
        // ap = a * pow
        // 有些数直接放大10^n倍也会失真如： 0.5025 * 100 = 50.24999999999999
        // 所以直接用字符修改的方式
        var ap = +(String(a).replace('.', '') + Array(mdl - adl + 1).join(0)); // 0.5025 => '05025' => 5025
        var bp = +(String(b).replace('.', '') + Array(mdl - bdl + 1).join(0)); // 100 => 100+'00' => '10000' => 10000
        switch (p) {
            case '+':
                return (ap + bp) / pow;
            case '-':
                return (ap - bp) / pow;
            case '*':
                return (ap * bp) / (pow * pow);
            case '/':
                return ap / bp;
        }
    }


    /*
    js小数运算精度问题解决方案 2

    0.5025*100 // => 50.24999999999999
    (0.5025*100).fixed() // => 50.25
    */
    prototype.fixed = function(n) {
        return +this.toFixed(n || 10)
    }


    /*
    大数用‘万，亿’表示
     */
    prototype.toWY = function(n) {
        n = n || 0
        var value = this
        for (var i = 0; true; i++) {
            var v = value / 10000
            if (v < 1) break
            value = v
        }
        return (+value.toFixed(n)) +
            Array(i % 2 + 1).join('万') +
            Array(parseInt(i / 2) + 1).join('亿')
    }


    Number.random = function(start, end, float) {
        var n = Math.random() * (end - start + (float ? 0 : 1)) + start;
        return float ? n : parseInt(n)
    }

})(Number, Number.prototype)


/*
function test(a, p, b) {
    Function(`
        var a=#a,b=#b;
        console.log(a+'#p'+b+' //=> '+(a#pb));
        console.log('('+a+')[\\'#p\\']('+b+')'+' //=> '+(a)['#p'](b)+'\\n')
        `
        .replace(/#a/g, a)
        .replace(/#p/g, p)
        .replace(/#b/g, b)
    )()
}

test(.1, '+', .2)
test(.3, '-', .1)
test(.1, '*', .2)
test(.3, '/', .1)

test(.5025, '*', 100)
test(.282, '*', 100)

test(220.2342, '-', 20.2323)
*/

// console.log((0.5025*100).fixed())
// console.log((220.2342 - 20.2323).fixed())
console.log(23413241.1.toWY())