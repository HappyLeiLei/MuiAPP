//倒计时
function updateEndTime() {
	var date = new Date();
	var time = date.getTime(); //毫秒
	mui(".settime").each(function(i) {
		var endTime = parseInt(this.getAttribute("endTime")); // * 1000; //毫秒
		if(endTime > time) {
			var lag = (endTime - time) / 1000;
			var day = Math.floor((lag / 3600) / 24);
			var hour = Math.floor((lag / 3600) % 24); // + day * 24;
			var minite = Math.floor((lag / 60) % 60);
			var second = Math.floor(lag % 60);
			if(lag > 0) {
				if(day > 0)
					this.innerHTML = day + "天" + hour + "时";
				else
					this.innerHTML = hour + "时" + minite + "分";
			} else {
				this.innerHTML = 0 + "时" + 0 + "分";
			}
		}
	});
	setTimeout(updateEndTime, 1000);
}

//转换订单状态为中文
function ChangeStatusToCN(oStatusCode, sStatusCode, asStatusCode) {
	var statusCN = "";
	switch(oStatusCode) {
		case "TRADE_CANCELED_TIMEOUT":
		case "TRADE_CANCELED_ADMIN":
			statusCN = "交易取消";
			break;
		default:
			switch(sStatusCode) {
				case "ORDER_ING":
					statusCN = "进行中";
					if(asStatusCode === "1") statusCN += " - 卖方已发货"
					break;
				case "TRADE_CANCELED_TIMEOUT":
				case "TRADE_CANCELED_ADMIN":
					statusCN = "交易取消";
					break;
				case "TRADE_FINISHED":
					statusCN = "交易完成";
					break;
				default:
					statusCN = "进行中";
					break;
			}
			break;
	}

	/*switch(oStatusCode) {
		case "WAIT_BUYER_PAY":
			statusCN = "进行中 - 待付款";
			break;
		case "PAYED_OFFLINE":
			statusCN = "进行中 - 已付款";
			break;
		case "TRADE_CANCELED_TIMEOUT":
		case "TRADE_CANCELED_ADMIN":
			statusCN = "交易取消";
			break;
	}*/
	return statusCN;
}

//是否显示订单剩余时间
function CanShowExpireTime(expireTime, oStatus) {
	var showFlag = false;
	/*console.info("[utils-orders.js CanShowExpireTime] oStatus:" + oStatus);
	console.info("[utils-orders.js CanShowExpireTime] expireTime:" + expireTime);
	console.info("[utils-orders.js CanShowExpireTime] expireTime >= new Date:" + (expireTime >= new Date()));*/
	switch(oStatus) {
		case "WAIT_BUYER_PAY":
			if(expireTime >= new Date()) showFlag = true;
			break;
		case "TRADE_CANCELED_TIMEOUT":
		case "TRADE_CANCELED_ADMIN":
			break;
	}
	return showFlag;

}