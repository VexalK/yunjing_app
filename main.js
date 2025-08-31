const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const AutoUpdaterService = require('./src/services/auto-updater');

const fs = require('fs');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      frame: false,
      transparent: true,
      backgroundColor: '#00000000',
      visualEffectState: 'active',
      icon: path.join(__dirname, 'src/assets/app-icon.ico'),
      show: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false
      }
    });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // 窗口准备就绪后直接显示
  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
    // 添加淡入效果
    mainWindow.setOpacity(0);
    let opacity = 0;
    const interval = setInterval(() => {
      opacity += 0.1;
      if (opacity >= 1) {
        mainWindow.setOpacity(1);
        clearInterval(interval);
      } else {
        mainWindow.setOpacity(opacity);
      }
    }, 16);
  });

  // 窗口最大化/恢复状态变化时通知渲染进程
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window-maximized');
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window-unmaximized');
  });

  // 窗口控制事件
  ipcMain.on('minimize-window', () => mainWindow.minimize());
  ipcMain.on('maximize-window', () => {
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
  });
  ipcMain.on('close-window', () => mainWindow.close());
}

app.whenReady().then(() => {
  createWindow();
  
  // 初始化自动更新服务
  const updater = new AutoUpdaterService(mainWindow);
  updater.checkForUpdates();
});
  
  app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});