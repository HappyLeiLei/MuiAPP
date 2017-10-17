

var hasclass = true;//品种品名分类参数
var mType = "true";
var cPages = [1, 1, 1, 1];
var lastPage = [1, 1, 1, 1];
var pSortNum = ["1", "1", "1", "1"];
var cWebView;
var tabIdx = 0;
var isFirst = true;
var pPid = ["-1", "-1", "-1", "-1"],
	pCid = ["", "", "", ""],
	pSpecId = ["", "", "", ""],
	pVid = ["", "", "", ""],
	pName = ["铜杆", "电解铜", "铝杆", "铝锭"];
var dataDivId = ["cc_copper_rod", "cc_electrolytic_copper", "cc_aluminum_rod", "cc_aluminum_ingot"];
var preCopperPrice = {
		"priceName": "沪铜",
		"newPrice": "",
		"sellPrice": "",
		"buyPrice": ""
	},
	preAluminumPrice = {
		"priceName": "沪铝",
		"newPrice": "",
		"sellPrice": "",
		"buyPrice": ""
	};
var priceType = ["cu", "al"];
var perPrices = [preCopperPrice, preAluminumPrice];
var timerID;
//初始化
mui.init({
	swipeBack: false, //关闭右滑关闭功能
	// 预加载详情页
	preloadPages: [{
		id: LS_P_LOGIN,
		url: LS_P_LOGIN
	}, {
		id: LS_P_SUBMIT_ORDER,
		url: LS_P_SUBMIT_ORDER
	}, {
		/*51集市*/
		id: LS_P_MAIN_MALL,
		url: LS_P_MAIN_MALL
	}, {
		/*行情*/
		id: LS_P_MAIN_PRICE,
		url: LS_P_MAIN_PRICE
	}, {
		/*我的*/
		id: LS_P_MAIN_MY,
		url: LS_P_MAIN_MY
	}],
	statusBarBackground: '#f7f7f7'
});

function initPage() {

	//阻尼系数
	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	mui('.mui-scroll-wrapper').scroll({
		bounce: false,
		indicators: true, //是否显示滚动条
		deceleration: deceleration
	});

	//循环初始化所有下拉刷新，上拉加载。
	tabIdx = 0;
	//监听左右拖动事件
	document.getElementById('slider').addEventListener('slide', function(e) {
		if(tabIdx !== e.detail.slideNumber) {
			tabIdx = e.detail.slideNumber;
			switch(tabIdx) {
				case 1:
				case 2:
				case 3:
					break;
				default:
					tabIdx = 0;
					break;
			}
			hasclass = true;
//			ChangeFilterIconBySlide();
			ReloadPriceAutoData();
			ShowData(true, true);
			localStorage.removeItem("showproduct");
		}
	});
	//监听选项卡点击事件
	document.getElementById('sc_copper_rod').addEventListener('tap', function(e) {
		tabIdx = 0;
		ExchangeHtml();
		hasclass = true;
//		ChangeFilterIconBySlide();
		ReloadPriceAutoData();
		ShowData(true, true);
		localStorage.removeItem("showproduct");
	});
	document.getElementById('sc_electrolytic_copper').addEventListener('tap', function(e) {
		tabIdx = 1;
		ExchangeHtml();
		hasclass = true;
//		ChangeFilterIconBySlide();
		ReloadPriceAutoData();
		ShowData(true, true);
		localStorage.removeItem("showproduct");
	});
	document.getElementById('sc_aluminum_rod').addEventListener('tap', function(e) {
		tabIdx = 2;
		ExchangeHtml();
		hasclass = true;
//		ChangeFilterIconBySlide();
		ReloadPriceAutoData();
		ShowData(true, true);
		localStorage.removeItem("showproduct");
	});
	document.getElementById('sc_aluminum_ingot').addEventListener('tap', function(e) {
		tabIdx = 3;
		ExchangeHtml();
		hasclass = true;
//		ChangeFilterIconBySlide()
		ReloadPriceAutoData();;
		ShowData(true, true);
		localStorage.removeItem("showproduct");
	});
	//实现ios平台的侧滑关闭页面；
	if(mui.os.plus && mui.os.ios) {
		document.getElementById("Order_offCanvasWrapper").addEventListener('shown', function(e) {
			//菜单显示完成事件
			plus.webview.currentWebview().setStyle({
				'popGesture': 'none'
			});
		});
		document.getElementById("Order_offCanvasWrapper").addEventListener('hidden', function(e) {
			//菜单关闭完成事件
			plus.webview.currentWebview().setStyle({
				'popGesture': 'close'
			});
		});
	}
	//重置筛选设置
	document.getElementById('btn_order_resetSearch').addEventListener('tap', function() {
		if(localStorage.getItem("showproduct") == "" || localStorage.getItem("showproduct") == null) {
			ChangeFilterIcon(false);
			mui("#Order_offCanvasWrapper").offCanvas('close');
			pSpecId[tabIdx] = "";
			pVid[tabIdx] = "";
			cPages[tabIdx] = 1;
			ShowData(true, true);
		} else {
			hasclass = true;
			ChangeFilterIcon(false);
			mui("#Order_offCanvasWrapper").offCanvas('close');
			pSpecId[tabIdx] = "";
			pVid[tabIdx] = "";
			cPages[tabIdx] = 1;
			ShowData(true, true);
		}

	});
	//筛选
	document.getElementById('btn_order_search').addEventListener('tap', function() {
		if(pSpecId[tabIdx].length > 0 && pSpecId[tabIdx] !== "nonumber,nonumber,nonumber,nonumber") {
			ChangeFilterIcon(true);
		} else {
			pSpecId[tabIdx] = "";
			pVid[tabIdx] = "";
			ChangeFilterIcon(false);
		}
		mui("#Order_offCanvasWrapper").offCanvas('close');
		cPages[tabIdx] = 1;
		ShowData(true, true);
	});

	BindTapEventToTypeSelectDiv();

	BindTapEventToSortSelectDiv();

	document.getElementById("div_price").addEventListener("tap", function() {
		var pIdx = 0;
		if(tabIdx === 2 || tabIdx === 3) pIdx = 1;
		OpenPage(LS_P_MAIN_PRICE, "price_showlist", {
			"priceTypeIdx": pIdx
		});
	}, false);

	//选项卡点击事件
	mui('.footer_fixed').on('tap', 'a', function(e) {
		var targetTab = this.getAttribute('href');
		if(targetTab != LS_P_MAIN_MARKET) {
			if(targetTab === LS_P_MAIN_MY)
				OpenPage(targetTab, "my_check_login");
			else
				OpenPage(targetTab);
		}

	}, false);

	/*版本升级*/
	document.getElementById("shengji").addEventListener("tap", function() {
		if(mui.os.ios) {
			plus.runtime.openURL(C_SCORE_IOS_URL);
		} else if(mui.os.android) {
			plus.runtime.openURL(C_SCORE_ANDROID_RUL);
			/*var dtask = plus.downloader.createDownload(C_SCORE_ANDROID_RUL, {}, function(d, status) {
				if(status == 200) {
					ShowToast(MSG_APP_DOWNLOAD_SUCCESS);
				} else {
					ShowToast(MSG_NET_LINK_ERROR);
				}
			});
			dtask.start();*/
		}
		document.getElementById("backgroun").style.display = "none";
		document.getElementById("alertversion").style.display = "none";
	}, false);

}

