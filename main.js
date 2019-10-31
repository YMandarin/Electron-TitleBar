const {app,BrowserWindow} = require("electron");
const path = require("path");
const url = require("url");

let win;
let onMac = false;

class Window extends BrowserWindow{

    constructor(parameter,urlFromDir = null){

        super(parameter);

        if (urlFromDir !== null){
            this.loadURL(urlFromDir);
        }

        this.on("close",()=>{
            dispose(this);
        });
    }

    loadURL(urlFromDir){
        super.loadURL(url.format({
            pathname: path.join(__dirname,urlFromDir),
            protocol:"file",
            slashes: true
        }));
    }

    openDevTools(){
        this.webContents.openDevTools();
    }
}

function dispose(obj){
    obj = null;
}

function init(){

    if(process.platform == "darwin"){
        onMac = true;
    }

    win = new Window({width:1200,height:720},"Pages/index.html");

    win.openDevTools();
    
}


// app events
app.on("ready",init);

app.on("window-all-closed",()=>{
    app.quit();
});

