介绍

proto.js 是一个增强js的库。使数据操作更加方便，增强链式操作。
增加日期的加减与格式化；
增加数据类型转换与判断；
增加数组的增删改查、分页，提供类SQL的方法；
增加数组的集合运算操作；
增加修复浮点数运算精度问题的方法；
增加字符串模板引擎；

//明年今日
Date.today().addFullYear(1)

//3天前
Date.today().addDate(-3)

//字符串与日期转换
'1990-10-30'.toDate().format('yyyy年MM月dd日')

//字符串与数字转换
'3.14159'.toNumber().toFixed(2).toNumber()

//取整
(3.14159).toInt()
'3.14159'.toInt()

//修复小数运算精度
0.1+0.2 //=> 0.30000000000000004
(0.1)['+'](0.2) //=> 0.3

0.3-0.1 //=> 0.19999999999999998
(0.3)['-'](0.1) //=> 0.2

0.1*0.2 //=> 0.020000000000000004
(0.1)['*'](0.2) //=> 0.02

0.3/0.1 //=> 2.9999999999999996
(0.3)['/'](0.1) //=> 3


//数组查找
list.get({id:10}).name

list.select({'age>': 18}).orderBy('age', 'desc').top(10)


Object
  .getType //获取参数数据类型
  .isType //判断参数数据类型
  .assign //[es]
  .keys //[es]
  .values //返回对象的值数组
  // .isMatch //判断两个对象是否匹配

Array
  .range //返回区间整数元素数组

  .prototype
    .__noforin__ //用于警告勿用'for in'遍历数组

    .forEach //[es]
    .each //相当于.forEach，但return this
    .filter //[es]
    .map //[es]
    .includes //[es]
    .indexOf //[es]
    .lastIndexOf //[es]

    .select //查找符合条件的元素返回数组
    .where //查找符合条件的元素返回数组
    .get //查找符合条件的第一个元素，不存在返回false
    .getIndex //查找符合条件的第一个元素下标，不存在返回-1
    .update //修改符合条件的元素
    .delete //删除符合条件的元素
    .del //.delete
    .insert //插入一个元素到某位置
    .orderBy //按某字段排序
    .groupBy //按某字段分组
    .groupCount //按某字段分组，有多少组

    .fields //返回所有字段的数组
    .column //返回某一列
    .col //.column

    .limit //返回start开始n个元素
    .top //前n个元素
    .page //分页
    .pageCount //页数

    .nth //第n个元素，负数从后面开始
    .first //第一个元素
    .last //最后一个元素

    .uniq //去重
    .contains //是否包含某元素
    .has //.contains
    .eq //两个数组是否相等
    .add //添加元素
    .ensure //加入元素，已存在不添加
    .union //并集
    .same //交集
    .xor //两个集合不同部分
    .remove //差集或删除元素
    .difference //.remove别名
    .without //.remove别名
    .removeIndex //按下标删除元素
    .empty //清空

    .min //数组中元素最小的一个
    .max //数组中元素最大的一个
    .sum //数组中元素数值总和
    .avg //数组中元素平均值
    .mean //.avg

    .copy //复制
    .shuffle //乱序
    .random //随机返回其中一个
    .toJson //转json
    .toMap //以元素的某字段的值转为map的key

    .key

Date
  .today //返回今天0点的日期
  .yesterday //返回昨天0点的日期
  .tomorrow //返回明天0点的日期

  .prototype
    .format //日期格式化
    .diff //两个日期的差值格式化
    .addFullYear //加减n年
    .addMonth //加减n个月
    .addDate //加减n天
    .addHours //加减n小时
    .addMinutes //加减n分钟
    .addSeconds //加减n秒
    .addMilliseconds //加减n毫秒
    .addTime //获取或设置毫秒
    .fullYear //获取或设置年
    .month //获取或设置月
    .date //获取或设置天
    .hours //获取或设置小时
    .minutes //获取或设置分钟
    .seconds //获取或设置秒
    .milliseconds //获取或设置毫秒
    .time //获取或设置毫秒

Number
  .random //随机返回某区间的一个数字

  .prototype
    .add //加，修复小数运算精度问题
    .subtrack //减，修复小数运算精度问题
    .multiply // 乘，修复小数运算精度问题
    .divide //除，修复小数运算精度问题
    ['+'] //.add 别名
    ['-'] //.subtrack 别名
    ['*'] //.multiply 别名
    ['/'] //.divide 别名

String
  .trim // --?
  .tpl

  .prototype
    .trim //[es]

    .toCamelCase //转驼峰命名
    .toPascalCase //转帕斯卡命名
    .toUnderscoreCase //转下划线命名
    .toKebabCase //转中划线命名

    .toString //转字符串
    .toBoolean //转布尔
    .toArray //转数组
    .toDate //转日期
    .toNumber //转数字
    .parseInt //取整
    .toInt //.parseInt别名
    .toJson //转json
    .toCsv //转csv
    .csv2json //csv转json
    .json2csv //json转csv

    .tpl //模板引擎

Boolean
  .prototype
    .toString //转字符串
    .toBoolean //转布尔
    .toArray //转数组
    .toDate //转日期
    .toNumber //转数字
    .parseInt //取整
    .toInt //.parseInt别名
    .toJson //转json
    .toCsv //转csv

Function
  .prototype
    .bind //[es]
    .delay //延时执行
    .debounce //防重复

RegExp

Math
  .avg //平均

JSON
  .parse
  .stringify

//Type
  .isObject
  .isArray
  .isDate
  .isRegExp
  .isFunction
  .isString
  .isNumber
  .isBoolean

  .isNull
  .isUndefined
  
  .isArrayLike
  .isInt
  .isNaN

  .toObject
  .toArray
  .toDate
  .toRegExp
  .toFunction
  .toString
  .toNumber
  .toBoolean
  .toInt
  .parseInt

  .prototype
    .toObject
    .toArray
    .toDate
    .toRegExp
    .toFunction
    .toString
    .toNumber
    .toBoolean
    .toInt
