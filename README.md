# proto.js
proto.js 是一个js增强库，提供许多实用的链式方法，使数据操作更加方便。 同时还提供了许多 polyfill ，如 array.forEach, array.map 等。

## 日期操作
```javascript
'2008-08-08'.toDate().addDate(-3).format('yyyy-MM-dd')
```
```javascript
'2018-08-05'
```

## 数组操作，CRUD
```javascript
var list = [
    {id:1, name:'apple', country:'中国'},
    {id:2, name:'banana', country:'美国'},
    {id:3, name:'wsf', country:'中国'},
]

list.select({country:'中国'})
```
```javascript
[{"id":1,"name":"apple","country":"中国"}, {"id":3,"name":"wsf","country":"中国"}]
```

## 小数运算精度修复
```javascript
0.5025 * (200 / 2); //=> 50.24999999999999

(0.5025 * (200 / 2)).fixed()
```
```javascript
50.25
```

## 链式类型转换与判断
```javascript
'3.14159'.toNumber()
```
```javascript
3.14159
```

```javascript
'2017-10-1 00:00:00'.toDate()
```
```javascript
'[Date] Sun Oct 01 2017 00:00:00 GMT+0800 (中国标准时间)'
```

```javascript
[].isArray()
```
```javascript
true
```


## DOC
详见文档  
https://wusfen.github.io/proto.js
