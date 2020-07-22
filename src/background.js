// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
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


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
} */