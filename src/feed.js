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

function clearList() {
    const content = document.getElementById("content");

    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }
}

function removeLoader() {
    document.getElementById('loader').classList.add('hide');
}

function addLoader() {
    document.getElementById('loader').classList.remove('hide');
}

function setupRefresh() {
    const interval = 2 * 60 * 1000
    setInterval(main, interval);
}

async function main() {
    addLoader();
    clearList();

    document.getElementById('')
    const data = await getItem('3556498');
    await getData(data.url, data.selector);

    removeLoader();
}

async function onOpen() {
    await main();
    chrome.storage.sync.get(console.log)
    setupRefresh();
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