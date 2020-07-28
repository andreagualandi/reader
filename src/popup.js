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

async function inject() {
	const results = await executeScript(tabId, { file: 'content.js' });
	if (chrome.runtime.lastError || !results || !results.length) {
		return;  // Permission error, tab closed, etc.
	}
	if (results[0] !== true) {
		// Not already inserted before, do your thing, e.g. add your CSS:
		return insertCSS(tabId, { file: 'content.css' });
	}
}


// --- BIND EVENTs ---
window.onload = onOpen;
inspectButton.onclick = onInspectClick;
previewButton.onclick = onPreviewClick;
startButton.onclick = onStartClick;
