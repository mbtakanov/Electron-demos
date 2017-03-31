const electron = require('electron');
const path = require('path');
const fs = require('fs');

const {desktopCapturer, ipcRenderer: ipc, screen} = electron;

function getMainSource(desktopCapturer, screen, done) {
	const options = {
		types: ['screen'], 
		thumbnailSize: screen.getPrimaryDisplay().workAreaSize
	};

	desktopCapturer.getSources(options, (err, sources) => {
		if (err) {
			return console.log('Cannot capture screen: ', err);
		}

		const isMainSource = source => source.name === 'Entire screen' || source.name === 'Screen 2';
		
		let filteredSources = sources.filter(isMainSource);
		if (filteredSources.length) {
			done(filteredSources[0]);
		}
	});
}

function onCapture(evt, targetPath) {
	getMainSource(desktopCapturer, screen, source => {
		const png = source.thumbnail.toPng();
		let now = ('' + new Date()).replace(/:/g, '-');
		const filePath = path.join(targetPath, `${now}.png`);
		writeScreenshot(png, filePath);
	});
}

function writeScreenshot(png, filePath) {
	console.log('write in: ', filePath);
	fs.writeFile(filePath, png, err => {
		if (err) {
			return console.log('Failed to save the screenshot: ', err);
		}
	});
}

ipc.on('capture', onCapture);