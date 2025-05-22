var yuman = yuman || {};
yuman.index = yuman.index || {};
yuman.index.title = "Welcome to My Website"
yuman.index.menus = [
    {
        id: "home",
        name: "Home",
    },
    {
        id: "jobInfo",
        name: "Job Info",
    },
    {
        id: "about",
        name: "About",
    },
];
yuman.index.footer = new Date().getFullYear() + " My Website"

document.addEventListener('DOMContentLoaded', function () {
    yuman.index.menus.forEach(f => {
        f.html = window.initialPages[f.id];//window.initialPages是后端返回的全局变量，给这里拼接html使用
    });
    var navigationProvider = {
        title: yuman.index.title,
        menus: yuman.index.menus,
        footer: yuman.index.footer
    }
    const templateSource = document.getElementById('template').innerHTML;
    const template = Handlebars.compile(templateSource);
    const html = template(navigationProvider);
    document.body.innerHTML = html;

    yuman.index.loaded = yuman.index.loaded || {};
    yuman.index.changeTab = function (id) {
        $('.content').hide();
        $('#' + id).show();

        if (yuman.index.loaded[id]) {
            console.log(id, '已渲染，不重复渲染');
            return;
        };

        //构造这个代码：initHome()
        var code = 'init' + id.charAt(0).toUpperCase() + id.slice(1) + '("' + id + '")';
        var initObj = eval(code);//执行构造的代码
        yuman.index.loaded[id] = initObj;
    }
    yuman.index.changeTab('home');//默认显示首页
});