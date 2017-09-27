
function codeLogin(a) {
	/*a = a.code || 0;
	if(_.isEmpty(a)) return !0;
	switch(a) {
		case -99:
		case -1:
			mui.openWindow({
				url: "login.html",
				id: "login"
			});
			break;
		default:
			return !0
	}*/
}

function checkNet() {
	var a = plus.networkinfo.getCurrentType() || {};
	if(plus.networkinfo.CONNECTION_UNKNOW != a && plus.networkinfo.CONNECTION_NONE != a) return true;
	else return false;
};