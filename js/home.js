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
		/*资讯*/
		id: LS_P_MAIN_INFORMATION,
		url: LS_P_MAIN_INFORMATION
	}, {
		/*我的*/
		id: LS_P_MAIN_MY,
		url: LS_P_MAIN_MY
	}],
	statusBarBackground: '#f7f7f7'
});

//加载swiper图片地址
jQuery.ajax({
	type: "GET",
	url: C_URL + C_M_GET_SWIPER,
	dataType: "json",
	timeout: C_TIMEOUT,
	success: function(response) {
		var bannerhtml = '';
		var bannerhtml1 = '';
		var bannerhtml2 = '';
		var bannerhtml3 = '';
		var bannerpoint = '';
		mui.each(response, function(idx, item) {
			if(idx == 0) {
				bannerhtml1 += '<div class="mui-slider-item mui-slider-item-duplicate"><a href="#"><img src=' + item + ' /></a></div>';
				bannerhtml2 += '<div class="mui-slider-item "><a href="#"><img src=' + item + ' /></a></div>';
			} else if(idx + 1 == response.length) {
				bannerhtml3 += '<div class="mui-slider-item mui-slider-item-duplicate"><a href="#"><img src=' + item + ' /></a></div>';
				bannerhtml2 += '<div class="mui-slider-item "><a href="#"><img src=' + item + ' /></a></div>';
			} else {
				bannerhtml2 += '<div class="mui-slider-item "><a href="#"><img src=' + item + ' /></a></div>';
			}
			if(idx == 0) {
				bannerpoint += '<div class="mui-indicator mui-active"></div>';
			} else {
				bannerpoint += '<div class="mui-indicator"></div>';
			}
		});
		bannerhtml = bannerhtml3 + bannerhtml2 + bannerhtml1;
		$("#bannerslider").html(bannerhtml);
		$("#bannersliderpoint").html(bannerpoint);
	},
	error: function(xhr, type, errorThrown) {

	}
});

//获得slider插件对象
var gallery = mui('.top-mui-slider .mui-slider');
gallery.slider({
	interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
});

var gallery1 = mui('.data-slider .mui-slider');
gallery1.slider({
	interval: 0 //自动轮播周期，若为0则不自动播放，默认为0；
});


//快讯滚动
//设置vis为1，即可视高度为整个ul高度，这样就能实现里面li高度不固定时的无缝滚动
var information_height = jQuery(".information-items").height();
if ( information_height > 24) {
		jQuery(".txtMarquee-top").slide({
		mainCell: ".bd .listWrap",
		autoPlay: true,
		effect: "topMarquee",
		vis: 1,
		interTime: 90
	});
}

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

//行情价格接口
jQuery.ajax({
	type: "GET",
	contentType: "application/x-www-form-urlencoded; charset=utf-8",
	url: C_URL + C_M_LAST_PRICE,
	data: {
		"type": 'cu'
	},
	dataType: "json",
	timeout: C_TIMEOUT,
	success: function(response) {
		var hqdata = response.data[0];
		$(".data-list1 .data-title").html(hqdata.name);
		$(".data-list1 .data-content-jia").html(hqdata.CONTPRICE);
		$(".data-list1 .upordown span").html("涨跌：" + hqdata.UPORDOWN);
		$(".data-list11 .data-title").html(hqdata.name);
		$(".data-list11 .data-content-jia").html(hqdata.CONTPRICE);
		$(".data-list11 .upordown span").html("涨跌：" + hqdata.UPORDOWN);
		if(hqdata.UPORDOWN >= 0) {
			$(".data-list1 .upordown").addClass("up");
			$(".data-list11 .upordown").addClass("up");
		} else {
			$(".data-list1 .upordown").addClass("down");
			$(".data-list11 .upordown").addClass("down");
		}
	},
	error: function(xhr, type, errorThrown) {}
});
jQuery.ajax({
	type: "GET",
	contentType: "application/x-www-form-urlencoded; charset=utf-8",
	url: C_URL + C_M_LAST_PRICE,
	data: {
		"type": 'al'
	},
	dataType: "json",
	timeout: C_TIMEOUT,
	success: function(response) {
		var hqdata = response.data[0];
		$(".data-list2 .data-title").html(hqdata.name);
		$(".data-list2 .data-content-jia").html(hqdata.CONTPRICE);
		$(".data-list2 .upordown span").html("涨跌：" + hqdata.UPORDOWN);
		$(".data-list12 .data-title").html(hqdata.name);
		$(".data-list12 .data-content-jia").html(hqdata.CONTPRICE);
		$(".data-list12 .upordown span").html("涨跌：" + hqdata.UPORDOWN);
		if(hqdata.UPORDOWN >= 0) {
			$(".data-list2 .upordown").addClass("up");
			$(".data-list12 .upordown").addClass("up");
		} else {
			$(".data-list2 .upordown").addClass("down");
			$(".data-list12 .upordown").addClass("down");
		}
	},
	error: function(xhr, type, errorThrown) {}
});

//获取最新成交数据
jQuery.ajax({
	type: "GET",
	contentType: "application/x-www-form-urlencoded; charset=utf-8",
	url: C_URL + C_M_GET_NEWWORDER,
	data: {
		"type": 'al'
	},
	dataType: "json",
	timeout: C_TIMEOUT,
	success: function(response) {
		console.log(response);
		var listall = '';
		mui.each(response, function(idx, item) {
			var aa = item.goodsSku;
			var bb = aa.split("-");
			//				var cc = bb.split("_");
			listall += '<li><div class="deal-title"><span class="deal-title-time">' + item.expireTime.substring(0, 10) + '</span>' + item.name + idx + ' 测试 TR <span>1.35mm</span></div>' +
				'<div class="deal-content"><span class="deal-content-note">无为 | 1.8吨</span><strong>' + item.SgoodsPrice + '元</strong><span> / 吨</span></div></li>';
			//				console.log(time);
		});
		$(".picList").html(listall);
		//即时成交
		jQuery(".instant-deal .picScroll-top").slide({
			mainCell: ".bd ul",
			autoPage: true,
			scroll:2,
			effect: "topLoop",
			autoPlay: true,
			vis: 4,
			interTime:4000
		});
	},
	error: function(xhr, type, errorThrown) {}
});

