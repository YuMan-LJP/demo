var yuman = yuman || {};
(function ($) {
    if (!sweetAlert || !$) {
        return;
    }

    /* DEFAULTS *************************************************/

    yuman.libs = yuman.libs || {};
    yuman.libs.sweetAlert = {
        config: {
            'default': {

            },
            info: {
                icon: 'info'
            },
            success: {
                icon: 'success'
            },
            warn: {
                icon: 'warning'
            },
            error: {
                icon: 'error'
            },
            confirm: {
                icon: 'warning',
                title: 'Are you sure?',
                buttons: ['Cancel', 'Yes']
            }
        }
    };

    /* MESSAGE **************************************************/
    /**
     * 
     * @param {any} type 类型
     * @param {any} message 显示内容信息
     * @param {any} title 显示标题
     * @param {any} messageAlign 内容信息文本位置：左中右（默认左对齐）
     * @param {any} titleAlign 标题文本位置：左中右（默认居中）
     */
    var showMessage = function (type, message, title, messageAlign, titleAlign) {
        //if (!title) {//title为空时不处理，不改变message原本内容
        //    title = message;
        //    message = undefined;
        //}
        var div = document.createElement("div");//div标签换行符用HTML的<br/>
        div.classList.add("contentCustomsCss");
        div.classList.add(type + "CustomsCss");

        message = message.replace(/\r\n/g, "<br>");//替换所有的换行符
        message = message.replace(/\n/g, "<br>");

        message = message.replace(/\\r\\n/g, "<br>");//替换所有的换行符字符串
        message = message.replace(/\\n/g, "<br>");

        div.innerHTML = message;
        div.style.overflowWrap = "break-word";//文字不超界
        div.style.fontSize = "16px";//字体大小
        div.style.maxHeight = "calc(100vh - 350px)";//固定最大高度
        div.style.overflowX = "auto";//内容超过最大宽度时出现右滚动条
        div.style.overflowY = "auto";//内容超过最大宽度时出现右滚动条
        if (messageAlign == "" || messageAlign == null) messageAlign = "left";//默认左对齐
        div.style.textAlign = messageAlign;//文字对齐
        div.style.position = "relative";

        //判断标题样式：左中右(原本样式居中)
        var customs_css = null;
        if (titleAlign != null || titleAlign != "") {
            if (titleAlign == "left") {
                customs_css = 'sweetAlertCustomsCss_title_left';
            }
            else if (titleAlign == "right") {
                customs_css = 'sweetAlertCustomsCss_title_right';
            } else {
                customs_css = 'sweetAlertCustomsCss';
            }
        } else {
            customs_css = 'sweetAlertCustomsCss';
        }

        var opts = $.extend(
            {},
            yuman.libs.sweetAlert.config['default'],
            yuman.libs.sweetAlert.config[type],
            {
                title: title,
                content: {
                    element: div
                },
                className: customs_css
            }
        );

        return $.Deferred(function ($dfd) {
            sweetAlert(opts).then(function () {
                $dfd.resolve();
            });
        });
    };

    yuman.message = yuman.message || {};
    yuman.message.info = function (message, title, messageAlign, titleAlign) {
        return showMessage('info', message, title, messageAlign, titleAlign);
    };

    yuman.message.infoCallback = function (message, title, callback, messageAlign, titleAlign) {
        var opts = $.extend(
            {},
            yuman.libs.sweetAlert.config['default'],
            yuman.libs.sweetAlert.config['info'],
            {
                title: title,
                text: message
            }
        );
        return $.Deferred(function ($dfd) {
            sweetAlert(opts).then(function () {
                callback && callback();
                $dfd.resolve();
            });
        });
    };

    yuman.message.success = function (message, title, messageAlign, titleAlign) {
        return showMessage('success', message, title, messageAlign, titleAlign);
    };

    yuman.message.warn = function (message, title, messageAlign, titleAlign) {
        return showMessage('warn', message, title, messageAlign, titleAlign);
    };

    yuman.message.error = function (message, title, messageAlign, titleAlign) {
        return showMessage('error', message, title, messageAlign, titleAlign);
    };

    yuman.message.confirm = function (message, titleOrCallback, callback, confirmText, messageAlign, titleAlign, cancelText,btnOpts) {
        var div = document.createElement("div");//div标签换行符用HTML的<br/>

        message = message.replace(/\r\n/g, "<br>");//替换所有的换行符
        message = message.replace(/\n/g, "<br>");

        message = message.replace(/\\r\\n/g, "<br>");//替换所有的换行符字符串
        message = message.replace(/\\n/g, "<br>");

        div.innerHTML = message;
        div.style.overflowWrap = "break-word";//文字不超界
        div.style.fontSize = "16px";//字体大小，可调整
        div.style.maxHeight = "calc(100vh - 350px)";//固定最大高度
        div.style.overflowX = "auto";//内容超过最大宽度时出现右滚动条
        div.style.overflowY = "auto";//内容超过最大宽度时出现右滚动条
        if (messageAlign == "" || messageAlign == null) messageAlign = "left";//默认左对齐
        div.style.textAlign = messageAlign;//文字对齐
        div.style.position = "relative";

        //判断标题样式：左中右(原本样式居中)
        var customs_css = null;
        if (titleAlign != null || titleAlign != "") {
            if (titleAlign == "left") {
                customs_css = 'sweetAlertCustomsCss_title_left';
            }
            else if (titleAlign == "right") {
                customs_css = 'sweetAlertCustomsCss_title_right';
            } else {
                customs_css = 'sweetAlertCustomsCss';
            }
        } else {
            customs_css = 'sweetAlertCustomsCss';
        }

        var userOpts = {
            content: {
                element: div
            },
            className: customs_css,
            buttons: {
                confirm: confirmText != null ? confirmText : "OK",
                cancel: cancelText ? cancelText : true
            }
        };
        if(btnOpts){
            userOpts.buttons = btnOpts
        }
        if ($.isFunction(titleOrCallback)) {
            callback = titleOrCallback;
        } else if (titleOrCallback) {
            userOpts.title = titleOrCallback;
        };

        var opts = $.extend(
            {},
            yuman.libs.sweetAlert.config['default'],
            yuman.libs.sweetAlert.config.confirm,
            userOpts
        );

        return $.Deferred(function ($dfd) {
            sweetAlert(opts).then(function (isConfirmed) {
                callback && callback(isConfirmed);
                $dfd.resolve(isConfirmed);
            });
        });
    };
    
    var showMessage2 = function (type, message, content,title) {

        var div = document.createElement("div");

        message = message.replace(/\r\n/g, "<br>");
        message = message.replace(/\n/g, "<br>");

        message = message.replace(/\\r\\n/g, "<br>");//替换所有的换行符字符串
        message = message.replace(/\\n/g, "<br>");

        l
        if(type == "warn"){
            txt = "<div style='color:orange;font-size:16px;'>" + message +"</div>"
        }
        else if(type == "error"){
            txt = "<div style='color:red;font-size:16px;'>" + message +"</div>"
        }
        else{
            txt = "<div style='font-size:16px;'>" + message +"</div>"
        }

        if(content)
            div.innerHTML = txt + "<br><div>" + content +"</div>";
        else
            div.innerHTML = txt
        
        var opts = $.extend(
            {},
            yuman.libs.sweetAlert.config['default'],
            yuman.libs.sweetAlert.config[type],
            {
                title: title,
                content: {
                    element: div
                },
            }
        );

        return $.Deferred(function ($dfd) {
            sweetAlert(opts).then(function () {
                $dfd.resolve();
            });
        });
    };
    yuman.message.success2 = function (message,content, title) {
        return showMessage2('success', message, content, title);
    };
    yuman.message.warn2 = function (message, content,title) {
        return showMessage2('warn', message, content, title);
    };
    yuman.message.error2 = function (message, content,title) {
        return showMessage2('error', message, content, title);
    };
    yuman.message.info2 = function (message, content,title) {
        return showMessage2('info', message, content, title);
    };

    //多按钮的选择框
    //buttons参数样例：[{ text: '按钮文本1', value: '回调的值1', className: '' },{ text: '按钮文本2', value: '回调的值2', className: '' } ...]
    yuman.message.select = function (message, title, buttons, callback) {
        var options = {
            text: message,
            icon: 'info',
            title: title,
            buttons: {
                //btn1: {
                //    text: "Cancel",
                //    value: false,
                //    visible: true,
                //    className: "",
                //    closeModal: true,
                //},
                //btn2: {
                //    text: "Yes",
                //    value: true,
                //    visible: true,
                //    className: "",
                //    closeModal: true
                //},
            }
        };
        for (var i = 0; i < buttons.length; i++) {
            var btn = {
                text: buttons[i].text,
                value: buttons[i].value,
                visible: true,
                className: buttons[i].className ? buttons[i].className : "",
                closeModal: true,
            }
            options.buttons["btn" + i] = btn;
        }

        return $.Deferred(function ($dfd) {
            sweetAlert(options).then(function (value) {
                callback && callback(value);
                $dfd.resolve(value);
            });
        });
    };

    //yuman.event.on('yuman.dynamicScriptsInitialized', function () {
    //    yuman.libs.sweetAlert.config.confirm.title = yuman.localization.yumanWeb('AreYouSure');
    //    yuman.libs.sweetAlert.config.confirm.buttons = [yuman.localization.yumanWeb('Cancel'), yuman.localization.yumanWeb('Yes')];
    //});

})(jQuery);