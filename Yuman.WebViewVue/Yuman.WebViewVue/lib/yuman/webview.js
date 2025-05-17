var yuman = yuman || {};
(function () {
    if (!window.chrome) {
        return;
    }
    if (!window.chrome.webview) {
        return;
    }

    //��˷���Ϣ��ǰ��
    window.chrome.webview.addEventListener('message', arg => {
        console.log(arg);
        if (Object.prototype.toString.call(arg.data) === '[object String]') {
            console.log(arg.data);//���ڼ�ͨѶ
            document.getElementById("showText").insertAdjacentHTML('beforeend', '<p>' + arg.data + '</p>');
        } else {
            console.log(arg.data);//���ڸ���ͨѶ
            document.getElementById("showText").insertAdjacentHTML('beforeend', '<p>' + JSON.stringify(arg.data) + '</p>');
        }
    })

    yuman.webview = yuman.webview || {};

    yuman.webview.sendMessage = function () {
        //ǰ�˷���Ϣ�����
        var obj = { arg1: "aaa", arg2: "bbb" }
        window.chrome.webview.postMessage(JSON.stringify(obj));
    }

    yuman.webview.sendMessage2 = function () {
        window.chrome.webview.postMessage("sendMessage2");
    }

    //�Զ��巽��
    //function displayMessageFromCSharp(message) {
    //    alert("Message from C#: " + message);
    //}
})();