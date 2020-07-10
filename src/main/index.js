import {app, ipcMain, BrowserWindow, dialog} from 'electron'
const isDev =  process.env.NODE_ENV === 'development'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (!isDev) {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = isDev
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1200,
    titleBarStyle: 'hidden',
    webPreferences: {
      devTools: true,
      webSecurity: false
    }
  })
  mainWindow.setMenu(null)
  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('resize' , (event) => {
    event.sender.send('resize', mainWindow.getContentSize());
  })

}

ipcMain.on('changeImage', event => {
  const options = {
    filters: [ { name: 'Images', extensions: ['jpg', 'png', 'gif'] }]
  }

  dialog.showOpenDialog( options , function (filePaths) {
    if(!filePaths || filePaths.length === 0){
      return ;
    }
    event.sender.send('changeImage-done' , filePaths);
  })
})

if (!isDev){
  ipcMain.on('openDevTools', event=>{
    const contents = event.sender;
    contents.openDevTools();
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
