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
            console.log('前端监听到消息', arg.data);//用于简单通讯
        } else {
            console.log('前端监听到消息', arg.data);//用于复杂通讯
        }
    })

    //yuman.webview = window.chrome.webview.hostObjects;//把webview的接口挂到指定变量上，后续使用自己定义的变量，就不需要写全名
    //// 异步调用
    //window.chrome.webview.hostObjects.openApi.GetTestData().then(res => {
    //    console.log("GetTestData async:", res);
    //});

    //// 同步调用（需添加 sync 后缀）
    //const testData = window.chrome.webview.hostObjects.sync.openApi.GetTestData();
    //console.log("GetTestData sync:", testData);

    //window.chrome.webview.hostObjects.openApi.GetTestData2('asd123 前端参数').then(res => {
    //    console.log("GetTestData2 async:", res);
    //});
    //window.chrome.webview.postMessage(JSON.stringify({ arg1: "测试", arg2: "asd参数" }));
    //window.chrome.webview.hostObjects.openApi.GetTestData3().then(res => {
    //    console.log("GetTestData3:", res);
    //});

    //放弃webview自带的hostObjects传输方式来传复杂类型，因为复杂类型难以处理，必须序列化成字符串，后端的接口传入参数和返回值都必须是字符串才好处理
    //window.chrome.webview.hostObjects.openApi.MyHelpGetSampleData(JSON.stringify({ Key:'123', Name: 'jjj' }))
    //    .then(res => { console.log('getMianTable，返回的也是json字符串自己解析', res); })
    //    .catch(error => { console.error("getMianTable错误信息：", error); })
    //    .finally(() => console.log("GetMianTable3调用完成"));


    //yuman.webview.sendMessage = function () {
    //    //前端发消息给后端
    //    var obj = { arg1: "aaa", arg2: "bbb" }
    //    window.chrome.webview.postMessage(JSON.stringify(obj));
    //}

    //yuman.webview.sendMessage2 = function () {
    //    window.chrome.webview.postMessage("sendMessage2");
    //}

    ////自定义方法
    //function displayMessageFromCSharp(message) {
    //    alert("Message from C#: " + message);
    //}
})();