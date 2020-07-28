// Wrapping in a function to not leak/modify variables if the script
// was already inserted before.
(function () {
	if (window.hasRun === true)
		return true;  // Will ultimately be passed back to executeScript
	window.hasRun = true;



	const MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';
	const CRX_HIGHLIGHT_CLASSNAME = 'crx_highlight';
	let currDomElement = null;
	let selectedDomItems = [];
	let selector = null;

	function start() {
		document.body.classList.add('pointer-crosshair');
		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('click', onClick);
	}

	function finish() {
		document.removeEventListener('mousemove', onMouseMove);
		document.removeEventListener('click', onClick);
		document.body.classList.remove('pointer-crosshair');
		currDomElement && currDomElement.classList.remove(MOUSE_VISITED_CLASSNAME);
	}

	function onClick(e) {
		e.preventDefault();
		currDomElement.classList.remove(MOUSE_VISITED_CLASSNAME);
		const res = getSameElements(e.target);
		//console.log(res);

		chrome.runtime.sendMessage({ action: 'save', data: { name: 'test', url: document.URL, selector: selector } }, (data) => {
			console.log('risultato salvataggio', data);
			//const lastError = chrome.runtime.lastError;
			//lastError instanceof Object ? reject(lastError.message) : resolve(data);
			finish();
		});


	}

	function onMouseMove(e) {
		let srcElement = e.srcElement;

		if (!srcElement.isSameNode(currDomElement)) {
			if (currDomElement != null) {
				currDomElement.classList.remove(MOUSE_VISITED_CLASSNAME);
			}

			srcElement.classList.add(MOUSE_VISITED_CLASSNAME);

			currDomElement = srcElement;
		}
	}

	function highlights() {
		selectedDomItems.forEach((item) => {
			item.classList.toggle(CRX_HIGHLIGHT_CLASSNAME);
		});
	}


	function getSameElements(target) {
		selector = getQuerySelector(target);
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
		parseMsg(request.action);

		sendResponse({ data: 'ok' });
	});





	// No return value here, so the return value is "undefined" (without quotes).
})(); // <-- Invoke function. The return value is passed back to executeScript
