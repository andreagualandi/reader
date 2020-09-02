class Iframe {
    constructor() {
        this.saveButton = document.getElementById('save-button').onclick = this.onSaveClick;
        this.initHandlers();
    }

    onSaveClick() {
        console.log('Iframe - Cliccato');
        parent.postMessage('Save cliccato', '*');
    }

    initHandlers() {

    }

}

window.addEventListener("message", function (event) {
    /* if (event.origin != 'http://javascript.info') {
        // something from an unknown domain, let's ignore it
        return;
    } */

    alert("received: " + event.data);

    // can message back using event.source.postMessage(...)
});

window.addEventListener('DOMContentLoaded', new Iframe());

