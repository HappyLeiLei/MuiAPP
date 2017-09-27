Date.prototype.format = function(format) {
	var o = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S": this.getMilliseconds()
	}
	if(/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(format))
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
	return format;
}

function appinit() {
	plus.screen.lockOrientation("portrait-primary")
}

function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}

function allPrpos(obj) {
	var props = "";
	for(var p in obj) {
		if(typeof(obj[p]) == " function ") {
			obj[p]();
		} else {
			props += p + " = " + obj[p] + " /t ";
		}
	}
	/*console.log("allPrpos :" + props);*/
}

function checkMobile(sMobile) {
	var pattern = /^[0-9]*[1-9][0-9]*$/;
	if(11 == sMobile.length && pattern.test(sMobile)) {
		return(/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(sMobile))
	}
	return false
}

function clearLoaclInfo() {
	localStorage.removeItem(LS_TOKEN);
	localStorage.removeItem(LS_USER_ID);
	localStorage.removeItem(LS_USER_NAME);
	localStorage.removeItem(LS_MESSAGE);
	localStorage.removeItem(LS_MESSAGE_UNREAD)
}
var unixtimestamp = function() {
	return Math.round(new Date().getTime() / 1000)
}

function trim(str) {　　
	return str.replace(/(^\s*)|(\s*$)/g, "");　　
}

/*字符串格式化金额*/
function formatMoney(s, n) {
	if(typeof n == "number" && n >= 0)
		s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
	else
		s += "";
	var l = s,
		r = "",
		t = "",
		sf = "";
	if(l.indexOf("-") == 0 || l.indexOf("+") == 0) {
		sf = s.substr(0, 1);
		s = s.substr(1);
	}
	if(s.indexOf(".") >= 0) {
		l = s.split(".")[0].split("");
		r = s.split(".")[1];
	} else {
		l = s.split("");
	}
	var len = l.length;
	for(i = 1; i <= len; i++) {
		t = (i % 3 == 0 && i != len ? "," : "") + l[len - i] + t;
	}
	return sf + t + (r > 0 ? "." + r : "");
}

//数字四舍五入
function RoundFormat(number, fractionDigits) {
	with(Math) {
		fractionDigits = fractionDigits || 2;
		return round(number * pow(10, fractionDigits)) / pow(10, fractionDigits);
	}
}

//复制内容到粘贴板
function copyToClip(copyStr) {
	if(mui.os.ios) {
		var UIPasteboard = plus.ios.importClass("UIPasteboard");
		var generalPasteboard = UIPasteboard.generalPasteboard();
		// 设置文本内容:
		generalPasteboard.setValueforPasteboardType(copyStr, "public.utf8-plain-text");

		//ios 10 报错解决方案
		if(mui.os.ios && parseFloat(mui.os.version) >= 10) {
			generalPasteboard.plusCallMethod({
				"setValue": copyStr,
				"forPasteboardType": "public.utf8-plain-text"
			});
			generalPasteboard.plusCallMethod({
				"valueForPasteboardType": "public.utf8-plain-text"
			});
		}
	} else {
		var Context = plus.android.importClass("android.content.Context");
		var main = plus.android.runtimeMainActivity();
		var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
		plus.android.invoke(clip, "setText", copyStr);
	}
}

//读取粘贴板内容
function copyFromClip() {
	var value = "";
	if(mui.os.ios) {
		var UIPasteboard = plus.ios.importClass("UIPasteboard");
		var generalPasteboard = UIPasteboard.generalPasteboard();
		//获取文本内容
		value = generalPasteboard.valueForPasteboardType("public.utf8-plain-text");
	} else {
		var Context = plus.android.importClass("android.content.Context");
		var main = plus.android.runtimeMainActivity();
		var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
		value = plus.android.invoke(clip, "getText");
	}
	return value;
}

//打开页面
function OpenPage(pagehref, initMethod, params) {
	/*console.info("[common.js] OpenPage window.plus:" + window.plus);*/
	if(window.plus) {
		targetPage = plus.webview.getWebviewById(pagehref);
		/*console.info("[common.js] OpenPage targetPage:" + targetPage);
		console.info("[common.js] OpenPage tpagehref:" + pagehref);
		console.info("[common.js] OpenPage initMethod:" + initMethod);*/
		if(null == targetPage) {
			targetPage = mui.preload({
				url: pagehref,
				id: pagehref
			});
		}
		targetPage.setStyle({
			'popGesture': 'none'
		});

		params = params || {};
		if(initMethod != null && trim(initMethod).length > 0) {
			mui.fire(targetPage, initMethod, params);
			/*console.info("[common.js] OpenPage mui.fire:" + initMethod);*/
		}
		mui.openWindow({
			id: pagehref,
			url: pagehref,
			show: {
				aniShow: 'none'
			},
			waiting: {
				autoShow: false
			}
		});
		/*console.info("[common.js] OpenPage mui.openWindow finish");*/
	} else {
		window.location.href = pagehref;
	}
}

function CheckLoginToken(params) {
	var token = localStorage.getItem(LS_TOKEN);
	if(token === null || trim(token).length === 0) {
		OpenPage(LS_P_LOGIN, "auto_login", params);
	} else {
		return true;
	}
}

//拨打电话
function DialTel(telNumber) {
	plus.device.dial(telNumber, false);
}

//限制小数位最多5位
function LimiDigital(val) {
	var limit = ""
	if(val.length > 0) {
		if(val.match(/\d*(\.\d{0,4})?/)[0].length > 0)
			limit = val.match(/\d*(\.\d{0,5})?/)[0];
		else
			limit = val.match(/\d*(\.\d{0,4})?/)[0];
	}
	return limit;
}

//显示自动消失信息提示框
function ShowToast(msg, options) {
	options = mui.extend({"verticalAlign": "center"}, options);
	if(mui.os.plus) {
		plus.nativeUI.toast(msg, options);
	} else {
		mui.toast(msg);
	}
}

/*字符串替换*/
String.prototype.replaceAll  = function(s1,s2){
	return this.replace(new RegExp(s1,"gm"),s2);
}

/*根据字符串生成日期对象*/
function getDateByStr(dateStr){
	return new Date(dateStr.replaceAll("-", "/"));
}