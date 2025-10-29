// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', async () => {
    // 显示环境信息 - 使用从预加载脚本暴露的版本信息
    if (window.electronAPI && window.electronAPI.versions) {
        document.getElementById('electron-version').textContent = window.electronAPI.versions.electron;
        document.getElementById('node-version').textContent = window.electronAPI.versions.node;
        document.getElementById('chrome-version').textContent = window.electronAPI.versions.chrome;
        document.getElementById('platform').textContent = window.electronAPI.platform;
    } else {
        document.getElementById('electron-version').textContent = '不可用';
        document.getElementById('node-version').textContent = '不可用';
        document.getElementById('chrome-version').textContent = '不可用';
        document.getElementById('platform').textContent = '不可用';
    }


    // 获取应用版本
    try {
        if (window.electronAPI) {
            const appVersion = await window.electronAPI.getAppVersion();
            document.querySelector('h1').textContent += ` v${appVersion}`;
        }
    } catch (error) {
        console.log('无法获取应用版本:', error);
    }

    // 测试按钮事件
    document.getElementById('test-btn').addEventListener('click', async () => {
        const messageBox = document.getElementById('message-box');
        messageBox.textContent = '正在与主进程通信...';

        try {
            if (window.electronAPI) {
                const response = await window.electronAPI.sendMessage('Hello from renderer!');
                messageBox.textContent = `主进程回复: ${response}`;
            } else {
                messageBox.textContent = 'Electron API 不可用';
            }
        } catch (error) {
            messageBox.textContent = `通信错误: ${error.message}`;
        }
    });

    // 重新加载按钮
    document.getElementById('reload-btn').addEventListener('click', () => {
        location.reload();
    });
});

// 监听来自主进程的消息
if (window.electronAPI) {
    window.electronAPI.onMessage((event, message) => {
        console.log('收到主进程消息:', message);
    });
}
