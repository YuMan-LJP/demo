import Swal from 'sweetalert2'

//https://sweetalert2.github.io/
const $swalInfo = (title, message) => {
    Swal.fire({
        title: title,
        text: message,
        icon: "info"
    });
}
const $swalSuccess = (title, message) => {
    Swal.fire({
        title: title,
        text: message,
        icon: "success"
    });
}
const $swalWarn = (title, message) => {
    Swal.fire({
        title: title,
        text: message,
        icon: "warning"
    });
}
const $swalError = (title, message) => {
    Swal.fire({
        title: title,
        text: message,
        icon: "error"
    });
}
const $swalConfirm = (title, message, callback) => {
    Swal.fire({
        title: title,
        text: message,
        icon: "question",
        showConfirmButton: true,//确认
        confirmButtonText: 'OK',
        showCancelButton: true,//取消
        cancelButtonText: 'Cancel',
        showDenyButton: false,//否认，一般情况下取消也可以代表否认，所以就不显示了，如果后续需要再支持
        denyButtonText: 'No',
    }).then((result) => {
        callback(result.isConfirmed)
    });
}

export default {
    install: (app) => {
        app.config.globalProperties["$swalInfo"] = $swalInfo;
        app.config.globalProperties["$swalSuccess"] = $swalSuccess;
        app.config.globalProperties["$swalWarn"] = $swalWarn;
        app.config.globalProperties["$swalError"] = $swalError;
        app.config.globalProperties["$swalConfirm"] = $swalConfirm;
    }
}