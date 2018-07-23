/*
 * c 2018.01.18
 * u 2018.01.18
 * wushufen: 404315887@qq.com
 */

!(function(RegExp, prototype) {

	// # 尽量宽松

	// 汉字，匹配双字节代替
	RegExp.han = /[^\x00-\xff]$/
	// ascii标准+扩展
	RegExp.ascii = /^[\x00-\xff]$/
	// 1xxxxxxxxxx
	RegExp.phone = /^1\d{10}$/
	// xxx|xxx-xxxx|(xxx)xxxx
	RegExp.tel = /^\d+|\d+-\d+|\(\d+\) ?\d+$/
	// xxx@xxx.xxx
	RegExp.email = /^\S+@\S+[.。]\S+$/
	// yyyy[-/]MM[-/]dd( HH:mm(:ss)?)?
	RegExp.date = /^\d{4}[-/]\d{1,2}[-/]\d{1,2}( \d{1,2}:\d{1,2}(:\d{1,2})?)?$/
	// 中国邮编6数字，外国不规则不用校验
	RegExp.postCode = /^\d{6}$/
	// 中国二代身份证18位，强校验要按 (区码 生日 顺序码 校验码)进行计算
	RegExp.idCard = /^\d{1}[\dX]$/i
	// xxxx://xxxx.xxx
	RegExp.url = /^\S+:\/\/\S+[.]\S+$/
	// [+-]?(123|.123|1.23|123e+21|1.23e+21)
	RegExp.number = /^[+-]?(\d+|\d*[.]\d+|\d*[.]?\d+e\+\d+)$/i
	RegExp.int = /^[+-]?(\d+)$/i
	RegExp.float = /^[+-]?(\d*[.]\d+|\d*[.]\d+e\+\d+)$/i
	// xxx.xxx.xxx.xxx
	RegExp.ipv4 = /^(\d{1,3})(\.\d{1,3}){3}$/
	// xxx:xxx:xxx:xxx:xxx:xxx:xxx:xxx
	// ...::...
	// ...::ip4
	// 较弱
	RegExp.ipv6 = /^[0-9a-f]{0,4}?(:|:[0-9a-f]{0,4}){1,7}(:(\d{1,3})(\.\d{1,3}){3})?$/i
	// ipv4 ipv6
	RegExp.ip = /^(\d{1,3})(\.\d{1,3}){3}|[0-9a-f]{0,4}?(:|:[0-9a-f]{0,4}){1,7}(:(\d{1,3})(\.\d{1,3}){3})?$/

})(RegExp, RegExp.prototype)
