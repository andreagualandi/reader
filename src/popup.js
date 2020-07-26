// --- INIT VARIABLES ---
import { executeScript, insertCSS, sendMessage, getCurrentTabId } from './util';

let tabId;
const inspectButton = document.getElementById('inspect');
const previewButton = document.getElementById('preview');
const startButton = document.getElementById('start');
let clickedInspect = false;
let clickedPreview = false;

// --- METHODS ---

async function onOpen() {
	tabId = await getCurrentTabId();
	inspectButton.style.backgroundColor = 'green';
}

async function onInspectClick(e) {
	e.preventDefault();
	console.log('-- inizio click --');
	clickedInspect = !clickedInspect;

	await inject();

	const msg = clickedInspect ? 'selectionOn' : 'selectionOff';
	console.log('Invio messaggio', msg, tabId);
	await sendMessage({ data: msg }, tabId);

	inspectButton.style.backgroundColor = clickedInspect ? 'red' : 'green';
	console.log('--- fine click ---');
}

async function onPreviewClick(e) {
	await sendMessage({ data: 'highlights' }, tabId);
}

async function onStartClick(e) {
	await sendMessage({ data: 'open' });
}

function inject() {
	return new Promise((resolve, reject) => {
		// start listening
		chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
			if (message.loaded === false) {
				await executeScript(tabId, { file: 'content.js' });
				await insertCSS(tabId, { file: 'content.css' });
			}
			resolve(true);
		});
		// ping content script
		executeScript(tabId, {
			code: "chrome.runtime.sendMessage({ loaded: typeof(MOUSE_VISITED_CLASSNAME) !== 'undefined' });",
		});
	});
}

// --- BIND EVENTs ---
window.onload = onOpen;
inspectButton.onclick = onInspectClick;
previewButton.onclick = onPreviewClick;
startButton.onclick = onStartClick;
