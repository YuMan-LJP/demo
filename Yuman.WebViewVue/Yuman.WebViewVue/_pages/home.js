var yuman = yuman || {};
yuman.vuepage = yuman.vuepage || {};
yuman.vuepage.home = yuman.vuepage.home || {};
function initHome(elId) {
    yuman.vuepage.home = new Vue({
        el: '#' + elId,
        data: {
            title: "Home",
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
    return yuman.vuepage.home;
}