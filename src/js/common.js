let  Common = {
	userinfo: {},
    stores: {},
    store_bills:[],
    round: function(value, precision) {
        value = (value)?value:0;
        var tmp = Math.pow(10, precision);
        return (Math.round(value * tmp) / tmp).toFixed(precision);
    },
    url_params:function(url) {
        if (typeof(url) == "undefined") {
            url = location.href;
        }
        var urlParams = {};
        var para = url;
        if (url.lastIndexOf("?") > -1) {
            para = url.substring(url.lastIndexOf("?") + 1, url.length);
        }
        var arr = para.split("&");
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].split("=").length < 2) {
                continue;
            }
            urlParams[arr[i].split("=")[0]] = arr[i].split("=")[1];
        }
        return urlParams;
    },
    insert_zero: function(num, fill){
        var len = ('' + num).length;
        return (Array(
          fill > len ? fill - len + 1 || 0 : 0
        ).join(0) + num);
    },
    now :function() {
        var date = new Date();
        return date.getFullYear() + "-" + Common.insert_zero(date.getMonth() + 1, 2) + "-" + Common.insert_zero(date.getDate(), 2);
    }
}


export default Common