function ChangeFilterIcon(hasFilter) {
	var icon = document.getElementById("span_search_icon");
//	if(hasFilter) {
//		icon.classList.remove('search-info');
//		icon.classList.add('search-info-two');
//	} else {
//		icon.classList.remove('search-info-two');
//		icon.classList.add('search-info');
//	}
}

function ChangeFilterIconBySlide() {
	if(pSpecId[tabIdx].length > 0 && pSpecId[tabIdx] !== "nonumber,nonumber,nonumber,nonumber") {
		ChangeFilterIcon(true);
	} else {
		ChangeFilterIcon(false);
	}
}

mui.ready(function() {
	localStorage.removeItem("localname");
	ExchangeHtml();
//	AutoLoadPriceData();
	ShowData(true, true);
	demoPullToRefresh.init(PullToRefreshTools.skin.defaults);
});

//			mui.plusReady(function() {
//				//plus.navigator.getStatusbarHeight();//获取状态栏高度
//				//关闭启动界面
//				//plus.navigator.closeSplashscreen();
//				//plus.screen.lockOrientation("portrait-primary");
//				initPage();
//				AutoLoadPriceData();
//				ShowData(true, true);
//				//绘制顶部图标
//				cWebView = plus.webview.currentWebview();
//				//开启回弹
//				cWebView.setStyle({
//					bounce: "vertical",
//					bounceBackground: "#efeff4"
//				});
//              demoPullToRefresh.init(PullToRefreshTools.skin.defaults);
//			});

//			function IsEndOfData() {
//				var stopFlag = false;
//				/*console.info("[" + LS_P_MAIN + " IsEndOfData] cPages[" + tabIdx + "]:" + cPages[tabIdx]);
//				console.info("[" + LS_P_MAIN + " IsEndOfData] lastPage[" + tabIdx + "]:" + lastPage[tabIdx]);
//				console.info("[" + LS_P_MAIN + " IsEndOfData] cPages[" + tabIdx + "] > lastPage[" + tabIdx + "]:" + (cPages[tabIdx] > lastPage[tabIdx]));*/
//				if(cPages[tabIdx] > lastPage[tabIdx]) stopFlag = true;
//				else if(cPages[tabIdx] === 1 && lastPage[tabIdx] === 1) stopFlag = true;
//				return stopFlag;
//			}

function IsEndOfData() {
	var stopFlag = false;
	if(cPages[tabIdx] > lastPage[tabIdx]) stopFlag = true;
	//				else if(cPages[tabIdx] === 1 && lastPage[tabIdx] === 1) stopFlag = true;
	return stopFlag;
}

//交货地、发货地、仓库筛选条件
function GetCurrentPageData(isInitPage,isInitCurrentPage) {
	if(isInitCurrentPage) cPages[tabIdx] = 1;
	var param;
		if(pSpecId[tabIdx].length === 0 && hasclass) {
		pVid[tabIdx] = "";
		param = {
			"processCost":'',
			"goodsPriceFlag":1,
			"pid": pPid[tabIdx],
			"change": mType,
			"locationType":localStorage.getItem("localtype"),
			"locationName":localStorage.getItem("localname")
		};
	} else if(pSpecId[tabIdx].length === 0) {
		pVid[tabIdx] = "";
		param = {
			"processCost":'',
			"goodsPriceFlag":1,
			"pid": pPid[tabIdx],
			"cid": pCid[tabIdx],
			"change": mType,
			"locationType":localStorage.getItem("localtype"),
			"locationName":localStorage.getItem("localname")
		};
	} else {
		param = {
			"processCost":'',
			"goodsPriceFlag":1,
			"specId": pSpecId[tabIdx],
			"vid": pVid[tabIdx],
			"change": mType,
			"locationType":localStorage.getItem("localtype"),
			"locationName":localStorage.getItem("localname")
		};
	}
	jQuery.ajax({
		type: "GET",
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		url: C_URL + C_M_GOODS_LIST,
		data: param,
		dataType: "json",
		timeout: C_TIMEOUT,
		success: function(response) {
			//						wd.close();
			cPages[tabIdx] = cPages[tabIdx] + 1;
			if(response != null && response["8"] != null && response["8"].pageNumber != null)
				lastPage[tabIdx] = response["8"].pageNumber;
			else lastPage[tabIdx] = 1;
			var tip = document.querySelector("#" + dataDivId[tabIdx] + " .mui-pull-bottom-tips");
			if(tip) {
				if(IsEndOfData()) {
					tip.querySelector(".mui-pull-loading").innerHTML = MSG_DATA_NOMORE;
					setTimeout(function() {
						tip.style.display = "none";
					}, C_TIME_WAIT);
				} else {
					tip.querySelector(".mui-pull-loading").innerHTML = MSG_DATA_PULL_LOAD;
					tip.style.display = "block";
				}
			}
			bingData(response, dataDivId[tabIdx], isInitCurrentPage);

		},
		error: function(xhr, type, errorThrown) {
			
			ShowToast(MSG_DATA_ERROR);
			//                  var table = document.body.querySelector('#' + dataDivId[tabIdx] + ' ul');
			//					pSpecId[tabIdx] = "";
			//					pVid[tabIdx] = "";
			//					cPages[tabIdx] = 1;
			//					lastPage[tabIdx] = 1;
			//					table.innerHTML = '<div class="nobuy"><div style="width:15%;margin:-15px auto 25px auto;"><img src="images/nowifi.png"/></div><div style="color:#4D4D4D;font-size:16px;margin-bottom: ;">您的手机网络不太顺畅哦~</div><div style="color:#999999;font-size:14px;">请检查您的手机是否联网</div><div><a id="reloadpage"><span style="color:#ff6724;font-size:14px;border:1px solid #ff6724;line-height:30px;width:140px;display:inline-block;border-radius:4px;margin-top:25px;">重新加载</span></a></div></div>';
			reloadpage();
		}

	});
}

