//获取一个GUID
function getGuid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function getObjectURL(file) {
    if (typeof (file) === "string") {
        if (file && file.indexOf('data:image') !== -1) {
            return file;
        } else if (file && file.indexOf('blob') !== -1) {
            return file;
        }
        return 'data:image/jpeg;base64,' + file;
    }

    var url = null;
    // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}

function fileToBase64String(file){
    let base64String; 
    let reader = new FileReader();
    reader.onload = function(e) {
        base64String = e.target.result;
    };
    reader.readAsDataURL(file);
    return base64String;
}

function event() {
    var _callbacks = {};

    var on = function (eventName, callback) {
        if (!_callbacks[eventName]) {
            _callbacks[eventName] = [];
        }

        _callbacks[eventName].push(callback);
    };

    var off = function (eventName, callback) {
        var callbacks = _callbacks[eventName];
        if (!callbacks) {
            return;
        }

        var index = -1;
        for (var i = 0; i < callbacks.length; i++) {
            if (callbacks[i] === callback) {
                index = i;
                break;
            }
        }

        if (index < 0) {
            return;
        }

        _callbacks[eventName].splice(index, 1);
    };

    var trigger = function (eventName) {
        var callbacks = _callbacks[eventName];
        if (!callbacks || !callbacks.length) {
            return;
        }

        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0; i < callbacks.length; i++) {
            callbacks[i].apply(this, args);
        }
    };

    return {
        on: on,
        off: off,
        trigger: trigger
    };
}

export default {
    getGuid,
    getObjectURL,
    event: event(),
}