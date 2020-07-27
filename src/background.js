'use strict';

import { sleep, storageGet, storageSet, createTab, hash } from './util';

function parseMsg(action, data = null) {
    switch (action) {
        case 'feed': return openFeedTab();
        case 'save': return saveFeed(data);
        default: console.error('Action not valid', action);
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

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    console.log('Messaggio ricevuto in back', request);
    if (request.action) {
        const result = await parseMsg(request.action, request.data)
        sendResponse({ data: result });
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
