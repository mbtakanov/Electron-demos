const electron = require('electron')

const countdown = require('./countdown')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain

let mainWindow

app.on('ready', _ => {
	mainWindow = new BrowserWindow({
			width: 500,
			height: 500
		})

		mainWindow.loadURL(`file://${__dirname}/countdown.html`)

		mainWindow.on('close', _ => {
			mainWindow = null
		})
})

ipc.on('countdown-start', _ => {
	countdown(count => {
		mainWindow.webContents.send('countdown', count)
	})
})