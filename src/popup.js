// --- INIT VARIABLES ---
import { executeScript, insertCSS, sendMessage, getCurrentTabId } from './util';

let tabId;
const inspectButton = document.getElementById('inspect');
const previewButton = document.getElementById('preview');
const startButton = document.getElementById('start');
let clickedInspect = false;

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

	const action = clickedInspect ? 'selectionOn' : 'selectionOff';
	console.log('Invio messaggio', action, tabId);
	await sendMessage({ action: action }, tabId);

	inspectButton.style.backgroundColor = clickedInspect ? 'red' : 'green';
	console.log('--- fine click ---');
}

async function onPreviewClick(e) {
	await sendMessage({ action: 'highlights' }, tabId);
}

async function onStartClick(e) {
	await sendMessage({ action: 'open' });
}

async function onSaveClick(e) {
	await sendMessage({ action: 'save' });
}

function inject() {
	return new Promise((resolve, reject) => {
		// start listening
		chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
			console.log('Messaggio ricevuto in popup', message);
			if (message.loaded === false) {
				await executeScript(tabId, { file: 'content.js' });
				await insertCSS(tabId, { file: 'content.css' });
			}
			resolve(true);
			sendResponse({ result: 'popup - done' })
			return;
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
