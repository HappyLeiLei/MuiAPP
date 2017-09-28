//初始化
mui.init({
	swipeBack: false, //关闭右滑关闭功能
	// 预加载详情页
	preloadPages: [
	{
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
	},{
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
		url: C_URL+C_M_GET_SWIPER,
		dataType: "json",
		timeout: C_TIMEOUT,
		success: function(response) {
			console.log(response.length);
			var bannerhtml = '';
			mui.each(response, function(idx, item){
				console.log(idx);
				if(idx == 0){
					bannerhtml += '<div class="mui-slider-item mui-slider-item-duplicate"><a href="#"><img src='+item+' /></a></div>';
				}else{
					bannerhtml += '<div class="mui-slider-item "><a href="#"><img src='+ item +' /></a></div>';
				}
			});
			$("#bannerslider").html(bannerhtml);
		
		},
		error: function(xhr, type, errorThrown) {
			
		}
	});

//获得slider插件对象
var gallery = mui('.mui-slider');
gallery.slider({
	interval: 0 //自动轮播周期，若为0则不自动播放，默认为0；
});
//获得slider插件对象
//			var gallery = mui('.mui-slider');
//			gallery.slider().gotoItem(index); //跳转到第index张图片，index从0开始；
jQuery(".txtScroll-top").slide({
	titCell: ".hd ul",
	mainCell: ".bd ul",
	autoPage: true,
	effect: "top",
	autoPlay: true,
	vis: 1
});

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