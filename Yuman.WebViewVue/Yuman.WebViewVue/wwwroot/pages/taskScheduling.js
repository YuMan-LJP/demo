var yuman = yuman || {};
yuman.vuepage = yuman.vuepage || {};
yuman.vuepage.taskScheduling = yuman.vuepage.taskScheduling || {};
function initTaskScheduling(elId) {
    yuman.vuepage.TaskScheduling = new Vue({
        el: '#' + elId,
        data: {
            title: L("TaskScheduling"),
        },
        methods: {
            test(name) {
                console.log(name);
            },
        },
        mounted: function () {
            console.log(this.title);
        },
    })
    return yuman.vuepage.taskScheduling;
}
