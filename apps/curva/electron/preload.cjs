const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('curva', {
  send(payload) {
    return ipcRenderer.invoke('curva:send', payload)
  },
  onEvent(listener) {
    const wrap = (_evt, payload) => {
      try {
        listener(JSON.parse(payload))
      } catch (err) {
        listener({ type: 'parse-error', raw: payload, error: String(err) })
      }
    }
    ipcRenderer.on('curva:from-worker', wrap)
    return () => ipcRenderer.removeListener('curva:from-worker', wrap)
  }
})
