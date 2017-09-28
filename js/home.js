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
			}if(idx == 0) {
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
var gallery = mui('.mui-slider');
gallery.slider({
	interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
});
//获得slider插件对象
//			var gallery = mui('.mui-slider');
//			gallery.slider().gotoItem(index); //跳转到第index张图片，index从0开始；

//快讯滚动
jQuery(".information-box .txtScroll-top").slide({
	mainCell: ".bd ul",
	autoPage: true,
	effect: "topLoop",
	autoPlay: true,
	vis: 1,
	interTime:4000
});

//即时成交
jQuery(".picScroll-top").slide({
	mainCell: ".bd ul",
	autoPage: true,
	effect: "topLoop",
	autoPlay: true,
	scroll:1,
	vis: 4,
	delayTime:1000,
	interTime:4000
})

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