const {app,BrowserWindow} = require("electron");
const path = require("path");
const url = require("url");

let win;
let onMac = false;

//create first Window
function createWindow(){
    if(process.platform === "darwin"){
        onMac = true;
    }

    win = new BrowserWindow({width:1200,height:720});

    win.loadURL(url.format({
        pathname: path.join(__dirname,"pages/index.html"),
        protocol: "file",
        slashes: true
    }));

    win.on("closed", ()=>{
        win = null;
    });

    openDevTools();

}

//open devTools of Chromium
function openDevTools(){
    win.webContents.openDevTools();
}

app.on("ready",createWindow);

app.on("window-all-closed",()=>{
    if (onMac){
        app.quit();
    }
});