/*刷新页面，初始化排序和*/
function ShowData(isInitCurrentPage, isInitSort) {
	if(isInitCurrentPage) cPages[tabIdx] = 1;
//	if(isInitSort) {
//		pSortNum[tabIdx] = "1";
//		/*document.getElementById("sel_orderby").selectedIndex = 0;*/
//		var selDiv = document.getElementById("div_sel_sort_item");
//		var selA = document.getElementById("a_sel_sort");
//		var selItem = selDiv.querySelector("li[dataid='1']");
//		var oVal = selA.getAttribute("selVal");
//		var nVal = selItem.getAttribute("dataid");
//		if(oVal !== nVal) {
//			var preSelItem = selDiv.querySelector("li[dataid='" + selA.getAttribute("selVal") + "']");
//			if(preSelItem) {
//				var spImg = preSelItem.querySelector("span[selimg]");
//				if(spImg) spImg.parentNode.removeChild(spImg);
//				preSelItem.classList.remove("selected-item");
//				selItem.innerHTML += '<span selimg="" style="float: right;height: 30px;"><img src="images/duigou.png" /></span>';
//				selItem.classList.add("selected-item");
//				selA.setAttribute("selVal", selItem.getAttribute("dataid"));
//				if(selItem.innerText == "全部"){
//				selA.innerHTML = '交货地111'+' <span class="mui-icon mui-icon mui-icon-arrowdown">'+'</span>';
//			}else{
//				selA.innerHTML = selItem.innerText+' <span class="mui-icon mui-icon mui-icon-arrowdown">'+'</span>';
//			}
//			}
//		}
//	}
	var param; //商品详情发送内容
	var loacaltype = document.getElementById("a_sel_sort_span");
//		console.log(loacaltype.innerText);
		localStorage.setItem("localtype",loacaltype.innerText);
	if(isFirst || pPid[tabIdx] === "-1") {
		param = {
			"processCost":'',
			"goodsPriceFlag":1,
			"change": mType
		};
	} else if(pSpecId[tabIdx].length === 0 && hasclass) {
		pVid[tabIdx] = "";
		param = {
			"processCost":'',
			"goodsPriceFlag":1,
			"pid": pPid[tabIdx],
			"change": mType,
			"locationType":localStorage.getItem("localtype"),
			"locationName":localStorage.getItem("localname")
		};
	} else if(pSpecId[tabIdx].length === 0) {
		pVid[tabIdx] = "";
		param = {
			"processCost":'',
			"goodsPriceFlag":1,
			"pid": pPid[tabIdx],
			"cid": pCid[tabIdx],
			"change": mType,
			"locationType":localStorage.getItem("localtype"),
			"locationName":localStorage.getItem("localname")
		};
	} else {
		param = {
			"processCost":'',
			"goodsPriceFlag":1,
			"specId": pSpecId[tabIdx],
			"vid": pVid[tabIdx],
			"change": mType,
			"locationType":localStorage.getItem("localtype"),
			"locationName":localStorage.getItem("localname")
		};
	}
	//				var wd = plus.nativeUI.showWaiting();
	/*console.info("[" + LS_P_MAIN + " ShowData] url is:" + C_URL + C_M_GOODS_LIST);
	for(p in param) {
		console.info("[" + LS_P_MAIN + " ShowData] param." + p + " is:" + param[p]);
	}*/
	console.log(param);
	jQuery.ajax({
		type: "GET",
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		url: C_URL + C_M_GOODS_LIST,
		data: param,
		dataType: "json",
		timeout: C_TIMEOUT,
		success: function(response) {
			//						wd.close();
			cPages[tabIdx] = cPages[tabIdx] + 1;
			if(response != null && response["8"] != null && response["8"].pageNumber != null)
				lastPage[tabIdx] = response["8"].pageNumber;
			else lastPage[tabIdx] = 1;
			var tip = document.querySelector("#" + dataDivId[tabIdx] + " .mui-pull-bottom-tips");
			if(tip) {
				if(IsEndOfData()) {
					tip.querySelector(".mui-pull-loading").innerHTML = MSG_DATA_NOMORE;
					setTimeout(function() {
						tip.style.display = "none";
					}, C_TIME_WAIT);
				} else {
					tip.querySelector(".mui-pull-loading").innerHTML = MSG_DATA_PULL_LOAD;
					tip.style.display = "block";
				}
			}
			bingData(response, dataDivId[tabIdx], isInitCurrentPage);

		},
		error: function(xhr, type, errorThrown) {
			//						wd.close();
			//						ShowToast(MSG_DATA_ERROR);
			var table = document.body.querySelector('#' + dataDivId[tabIdx] + ' ul');
			pSpecId[tabIdx] = "";
			pVid[tabIdx] = "";
			cPages[tabIdx] = 1;
			lastPage[tabIdx] = 1;
			table.innerHTML = '<div class="nobuy"><div style="width:15%;margin:-15px auto 25px auto;"><img src="images/nowifi.png"/></div><div style="color:#4D4D4D;font-size:16px;margin-bottom: ;">您的手机网络不太顺畅哦~</div><div style="color:#999999;font-size:14px;">请检查您的手机是否联网</div><div><a id="reloadpage' + tabIdx + '" ><span style="color:#ff6724;font-size:14px;border:1px solid #ff6724;line-height:30px;width:140px;display:inline-block;border-radius:4px;margin-top:25px;">重新加载</span></a></div></div>';
			reloadpage();
		}
	});
}

function HaveData(data, table) {
	var isdatalength = true;
	if(data["4"] == null || data["4"].length === 0 ||
		pName[tabIdx] !== data["4"][0].name) {
		pSpecId[tabIdx] = "";
		pVid[tabIdx] = "";
		cPages[tabIdx] = 1;
		lastPage[tabIdx] = 1;
		table.innerHTML = '<div class="nobuy"><div style="width:15%;margin:10px auto 2px auto;"><img src="images/elephant.png"/></div><div style="color:#999999;font-size:16px;">抱歉，该品名没有商品在销售</div><div><a  href="#cc_aluminum_rod" id="gotofirst"><span style="color:#ff6724;font-size:14px;border:1px solid #ff6724;line-height:30px;width:140px;display:inline-block;border-radius:4px;margin-top:25px;">前去看看其他商品</span></a></div></div>';
		isdatalength = false;
		togofirst();
	}
	return isdatalength;
}

