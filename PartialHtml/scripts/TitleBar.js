const { remote } = require("electron");

let fullscreen = false;

window.onload = function(){

    const win =  remote.getCurrentWindow();

    //get Titlebar buttons
    const hideButton = document.getElementById("TitleBar-HideButton");
    const maxMinButton = document.getElementById("TitleBar-MaxMinimizeButton");
    const closeButton = document.getElementById("TitleBar-CloseButton");

    //hide event
    hideButton.addEventListener("click",()=>{
        win.minimize();
    });
    
    //resize button event
    maxMinButton.addEventListener("click",()=>{
        if(fullscreen){
            win.unmaximize();
            fullscreen = false;
        }
        else{
            win.maximize();
            fullscreen = true;
        }
    });
    
    //close event
    closeButton.addEventListener("click",()=>{
        win.close();
    });
        
    //check if window is in fullscreen
    window.addEventListener("resize",(event)=>{
        var scr = event.target.screen;

        if(window.outerWidth == scr.availWidth & window.outerHeight == scr.availHeight){
            fullscreen = true;
        }
        else{
            fullscreen = false;
        }
    
    });

}

