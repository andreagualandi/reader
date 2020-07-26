const MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';
const CRX_HIGHLIGHT_CLASSNAME = 'crx_highlight';
let prevDOM = null;
let selectedDomItems = [];

function start() {
	document.body.classList.add('pointer-crosshair');
	document.addEventListener('mousemove', onMouseMove);
	document.addEventListener('click', onClick);
}

function finish() {
	document.removeEventListener('mousemove', onMouseMove);
	document.removeEventListener('click', onClick);
	document.body.classList.remove('pointer-crosshair');
}

function onClick(e) {
	e.preventDefault();
	prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);
	const res = getSameElements(e.target);
	console.log(res);
	finish();
}

function onMouseMove(e) {
	let srcElement = e.srcElement;

	if (!srcElement.isSameNode(prevDOM)) {
		if (prevDOM != null) {
			prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);
		}

		srcElement.classList.add(MOUSE_VISITED_CLASSNAME);

		prevDOM = srcElement;
	}
}

function highlights() {
	selectedDomItems.forEach((item) => {
		item.classList.toggle(CRX_HIGHLIGHT_CLASSNAME);
	});
}


function getSameElements(target) {
	const selector = getQuerySelector(target);
	console.log('selector', selector);

	selectedDomItems = document.querySelectorAll(selector);
	const textItems = Array.prototype.map.call(selectedDomItems, function (t) {
		t.classList.add(CRX_HIGHLIGHT_CLASSNAME);
		return t.textContent;
	});
	return textItems;
}

function getQuerySelector(target) {
	targetSelector = getSelectorForElement(target);
	parentSelector = getSelectorForElement(target.parentNode);

	return parentSelector + ' ' + targetSelector;
}

function getSelectorForElement(element) {
	if (element.id) {
		return '#' + element.id;
	}

	selector = element.tagName.toLowerCase();
	if (element.className && element.className.length > 1) {
		selector = '.' + element.className.replace(/ /g, '.'); //rimuove spazi bianchi nel nome
	}

	return selector;
}

function parseMsg(action) {
	switch (action) {
		case 'selectionOn': return start();
		case 'selectionOff': return finish();
		case 'highlights': return highlights();
		default: console.error('Action not valid', action);
	}
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log('Ricevuto messaggio', request);
	parseMsg(request.data);

	sendResponse({ data: 'ok' });
});
