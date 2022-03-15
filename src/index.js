const { app, BrowserWindow } = require('electron')

const createWindow = () => {
    const win = new BrowserWindow({
      width: 505,
      height: 785,
      resizable: false
    })
  
    win.loadFile('src\\index.html')
  }

app.whenReady().then(() => {
createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })


  