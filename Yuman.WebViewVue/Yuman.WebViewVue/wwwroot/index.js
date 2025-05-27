var yuman = yuman || {};
yuman.index = yuman.index || {};

document.addEventListener('DOMContentLoaded', function () {
    loadMyPage('home')//Ĭ����ת��ҳ
});

function loadMyPage(showPage) {
    var navigationProvider = {
        title: L("Heard.Title"),
        menus: [
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
            {
                id: "setting",
                name: L("Setting"),
            },
        ],
    }
    navigationProvider.menus.forEach(f => {
        f.html = yuman.initialPages[f.id];//yuman.initialPages�Ǻ�˷��ص�ȫ�ֱ�����������ƴ��htmlʹ��
    });

    var htmlTemplateSource = `
        <div>
            <nav>
                <ul>
                    {{#each menus}}
                    <li><a href="javascript:void(0)" onclick="yuman.index.changeTab('{{{this.id}}}')">{{this.name}}</a></li>
                    {{/each}}
                </ul>
            </nav>

            <main>
                {{#each menus}}
                <section id="{{this.id}}" class="content">
                    {{{this.html}}}
                </section>
                {{/each}}
            </main>
        </div>`;
    const template = Handlebars.compile(htmlTemplateSource);
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
    if (!showPage) {
        showPage = 'home';//���û��������Ĭ������ҳ
    }
    yuman.index.changeTab(showPage);//Ĭ����ʾ��ҳ
}
function reloadMyPage(showPage) {
    yuman.index.loaded = {};//�������
    yuman.vuepage = {};//����
    loadMyPage(showPage)
}