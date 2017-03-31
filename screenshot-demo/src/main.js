const electron = require('electron');
const path = require('path');
const { app, globalShortcut, Menu, BrowserWindow } = electron;

let mainWindow

app.on('ready', _ => {
	mainWindow = new BrowserWindow({
		width: 0,
		height: 0,
		resizable: false,
		frame: false,
		show: false
	});

	mainWindow.loadURL(`file://${__dirname}/capture.html`);

	mainWindow.on('close', _ => {
		mainWindow = null;
	});

	globalShortcut.register('Alt+1', _ => {
		mainWindow.webContents.send('capture', app.getPath('pictures'));
	});
});