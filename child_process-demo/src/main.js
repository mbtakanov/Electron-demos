const electron = require('electron');
const { app, globalShortcut, Menu, BrowserWindow } = electron;

app.on('ready', _ => {
	mainWindow = new BrowserWindow({
		width: 400,
		height: 100
	});

	mainWindow.loadURL(`file://${__dirname}/status.html`);

	mainWindow.on('close', _ => {
		mainWindow = null;
	});
});