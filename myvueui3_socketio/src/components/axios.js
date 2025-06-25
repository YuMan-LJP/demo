import axios from 'axios'
import i18n from './i18n/index'
import Swal from 'sweetalert2'
import { ElLoading } from 'element-plus';

const $swalError = (title, message) => {
    Swal.fire({
        title: title,
        text: message,
        icon: "error"
    });
}

var instance = axios.create({ timeout: 1000 * 12 });
// 配置 axios 默认的根路径
instance.defaults.baseURL = '/api';//'http://192.168.1.234:5005';//node服务器
// 可以在此处配置请求头、超时等
// instance.defaults.headers.common['Authorization'] = 'Bearer token';
// instance.defaults.timeout = 10000;
//统一设置post请求头，默认是json格式，如果是表单格式则自己请求时设置
instance.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';//application/x-www-form-urlencoded

// 添加请求拦截器
instance.interceptors.request.use(
    config => {
        // 在请求发送之前做一些事情，比如添加 token
        const token = localStorage.getItem('token');//localStorage.setItem('token', 'XXXXXX');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        // 处理请求错误
        return Promise.reject(error);
    });

// 添加响应拦截器
instance.interceptors.response.use(
    response => {
        // 对响应数据做处理
        return response;
    },
    error => {
        // 处理响应错误
        if (error.response) {
            // 根据响应状态码进行错误处理
            switch (error.response.status) {
                case 401:
                    $swalError(i18n.global.t("app.systemTips"), i18n.global.t("app.systemTips.responseStatus401"));
                    // 可以在此处跳转到登录页或其他处理逻辑
                    break;
                case 404:
                    $swalError(i18n.global.t("app.systemTips"), i18n.global.t("app.systemTips.resourceNotFound"));
                    break;
                case 500:
                    //针对后端的自定义异常，显示特定的错误消息
                    if (error.response.data && error.response.data.isError) {
                        if (error.response.data.details) {
                            $swalError(error.response.data.message, error.response.data.details);
                        } else {
                            $swalError(i18n.global.t("app.systemTips"), error.response.data.message);
                        }
                    } else {
                        $swalError(i18n.global.t("app.systemTips"), i18n.global.t("app.systemTips.unexpectedError"));
                    }
                    break;
                default:
                    $swalError(i18n.global.t("app.systemTips"), i18n.global.t("app.systemTips.unexpectedError"));
            }
        } else {
            $swalError(i18n.global.t("app.systemTips"), i18n.global.t("app.systemTips.networkError"));
        }
        return Promise.reject(error.response ? (error.response.data ? error.response.data : error.response) : error);
    });

const $get = (url) => {
    return instance.get(url);
}
const $get2 = (url, callback) => {
    return instance.get(url).then((response) => {
        if (response.data.isSuccess) {
            callback(response.data.data);
        } else {
            $swalError(i18n.global.t("app.systemTips"), response.data.error);
        }
    }).catch((err) => {
        $swalError(i18n.global.t("app.systemTips"), err);
    })
}
const $post = (url, data) => {
    return instance.post(url, data);//默认是json格式
}
const $post2 = (url, data, callback) => {//默认是json格式
    return instance.post(url, data).then((response) => {
        if (response.data.isSuccess) {
            callback(response.data.data);
        } else {
            $swalError(i18n.global.t("app.systemTips"), response.data.error);
        }
    }).catch((err) => {
        $swalError(i18n.global.t("app.systemTips"), err);
    })
}
const $postForm = (url, data) => {
    return instance.post(url, data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
const $postForm2 = (url, data) => {
    return instance.post(url, data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then((response) => {
        if (response.data.isSuccess) {
            callback(response.data.data);
        } else {
            $swalError(i18n.global.t("app.systemTips"), response.data.error);
        }
    }).catch((err) => {
        $swalError(i18n.global.t("app.systemTips"), err);
    });
}

//由于接口返回的结构都是一样的，这里统一做错误提示处理，然后再加上loading，直接封装成通用请求方法
const getEx = (url, callback) => {
    let loadingInstance = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
        fullscreen: true
    });
    instance.get(url).then((response) => {
        if (response.data.isSuccess) {
            callback(response.data.data);
        } else {
            $swalError(i18n.global.t("app.systemTips"), response.data.error);
        }
    }).catch((err) => {
        $swalError(i18n.global.t("app.systemTips"), err);
    }).finally(() => {
        loadingInstance.close();
    })
}

//由于接口返回的结构都是一样的，这里统一做错误提示处理，然后再加上loading，直接封装成通用请求方法
const postEx = (url, data, callback) => {//默认是json格式
    let loadingInstance = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
        fullscreen: true
    });
    instance.post(url, data).then((response) => {
        if (response.data.isSuccess) {
            callback(response.data.data);
        } else {
            $swalError(i18n.global.t("app.systemTips"), response.data.error);
        }
    }).catch((err) => {
        $swalError(i18n.global.t("app.systemTips"), err);
    }).finally(() => {
        loadingInstance.close();
    })
}

export default {
    install: (app) => {
        app.config.globalProperties["$get"] = $get;
        app.config.globalProperties["$post"] = $post;
        app.config.globalProperties["$postForm"] = $postForm;
        app.config.globalProperties["$get2"] = $get2;//包含统一的异常处理
        app.config.globalProperties["$post2"] = $post2;//包含统一的异常处理
        app.config.globalProperties["$postForm2"] = $postForm2;//包含统一的异常处理
        app.config.globalProperties["$getEx"] = getEx;//包含Laoding和统一的异常处理
        app.config.globalProperties["$postEx"] = postEx;//包含Laoding和统一的异常处理
    }
};