function bingData(response, targetID, isInitCurrentPage) {
//					console.log(response);
	var table = document.body.querySelector('#' + targetID + ' ul');
	document.getElementById("div_search_item").innerHTML = "";
	var selObj = document.getElementById("a_sel_type"); //document.getElementById("sel_type_name");
	var selItemDiv = document.getElementById("div_sel_type_item");
//	selObjName.innerHTML = "";
	if(hasclass) {
		selItemDiv.innerHTML = '<li dataid="" class="sel-item selected-item"><span class="" style="font-size:14px;">' + '全部' + '</span><span selimg="" style="float: right;height: 30px;"><img src="images/duigou.png" style="height:18px;margin-top:8px;"/></span>';
	} else {
		selItemDiv.innerHTML = '<li dataid="" class="sel-item"><span class="" style="font-size:14px;">' + '全部' + '</span></span>';
	}
	if(pCid[tabIdx] == "") {
		hasclass = true;
	}
	if(isInitCurrentPage) table.innerHTML = "";
	if(response != null) {
		//品种
		mui.each(response["0"], function(idx, item) {
			if(item.pname != null) {
				if(item.pname.indexOf("铜杆") >= 0) {
					pPid[0] = item.pid;
				} else if(item.pname.indexOf("电解铜") >= 0) {
					pPid[1] = item.pid;
				} else if(item.pname.indexOf("铝杆") >= 0) {
					pPid[2] = item.pid;
				} else if(item.pname.indexOf("铝锭") >= 0) {
					pPid[3] = item.pid;
				}
			}
		});
		//品名
		var tmpCid = pCid[tabIdx];
		if(response["1"] == null || response["1"].length === 0 || pPid[tabIdx] === "-1") {
			pCid[tabIdx] = "";
		} else {
			mui.each(response["1"], function(idx, item) {
				var itemHtml = '';

				if(((response["6"] === null || response["6"].length === 0) && idx === 0 && !hasclass) ||
					response["6"] === item.cid) {
					pCid[tabIdx] = item.cid;
					itemHtml += '<li dataid="' + item.cid + '" class="sel-item selected-item">'
					itemHtml += '<span class="" style="font-size:14px;">' + item.cname + '</span>';
					itemHtml += '<span selimg="" style="float: right;height: 30px;"><img src="images/duigou.png" style="height:18px;margin-top:8px;"/></span>';
					selObj.innerHTML = item.cname+' <span class="mui-icon mui-icon mui-icon-arrowdown">'+'</span>';
					selObj.setAttribute("selVal", item.cid);
				} else if(hasclass) {
					selObj.innerHTML = '品名'+' <span class="mui-icon mui-icon mui-icon-arrowdown">'+'</span>';
					selObj.setAttribute("selVal", "");
					itemHtml += '<li dataid="' + item.cid + '" class="sel-item">'
					itemHtml += '<span>' + item.cname + '</span>';
				} else {
					itemHtml += '<li dataid="' + item.cid + '" class="sel-item">'
					itemHtml += '<span>' + item.cname + '</span>';
				}
				itemHtml += '</li>';
				selItemDiv.innerHTML += itemHtml;
			});
		}
		if(HaveData(response, table)) {
			if(pPid[tabIdx] !== "-1" && tmpCid === "" && isFirst) {
				isFirst = false;
				ShowData(true, true);
			} else {
				//筛选项
				if(hasclass) {
					BindSearchItempProductName(response["1"], response["7"]);
					BindDataToLocalSelect(response["13"]);
					//数据
					BindDataToPage(response["4"], table, response["8"].pageNum);
					BindTapEventToBuyButton();
					BindTapEventToSearchProduct();
				} else {
					BindSearchItem(response["2"], response["7"], response["1"]);
					BindDataToLocalSelect(response["13"]);
					//数据
					BindDataToPage(response["4"], table, response["8"].pageNum);
					BindTapEventToBuyButton();
					BindTapEventToSearchItem();
				}
			}
		}
	}
}

//绑定数据到交货的筛选菜单中
function BindDataToLocalSelect(dataList){
	var dataListall = dataList.deliveryPlace;
	var localselect = '<li id="div_sel_sort_item_list" dataid="1" class="sel-item selected-item"><span>全部</span><span selimg="" style="float: right;"><img src="images/duigou.png" style="height: 18px;margin-top: 8px;"/></span></li>';
	mui.each(dataListall,function(index,item){
		localselect += '<li dataid='+item+' class="sel-item"><span>'+item+'</span></li>';
	});
	$("#div_sel_sort_item").html(localselect);
}
//pageNum 临时修改“筛选”样式问题。20170803-李健
//绑定页面数据
function BindDataToPage(dataList, table, filter) {
	var parambb = false;
	mui.each(dataList, function(index, item) {
		var li = document.createElement('li');
		li.className = 'mui-table-view-cell pulltop';
		var templateHtml = '';
		templateHtml = '<div class="product-main"><span class="product-item"><div class="item-main-top">';
		templateHtml += '<span class="black">' + item.name2 + '</span>';
		templateHtml += '<span class="pro-t">' + RoundFormat(item.goodsCount, 5) + '吨</span>';
		templateHtml += '<span class="start-mark">起订</span>';
		templateHtml += '<span class="tt">' + RoundFormat(item.minimum, 5) + '吨</span>';
		if(dataList[index].status == "DOWN_SHELF") {
			templateHtml += '<span class="money">' + '<span class="orange1">' + '-' + '</span><span>元/吨</span>' + '</span>';
		} else {
			templateHtml += '<span class="money">' + '<span class="orange1">' + RoundFormat(item.goodsPrice, 2) + '</span><span>元/吨</span>' + '</span>';
		}
		templateHtml += '</div><div class="item-main-bottom">';
		if(item.goodsSkuDetail != null && item.goodsSkuDetail.length > 0) {
			mui.each(item.goodsSkuDetail, function(idx, obj) {
				if(obj.key.indexOf("直径") === -1) {
					if(obj.key.indexOf("交货地") === -1) {
						if(obj.key.indexOf("发货地") === -1) {
							templateHtml += '<span class="common">' + obj.value + '</span>';
						} else {
							templateHtml += '<span class="common">发货地:' + obj.value + '</span>';
						}
					} else {
						templateHtml += '<span class="common">交货地:' + obj.value + '</span>';
					}
				} else {
					templateHtml += '<span class="common">φ' + obj.value + '</span>';
				}
			});
		}
		templateHtml += '</div>';
		//可购买
		if(dataList[index].status == "UP_SHELF") {
			parambb = true;
			templateHtml += '</span><span class="btn-product">';
			templateHtml += '<button type="button" class="mui-btn orange setbtn" status="' + item.status + '" data_id="' + item.id + '" seller="' + item.sellerId + '">购买</button>';
			templateHtml += '</span>';
			templateHtml += '</div>';
		} else if(dataList[index].status == "SOLT_OUT") { //已成交
			templateHtml += '</span><span class="btn-product">';
			templateHtml += '<button type="button" class="mui-btn-sell setbtn-sell" status="' + item.status + '"  data_id="' + item.id + '" seller="' + item.sellerId + '">已成交</button>';
			templateHtml += '</span>';
			templateHtml += '</div>';
		} else if(dataList[index].status == "DOWN_SHELF") { //待上架
			templateHtml += '</span><span class="btn-product">';
			templateHtml += '<button type="button" class="mui-btn-sell setbtn-sell-well" status="' + item.status + '"  data_id="' + item.id + '" seller="' + item.sellerId + '">待上架</button>';
			templateHtml += '</span>';
			templateHtml += '</div>';
		}
		li.innerHTML = templateHtml;

		table.appendChild(li);
	});

	if(filter == 1 && parambb == false) {
		$(".search-in").css("color", "#999999");
		$(".search").attr('href', 'javascript:void(0)');
	} else if(filter == 1 && parambb == true) {
//		$(".search-in").css("color", "#4D4D4D");
		$(".search").attr('href', '#order_search_canva');
	}
}

