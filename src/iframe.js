const selectorData = document.getElementById('selector-data');
const saveButton = document.getElementById('save-button');
const cancelButton = document.getElementById('cancel-button');

function onSaveClick() {
    parent.postMessage({ action: 'save', data: selectorData.textContent }, '*');
}

function onCancelClick() {
    parent.postMessage({ action: 'cancel' }, '*');
}

window.addEventListener("message", (event) => {
    selectorData.textContent = event.data;
});

saveButton.onclick = onSaveClick;
cancelButton.onclick = onCancelClick;
