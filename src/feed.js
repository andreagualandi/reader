'use strict';

import { storageGet } from './util';

async function getItem(key) {
    const data = await storageGet(key);
    return data[key];
}

function createElement(text) {
    const p = document.createElement("P");
    p.innerHTML = text;
    document.getElementById("content").appendChild(p);
}


async function onOpen() {
    chrome.storage.sync.get(console.log)
    const data = await getItem('3556498');

    createElement(data.selector);
}

window.onload = onOpen;