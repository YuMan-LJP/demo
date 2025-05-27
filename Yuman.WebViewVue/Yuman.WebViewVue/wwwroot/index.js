var yuman = yuman || {};
yuman.index = yuman.index || {};

document.addEventListener('DOMContentLoaded', function () {
    yuman.ui.setBusy();
    //�Զ�����pages�ļ����µ�css�ļ�
    try {
        if (yuman.pageFile.css) {
            for (var i = 0; i < yuman.pageFile.css.length; i++) {
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = yuman.pageFile.css[i];
                document.head.appendChild(link);
                console.log('�Զ����أ�' + link.href);
            }
        }
    }
    catch (ex) { console.error(ex) }

    //�Զ�����pages�ļ����µ�js�ļ�
    try {
        if (yuman.pageFile.js) {
            for (var i = 0; i < yuman.pageFile.js.length; i++) {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = yuman.pageFile.js[i];
                document.body.appendChild(script);
                console.log('�Զ����أ�' + script.src);
            }
        }
    }
    catch (ex) { console.error(ex) }

    //��ʱ�ж�yuman.vuepage�Ƿ������ɣ�������ɿ�ʼ��Ⱦҳ��
    var timer = setInterval(function () {
        try {
            if (yuman.vuepage) {
                console.log('�ҵ�vuepage����ʼ��ʼ��');
                yuman.ui.clearBusy();
                loadMyPage('home')//Ĭ����ת��ҳ
                clearInterval(timer);
            }
            else {
                console.log('û�ҵ�vuepage');
            }
        }
        catch (ex) {
            console.error(ex);
            clearInterval(timer);
        }
    }, 1);
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
                id: "taskScheduling",
                name: L("TaskScheduling"),
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