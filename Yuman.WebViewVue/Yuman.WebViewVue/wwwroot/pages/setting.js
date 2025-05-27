var yuman = yuman || {};
yuman.vuepage = yuman.vuepage || {};
yuman.vuepage.setting = yuman.vuepage.setting || {};
function initSetting(elId) {
    yuman.vuepage.setting = new Vue({
        el: '#' + elId,
        data: {
            title: L("Setting"),
            setting: {
                systemSetting_JobIsDefaultStart: false,
                systemSetting_Language: '',
            },
            languageSelect: {
                name: 'selectLanguage',
                value: { value: "" },
                datas: [],
                length: 200,
                multiple: false,
                allowClear: false,
                title: L("Setting.SwitchLanguages"),
                label: L("Setting.SwitchLanguages"),
                isHasBr: false,//标题和下拉框不用换行
            },
        },
        methods: {
            loadData() {
                yuman.ui.setBusy(
                    "body",
                    yuman.webview.ISystemSettingService.LoadAllSystemSettingsAsync()
                        .then((res) => {
                            if (res) {
                                for (var key in res) {
                                    if (this.setting[key] !== undefined) {
                                        if (res[key].toLowerCase() == 'true' || res[key].toLowerCase() == 'false') {
                                            this.setting[key] = res[key].toLowerCase() == 'true'//字符串转布尔型
                                        } else {
                                            this.setting[key] = res[key]
                                        }
                                    }
                                }
                            }
                        })
                )
            },
            saveData() {
                var setting = {};
                for (var key in this.setting) {
                    setting[key] = this.setting[key] + ''
                }
                yuman.ui.setBusy(
                    "body",
                    yuman.webview.ISystemSettingService.SaveAllSystemSettingAsync(setting, { isIgnoreCheckEmpty : true }).then((res) => {
                        yuman.ui.clearBusy();
                        if (res) {
                            yuman.message.success(L("SaveSuccess"), L("SystemTips"));
                            this.tryChangeLanguage(this.setting.systemSetting_Language);
                        }
                    })
                )
            },
            languageSelectChange() {
                this.setting.systemSetting_Language = this.languageSelect.value.value
            },
            tryChangeLanguage(lang) {
                if (yuman.currentLanguage == lang) {
                    return;
                }
                yuman.currentLanguage = lang;//前端切换语言
                window.chrome.webview.hostObjects.openApi.ChangeLanguage(yuman.currentLanguage);//后端切换语言
                reloadMyPage('setting');
            }
        },
        mounted: function () {
            console.log(this.title);
            this.languageSelect.datas = yuman.languageSelect;
            this.languageSelect.value.value = yuman.currentLanguage;
            this.loadData();
        },
    })
    return yuman.vuepage.setting;
}
