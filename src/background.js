'use strict';

import { sleep, storageGet, storageSet, createTab, hash } from './util';

async function parseMsg(action, data = null) {
    switch (action) {
        case 'start': return openFeedTab();
        case 'save': return saveFeed(data);
        default: Promise.resolve('Action not valid');
    }
}

function openFeedTab() {
    return createTab('feed.html');
}

async function saveFeed(data) {
    const id = hash(data.name);
    console.log('id', id);
    await storageSet(id, data);
    return id;
}

// ATTENCTION: Using async as a listener function doesn't work
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Messaggio ricevuto in back', request);
    if (request.action) {
        parseMsg(request.action, request.data).then(sendResponse);
        return true;
    }
});


/* chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    if (request.receiver === 'back') {
        sendResponse({ data: 'ok' });
        return true;
        fetch('https://www.oasport.it/2020/07/live-f1-gp-ungheria-2020-in-diretta-ferrari-prima-vettel-incanta-sotto-la-pioggia/').then(r => r.text()).then(html => {
            //console.log(result);

            const parser = new DOMParser();

            // Parse the text
            const doc = parser.parseFromString(html, "text/html");
            const items = doc.querySelectorAll('p:nth-of-type(n+4)');//'p:nth-of-type(n+4)'
            const res = Array.prototype.map.call(items, function (t) { return t.textContent; });
            console.log(res);

            sendResponse({ data: "ricevuto" });
        })
        return true;
    }
});


 */
