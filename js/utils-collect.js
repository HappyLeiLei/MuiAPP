(function($, app) {
    app.init = function(obj, obj_a, obj_id, obj_type) {
        var token = localStorage.getItem(LS_TOKEN);
        var is_collect = localStorage.getItem(LS_COLLECT);
        obj_type = obj_type || 1;
        if (_.isEmpty(token)) {
            obj_a.className = '';
            obj.off('tap', 'a');
            obj.on('tap', 'a', function(e) {
                mui.alert("您当前未登陆，请先登陆。");
                return false;
            })
        } else {
            if (LS_COLLECT_N == is_collect) {
                obj_a.className = '';
                obj_a.innerText = '收藏';
            } else {
                obj_a.className = 'active';
                obj_a.innerText = '已收藏';
            }
            obj.off('tap', 'a');
            obj.on('tap', 'a', function(e) {
                var wd = plus.nativeUI.showWaiting();
                var coll = localStorage.getItem(LS_COLLECT);
                mui.ajax(C_URL + C_M_FAV_ADD, {
                    data: {
                        token: token,
                        id: obj_id,
                        state: coll,
                        type: obj_type
                    },
                    contentType: "application/x-www-form-urlencoded; charset=utf-8",
                    dataType: 'json',
                    type: 'get',
                    timeout: C_TIMEOUT,
                    success: function(data_output_Favorited_no) {
                        codeLogin(data_output_Favorited_no);
                        wd.close();
                        if (data_output_Favorited_no.result == false) {
                            mui.alert('操作失败' + data_output_Favorited_no.message);
                            return false;
                        } else {
                            if (LS_COLLECT_N == coll) {
                                mui.alert("收藏成功！！");
                                obj_a.className = 'active';
                                obj_a.innerText = '已收藏';
                                localStorage.setItem(LS_COLLECT, LS_COLLECT_Y)
                            } else {
                                mui.alert("取消收藏成功！！");
                                obj_a.className = '';
                                obj_a.innerText = '收藏';
                                localStorage.setItem(LS_COLLECT, LS_COLLECT_N)
                            }
                        }
                    },
                    error: function(xhr, type, errorThrown) {
                        wd.close();
                        mui.toast(MSG_DATA_ERROR);
                    },
                    complete: function() {
                        wd.close();
                    }
                })
            })
        }
    }
}(mui, window.appcollect = {}));