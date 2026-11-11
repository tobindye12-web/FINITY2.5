const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('finity', {
  openExternal: url => ipcRenderer.invoke('finity:open-external', url),
  onWebsiteKeyPress: callback => ipcRenderer.on('finity:website-keypress', callback)
});
