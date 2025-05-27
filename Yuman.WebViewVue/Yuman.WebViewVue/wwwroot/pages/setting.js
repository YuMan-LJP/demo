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
                language: '',
            },
            languageSelect: {
                name: 'selectLanguage',
                value: { value: "" },
                datas: [],
                length: 200,
                multiple: false,
                allowClear: false,
                title: L("Setting.SwitchLanguages"),
                label: L("Setting.SwitchLanguages")
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
                                            this.setting[key] = res[key].toLowerCase() == 'true'//◊÷∑˚¥Æ◊™≤º∂˚–Õ
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
                            this.tryChangeLanguage(this.setting.language);
                        }
                    })
                )
            },
            languageSelectChange() {
                this.setting.language = this.languageSelect.value.value
            },
            tryChangeLanguage(lang) {
                if (yuman.currentLanguage == lang) {
                    return;
                }
                yuman.currentLanguage = lang;//«∞∂À«–ªª”Ô—‘
                window.chrome.webview.hostObjects.openApi.ChangeLanguage(yuman.currentLanguage);//∫Û∂À«–ªª”Ô—‘
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
