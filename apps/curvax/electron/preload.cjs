const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('curvax', {
  send(payload) {
    return ipcRenderer.invoke('curvax:send', payload)
  },
  onEvent(listener) {
    const wrap = (_evt, payload) => {
      try {
        listener(JSON.parse(payload))
      } catch (err) {
        listener({ type: 'parse-error', raw: payload, error: String(err) })
      }
    }
    ipcRenderer.on('curvax:from-worker', wrap)
    return () => ipcRenderer.removeListener('curvax:from-worker', wrap)
  }
})
