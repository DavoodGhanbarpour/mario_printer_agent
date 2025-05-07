const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  setConfig: (input) => ipcRenderer.send('setConfig', input),
  getConfig: () => ipcRenderer.send('getConfig'),
  replyGetConfig: (callback) => ipcRenderer.on('replyGetConfig', callback),
  updatePreviewFrame: (callback) => ipcRenderer.on('updatePreviewFrame', callback),
});
