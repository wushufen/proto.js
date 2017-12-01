/*
 * url: http://domain.com/path?key=true
 * 
 * location.params.key //=> true
 * 
 * c 2016.04.01
 * u 2017.12.01
 * wushufen: 404315887@qq.com
 */

(function() {
    if (typeof location == 'undefined') return

    function convert(value) {
        return value == 'true' ? true :
            value == 'false' ? false :
            value == 'null' ? null :
            value == 'undefined' ? undefined :
            !isNaN(+value) ? +value :
            value
    }

    var params = {}

    function handler() {
        var href = location.href
        var match = href.match(RegExp('(\\?|&)(.*?)=(.*?)(?=&|$)', 'g')) || []
        for (var i = 0; i < match.length; i++) {
            var k_v = match[i].slice(1).split('='),
                key = k_v[0],
                value = convert(k_v[1])
            params[key] = value
        }
    }

    handler()

    location.params = params

    // onpopstate ?

})()