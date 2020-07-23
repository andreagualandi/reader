'use strict';

import { sleep } from './util';


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    sendResponse({ data: 'ok' });
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
