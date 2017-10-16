/**
 * @author wushufen
 */

Number.random = function(start, end, float) {
    var n = Math.random() * (end - start + (float ? 0 : 1)) + start;
    return float ? n : parseInt(n)
};

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
!(function() {

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

    var fn = Number.prototype;

    // each
    '+-*/'.replace(/./g, function($) {
        fn[$] = function(n) {
            return fun(this, $, n)
        }
    });

    fn.add = fn['+'];
    fn.subtrack = fn['-'];
    fn.multiply = fn['*'];
    fn.divide = fn['/'];

})();

/*
function test(a, p, b) {
    Function(
        "var a=#a,b=#b;console.log(a+'#p'+b+' //=> '+(a#pb));console.log('('+a+')[\\'#p\\']('+b+')'+' //=> '+(a)['#p'](b)+'\\n')"
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