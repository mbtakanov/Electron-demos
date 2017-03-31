const fs = require('fs');
const exec = require('child_process').exec;
const os = require('os');

const STATUS_UNKNOWN = 'unknown';
const STATUS_CLEAN = 'clean';
const STATUS_DIRTY = 'dirty';

function isDir(dir) {
	try	{
		return fs.lstatSync(dir).isDirectory();
	} catch (err) {
		return false;
	}
}

function checkGitStatus(dir) {
	exec('git status', {
		cwd: dir
	}, (err, stdout, stderr) => {
		if (err) {
			return setStatus(STATUS_UNKNOWN);
		}

		if (/nothing to commit/.test(stdout)) {
			return setStatus(STATUS_CLEAN);
		}

		return setStatus(STATUS_DIRTY);
	});
}

function formatDir(dir) {
	return /^~/.test(dir)
		? os.homedir() + dir.substr(1).trim()
		: dir.trim()
}

function removeStatus() {
	const el = document.getElementById('status');
	el.classList.remove('unknown', 'clean', 'dirty');
	return el;
}

function setStatus(status) {
	const el = removeStatus();
	el.classList.add(status);
}

let timer = undefined;
document.getElementById('input').addEventListener('keyup', evt => {
	removeStatus();
	clearTimeout(timer);

	timer = setTimeout(_ => {
		const dir = formatDir(evt.target.value);

		if (isDir(dir)) {
			console.log(dir);
			checkGitStatus(dir);
		}
	}, 500);
});

//~\projects\NSI_UI