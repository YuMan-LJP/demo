//获取一个GUID
function getGuid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function getObjectURL(file) {
    if(typeof(file) === "string"){
        if(file && file.indexOf('data:image') !== -1){
            return file;
        }else if(file && file.indexOf('blob') !== -1){
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

export default {
    getGuid,
    getObjectURL,
}