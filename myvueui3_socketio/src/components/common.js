import { ElLoading } from 'element-plus';

const setBusy = (promiseFun) => {
    let loadingInstance = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
        fullscreen: true
    });
    if (promiseFun.then) {
        promiseFun.then(function () {
            loadingInstance.close()
        })
    } else if (promiseFun['finally']) {
        promiseFun['finally'](function () {
            loadingInstance.close()
        })
    }
}
const getLoading = () => {
    return ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
        fullscreen: true
    });
}

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

//是否数组是连续数字
function areNumbersConsecutive(arr) {
    // 对数组进行排序
    arr.sort((a, b) => a - b);

    // 检查数组中的元素是否连续
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] - arr[i - 1] !== 1) {
            return false;
        }
    }
    return true;
}

//判断数组是否有重复
function hasDuplicates(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr.indexOf(arr[i]) !== i) {
            return true;
        }
    }
    return false;
}

//判断一个方法执行了多少次
function createCounter() {
    let totalCalls = 0;
    let callsPerSecond = 0;
    let lastTimestamp = Date.now();

    return {
        wrap: function (fn) {
            return (...args) => {
                totalCalls++;
                callsPerSecond++;

                // 检查时间窗口
                const now = Date.now();
                if (now - lastTimestamp >= 1000) {
                    console.log(`当前频率：${callsPerSecond}/秒`);
                    callsPerSecond = 0;
                    lastTimestamp = now;
                }

                return fn(...args);
            };
        },
        getTotal: () => totalCalls,
        getCPS: () => callsPerSecond
    }
}

export default {
    install: (app) => {
        app.config.globalProperties["$setBusy"] = setBusy;
        app.config.globalProperties["$getLoading"] = getLoading;
        app.config.globalProperties["$getGuid"] = getGuid;
        app.config.globalProperties["$debounce"] = debounce;
        app.config.globalProperties["$areNumbersConsecutive"] = areNumbersConsecutive;
        app.config.globalProperties["$hasDuplicates"] = hasDuplicates;
        app.config.globalProperties["$createCounter"] = createCounter;
    }
}