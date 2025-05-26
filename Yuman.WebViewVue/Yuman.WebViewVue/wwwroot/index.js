var yuman = yuman || {};
yuman.index = yuman.index || {};
yuman.index.title = L("Heard.Title")
yuman.index.menus = [
    {
        id: "home",
        name: L("Home"),
    },
    {
        id: "jobInfo",
        name: L("JobInfo"),
    },
    {
        id: "about",
        name: L("About"),
    },
];

document.addEventListener('DOMContentLoaded', function () {
    yuman.index.menus.forEach(f => {
        f.html = yuman.initialPages[f.id];//yuman.initialPages�Ǻ�˷��ص�ȫ�ֱ�����������ƴ��htmlʹ��
    });
    var navigationProvider = {
        title: yuman.index.title,
        menus: yuman.index.menus,
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
            console.log(id, '����Ⱦ�����ظ���Ⱦ');
            return;
        };

        //����������룺initHome()
        var code = 'init' + id.charAt(0).toUpperCase() + id.slice(1) + '("' + id + '")';
        var initObj = eval(code);//ִ�й���Ĵ���
        yuman.index.loaded[id] = initObj;
    }
    yuman.index.changeTab('home');//Ĭ����ʾ��ҳ
});