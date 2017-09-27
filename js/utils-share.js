(function($, app) {
    var page = null;
    app.init = function(obj_share, obj) {
        page = mui.preload({
            url: 'index-main-share.html',
            id: 'index-main-share.html',
            styles: {
                bottom: '1px',
                left: "0%",
                width: "100%",
                height: "25%",
                popGesture: "none",
            },
        });
        obj_share.on('tap', '.activity', function(e) {
            var currwebview = plus.webview.currentWebview();
            currwebview.setStyle({
                mask: "rgba(0,0,0,0.5)"
            });
            mui.fire(page, 'showobj', {
                obj: obj,
            });
            page.show("slide-in-bottom", 200)
        });
        plus.webview.currentWebview().addEventListener("maskClick", function() {
            hideshade();
        }, false)
    }

    function hideshade() {
        page.hide();
        plus.webview.currentWebview().setStyle({
            mask: "none"
        })
    }
}(mui, window.appshare = {}));