function IsSelectItem(specId, specVid, selItems) {
	var flag = false;
	if(selItems != null && selItems.length > 0) {
		mui.each(selItems, function(idx, sel) {
			if(sel.specId === specId && sel.specVid === specVid) {
				flag = true;
				return false;
			}
		});
	}
	return flag;
}

//绑定筛选项
function BindSearchItem(items, selItems, allProduct) {
	if(items != null) {
		var html = '';
		if(allProduct != null) {
			var html1 = '';
			mui.each(allProduct, function(idx, obj) {
				var showproduct = localStorage.getItem("showproduct");
				var dataId = Object.values(obj)[0];
				var name = Object.values(obj)[1];
				if(showproduct == dataId) {
					html1 += '<div class="scroll-name"><span>' + "品名" + '</span><span class="search-icon-collapse"  is_show="false"></span></div><div>';
					html1 += '<button type="button" nati="' + dataId + '"  ccid="' + dataId + '" class="mui-btn search-item-button-select">' + name + '</span>';
				}
			});
			html1 += '</div>';
		}
		document.getElementById("div_search_item_top").innerHTML = html1;
		mui.each(items, function(idx, obj) {
			var dataId = Object.keys(obj)[0];
			var val = obj[dataId];
			var name = Object.keys(val)[0];
			val = val[name];
			if(name.indexOf("直径") === -1) {
				var key = Object.keys(val);
				html += '<div class="scroll-name">';
				html += '<span>' + name + '</span>';
				if(key === null) key = [];
				if(key.length > 3) {
					html += '<span class="search-icon-collapse" scid="' + dataId + '" is_show="false"><img src="images/triangle_down.png"></span>';
				}
				html += '</div>';
				html += '<div id="' + dataId + '">';
				html += '<div class="scroll-btn">';
				for(var i = 0; i < key.length; i++) {
					if(i > 2 && i % 3 === 0) {
						html += '</div>';
						if(i === 3) html += '<div class="search-item-collapse">';
						html += '<div>';
					}
					if(IsSelectItem(dataId, key[i], selItems))
						html += '<button type="button" nati="' + key[i] + '" dataId="' + dataId + '" class="mui-btn search-item-button-select">' + val[key[i]] + '</button>';
					else
						html += '<button type="button" nati="' + key[i] + '" dataId="' + dataId + '" class="mui-btn search-item-button">' + val[key[i]] + '</button>';
				}
				if(key.length > 3) html += '</div>';
				html += '</div></div>';
			} else {
				html += BindSearchItemForNorm(dataId, val, selItems);
			}

		});

		document.getElementById("div_search_item").innerHTML = html;
	}
}

//绑定筛选产品名称
function BindSearchItempProductName(items, selItems) {
	if(items != null) {
		var html = '';
		html += '<div class="scroll-name"><span>' + "品名" + '</span><span class="search-icon-collapse"  is_show="false"></span></div><div>';
		mui.each(items, function(idx, obj) {
			var dataId = Object.values(obj)[0];
			var name = Object.values(obj)[1];
			html += '<button type="button" nati="' + dataId + '"  ccid="' + dataId + '" class="mui-btn search-item-button">' + name + '</span>';
		});
		html += '</div>';
		document.getElementById("div_search_item_top").innerHTML = html;
	}
}

