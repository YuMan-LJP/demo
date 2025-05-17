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
        f.html = window.initialPages[f.id];//window.initialPages�Ǻ�˷��ص�ȫ�ֱ�����������ƴ��htmlʹ��
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

    yuman.index.changeTab = function (name) {
        $('.content').hide();
        $('#' + name).show();

        //����������룺initHome()
        var code = 'init' + name.charAt(0).toUpperCase() + name.slice(1) + '("' + name + '")';
        eval(code);//ִ�й���Ĵ���
    }
    yuman.index.changeTab('home');//Ĭ����ʾ��ҳ
});