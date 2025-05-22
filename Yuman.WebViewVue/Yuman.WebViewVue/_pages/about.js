var yuman = yuman || {};
yuman.vuepage = yuman.vuepage || {};
yuman.vuepage.about = yuman.vuepage.about || {};
function initAbout(elId) {
    yuman.vuepage.about = new Vue({
        el: '#' + elId,
        data: {
            title: "About",
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
    return yuman.vuepage.about;
}
