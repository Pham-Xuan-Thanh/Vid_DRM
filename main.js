

const electron = require('electron');
const app = electron.app;
const BrsWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url')
const jsdom = require('jsdom');
const { ipcMain } = require('electron');
const extract = require('extract-zip');
const decompress = require('decompress');
const fs = require('fs');
const { JSDOM } = jsdom;
global.document = new JSDOM(`...`).window.document;

 
const find = require('find');
const diaglog = electron.dialog;


let win,player;
var _urlSV = "https://demo.edge247.xyz/api/v1/drm/key";

function CreateWindow() {
    win = new BrsWindow({width : 900 ,
        height : 600,
        webPreferences :{
            enableRemoteModule : true,
            nodeIntegration : true,
            contextIsolation : false
        }});
    win.loadURL(url.format({
        pathname : path.join(__dirname,'./src/listDevice/devices.html'),
        protocol : 'file',
        slashes : true
    }));

    win.webContents.openDevTools();
    
    win.on('closed',() => {
        win = null;
    });
}

app.on('ready',CreateWindow);

ipcMain.on('load:listdev',function(event){
    win.loadURL(url.format({
        pathname : path.join(__dirname,'./src/listDevice/devices.html'),
        protocol : 'file',
        slashes : true
    }));
});

ipcMain.on('load:record',function(event){
    win.loadURL(url.format({
        pathname : path.join(__dirname,'./src/recordplay/record.html'),
        protocol : 'file',
        slashes : true
    }));
});

ipcMain.on('load:livecam',function(event){
    win.loadURL(url.format({
        pathname : path.join(__dirname,'./src/liveCam/liveCam.html'),
        protocol : 'file',
        slashes : true
    }));
});

ipcMain.on('file:submit', function (event, arg, urlSV) {
    if(urlSV == null){
        urlSV = _urlSV;
    }
    fs.rmdirSync('./dist',{ recursive: true });
        console.log("File is deleted.");
    try {
        decompress(arg, 'dist').then(files => {

            player = new BrsWindow({parent : win , modal : true,width : 900 ,  height : 600, webPreferences :{
                enableRemoteModule : true,
                nodeIntegration : true,
                contextIsolation : false
            }});
            player.loadURL(url.format({
                pathname : path.join(__dirname,'./src/recordplay/play.html'),
                protocol : 'file',
                slashes : true
            }));
        });


    } catch (err) {
        dialog.showErrorBox('Extraction failed!!!', 'File cant to extract');
    }
})

ipcMain.on('video_load', function(event){
    event.sender.send('receive_url', _urlSV);
});

ipcMain.on('link:submit',(event,link) => {
    player = new BrsWindow({parent : win ,width : 900 ,  height : 600, webPreferences :{
        enableRemoteModule : true,
        nodeIntegration : true,
        contextIsolation : false
    }});
    player.loadURL(url.format({
        pathname : path.join(__dirname,'./src/liveCam/live.html'),
        // pathname : path.join(__dirname,'./index.html'),
        protocol : 'file',
        slashes : true
    }));
    
   player.webContents.on('did-finish-load',()=>{
    player.webContents.send('play:live',link);
   });
    
});

ipcMain.on('log',(event,log) => {
    console.log(log);
})

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

