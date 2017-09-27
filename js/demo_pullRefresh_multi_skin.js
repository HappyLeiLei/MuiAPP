/**
 * 作者: dailc
 * 时间: 2017-04-05 
 * 描述: 这里是同时生成多个下拉刷新
 */
(function(exports) {
	/**
	 * @description 初始化下拉刷新
	 */
	function initPullRefreshList(pullToRefreshBase, options) {
		options = options || {};
		isAuto = options.isAuto||false;
		var container = options.container;
		var listContainer = options.listContainer;
		// 以下几个是测试加载更多,没有更多数据功能的
		// 当前页
		var currpage = 0;
		// 每页大小
		var pageSize = 20;
		// 总共大小，这里用来判断是否可以上拉加载
		// 实际业务中，可以不基于totalcount判断的，直接根据接口返回的数据进行判断
		var totalCount = 500;
		var pullToRefreshObj = new pullToRefreshBase({
			// 这里用默认设置
			container: container,
			down: {
				callback: pullDownRefreshCallback,
				// 是否显示成功动画
				isSuccessTips: false,
			},
			// down为null表示不要下拉刷新
			// down: null,
			// 上拉有关
			up: {
				// 是否自动上拉加载-初始化是是否自动
				auto: isAuto || false,
				callback: pullUpRefreshCallback
			},
			scroll: {
				bounceTime: 500, // 回弹动画时间
				// 下拉刷新和上拉加载成功动画的时间
				successAnimationTime: 500,
				// 是否嵌套，嵌套的话就不会preventDefault了
				eventPassthrough: 'horizontal'
			},
		});

		function pullDownRefreshCallback() {
			var self = this;
			// console.log("下拉刷新");
			setTimeout(function() {
				// 下拉刷新当前页变为0
				currpage = 0;
				// 测试每次添加10条
				ShowData(true, true);
				resetState(true);
			}, 1000);
		}

		function pullUpRefreshCallback() {
			var self = this;
//			 console.log(IsEndOfData());
			if(!IsEndOfData()){
				setTimeout(function() {
				//请求数据
				//当前页++
				currpage++;
				//测试每次添加20条
				GetCurrentPageData(false);
				resetState(false);
			}, 500);
			}
			else{
				pullToRefreshObj.endPullUpToRefresh(true);
			}

		}
		
		/**
		 * @description 重置状态
		 * @param {Boolean} isPullDown 是否是上拉加载
		 */
		function resetState(isPullDown) {
			if(isPullDown) {
				pullToRefreshObj.endPullDownToRefresh();
				if(pullToRefreshObj.finished) {
					pullToRefreshObj.refresh(true);
				}
			}
			// 判断当前页的数据是否已经大于totalCount
			var itemLength = document.querySelector(listContainer).children.length;
			if(itemLength >= totalCount) {
				pullToRefreshObj.endPullUpToRefresh(true);
			} else {
				pullToRefreshObj.endPullUpToRefresh(false);
			}
		}

		function refresh() {
			// 清空dom
			document.querySelector(listContainer).innerHTML = '';
			currpage = -1; //这个必须要变
			// 手动将状态设为可以加载更多
			if(pullToRefreshObj.finished) {
				pullToRefreshObj.refresh(true);
			}
			// 当然也可以换为其它的刷新方法
			pullToRefreshObj.pullupLoading();
		}
		return {
			refresh: refresh
		};
	}



	exports.init = function(pullToRefreshObj) {
		initPullRefreshList(pullToRefreshObj, {
			isAuto:false,
			container:'#pullrefresh1',
			listContainer:'#listdata1'
		});
		initPullRefreshList(pullToRefreshObj, {
			isAuto:false,
			container:'#pullrefresh2',
			listContainer:'#listdata2'
		});
		initPullRefreshList(pullToRefreshObj, {
			isAuto:false,
			container:'#pullrefresh3',
			listContainer:'#listdata3'
		});
		initPullRefreshList(pullToRefreshObj, {
			isAuto:false,
			container:'#pullrefresh4',
			listContainer:'#listdata4'
		});
	};
	
	window.demoPullToRefresh = exports;
})({});