const electron = require('electron');

const images = require('./images');
const menuTemplate = require('./menu');

const { app, BrowserWindow, ipcMain: ipc, Menu } = electron;

let mainWindow = null;

app.on('ready', _ => {
	mainWindow = new BrowserWindow({
		width: 913,
		height: 825,
		resizable: false
	});

	mainWindow.loadURL(`file://${__dirname}/capture.html`);

	// mainWindow.we bContents.openDevTools();

	images.mkdir(images.getPicturesDir(app));

	mainWindow.on('close', _ => {
		mainWindow = null;
	});

	const menuContent = Menu.buildFromTemplate(menuTemplate(mainWindow));
	Menu.setApplicationMenu(menuContent)
});

ipc.on('image-captured', (event, contents) => {
	images.save(images.getPicturesDir(app), contents, (err, imgPath) => {
		images.cache(imgPath);
	});
});

ipc.on('image-remove', (event, index) => {
	images.rm(index, _ => {
		event.sender.send('image-removed', index);
	});
});