//绑定筛选项(规格)
function BindSearchItemForNorm(dataId, items, selItems) {
	var html = '';
	if(items != null) {
		html = '<div class="scroll-name" style="padding-bottom: 0;"><span>规格</span></div>';
		var lenArray = [0, 0, 0, 0];
		var htmls = ["", "", "", ""];
		var hh = ["", "", "", ""];
		var RVal = 0;
		var key = Object.keys(items);
		for(var i = 0; i < key.length; i++) {
			RVal = parseFloat(items[key[i]]);
			var idx = 0;
			if(RVal < 1) idx = 0;
			else if(RVal >= 1 && RVal <= 2) idx = 1;
			else if(RVal > 2 && RVal <= 3) idx = 2;
			else if(RVal > 3) idx = 3;
			if(lenArray[idx] > 2 && lenArray[idx] % 3 === 0) {
				htmls[idx] += '</div>';
				if(lenArray[idx] === 3) htmls[idx] += '<div class="search-item-collapse">';
				htmls[idx] += '<div>';
			}
			if(IsSelectItem(dataId, key[i], selItems))
				htmls[idx] += '<button type="button" nati="' + key[i] + '" dataId="' + dataId + '" class="mui-btn search-item-button-select">' + items[key[i]] + '</button>';
			else
				htmls[idx] += '<button type="button" nati="' + key[i] + '" dataId="' + dataId + '" class="mui-btn search-item-button">' + items[key[i]] + '</button>';

			lenArray[idx] += 1;
		}

		var normTitle = ["&lt;φ1mm", "φ1mm-φ2mm", "φ2mm-φ3mm", "&gt;φ3mm"];
		mui.each(lenArray, function(idx, len) {
			if(len > 0) {
				hh[idx] = '<div class="scroll-name">';
				hh[idx] += '<span>' + normTitle[idx] + '</span>';
				if(len > 3) {
					hh[idx] += '<span class="search-icon-collapse" scid="search_norm' + (idx + 1) + '" is_show="false"><img src="images/triangle_down.png"></span>';
					htmls[idx] += '</div>';
				}
				hh[idx] += '</div>';
				hh[idx] += '<div id="search_norm' + (idx + 1) + '">';
				hh[idx] += '<div class="scroll-btn">';
				html += hh[idx] + htmls[idx] + '</div></div>';
			}
		});

	}
	return html;

}
//购买按钮点击事件
function BindTapEventToBuyButton() {
	//购买
	mui('.mui-table-view-cell').off('tap', 'button');
	mui('.mui-table-view-cell').on('tap', 'button', function(e) {
		var data_id = this.getAttribute('data_id');
		var seller = this.getAttribute('seller');
		var status = this.getAttribute('status');
		CheckLoginToken({
			fromUrl: LS_P_MAIN_MARKET
		});
		//					var wd = plus.nativeUI.showWaiting();
		if(status == "UP_SHELF") {
			jQuery.ajax({
				type: "GET",
				contentType: "application/x-www-form-urlencoded; charset=utf-8",
				url: C_URL + C_M_USER_GROUP,
				data: {
					"login_token": localStorage.getItem(LS_TOKEN)
				},
				dataType: "json",
				timeout: C_TIMEOUT,
				success: function(response) {
					//							wd.close();
					/*var info = "[" + LS_P_MAIN + " BuyButton] response:" + response;
					for(p in response) {
						info += "\n\t type response." + p + " is:" + (typeof response[p]) + " ; response." + p + " is:" + response[p];
					}
					console.info(info);*/
					if(response != null && response.userId != null) {
						if(response.userId === seller) {
							mui.alert('您不可购买自己发布的商品');
						} else if(response.group === 1 || response.group === 2) {
							OpenPage(LS_P_SUBMIT_ORDER, "goods_order", {
								"id": data_id,
								"fromUrl": LS_P_MAIN_MARKET
							});

						} else {
							var btnArray = ['取消', '确定'];
							mui.confirm('您没有采购权限，\n是否拨打客服电话开通\n客服电话' + LS_PHONE, '', btnArray, function(e) {
								if(e.index === 1) {
									/*确定*/
									DialTel(LS_PHONE);
								} else {
									/*取消*/
								}
							});
						}
					} else if(response === "requireToken") {
						OpenPage(LS_P_LOGIN, "auto_login", {
							"fromUrl": LS_P_MAIN
						});
					} else {
						ShowToast(MSG_DATA_ERROR);
					}
				},
				error: function(xhr, type, errorThrown) {
					//							wd.close();
					ShowToast(MSG_DATA_ERROR);
				}
			});
		}
		//已成交的没写
		//                  else if( status == "SOLT_OUT" ){
		//                 	alert(111);
		//                 }				
	});

}
//展开筛选条件点击事件
function BindTapEventToSearchItem() { 
	mui('#div_search_item').off('tap', '.search-icon-collapse');
	mui('#div_search_item').on('tap', '.search-icon-collapse', function() {
		var scid = this.getAttribute("scid");
		var isshow = this.getAttribute("is_show");
		var el = document.getElementById(scid).querySelector('.search-item-collapse');
		if(isshow === "true") {
			this.setAttribute("is_show", "false");
			el.style.display = 'none';
		} else {
			this.setAttribute("is_show", "true");
			el.style.display = 'inherit';
		}
	});

	//展开筛选条件点击事件
	mui('#div_search_item').off('tap', 'button');
	mui('#div_search_item').on('tap', 'button', function() {
		//					document.getElementById('mui-off-canvas-backdrop').addEventListener('tap', function(e) {
		//					ChangeFilterIconBySlide();
		//				});
		pSpecId[tabIdx] = "";
		pVid[tabIdx] = "";
		if(this.classList.contains("search-item-button")) {
			this.classList.remove("search-item-button");
			this.classList.add("search-item-button-select");
		} else {
			this.classList.remove("search-item-button-select");
			this.classList.add("search-item-button");
		}
		hasclass = false;
		BindParam(document.querySelectorAll("#div_search_item button[nati].search-item-button-select"));
		pVid[tabIdx] = pPid[tabIdx] + "," + pCid[tabIdx] + pVid[tabIdx];
		if(pSpecId[tabIdx].length > 0) pSpecId[tabIdx] = pSpecId[tabIdx].substr(1);
//		ShowData(true, true);
	});
}

//展开筛选条件点击事件
function BindTapEventToSearchProduct() { 
	mui('#div_search_item_top').off('tap', 'button');
	mui('#div_search_item_top').on('tap', 'button', function() {
		//					document.getElementById('mui-off-canvas-backdrop').addEventListener('tap', function(e) {
		//					ChangeFilterIconBySlide();
		//				});
		pSpecId[tabIdx] = "";
		pVid[tabIdx] = "";
		if(this.classList.contains("search-item-button")) {
			this.classList.remove("search-item-button");
			this.classList.add("search-item-button-select");
			hasclass = false;
		} else {
			this.classList.remove("search-item-button-select");
			this.classList.add("search-item-button");
			localStorage.removeItem("showproduct");
			hasclass = true;
		}
		BindParam(document.querySelectorAll("#div_search_item button[nati].search-item-button-select"));
		pVid[tabIdx] = pPid[tabIdx] + "," + pCid[tabIdx] + pVid[tabIdx];
		pSpecId = ["", "", "", ""];
		pCid[tabIdx] = this.getAttribute("ccid");
		localStorage.setItem("showproduct", pCid[tabIdx]);
//		ShowData(true, true);
	});
}

function BindParam(items) {
	if(items != null && items.length > 0) {
		mui.each(items, function(idx, item) {
			pSpecId[tabIdx] += "," + item.getAttribute("dataId");
			pVid[tabIdx] += "," + item.getAttribute("nati");
		})

	} else {
		pSpecId[tabIdx] = "";
		pVid[tabIdx] = "";
	}
}

/*刷新行情数据*/
function AutoLoadPriceData() {
	ShowPriceData();
	timerID = setTimeout(AutoLoadPriceData, 2000);
}

