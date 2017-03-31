const electron = require('electron');

const countdown = require('./countdown');
const effects = require('./effects');
const video = require('./video');
const flash = require('./flash');

const { ipcRenderer: ipc, shell, remote } = electron;

const images = remote.require('./images');

let canvasTarget = undefined;
let seriously = undefined;
let videoSrc = undefined;

function formatImgTag(doc, bytes) {
	const div = doc.createElement('div');
	div.classList.add('photo');

	const close = doc.createElement('div');
	close.classList.add('photoClose');

	const img = new Image();
	img.classList.add('photoImg');
	img.src = bytes;

	div.appendChild(close);
	div.appendChild(img);

	return div;
}

window.addEventListener('DOMContentLoaded', _ => {
	const videoEl = document.getElementById('video');
	const canvasEl = document.getElementById('canvas');
	const recordEl = document.getElementById('record');
	const photosEl = document.querySelector('.photosContainer');
	const counterEl = document.getElementById('counter');
	const flashEl = document.getElementById('flash');

	seriously = new Seriously();
	videoSrc = seriously.source('#video');
	canvasTarget = seriously.target('#canvas');
	effects.choose(seriously, videoSrc, canvasTarget);

	video.init(navigator, videoEl);

	recordEl.addEventListener('click', _ => {
		countdown.start(counterEl, 3, _ => {
			flash(flashEl);
			const bytes = video.captureBytesFromLiveCanvas(canvasEl);
			ipc.send('image-captured', bytes);
			photosEl.appendChild(formatImgTag(document, bytes));
		});
	});

	photosEl.addEventListener('click', evt => {
		const isRm = evt.target.classList.contains('photoClose');
		const selctor = isRm ? '.photoClose' : '.photoImg';

		const photos = Array.from(document.querySelectorAll(selctor));
		const index = photos.findIndex(el => el == evt.target);

		if (index > -1) {
			if (isRm) {
				ipc.send('image-remove', index);
			} else {
				shell.showItemInFolder(images.getFromCache(index));
			}
			
		}
	});
});

ipc.on('image-removed', (event,index) => {
	document.getElementById('photos').removeChild(Array.from(document.querySelectorAll('.photo'))[index]);
});

ipc.on('effect-cycle', event => {
	effects.cycle(seriously, videoSrc, canvasTarget);
});

ipc.on('effect-choose', (event, effectName) => {
	effects.choose(seriously, videoSrc, canvasTarget, effectName);
});