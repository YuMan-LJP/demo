const { contextBridge, ipcRenderer } = require('electron');

// 向渲染进程暴露安全的 API
contextBridge.exposeInMainWorld('electronAPI', {
    // 获取应用版本
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),

    // 发送消息到主进程
    sendMessage: (message) => ipcRenderer.invoke('show-message', message),

    // 平台信息
    platform: process.platform,

    // 版本信息
    versions: {
        electron: process.versions.electron,
        node: process.versions.node,
        chrome: process.versions.chrome
    },

    // 监听主进程消息
    onMessage: (callback) => ipcRenderer.on('message-from-main', callback)
});