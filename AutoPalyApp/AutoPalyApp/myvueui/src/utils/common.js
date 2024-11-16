//获取一个GUID
function getGuid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function getObjectURL(file) {
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

function base64ToFile(base64, fileName) {
    let arr = base64.split(",");
    let mime = arr[0].match(/:(.\*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
}
function base64ToBlob(base64) {
    var arr = base64.split(","),
        mime = arr[0].match(/:(.\*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
        type: mime,
    });
}
function blobToFile(blob, fileName) {
    return new File([blob], fileName);
}
function fileToBlob(file) {
    return new Blob([file], { type: file.type });
}
function fileToBase64(file) {
    //调用样例：this.$common.fileToBase64(file).then((base64) => { //TODO...  })
    return new Promise((resolve, reject) => {
        // 创建一个新的 FileReader 对象
        const reader = new FileReader();
        // 读取 File 对象
        reader.readAsDataURL(file);
        // 加载完成后
        reader.onload = function () {
            const type = reader.result.split(",")[0];
            // 将读取的数据转换为 base64 编码的字符串
            const base64String = reader.result.split(",")[1];
            // 解析为 Promise 对象，并返回 base64 编码的字符串
            resolve(type + "," + base64String);
        };

        // 加载失败时
        reader.onerror = function () {
            reject(new Error("Failed to load file"));
        };
    });
}
function blobToBase64(blob) {
    //调用样例：this.$common.blobToBase64(file).then((base64) => { //TODO...  })
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const type = reader.result.split(",")[0];
            const base64String = reader.result.split(",")[1];
            resolve(type + "," + base64String);
        }
        reader.onerror = reject;
    });
}
function base64toBlobByType(base64, type) {
    // 将base64转为Unicode规则编码
    var bstr = atob(base64, type);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n); // 转换编码后才可以使用charCodeAt 找到Unicode编码
    }
    return new Blob([u8arr], type);
}
function exportFileByBlob(file, fileName, fileType) {
    var blob = base64toBlobByType(file, { type: fileType });
    if (window.navigator.msSaveOrOpenBlob) {// 兼容IE10+
        navigator.msSaveBlob(blob, fileName);
    } else {
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
}

//https://blog.csdn.net/qq_35493664/article/details/88896638
//json数据导出Excel
//JSONData：json数据
//FileName：文件名（包括后缀）
//title：表头
//filter：过滤字段
//rowlength：一行长度
//customColumnTypes：自定义列类型
function JSONToExcelConvertor(JSONData, FileName, title, filter, rowlength, customColumnTypes) {
    if (!JSONData) { return }
    // 转化json为object
    var arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData

    var excel = '<table id="expoetTable">'

    // 设置表头
    var row = '<tr>'
    if (title) {
        // 使用标题项
        for (var i in title) {
            row += "<th align='center'>" + title[i] + '</th>' // 将标题新增到row中
        }
    } else {
        // 不使用标题项
        for (var i in arrData[0]) {
            row += "<th align='center'>" + i + '</th>'
        }
    }

    excel += row + '</tr>'
    // 设置数据
    for (var i = 0; i < arrData.length; i++) {
        if (i === arrData.length - 1) {
            var row = '<tr>'
        } else {
            var row = ''
        }
        for (var index in arrData[i]) {
            // 判断是否有过滤行
            if (filter) {
                var value = ''
                if (filter.indexOf(index) === -1) { // 过滤掉符合关键字的数据
                    for (var k = 0; k < (arrData.length / rowlength); k++) { // 循环到一个标题长度换一次行,否则数组会在一行
                        if (i === rowlength - 1) {
                            for (var j = k * rowlength; j < ((k + 1) * rowlength); j++) {
                                if (arrData[j].type === 'radio-group' || arrData[j].type === 'checkbox-group' || arrData[j].type === 'select') { // 如果为这三种格式,则他们的值储存在values中
                                    var groupLenght = arrData[j].values.length
                                    for (var q = 0; q < groupLenght; q++) {
                                        if (arrData[j].values[q].selected === true) { // 获取被选中的值
                                            value = value + arrData[j].values[q].label
                                        }
                                    }
                                } else {
                                    value = arrData[j].value == null ? '' : arrData[j].value
                                }
                                row += '<td>' + value + '</td>'
                                value = ''
                            }
                        }
                    }
                }
            } else {
                // 不过滤的逻辑
                var value = arrData[i][index] == null ? '' : arrData[i][index]
                // eslint-disable-next-line quotes
                row += "<td align='center'>" + value + '</td>'
            }
        }
        excel += row + '</tr>'
        row = ''
    }

    excel += '</table>'
    var objE = document.createElement('div') // 因为我们这里的数据是string格式的,但是js-xlsx需要dom格式,则先新建一个div然后把数据加入到innerHTML中,在传childNodes[0]即使dom格式的数据
    objE.innerHTML = excel
    var sheet = XLSX.utils.table_to_sheet(objE.childNodes[0], { raw: true })// 将一个table对象转换成一个sheet对象,raw为true的作用是把数字当成string,身份证不转换成科学计数法

    if (customColumnTypes) {
        for (var key in sheet) {
            var keyName = (key + "").replace(/[0-9]/ig, "");
            var index = customColumnTypes.findIndex(f => f.name === sheet[key].v);
            if (index !== -1) {
                customColumnTypes[index].name = keyName;//找出和列名相同的在第几列，sheet里面用A,B,C,D,E...来标记列的
            }
        }

        for (var key in sheet) {
            var keyName = (key + "").replace(/[0-9]/ig, "");
            var keyIndex = (key + "").replace(keyName, "");
            if (keyIndex === "1") {
                continue;//表头排除
            }
            var index = customColumnTypes.findIndex(f => f.name === keyName);
            if (index !== -1) {
                //自定义列类型https://github.com/SheetJS/js-xlsx#cell-object
                //s表示string类型，n表示number类型，b表示boolean类型，d表示date类型
                sheet[key].t = customColumnTypes[index].type;//内容替换成指定类型
            }
        }
    }

    openDownloadDialog(sheet2blob(sheet, FileName), FileName)
}

//json数据导出ExcelV2
//JSONData：json数据
//FileName：文件名（包括后缀）
//JSONtitle：表头字典（key,value）（只会按表头字典的顺序导出，若json数据有多余列但表头字典没给出，一律过滤调不导出该列，一切按表头字典为准）
//customColumnTypes：自定义列类型
function JSONToExcelConvertor2(JSONData, FileName, JSONtitle, customColumnTypes) {
    if (!JSONData) { return }
    if (!JSONtitle) { return }
    // 转化json为object
    var inputData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData

    //按表头字典重新整理排序，过滤多余列
    var arrData = [];
    for (var i = 0; i < inputData.length; i++) {
        var newRow = {};
        for (let key in JSONtitle) {
            if (inputData[i][key] !== undefined) {
                newRow[key] = inputData[i][key];
            } else {
                newRow[key] = "";
            }
        }
        arrData.push(newRow);
    }

    var excel = '<table id="expoetTable">'

    // 设置表头
    var row = '<tr>'
    // 使用标题项
    for (let key in JSONtitle) {
        row += "<th align='center'>" + JSONtitle[key] + '</th>' // 将标题新增到row中
    }

    excel += row + '</tr>'
    // 设置数据
    for (var i = 0; i < arrData.length; i++) {
        if (i === arrData.length - 1) {
            var row = '<tr>'
        } else {
            var row = ''
        }
        for (var index in arrData[i]) {
            var value = arrData[i][index] == null ? '' : arrData[i][index]
            row += "<td align='center'>" + value + '</td>'
        }
        excel += row + '</tr>'
        row = ''
    }

    excel += '</table>'
    var objE = document.createElement('div') // 因为我们这里的数据是string格式的,但是js-xlsx需要dom格式,则先新建一个div然后把数据加入到innerHTML中,在传childNodes[0]即使dom格式的数据
    objE.innerHTML = excel
    var sheet = XLSX.utils.table_to_sheet(objE.childNodes[0], { raw: true })// 将一个table对象转换成一个sheet对象,raw为true的作用是把数字当成string,身份证不转换成科学计数法

    if (customColumnTypes) {
        for (var key in sheet) {
            var keyName = (key + "").replace(/[0-9]/ig, "");
            var index = customColumnTypes.findIndex(f => f.name === sheet[key].v);
            if (index !== -1) {
                customColumnTypes[index].name = keyName;//找出和列名相同的在第几列，sheet里面用A,B,C,D,E...来标记列的
            }
        }

        for (var key in sheet) {
            var keyName = (key + "").replace(/[0-9]/ig, "");
            var keyIndex = (key + "").replace(keyName, "");
            if (keyIndex === "1") {
                continue;//表头排除
            }
            var index = customColumnTypes.findIndex(f => f.name === keyName);
            if (index !== -1) {
                //自定义列类型https://github.com/SheetJS/js-xlsx#cell-object
                //s表示string类型，n表示number类型，b表示boolean类型，d表示date类型
                sheet[key].t = customColumnTypes[index].type;//内容替换成指定类型
            }
        }
    }

    openDownloadDialog(sheet2blob(sheet, FileName), FileName)
}

// 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
function sheet2blob(sheet, sheetName) {
    sheetName = 'sheet1'; //sheetName || 'sheet1' // 不存在sheetName时使用sheet1代替, 调整sheet名称默认为sheet1
    var workbook = {
        SheetNames: [sheetName],
        Sheets: {}
    }
    workbook.Sheets[sheetName] = sheet // 生成excel的配置项

    var wopts = {
        bookType: 'xlsx', // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary' // 二进制格式
    }
    var wbout = XLSX.write(workbook, wopts)
    var blob = new Blob([s2ab(wbout)], {
        type: 'application/octet-stream'
    }) // 字符串转ArrayBuffer
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length)
        var view = new Uint8Array(buf)
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
        return buf
    }
    return blob
}

