const electron = require('electron')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu

let mainWindow

app.on('ready', _ => {
	mainWindow = new BrowserWindow()
	mainWindow.loadURL(`file://${__dirname}/index.html`)

	const name = electron.app.getName()
	const template = [
		{
			label: name,
			submenu: [{
				label: `About ${name}`,
				click: _ => {
					console.log('active');
				},
				role: 'about'
			}, {
				type: 'separator'
			}, {
				label: 'Exit',
				// click: _ => {
				// 	app.quit()
				// },
				accelerator: 'Alt+Q',
				role: 'close'
			}]
		}
	]

	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)
})