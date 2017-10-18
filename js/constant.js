/******************************************************************************/
/*******************     通用        ******************************************/
/******************************************************************************/
const APP_NAME = '51有色';
const APP_ADDRESS = '';
const APP_URL = 'www.51youse.com';
/** APP版本号 */
const C_VERSION = '2.5.1';
/** APP内部版本号 */
const C_APP_VER = 2;
/** URL */
//const C_URL = 'http://123.150.252.54:1002/';//外网测试环境
//const C_IMG_URL = 'http://123.150.252.54:1002';
const C_URL = 'http://10.36.2.29/';
const C_IMG_URL = 'http://10.36.2.29';
/*const C_URL = 'http://www.51youse.com/';
const C_IMG_URL = 'http://www.51youse.com';*/
/** 图片路径 */
const C_URL_IMG = C_URL + "images/";

/** IOS商店地址 */
const C_SCORE_IOS_URL = 'itms-apps://itunes.apple.com/cn/app/51%E6%9C%89%E8%89%B2/id1247143447?mt=8';
/** Android APP地址 */
const C_SCORE_ANDROID_RUL = C_URL + 'appdownload/51YouSeApp-release.apk';
/** Market APP应用名 */
const C_SCORE_ANDROID_MARKET = '';
/** 安卓市场地址1 */
const C_SCORE_ANDROID_URL1 = '';
/** 安卓市场地址2 */
const C_SCORE_ANDROID_URL2 = '';

const MSG_OVERDUE = -99;
const MSG_NO_LANDING = -1;
const C_TIME_WAIT = 1000;
const C_TIMEOUT = 10000;
const C_LONG_TIMEOUT = 60000;
const C_TIME_SLIDER = 5000;
const C_COMMON_PAGESIZE = 10;
const C_DATA_NOIMAGE = 'images/notu.png';
const C_MOBILE = 'api/v1';
const C_WAP = 'wap';

const C_M_ORDERS = C_MOBILE + '/buyer/order_list';
const C_M_ORDER_DETAIL = C_MOBILE + '/buyer/order_detail';
const C_M_ORDER_DOPAYMENT = C_MOBILE + '/buyer/upload_payment_info';
const C_M_ORDER_DORECEIPT = C_MOBILE + '/buyer/received_goods';
const C_M_ORDER_UPLOAD_INVOICE = C_MOBILE + '/buyer/upload_invoice_img';
const C_M_GOODS_LIST = C_MOBILE + '/goods_show';
const C_M_GOODS_LIST_CURRENT = C_MOBILE + '/goods_select';
const C_M_GOODS_DETAIL = C_MOBILE + '/buyer/goods_detail';
const C_M_GOODS_SUBMIT_ORDER = C_MOBILE + '/buyer/create_order';
const C_M_USER_GROUP = C_MOBILE + '/account/user_id_group';
const C_M_GET_SWIPER = C_MOBILE + '/get_banner';//获取banner图地址
const C_M_GET_NEWWORDER = C_MOBILE + '/getneworder';//获取最新成交数据
/*手机app登陆页面*/
const C_M_LOGIN = C_MOBILE + "/login";
/*手机注册页面*/
/*验证公司名*/
const C_M_COMPANY = C_MOBILE + "/check_company_unique";
/*手机号注册验证*/
const C_M_MOBILE = C_MOBILE + "/check_phone_unique";
/*获取验证码*/
const C_M_YZM = C_MOBILE + "/send_sms_code";
/*app获取信息*/
const C_M_ALLMESSAGE = C_MOBILE + "/account/user_info";
const C_M_ZHUECE = C_MOBILE + "/register";
/*APP内部版本号*/
const C_M_APP_VERSION = C_MOBILE + "/get_app_version";
/*行情*/
const C_M_LAST_PRICE = C_MOBILE + "/get_market_list";
const C_M_PRICE_LIST = C_MOBILE + "/get_latest_waipan";
const C_M_MARKET_LIST = C_MOBILE + "/get_marketlist";
const C_M_WAIPAN = C_MOBILE + "/get_latest_waipan";
const C_M_QKLINK = C_MOBILE + "/get_market_klist"
/*手机打开主界面*/
/*顶导航对应id*/
const M_M_SMALL = "tabbar-with-sliderSegmentedControl";
const M_M_SHOP = "tabbar-with-buyshop";
const M_M_NEW = "tabbar-with-newpages";
const M_M_USER = "tabbar-with-personuser";
const LS_MY_ORDERS = 'OrderList';
const LS_TOKEN = 'token';
const LS_LAUNCH_FLAG = 'launchFlag';
const LS_USER_NAME = 'user_name';
const LS_MESSAGE = 'message';
const LS_MESSAGE_UNREAD = 'message_count';
const LS_MESSAGE_TIMESTAMP = 'message_timestamp';
const LS_USER_ID = 'user_id';
const LS_USERINFO = 'userinfo';
/**  页面名  **/

