const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({ width: 1440, height: 900, minWidth: 980, minHeight: 640, backgroundColor: '#101018', title: 'FINITY', webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, webviewTag: true } });
  win.webContents.on('did-attach-webview', (_event, guest) => {
    // Forward printable key presses from every embedded website to FINITY's sound toggle.
    guest.on('before-input-event', (event, input) => {
      if (input.type !== 'keyDown' || !input.key || input.key.length !== 1) return;
      const mods = input.modifiers || [];
      if (mods.includes('control') || mods.includes('meta') || mods.includes('alt')) return;
      win.webContents.send('finity:website-keypress');
    });
  });
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  ipcMain.handle('finity:open-external', (_, url) => {
    try { const u = new URL(url); if (['https:', 'http:'].includes(u.protocol)) return shell.openExternal(u.href); } catch {}
    return false;
  });
  createWindow();
  app.on('activate', () => { if (!BrowserWindow.getAllWindows().length) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
