const { autoUpdater } = require('electron-updater');
const { dialog } = require('electron');

class AutoUpdaterService {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.initialize();
  }

  // 初始化更新器
  initialize() {
    // 配置日志
    autoUpdater.logger = require('electron-log');
    autoUpdater.logger.transports.file.level = 'info';

    // 监听更新事件
    this.setupEventListeners();
  }

  // 设置事件监听器
  setupEventListeners() {
    // 发现新版本
    autoUpdater.on('update-available', (info) => {
      dialog.showMessageBox({
        type: 'info',
        title: '发现更新',
        message: `版本 ${info.version} 可用，是否立即更新？`,
        buttons: ['立即更新', '稍后']
      }).then((result) => {
        if (result.response === 0) {
          autoUpdater.downloadUpdate();
        }
      });
    });

    // 更新下载进度
    autoUpdater.on('download-progress', (progressObj) => {
      const progress = Math.round(progressObj.percent);
      this.mainWindow.webContents.send('update-progress', progress);
    });

    // 更新下载完成
    autoUpdater.on('update-downloaded', (info) => {
      dialog.showMessageBox({
        type: 'info',
        title: '更新就绪',
        message: `版本 ${info.version} 已下载完成，是否立即重启应用？`,
        buttons: ['立即重启', '稍后重启']
      }).then((result) => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
    });

    // 更新错误
    autoUpdater.on('error', (err) => {
      dialog.showMessageBox({
        type: 'error',
        title: '更新失败',
        message: `自动更新时发生错误: ${err.message}`,
        buttons: ['确定']
      });
    });
  }

  // 检查更新
  checkForUpdates() {
    autoUpdater.checkForUpdates();
  }
}

module.exports = AutoUpdaterService;