const LS_P_LOGIN = "app_login.html";
const LS_P_ZHUECE = "app_zhuce.html";
const LS_P_ADVERT = "advert.html"; //广告页面
const LS_P_HOME = "home.html"; //主页
const LS_P_MAIN = "index.html"; //51集市
const LS_P_MAIN_MARKET = "index.html"; //51集市
const LS_P_MAIN_MALL = "main-mall.html"; //51商城
const LS_P_MAIN_INFORMATION = "main_information.html"; //资讯
const LS_P_MAIN_PRICE = "main-price.html"; //行情
const LS_P_MAIN_MY = "main-my.html"; //我的
const LS_P_MY_SET = 'set.html'; //设置
const LS_P_MY_LOGOUT = 'logout.html';
const LS_P_MY_ORDER_LIST = 'my-order-list.html'; //订单页面
const LS_P_MY_ORDER_PAYMENT = 'my-order-payment.html'; //支付页面
const LS_P_MY_ORDER_RECEIPT = 'my-order-receipt.html'; //确认收货页
const LS_P_MY_ORDER_INVOICE = 'my-order-invoice.html';//上传发票
const LS_P_MY_ORDER_DETAIL = 'my-order-detail.html'; //订单详情页
const LS_P_SUBMIT_ORDER = 'submit-order.html';
const LS_P_SUBMIT_ORDER_SUCCESS = 'submit-order-success.html';
const LS_P_GUID = "guid.html";
const LS_P_TEST = "test.html";

//底导航用到图片
const C_IMG_MARKET = 'images/Group.png';
const C_IMG_MARKET_ACTIVE = 'images/Group20.png';
const C_IMG_MALL = 'images/Group14.png';
const C_IMG_MALL_ACTIVE = 'images/Group18.png';
const C_IMG_PRICE = 'images/Group9.png';
const C_IMG_PRICE_ACTIVE = 'images/Group19.png';
const C_IMG_MY = 'images/Group16.png';
const C_IMG_MY_ACTIVE = 'images/Group17.png';

const C_PAGE = -1;
const S_SHOP = 0;
const S_HOTEL = 1;
const S_HOTELL = 2;
const S_PARK = 3;
const T_AD = 0;
const I_AD = 1;
const UNSTART = 0;
const ALREADYSTART = 1;
const END = 2;


/*订单状态*/
const S_ORDER_ALL = "ALL"; //全部
const S_ORDER_ING = "ORDER_ING"; //进行中
const S_ORDER_FINISHED = "TRADE_FINISHED"; //交易完成
const S_ORDER_CANCEL = "TRADE_CANCELED"; //取消交易

/*提示信息*/
const LS_PHONE = '022-59060860';
const S_LOADING = '等待数据加载。。。';
const MSG_NET_LINK_ERROR = '网络链接错误，请稍后重试。';
const MSG_DATA_ERROR = '网络不给力，重试一下亲~~';
const MSG_NET_ERROR = '网络链接错误，无法加载数据。请开启网络后，刷新重试。';
const MSG_DATA_ERROR_HARD = '我会继续努力的!';
const MSG_COPY_SUCCESS = '已复制成功';
const MSG_DATA_NOMORE = '没有更多数据了';
const MSG_DATA_PULL_LOAD = '';//上拉显示更多
const MSG_SUBMIT_ORDER_ERROR = '订单提交失败,请稍后重试或联系管理员。';
const MSG_APP_DOWNLOAD_SUCCESS = '下载成功';
//const MSG_SUBMIT_ORDER_RETURN_ERROR = ['重量不能为空', '重量必须为数字', '重量最多五位小数', '采购重量不能小于起订量', '采购重量不能大于可供重量', '商品总计异常,请重新购买'];
