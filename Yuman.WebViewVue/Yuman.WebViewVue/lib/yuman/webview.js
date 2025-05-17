var yuman = yuman || {};
(function () {
    if (!window.chrome) {
        return;
    }
    if (!window.chrome.webview) {
        return;
    }

    //后端发消息给前端
    window.chrome.webview.addEventListener('message', arg => {
        console.log(arg);
        if (Object.prototype.toString.call(arg.data) === '[object String]') {
            console.log(arg.data);//用于简单通讯
            document.getElementById("showText").insertAdjacentHTML('beforeend', '<p>' + arg.data + '</p>');
        } else {
            console.log(arg.data);//用于复杂通讯
            document.getElementById("showText").insertAdjacentHTML('beforeend', '<p>' + JSON.stringify(arg.data) + '</p>');
        }
    })

    yuman.webview = yuman.webview || {};

    yuman.webview.sendMessage = function () {
        //前端发消息给后端
        var obj = { arg1: "aaa", arg2: "bbb" }
        window.chrome.webview.postMessage(JSON.stringify(obj));
    }

    yuman.webview.sendMessage2 = function () {
        window.chrome.webview.postMessage("sendMessage2");
    }

    //自定义方法
    //function displayMessageFromCSharp(message) {
    //    alert("Message from C#: " + message);
    //}
})();