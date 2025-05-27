var yuman = yuman || {};
yuman.index = yuman.index || {};

document.addEventListener('DOMContentLoaded', function () {
    yuman.ui.setBusy();
    //自动加载pages文件夹下的css文件
    try {
        if (yuman.pageFile.css) {
            for (var i = 0; i < yuman.pageFile.css.length; i++) {
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = yuman.pageFile.css[i];
                document.head.appendChild(link);
                console.log('自动加载：' + link.href);
            }
        }
    }
    catch (ex) { console.error(ex) }

    //自动加载pages文件夹下的js文件
    try {
        if (yuman.pageFile.js) {
            for (var i = 0; i < yuman.pageFile.js.length; i++) {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = yuman.pageFile.js[i];
                document.body.appendChild(script);
                console.log('自动加载：' + script.src);
            }
        }
    }
    catch (ex) { console.error(ex) }

    //定时判断yuman.vuepage是否加载完成，加载完成开始渲染页面
    var timer = setInterval(function () {
        try {
            if (yuman.vuepage) {
                console.log('找到vuepage，开始初始化');
                yuman.ui.clearBusy();
                loadMyPage('home')//默认跳转首页
                clearInterval(timer);
            }
            else {
                console.log('没找到vuepage');
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
        f.html = yuman.initialPages[f.id];//yuman.initialPages是后端返回的全局变量，给这里拼接html使用
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
            console.log(id, '已渲染，不重复渲染');
            return;
        };

        //构造这个代码：initHome()
        var code = 'init' + id.charAt(0).toUpperCase() + id.slice(1) + '("' + id + '")';
        var initObj = eval(code);//执行构造的代码
        yuman.index.loaded[id] = initObj;
    }
    if (!showPage) {
        showPage = 'home';//如果没有声明就默认跳首页
    }
    yuman.index.changeTab(showPage);//默认显示首页
}
function reloadMyPage(showPage) {
    yuman.index.loaded = {};//清除缓存
    yuman.vuepage = {};//销毁
    loadMyPage(showPage)
}