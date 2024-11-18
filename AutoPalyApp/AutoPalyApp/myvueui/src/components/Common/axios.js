import axios from 'axios'
import VueSwal from 'vue-swal';
import Vue from 'vue'
import i18n from './i18n'

var instance = axios.create({ timeout: 1000 * 12 });
// 配置 axios 默认的根路径
instance.defaults.baseURL = 'http://localhost:5000';
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
        Vue.use(VueSwal);
        // 处理响应错误
        if (error.response) {
            // 根据响应状态码进行错误处理
            switch (error.response.status) {
                case 401:
                    Vue.$swal(i18n.t("app.systemTips"), "access, redirecting to login", "error");
                    // 可以在此处跳转到登录页或其他处理逻辑
                    break;
                case 404:
                    Vue.$swal(i18n.t("app.systemTips"), "Resource not found", "error");
                    break;
                case 500:
                    //针对后端的自定义异常，显示特定的错误消息
                    if (error.response.data && error.response.data.isError) {
                        if (error.response.data.details) {
                            Vue.$swal(error.response.data.message, error.response.data.details, "error");
                        } else {
                            Vue.$swal(i18n.t("app.systemTips"), error.response.data.message, "error");
                        }
                    } else {
                        Vue.$swal(i18n.t("app.systemTips"), "An unexpected error occurred", "error");
                    }
                    break;
                default:
                    Vue.$swal(i18n.t("app.systemTips"), "An unexpected error occurred", "error");
            }
        } else {
            Vue.$swal(i18n.t("app.systemTips"), "Network error, please try again later", "error");
        }
        return Promise.reject(error.response.data ? error.response.data : error.response);
    });

const api = {
    get(url) {
        return instance.get(url);
    },
    post(url, data) {
        return instance.post(url, data);//默认是json格式
    },
    postForm(url, data) {
        return instance.post(url, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },
}

export default api;