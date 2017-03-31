const electron = require('electron')
const path = require('path')

const { app, Tray, Menu } = electron

app.on('ready', _ => {
	
	const tray = new Tray('src/foo.ico')
	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'WoW',
			click: _ => {
				console.log('WoW');
			}
		},
		{
			label: 'Awesome',
			click: _ => {
				console.log('Awesome');
			}
		}
	])

	tray.setContextMenu(contextMenu)
	tray.setToolTip("This is tray menu")
})
