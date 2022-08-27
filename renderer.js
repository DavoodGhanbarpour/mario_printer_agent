document.getElementById('submitButton').addEventListener('click', () => {
    let input = {
        'ip' : document.getElementById('ip').value,
        'port' : document.getElementById('port').value,
        'printerName' : document.getElementById('printerName').value,
        'startup' : document.getElementById('startup').checked == true ? "on" : "off",
        'start' : document.getElementById('start').checked == true ? "on" : "off",
    }
    window.electronAPI.setConfig(input)
});

window.electronAPI.getConfig((_event, configs) => {
    console.log(configs)
    document.getElementById('ip').value = configs.ip;
    document.getElementById('port').value = configs.port;
    document.getElementById('printerName').value = configs.printerName;
    
    if( configs.startup == 'on' )
        document.getElementById('startup').checked  = true;  

    if( configs.start == 'on' )
        document.getElementById('start').checked    = true;
});

window.electronAPI.updatePreviewFrame((_event, printPrview) => {
    document.getElementById('printPreview').src    = printPrview;
});