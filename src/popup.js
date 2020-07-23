// --- INIT VARIABLES ---
import { executeScript, insertCSS, sendMessage, getCurrentTabId } from './util';

let tabId;
const inspectButton = document.getElementById('inspect');
const previewButton = document.getElementById('preview');
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

	const msg = clickedInspect ? 'enable' : 'disable';
	console.log('Invio messaggio', msg, tabId);
	console.log('messaggio inviato');
	await sendMessage({ data: msg }, tabId);

	inspectButton.style.backgroundColor = clickedInspect ? 'red' : 'green';
	console.log('--- fine click ---');
}

function onPreviewClick(e) { }

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