//下载的方法，可以参考以下资料
//https://blog.csdn.net/weixin_47721508/article/details/114656193
//https://learn.microsoft.com/zh-cn/aspnet/core/blazor/file-downloads?view=aspnetcore-7.0#download-from-a-stream
//https://learn.microsoft.com/zh-cn/aspnet/core/blazor/file-downloads?view=aspnetcore-7.0#download-from-a-url
function openDownloadDialog(url, saveName) {
    if (typeof url === 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url) // 创建blob地址
    }
    var aLink = document.createElement('a')
    aLink.href = url
    aLink.download = saveName || '' // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    var event
    if (window.MouseEvent) event = new MouseEvent('click')
    else {
        event = document.createEvent('MouseEvents')
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    }
    aLink.dispatchEvent(event)
    aLink.remove();
}

//下载Wbp请求参数txt文件，公共的提供全部品牌排版稿wbp参数字段转txt文件
function downloadWbpRequestArgsTxt(args, fileName) {
    var jsonModel = {};
    try {
        jsonModel = JSON.parse(args);
    } catch (error) {
        console.log(error);
        abp.message.warn(L("WbpRequestArgs.JsonFormatError"), L("SystemTips"));
        return;
    }

    if (Object.prototype.toString.call(jsonModel) === '[object Array]') {
        //如果反序列化之后是一个数组，默认取第一条
        if (jsonModel.length > 0) {
            jsonModel = jsonModel[0];
        }
    }

    var txtHead = "", txtBody = "";
    for (var head in jsonModel) {
        txtHead += head + ",";
        txtBody += jsonModel[head] + ",";
    }
    if (txtHead) { txtHead = txtHead.substring(0, txtHead.length - 1); }//去掉最后的逗号
    if (txtBody) { txtBody = txtBody.substring(0, txtBody.length - 1); }//去掉最后的逗号
    if (!txtHead && !txtBody) {
        abp.message.warn(L("WbpRequestArgs.NoValidData"), L("SystemTips"));
        return;
    }
    var txtString = txtHead + "\r\n" + txtBody;

    let blob = new Blob([txtString], { type: "text/plain;charset-utf-8" });
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = function (e) {
        let a = document.createElement('a');
        if (fileName) { a.download = fileName.indexOf('.txt') !== -1 ? fileName : fileName + ".txt"; }
        else { a.download = L("WbpRequestArgs") + ".txt"; }
        a.href = e.target.result;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
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
    base64ToFile,
    base64ToBlob,
    blobToFile,
    fileToBlob,
    fileToBase64,
    blobToBase64,
    exportFileByBlob,
    event: event(),
}