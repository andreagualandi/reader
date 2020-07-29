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

function removeLoader() {
    document.getElementById('loader').classList.add('hide');
}


async function onOpen() {
    chrome.storage.sync.get(console.log)
    const data = await getItem('3556498');
    await getData(data.url, data.selector);
    removeLoader();
}

async function getData(url, selector) {
    let response = null;
    try {
        response = await fetch(url);
    } catch (error) {
        console.error('Error downloading data', error);
        return;
    }

    const html = await response.text();
    const parser = new DOMParser();

    // Parse the text
    const doc = parser.parseFromString(html, "text/html");
    const items = doc.querySelectorAll(selector);
    const res = Array.prototype.map.call(items, function (t) {
        console.log(t.textContent);
        createElement(t.textContent);
        //return t.textContent; 
    });

    //console.log(res);
}

window.onload = onOpen;