const electron = require('electron');

const images = require('./images');

const { app } = electron;

function enableCycleEffect(items) {
	const nonEffectmenuOffset = 2;
	const selectedIndex = items.findIndex(item => item.checked);
	const nextIndex = selectedIndex + 1 < items.length 
		? selectedIndex + 1 
		: nonEffectmenuOffset;
	items[nextIndex].checked = true;
}

module.exports = mainWindow => {
	const name = app.getName();
	const template = [
		{
			label: 'Effects',
			submenu: [
				{
					label: 'Cycle',
					accelerator: 'Shift + CmdOrCtrl + E',
					click: menuItem => {
						enableCycleEffect(menuItem.menu.items);
						mainWindow.webContents.send('effect-cycle');
					}
				},
				{ 
					type: 'separator'
				},
				{
					label: 'Vanilla',
					accelerator: 'Ctrl + 1',
					type: 'radio',
					click: _ => {
						mainWindow.webContents.send('effect-choose');
					}
				},
				{
					label: 'Ascii',
					accelerator: 'Ctrl + 2',
					type: 'radio',
					click: _ => {
						mainWindow.webContents.send('effect-choose', 'ascii');
					}
				},
				{
					label: 'Daltonize',
					accelerator: 'Ctrl + 3',
					type: 'radio',
					click: _ => {
						mainWindow.webContents.send('effect-choose', 'daltonize');
					}
				},
				{
					label: 'hex',
					accelerator: 'Ctrl + 4',
					type: 'radio',
					click: _ => {
						mainWindow.webContents.send('effect-choose', 'hex');
					}
				}
			]
		},
		{
			label: 'View',
			submenu: [
				 {
				 	label: 'Photos Directory',
				 	accelerator: 'Ctrl + Space',
				 	click: _ => {
				 		images.openDir(images.getPicturesDir(app));
				 	}
				 }
			]
		}
	];

	if (process.platform === 'darwin' || process.platform === 'win32' ) {
		template.unshift({
			label: name,
			submenu: [
				{
					label: 'About ' + name,
					role: 'about'
				},
				{
					type: 'separator'
				},
				{
					label: 'Hide' + name,
					accelerator: 'Ctrl + H',
					role: 'hide'
				},
				{
					label: 'Hide Others',
					accelerator: 'Ctrl + Shift + H',
					role: 'hideothers'
				},
				{
					label: 'Show All',
					role: 'unhide'
				},
				{ 
					type: 'separator'
				},
				{
					label: 'Exit',
					accelerator: 'Ctrl + Q',
					click: _ => {
						app.quit();
					}
				}
			]
		});
	}

	return template;
}