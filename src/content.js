const MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';
const contentScriptIsLoaded = true;
let prevDOM = null;


function onClick(e) {
    e.preventDefault();
    prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);
    const res = getSameElements(e.target);
    console.log(res);
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

function mousePointActive() {
    document.body.classList.add('pointer-crosshair');
}

function getSameElements(target) {
    const selector = getQuerySelector(target);
    console.log('selector', selector);


    const DOMitems = document.querySelectorAll(selector);
    const textItems = Array.prototype.map.call(DOMitems, function (t) { return t.textContent; });
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
    if (element.className) {
        selector = '.' + element.className.replace(/ /g, '.'); //rimuove spazi bianchi nel nome
    }

    return selector;
}



chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('Ricevuto messaggio', request);
    if (request.data === 'enable') {
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('click', onClick);
    } else {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('click', onClick);
    }

    sendResponse({ data: 'ok' });
});