function ReloadPriceAutoData() {
	if(timerID) clearTimeout(timerID);
	AutoLoadPriceData();
}
//行情价格
function ShowPriceData() {
	
	var pIdx = 0;
	if(tabIdx === 2 || tabIdx === 3) pIdx = 1;
//	jQuery.ajax({
//		type: "GET",
//		contentType: "application/x-www-form-urlencoded; charset=utf-8",
//		url: C_URL + C_M_LAST_PRICE,
//		data: {
//			"type": priceType[pIdx]
//		},
//		dataType: "json",
//		timeout: C_TIMEOUT,
//		success: function(response) {
//			if(response != null) {
//				var item = response.data[0] || {};
//				if((pIdx === 0 && item.CIRCLENO.indexOf("CU") >= 0) ||
//					(pIdx === 1 && item.CIRCLENO.indexOf("AL") >= 0)) {
//					if(item.CIRCLENO.indexOf("CU") >= 0) {
//						perPrices[pIdx].priceName = item.name;
//						document.getElementById("sp_priceName").innerText = item.name;
//					} else if(item.CIRCLENO.indexOf("AL") >= 0) {
//						perPrices[pIdx].priceName = item.name;
//						document.getElementById("sp_priceName").innerText = item.name;
//					}
//					if(item.UPORDOWN >= 0) {
//						$(".green").css("color", "#FF3131");
//					} else {
//						$(".green").css("color", "#66AB1C");
//					}
//					perPrices[pIdx].newPrice = parseInt(item.CONTPRICE);
//					perPrices[pIdx].sellPrice = parseInt(item.SELLERPRICE);
//					perPrices[pIdx].buyPrice = parseInt(item.BUYERPRICE);
//					document.getElementById("sp_newPrice").innerText = parseInt(item.CONTPRICE);
//					document.getElementById("sp_sellPrice").innerText = parseInt(item.SELLERPRICE);
//					document.getElementById("sp_buyPrice").innerText = parseInt(item.BUYERPRICE);
//				}
//			}
//		},
//		error: function(xhr, type, errorThrown) {
//			//ShowToast(MSG_DATA_ERROR);
//		}
//	});
}
//品名选择
function BindTapEventToTypeSelectDiv() {
	mui('#div_sel_type_item').off('tap', 'li');
	mui('#div_sel_type_item').on('tap', 'li', function(e) {
		var selItem = this;
		var selDiv = document.getElementById("div_sel_type_item");
		var selA = document.getElementById("a_sel_type");
		var selAName = document.getElementById("a_sel_type_span");
		var oVal = selA.getAttribute("selVal");
		var nVal = selItem.getAttribute("dataid");
		localStorage.removeItem("showproduct");
		if(oVal !== nVal) {
			var preSelItem = selDiv.querySelector("li[dataid='" + oVal + "']");
			if(preSelItem) {
				var spImg = preSelItem.querySelector("span[selimg]");
				if(spImg) spImg.parentNode.removeChild(spImg);
				preSelItem.classList.remove("selected-item");
			}
			selItem.innerHTML += '<span selimg="" style="float: right;height: 30px;"><img src="images/duigou.png" /></span>';
			selItem.classList.add("selected-item");
			selA.setAttribute("selVal", nVal);
			if(selItem.innerText == "全部"){
				selA.innerHTML = '品名'+' <span class="mui-icon mui-icon mui-icon-arrowdown">'+'</span>';
			}else{
				selA.innerHTML = selItem.innerText+' <span class="mui-icon mui-icon mui-icon-arrowdown">'+'</span>';
			}
			//缓存参数执行查询
			hasclass = false;
			pSpecId[tabIdx] = "";
			pVid[tabIdx] = "";
			ChangeFilterIcon(false);
			cPages[tabIdx] = 1;
			pCid[tabIdx] = selItem.getAttribute("dataid");
//			ShowData(true, true);
		}
		mui('#div_sel_type').popover('hide');
	});
	document.getElementById('a_sel_type').addEventListener('tap', function(e) {
		mui('#div_sel_type').popover('show', document.getElementById('a_sel_type'));
	});
}

//交货地发货地仓库点击动作
function BindTapEventToSortSelectDiv() {
	document.getElementById('a_sel_sort').addEventListener('tap', function(e) {
//		console.log(localStorage.getItem("localname"));
		//调整
		if(localStorage.getItem("localname") == "" ||localStorage.getItem("localname") == null){
			$("li[dataid=1]").html('<span>全部</span><span selimg="" style="float: right;"><img src="images/duigou.png" style="height: 18px;margin-top: 8px;"/></span>')
		}else {
			$("li[dataid=1]").html('<span>全部</span></span>');
			$("li[dataid=1]").removeClass("selected-item");
			$("li[dataid='" + localStorage.getItem("localname") + "']").html('<span>'+localStorage.getItem("localname")+'</span><span selimg="" style="float: right;"><img src="images/duigou.png" style="height: 18px;margin-top: 8px;"/></span>')
            $("li[dataid='" + localStorage.getItem("localname") + "']").addClass("selected-item");
		}
		mui('#div_sel_sort').popover('show', document.getElementById('a_sel_sort'));
	});
	//排序选择
	mui('#div_sel_sort_item').off('tap', 'li');
	mui('#div_sel_sort_item').on('tap', 'li', function(e) {
		var selItem = this;
		var selDiv = document.getElementById("div_sel_sort_item");
		var selA = document.getElementById("a_sel_sort");
		var oVal = selA.getAttribute("selVal");
		var nVal = selItem.getAttribute("dataid");
		if(oVal !== nVal) {
			var preSelItem = selDiv.querySelector("li[dataid='" + oVal + "']");
			if(preSelItem) {
				var spImg = preSelItem.querySelector("span[selimg]");
				if(spImg) spImg.parentNode.removeChild(spImg);
				preSelItem.classList.remove("selected-item");
				selItem.innerHTML += '<span selimg="" style="float: right;height: 30px;"><img src="images/duigou.png" style="height:18px;margin-top:8px;"/></span>';
				selItem.classList.add("selected-item");
				selA.setAttribute("selVal", nVal);
				selA.innerHTML = '<span id=a_sel_sort_span>交货地</span>'+selItem.innerText+' <span class="mui-icon mui-icon mui-icon-arrowdown">'+'</span>';
			}
			//缓存参数执行查询
			console.log(selItem.innerText);
			if(selItem.innerText == "全部"){
				localStorage.setItem("localname","");
			}else{
				localStorage.setItem("localname",selItem.innerText);
			}
			pSortNum[tabIdx] = selItem.getAttribute("dataid");
			cPages[tabIdx] = 1;
			GetCurrentPageData(true,true,);
		}
		mui('#div_sel_sort').popover('hide');
	});
}
//购买其他商品点击事件
function togofirst() {

	document.getElementById('gotofirst').addEventListener('tap', function(e) {
		//直接重新刷新页面
		location.reload();
		//					$("#sc_aluminum_ingot,#sc_electrolytic_copper,#sc_copper_rod").removeClass("mui-active");
		//					$("#sc_aluminum_rod").addClass("mui-active");
		//					tabIdx = 0;
		//					ChangeFilterIconBySlide();
		//					ReloadPriceAutoData();
		//					ShowData(true, true);
		//					$(".mui-slider-group").css("transform","translate3d(0px, 0px, 0px) translateZ(0px)");
	});
}

//重新加载页面
function reloadpage() {
	//直接重新刷新页面
	document.getElementById('reloadpage' + tabIdx).addEventListener('tap', function(e) {
		location.reload();
	});
}

