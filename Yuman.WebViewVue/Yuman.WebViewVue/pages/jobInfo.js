var yuman = yuman || {};
yuman.vuepage = yuman.vuepage || {};
yuman.vuepage.jobInfo = yuman.vuepage.jobInfo || {};
function initJobInfo(elId) {
    yuman.vuepage.jobInfo = new Vue({
        el: '#' + elId,
        data: {
            title: "Job Info",
        },
        methods: {
            test: (name) => {
                console.log(name);
            },
        },
        mounted: function () {
            console.log(this.title);
        },
    })
}
