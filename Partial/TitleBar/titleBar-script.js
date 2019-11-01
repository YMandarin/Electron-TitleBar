const { remote } = require("electron");
const domify = require("domify");
const defaultCSS = require("defaultcss");
const fs = require("fs");
const path = require("path");

class TitleBar{
    /**
     * Create Title bar
     * @param {Object=} options : Titlebar config (Object)
     * @param {String=} options.backgroundColor : Background of the title bar (String="white")
     * @param {String=} options.iconColor : color of the button icons (String="rgb(150,150,150)")
     * @param {String=} options.iconColor_hover : color of the button icons when hovering (String="black")
     * @param {String=} options.buttonBackground_hover : Background of button when hovering (String="rgba(150,150,150,0.2)")
     * @param {String=} options.closeButtonBackground_hover : Background of the closebutton when hovering (String="red")
     * @param {String=} options.closeIconColor_hover : color of the close icon when hovering (String="white")
     * 
     * @param {String=} icon : path from __dirname of the icon on the left
     * 
     * @param {Array=} menu : Window-menu on the left in json format (array) 
     * @param {Object=} menu[x] : Menu-button (object)
     * @param {String=} menu[x].text : Menu-button (text)
     * @param {Object=} menu[x].click : Menu-button click event (function/eventHandler) (when defined, popup won't open) 
     * @param {Array=} menu[x].popup : Menu-button popup (array)
     * @param {Object=} menu[x].popup[x] : Menu-button popup item (object)
     * @param {Boolean=} menu[x].popup[x].line : Menu-button popup line (bool=false) (determent if item is a line or a button)
     * @param {String=} menu[x].popup[x].text : Menu-button popup Button-text (text) 
     * @param {string=} menu[x].popup[x].key : Menu-button popup Keyshortcut (text)
     */
    constructor(options = {}, icon = null, menu = []){

        this.options = {
            backgroundColor: "white",
            iconColor: "rgb(100,100,100)",
            iconColor_hover: "black",
            buttonBackground_hover: "rgba(150,150,150,0.2)",
            closeButtonBackground_hover: "red",
            closeIconColor_hover: "white"
        }

        this.options.backgroundColor = ( (options.backgroundColor != null) ? options.backgroundColor : this.options.backgroundColor)
        this.options.iconColor = ( (options.iconColor != null) ? options.iconColor : this.options.iconColor)
        this.options.iconColor_hover = ( (options.iconColor_hover != null) ? options.iconColor_hover : this.options.iconColor)
        this.options.buttonBackground_hover = ( (options.buttonBackground_hover != null) ? options.buttonBackground_hover : this.options.buttonBackground_hover)
        this.options.closeButtonBackground_hover = ( (options.closeButtonBackground_hover != null) ? options.closeButtonBackground_hover : this.options.closeButtonBackground_hover)
        this.options.closeIconColor_hover = ( (options.closeIconColor_hover != null) ? options.closeIconColor_hover : this.options.closeIconColor_hover)
    
        this.menu = menu;

        if (icon != null){
            document.getElementById("TitleBar-icon").src = icon;
        }

        let titleText = fs.readFileSync(path.join(__dirname,"..","Partial","TitleBar","titlebar.html"),"utf-8");
        this.titleView = domify(titleText,document);

        this.fullscreen = false;
    }
    
    appendTo(target=document.body){

        target.appendChild(this.titleView);

        this.handleEvents();

        defaultCSS("TitleBar",this.makeCSS());
    }

    handleEvents(){

        

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
            if(this.fullscreen){
                win.unmaximize();
                this.fullscreen = false;

            }
            else{
                win.maximize();
                this.fullscreen = true;
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
                this.fullscreen = true;
            }
            else{
                this.fullscreen = false;
            }
        
        });


    }

    makeCSS(){

        let css = `
        #TitleBar{
            background-color: ${this.options.backgroundColor};
            width: 100%;
        
        }
        
        #TitleBar-right{
            float: right;
            margin-left: auto;
            -webkit-app-region:no-drag;
            display: flex;
            flex-direction: row;
        }
        
        .TitleBar-left{
            -webkit-app-region: no-drag;
        }
        
        .TitleBar-ButtonIcon{
            stroke:${this.options.iconColor};
            stroke-width: 1;
            fill:none;
            shape-rendering: crispEdges;
        }
        
        .TitleBar-Button{
            margin: 0;
            padding: 0;
            background-color: inherit;
            border: none;
        }
        
        .TitleBar-Button:hover{
            background-color: ${this.options.buttonBackground_hover};
        }
        
        .TitleBar-Button:hover .TitleBar-ButtonIcon{
            stroke:${this.options.iconColor_hover};
        }
        
        #TitleBar-CloseButton:hover{
            background-color: ${this.options.closeButtonBackground_hover};
        }

        #TitleBar-CloseButton:hover .TitleBar-ButtonIcon{
            stroke:${this.options.closeIconColor_hover};
        }
        `
        return css;

    }


}


