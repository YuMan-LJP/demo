import { ElNotification } from 'element-plus'

const $notityInfo = (title, message, duration) => {
    if (!duration) {
        duration = 3000//3秒后关闭
    }
    ElNotification({
        title: title,
        message: message,
        type: 'info',
        duration: duration,
        position: 'top-right'
    })
}
const $notitySuccess = (title, message, duration) => {
    if (!duration) {
        duration = 3000//3秒后关闭
    }
    ElNotification({
        title: title,
        message: message,
        type: 'success',
        duration: duration,
        position: 'top-right'
    })
}

const $notityWarn = (title, message, duration) => {
    if (!duration) {
        duration = 3000//3秒后关闭
    }
    ElNotification({
        title: title,
        message: message,
        type: 'warning',
        duration: duration,
        position: 'top-right'
    })
}

const $notityError = (title, message, duration) => {
    if (!duration) {
        duration = 3000//3秒后关闭
    }
    ElNotification({
        title: title,
        message: message,
        type: 'error',
        duration: duration,
        position: 'top-right'
    })
}

export default {
    install: (app) => {
        app.config.globalProperties["$notityInfo"] = $notityInfo;
        app.config.globalProperties["$notitySuccess"] = $notitySuccess;
        app.config.globalProperties["$notityWarn"] = $notityWarn;
        app.config.globalProperties["$notityError"] = $notityError;
    }
}