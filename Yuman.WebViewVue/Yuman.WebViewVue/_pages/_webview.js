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
            console.log('ǰ�˼�������Ϣ', arg.data);//���ڼ�ͨѶ
        } else {
            console.log('ǰ�˼�������Ϣ', arg.data);//���ڸ���ͨѶ
        }
    })

    //yuman.webview = window.chrome.webview.hostObjects;//��webview�Ľӿڹҵ�ָ�������ϣ�����ʹ���Լ�����ı������Ͳ���Ҫдȫ��
    //// �첽����
    //window.chrome.webview.hostObjects.openApi.GetTestData().then(res => {
    //    console.log("GetTestData async:", res);
    //});

    //// ͬ�����ã������ sync ��׺��
    //const testData = window.chrome.webview.hostObjects.sync.openApi.GetTestData();
    //console.log("GetTestData sync:", testData);

    //window.chrome.webview.hostObjects.openApi.GetTestData2('asd123 ǰ�˲���').then(res => {
    //    console.log("GetTestData2 async:", res);
    //});
    //window.chrome.webview.postMessage(JSON.stringify({ arg1: "����", arg2: "asd����" }));
    //window.chrome.webview.hostObjects.openApi.GetTestData3().then(res => {
    //    console.log("GetTestData3:", res);
    //});

    //����webview�Դ���hostObjects���䷽ʽ�����������ͣ���Ϊ�����������Դ����������л����ַ�������˵Ľӿڴ�������ͷ���ֵ���������ַ����źô���
    //window.chrome.webview.hostObjects.openApi.MyHelpGetSampleData(JSON.stringify({ Key:'123', Name: 'jjj' }))
    //    .then(res => { console.log('getMianTable�����ص�Ҳ��json�ַ����Լ�����', res); })
    //    .catch(error => { console.error("getMianTable������Ϣ��", error); })
    //    .finally(() => console.log("GetMianTable3�������"));


    //yuman.webview.sendMessage = function () {
    //    //ǰ�˷���Ϣ�����
    //    var obj = { arg1: "aaa", arg2: "bbb" }
    //    window.chrome.webview.postMessage(JSON.stringify(obj));
    //}

    //yuman.webview.sendMessage2 = function () {
    //    window.chrome.webview.postMessage("sendMessage2");
    //}

    ////�Զ��巽��
    //function displayMessageFromCSharp(message) {
    //    alert("Message from C#: " + message);
    //}
})();