const getGuid = () => {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

//前端防抖，指定时间内只执行一次函数，防止重复点击触发事件
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

export default {
    install: (app) => {
        app.config.globalProperties["$getGuid"] = getGuid;
        app.config.globalProperties["$debounce"] = debounce;
    }
}