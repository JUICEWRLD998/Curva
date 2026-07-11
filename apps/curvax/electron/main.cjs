const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const PearRuntime = require('pear-runtime')

let worker = null
let win = null

function storageDir() {
  const dir = path.join(app.getPath('userData'), 'curvax-store')
  fs.mkdirSync(dir, { recursive: true })
  return dir
}

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 980,
    minHeight: 700,
    title: 'CURVAX',
    backgroundColor: '#050a08',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false
    }
  })

  const workerPath = path.join(__dirname, '..', 'workers', 'main.mjs')
  worker = PearRuntime.run(workerPath, [storageDir()])

  worker.on('data', (data) => {
    if (win && !win.isDestroyed()) {
      win.webContents.send('curvax:from-worker', data.toString())
    }
  })

  worker.stderr.on('data', (data) => {
    console.error('[curvax-worker]', data.toString())
  })

  ipcMain.handle('curvax:send', (_evt, payload) => {
    const msg = typeof payload === 'string' ? payload : JSON.stringify(payload)
    if (!worker) return { ok: false, reason: 'worker-not-ready' }
    worker.write(Buffer.from(msg))
    return { ok: true }
  })

  win.once('ready-to-show', () => win.show())

  const devUrl = process.env.VITE_DEV_SERVER_URL
  if (devUrl) {
    win.loadURL(devUrl)
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (worker) {
    try {
      worker.write(Buffer.from(JSON.stringify({ type: 'shutdown' })))
    } catch {}
    try {
      worker.destroy()
    } catch {}
  }
  app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
