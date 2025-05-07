const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const Store = require('electron-store');
const AutoLaunch = require('auto-launch');
const axios = require('axios');

const store = new Store();
let mainWindow;

app.disableHardwareAcceleration();

app.whenReady().then(() => {
  const configs = loadConfig();

  mainWindow = createMainWindow();
  setupIpcHandlers(configs);
  setupAutoLaunch(configs);
  startPolling(configs);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow();
    }
  });

  mainWindow.on('minimize', (event) => {
    event.preventDefault();
    mainWindow.minimize();
  });

  mainWindow.on('close', () => {
    app.quit();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ---------- Window Setup ----------

function createMainWindow() {
  const { bounds } = screen.getPrimaryDisplay();

  const win = new BrowserWindow({
    width: 350,
    height: 600,
    x: bounds.width - 350,
    y: bounds.height - 650,
    autoHideMenuBar: true,
    maximizable: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
  });

  win.loadFile('./src/index.html');
  return win;
}

// ---------- IPC and Config ----------

function setupIpcHandlers(configs) {
  ipcMain.on('setConfig', (_, input) => {
    saveConfig(input);
    Object.assign(configs, loadConfig());
  });

  ipcMain.on('getConfig', () => {
    mainWindow.webContents.send('replyGetConfig', loadConfig());
  });
}

function saveConfig(data) {
  store.set('config', JSON.stringify(data ?? ""));
}

function loadConfig() {
  if (store.has('config')) {
    try {
      return JSON.parse(store.get('config')) || {};
    } catch {
      return {};
    }
  }
  return {};
}

// ---------- Auto Launch ----------

function setupAutoLaunch(configs) {
  if (configs.startup === 'on') {
    const autoLauncher = new AutoLaunch({
      name: 'Printer Agent',
      path: app.getPath('exe'),
    });

    autoLauncher.isEnabled().then((isEnabled) => {
      if (!isEnabled) autoLauncher.enable();
    });
  }
}

// ---------- Polling ----------

function startPolling(configs) {
  setInterval(() => {
    fetchNextPrintJobs(configs);
  }, 8000);
}

function fetchNextPrintJobs(configs) {
  const { ip, port, printerName, start } = configs;
  if (ip && port && printerName && start === 'on') {
    const baseUrl = `${ip}:${port}`;
    printerName.split(',').forEach((name) => {
      const trimmedName = name.trim();
      if (trimmedName) {
        fetchAndPrintJob(baseUrl, trimmedName, configs);
      }
    });
  }
}

function fetchAndPrintJob(url, printerName, configs) {
  axios.get(`${url}/system/prints/${printerName}`)
    .then(({ data }) => {
      if (data !== '-') {
        printURL(`${data}&hide=true`, printerName, configs);
      }
    })
    .catch((err) => {
      console.error(`Failed to fetch print job for ${printerName}:`, err.message);
    });
}

// ---------- Printing ----------

function printURL(url, printerName, configs) {
  const hiddenWin = new BrowserWindow({ show: false });

  hiddenWin.loadURL(url);

  hiddenWin.webContents.on('did-finish-load', () => {
    hiddenWin.webContents.print({
      silent: true,
      deviceName: printerName,
      printBackground: configs.printBackground === 'on',
    }, () => {
      hiddenWin.destroy();
      sendPreviewUpdate(`${url}&hide=true`);
    });
  });
}

function sendPreviewUpdate(url) {
  mainWindow.webContents.send('updatePreviewFrame', url);
}
