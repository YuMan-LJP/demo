import VueSwal from 'vue-swal';

const Message = {}

// Vue暴露了一个install方法，用于自定义插件
Message.install = function (Vue) {
    Vue.use(VueSwal);

    //https://sweetalert.js.org/docs/
    Vue.prototype.$messageInfo = function (title, message) {
        Vue.$swal(title, message, "info")
    }
    Vue.prototype.$messageSuccess = function (title, message) {
        Vue.$swal(title, message, "success")
    }
    Vue.prototype.$messageWarn = function (title, message) {
        Vue.$swal(title, message, "warning")
    }
    Vue.prototype.$messageError = function (title, message) {
        Vue.$swal(title, message, "error")
    }
    Vue.prototype.$messageConfirm = function (title, message, callback) {
        Vue.$swal({
            title: title,
            text: message,
            icon: 'info',
            buttons: {
                cancel: {
                    text: "Cancel",
                    value: null,
                    visible: true,
                    className: "",
                    closeModal: true,
                },
                confirm: {
                    text: "OK",
                    value: true,
                    visible: true,
                    className: "",
                    closeModal: true
                }
            }
        }).then((isConfirm) => {
            callback(isConfirm)
        })
    }
}

export default Message;