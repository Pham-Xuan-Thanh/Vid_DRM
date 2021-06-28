console.log('Index.js');

const electron = require('electron');
const app = electron.app;
const BrsWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url')
 
let win;

function CreateWindow() {
    win = new BrsWindow;
    win.loadURL(url.format({
        pathname : path.join(__dirname,'dash_demo.html'),
        protocol : 'file',
        slashes : true
    }));

    win.webContents.openDevTools();
    
    win.on('closed',() => {
        win = null;
    });
}

app.on('ready',CreateWindow);

app.on('window-all-closed',() => {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if ( win == null ){
        CreateWindow();
    }
});

