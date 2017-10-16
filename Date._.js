
/**
避免时区、公元100前、ios的问题
Date._('2012-12-02') // '2012/12/02 00:00:00'
Date._('2001-02-03 11:22:33.456').toString('yyyy-MM-dd HH:mm:ss.SSS')


console.log(new Date('1011/12/13'))
console.log(new Date('2011/12/3'))
console.log(new Date('3011/12/03'))

console.log(new Date('4011-12-13')) // 这个会自动加 8h
console.log(new Date('5011-12-3'))
console.log(new Date('6011-12-03')) // 这个会自动加 8h
console.log(new Date('7011-12-03 14:15:16')) // 这个 ios 会无效

console.log(new Date('111/12/13'))
console.log(new Date('222-12-13'))

console.log(new Date('11/12/13')) // 如果都为2位，最后的会当成年份， +1900 或 +2000 ，有的浏览器 >=50 +1900, <50 +2000
console.log(new Date('11-12-14')) // 如果都为2位，最后的会当成年份， +1900 或 +2000 ，有的浏览器 >=50 +1900, <50 +2000

console.log(new Date('11-12-50')) // 如果都为2位，最后的会当成年份， +1900 或 +2000 ，有的浏览器 >=50 +1900, <50 +2000
console.log(new Date('11-12-51')) // 如果都为2位，最后的会当成年份， +1900 或 +2000 ，有的浏览器 >=50 +1900, <50 +2000

console.log(new Date(10, 11, 12)) // 如果第1为2位，会 +1900 ，第2从0开始为1月

 */
Date._ = function(y, M, d, h, m, s, S) {
    if (typeof y == 'string') {
        var str = y;
        var dr = /^\s*(\d+)[-/](\d+)[-/](\d+).*/; // (yyyy)-(mm)-(dd)
        var tr = /.*/;
        y = +(str.match(dr) || [])[1];
        M = +(str.match(dr) || [])[2] - 1;
        d = +(str.match(dr) || [])[3];
        h = +(str.match(/\d\s+(\d+)/) || [])[1]; // dd (HH)
        m = +(str.match(/\d\s+(\d+):(\d+)/) || [])[2]; // dd (HH):(mm)
        s = +(str.match(/\d\s+(\d+):(\d+):(\d+)/) || [])[3]; // dd (HH):(mm):(ss)
        S = +(str.match(/\d\s+(\d+):(\d+):(\d+)[.\s](\d+)/) || [])[4]; // dd (HH):(mm):(ss).(SSS)
    }
    y = y || 0;
    M = M || 0;
    d = d || 1;
    h = h || 0;
    m = m || 0;
    s = s || 0;
    S = S || 0;
    var date = new Date;
    if (!arguments.length) {
        return date
    }
    date.setFullYear(y);
    date.setMonth(M);
    date.setDate(d);
    date.setHours(h);
    date.setMinutes(m);
    date.setSeconds(s);
    date.setMilliseconds(S);
    return date
}