//改变页面
function ExchangeHtml(){
	if(tabIdx == 0){
		$("#dianjietongdata").html("");
		$("#lvdingdata").html("");
		var htmldata = '<div id="div_price" class="div-price"><span id="sp_price" class="sp-price">'
		+'<span id="sp_priceName" class="sp-price-item"></span><span class="sp-price-item">最新价<span>'
		+'<span style="font-family:Arial;" class="green">&yen;</span><span id="sp_newPrice" class="green">--</span></span></span>'
	    +'<span class="sp-price-item">卖价<span><span style="font-family:Arial; " class="green">&yen;</span><span id="sp_sellPrice" class="green">--</span></span></span>'
		+'<span class="sp-price-item">买价<span><span style="font-family:Arial; " class="green">&yen;</span><span id="sp_buyPrice" class="green">--</span></span></span></span></div>'
		+'<div class="screen-main-btn" id="yikou_keyi"><a href="" class="screen-btn-items mui-active">'
		+'<span class="screen-btn-icon screen-btn-icon1"></span>一口价</a><a href="" class="screen-btn-items "><span class="screen-btn-icon screen-btn-icon2"></span>可议价</a></div>'
		+'<div class="sel-sort"><div id="a_sel_type" class="sel-name" selVal=""><span id="a_sel_type_span">品名</span> <span class="mui-icon mui-icon mui-icon-arrowdown"></span>'
		+'</div><div id="a_sel_sort" class="sel-name" selVal="1"><span id="a_sel_sort_span">交货地</span> <span class="mui-icon mui-icon mui-icon-arrowdown"></span></div><div class="sel-name" style="border-color: white;">'
		+'<a class="search" href="#order_search_canva" style="line-height: 16px;"><span class="search-in" style="line-height: 16px;">筛选</span><span id="span_search_icon" class="search-insfo" style="position: absolute;right:10px;"></span></a></div></div>';
		$("#tonggandata").html(htmldata);
	}else if(tabIdx == 1){
		$("#tonggandata").html("");
		$("#lvdingdata").html("");
		$("#lvgandata").html("");
		var htmldata = '<div id="div_price" class="div-price"><span id="sp_price" class="sp-price">'
		+'<span id="sp_priceName" class="sp-price-item"></span><span class="sp-price-item">最新价<span>'
		+'<span style="font-family:Arial;" class="green">&yen;</span><span id="sp_newPrice" class="green">--</span></span></span>'
	    +'<span class="sp-price-item">卖价<span><span style="font-family:Arial; " class="green">&yen;</span><span id="sp_sellPrice" class="green">--</span></span></span>'
		+'<span class="sp-price-item">买价<span><span style="font-family:Arial; " class="green">&yen;</span><span id="sp_buyPrice" class="green">--</span></span></span></span></div>'
		+'<div class="screen-main-btn" id="yikou_keyi"><a href="" class="screen-btn-items mui-active">'
		+'<span class="screen-btn-icon screen-btn-icon1"></span>一口价</a><a href="" class="screen-btn-items "><span class="screen-btn-icon screen-btn-icon2">'
		+'</span>可议价</a></div>'+'<div class="sel-sort"><div id="a_sel_type" class="sel-name" selVal=""><span id="a_sel_type_span">品名</span> <span class="mui-icon mui-icon mui-icon-arrowdown"></span>'
		+'</div><div id="a_sel_sort" class="sel-name" selVal="1"><span id="a_sel_sort_span">交货地</span> <span class="mui-icon mui-icon mui-icon-arrowdown"></span></div><div class="sel-name" style="border-color: white;">'
		+'<a class="search" href="#order_search_canva" style="line-height: 16px;"><span class="search-in" style="line-height: 16px;">筛选</span><span id="span_search_icon" class="search-insfo" style="position: absolute;right:10px;"></span></a></div></div>';
		$("#dianjietongdata").html(htmldata);
	}else if(tabIdx == 2){
		$("#tonggandata").html("");
		$("#dianjietongdata").html("");
		$("#lvdingdata").html("");
		var htmldata = '<div id="div_price" class="div-price"><span id="sp_price" class="sp-price">'
		+'<span id="sp_priceName" class="sp-price-item"></span><span class="sp-price-item">最新价<span>'
		+'<span style="font-family:Arial;" class="green">&yen;</span><span id="sp_newPrice" class="green">--</span></span></span>'
	    +'<span class="sp-price-item">卖价<span><span style="font-family:Arial; " class="green">&yen;</span><span id="sp_sellPrice" class="green">--</span></span></span>'
	    +'<span class="sp-price-item">买价<span><span style="font-family:Arial; " class="green">&yen;</span><span id="sp_buyPrice" class="green">--</span></span></span></span>'
		+'<span style="display: block;">长江现货铝<span class="sp-price-item">均价<span><span style="font-family:Arial; " class="green">&yen;</span><span id="" class="green">--</span></span></span></span></div>'+'<div class="sel-sort"><div id="a_sel_type" class="sel-name" selVal=""><span id="a_sel_type_span">品名</span> <span class="mui-icon mui-icon mui-icon-arrowdown"></span>'
		+'</div><div id="a_sel_sort" class="sel-name" selVal="1"><span id="a_sel_sort_span">交货地</span> <span class="mui-icon mui-icon mui-icon-arrowdown"></span></div><div class="sel-name" style="border-color: white;">'
		+'<a class="search" href="#order_search_canva" style="line-height: 16px;"><span class="search-in" style="line-height: 16px;">筛选</span><span id="span_search_icon" class="search-insfo" style="position: absolute;right:10px;"></span></a></div></div>';
		$("#lvgandata").html(htmldata);
	}else if(tabIdx == 3){
		$("#tonggandata").html("");
		$("#dianjietongdata").html("");
		$("#lvgandata").html("");
		var htmldata = '<div id="div_price" class="div-price"><span id="sp_price" class="sp-price">'
		+'<span id="sp_priceName" class="sp-price-item"></span><span class="sp-price-item">最新价<span>'
		+'<span style="font-family:Arial;" class="green">&yen;</span><span id="sp_newPrice" class="green">--</span></span></span>'
	    +'<span class="sp-price-item">卖价<span><span style="font-family:Arial; " class="green">&yen;</span><span id="sp_sellPrice" class="green">--</span></span></span>'
	    +'<span class="sp-price-item">买价<span><span style="font-family:Arial; " class="green">&yen;</span><span id="sp_buyPrice" class="green">--</span></span></span></span>'
		+'<span style="display: block;">长江现货铝<span class="sp-price-item">均价<span><span style="font-family:Arial; " class="green">&yen;</span><span id="" class="green">--</span></span></span></span></div>'+'<div class="sel-sort"><div id="a_sel_type" class="sel-name" selVal=""><span id="a_sel_type_span">品名</span> <span class="mui-icon mui-icon mui-icon-arrowdown"></span>'
		+'</div><div id="a_sel_sort" class="sel-name" selVal="1"><span id="a_sel_sort_span">交货地</span> <span class="mui-icon mui-icon mui-icon-arrowdown"></span></div><div class="sel-name" style="border-color: white;">'
		+'<a class="search" href="#order_search_canva" style="line-height: 16px;"><span class="search-in" style="line-height: 16px;">筛选</span><span id="span_search_icon" class="search-insfo" style="position: absolute;right:10px;"></span></a></div></div>';
		$("#lvdingdata").html(htmldata);
	}
	initPage();
}
