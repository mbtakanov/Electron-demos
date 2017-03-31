const electron = require('electron');
const path = require('path');
const { app, clipboard, globalShortcut, Tray, Menu, BrowserWindow } = electron;

const iconPath = path.join(__dirname, 'trayIcon.ico');
const STACK_SIZE = 5;
const ITEM_MAX_LENGTH = 20;

let mainWindow = undefined;
let tray = undefined;
let contextMenu = undefined;

function checkClipboardForChange(clipboard, onChange) {
	let cache = clipboard.readText();;
	let latest = undefined;

	setInterval(_ => {
		latest = clipboard.readText();
		
		if (latest !== cache) {
			cache = latest;
			onChange(cache);
		}
	}, 1000);
}

function addToStack(item, stack) {
	return [item].concat(stack.length >= STACK_SIZE ? stack.slice(0, stack.length - 1) : stack);
}


function formatItem(item) {
	return item && item.length > ITEM_MAX_LENGTH
		? item.substr(0, ITEM_MAX_LENGTH) + '...'
		: item;
}

function formatMenuTemplateForStack(clipboard, stack) {
	return stack.map((item, i) => {
		return {
			label: `Copy: ${formatItem(item)}`,
			click: _ => clipboard.writeText(item),
			accelerator: `Ctrl+Alt+${i + 1}`
		};
	})
}

function registerShorcuts(globalShortcut, clipboard, stack) {
	globalShortcut.unregisterAll();
	for (let i = 0; i < STACK_SIZE; i++) {
		globalShortcut.register(`Ctrl+Alt+${i + 1}`, _ => {
			if (stack[i]) {
				clipboard.writeText(stack[i]);
			}
		}); 
	}
}

app.on('ready', _ => {
	let stack = [];

	mainWindow = new BrowserWindow()

	tray = new Tray(iconPath);
	tray.setContextMenu(Menu.buildFromTemplate([
		{
			label: '<Empty>',
			enabled: false
		}
	]));

	checkClipboardForChange(clipboard, text => {
		stack = addToStack(text, stack);
		tray.setContextMenu(Menu.buildFromTemplate(formatMenuTemplateForStack(clipboard, stack)));
		registerShorcuts(globalShortcut, clipboard, stack);
	});

	mainWindow.on('close', _ => {
		mainWindow = undefined;
		tray = undefined;
	});
});


app.on('will-quit', _ => {
	globalShortcut.unregisterAll();
});