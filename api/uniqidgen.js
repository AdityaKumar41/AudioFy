let getCall = document.getElementById('getCall');
let clickBtn = document.getElementById('generateBtn');
let copyBtn = document.getElementById('copyBtn');

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

clickBtn.addEventListener('click', () => {
    let generatedUUID = generateUUID();
    getCall.innerText = generatedUUID;
    getCall.style.display = 'block';
    copyBtn.style.display = 'block'; 
});

copyBtn.addEventListener('click', () => {
    var tempTextArea = document.createElement('textarea');
    tempTextArea.value = getCall.innerText;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextArea);
    alert("Copied to clipboard!");
});