const { remote } = require("electron");
const domify = require("domify");
const defaultCSS = require("defaultcss");
const fs = require("fs");
const path = require("path");


/**
 * portable titlebar class for creating a windows-titlebar per options
 * 
 */
class TitleBar{
    /**
     * Create Title bar
     * @constructor
     * @param {Object=} options : Titlebar config (Object)
     * @param {Boolean=} options.darkMode : set default to dark(default:bright)
     * @param {String=} options.backgroundColor : Background of the title bar (String="white")
     * @param {String=} options.iconColor : color of the button icons (String="rgb(150,150,150)")
     * @param {String=} options.iconColor_hover : color of the button icons when hovering (String="black")
     * @param {String=} options.buttonBackground_hover : Background of button when hovering (String="rgba(150,150,150,0.2)")
     * @param {String=} options.closeButtonBackground_hover : Background of the closebutton when hovering (String="red")
     * @param {String=} options.closeIconColor_hover : color of the close icon when hovering (String="white")
     * 
     * @param {String=} icon : absolute Pah of the icon on the left
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

        if(options.darkMode === true){

            this.options = {
                backgroundColor: "rgb(51,51,51)",
                iconColor: "rgb(150,150,150)",
                iconColor_hover: "white",
                buttonBackground_hover: "rgba(150,150,150,0.2)",
                closeButtonBackground_hover: "red",
                closeIconColor_hover: "white"
            }
        }
        else{

            this.options = {
                backgroundColor: "white",
                iconColor: "rgb(100,100,100)",
                iconColor_hover: "black",
                buttonBackground_hover: "rgba(150,150,150,0.2)",
                closeButtonBackground_hover: "red",
                closeIconColor_hover: "white"
            }
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

        
        this.titleView = domify(this.makeHTML(),document);

        this.fullscreen = false;

        
    }
    
    append(target=document.body){

        target.appendChild(this.titleView);

        this.handleEvents();

        defaultCSS("TitleBar",this.makeCSS());

        if(window.outerWidth == screen.availWidth & window.outerHeight == screen.availHeight){

            this.fullscreen = true;
            document.getElementById("TitleBar-MinimizeIcon").style.display = "initial";
            document.getElementById("TitleBar-MaximizeIcon").style.display = "none";
        }
        else{
            
            this.fullscreen = false;
            document.getElementById("TitleBar-MinimizeIcon").style.display = "none";
            document.getElementById("TitleBar-MaximizeIcon").style.display = "initial";
            
        }
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
                setMaxIcon();

            }
            else{
                win.maximize();
                this.fullscreen = true;
                setMinIcon();
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
                setMinIcon();
            }
            else{
                if(this.fullscreen == true){
                    this.fullscreen = false;
                    setMaxIcon();
                }
                
            }
        
        });

        function setMaxIcon(){
           
            document.getElementById("TitleBar-MinimizeIcon").style.display = "none";
            document.getElementById("TitleBar-MaximizeIcon").style.display = "initial";
        }

        function setMinIcon(){
            document.getElementById("TitleBar-MinimizeIcon").style.display = "initial";
            document.getElementById("TitleBar-MaximizeIcon").style.display = "none";
        }


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

    makeHTML(){
        let html = `
        <div id="TitleBar">

            <div id="TitleBar-left">
                <img src="" id="TitleBar-icon"></img>
            </div>

            <div id="TitleBar-right">

                <Button id="TitleBar-HideButton" class="TitleBar-Button">

                    <svg height="28" width=46 id="TitleBar-HideIcon">
                        <line class="TitleBar-ButtonIcon"  y1="15" y2="15" x1="18" x2="28">
                    </svg>

                </Button>

                <Button id="TitleBar-MaxMinimizeButton" class="TitleBar-Button">

                    <svg height="28" width=46 id="TitleBar-MaximizeIcon">
                        <rect class="TitleBar-ButtonIcon" y="10" x="19" width="10" height="10">
                    </svg>

                    <svg height="28" width=46 id="TitleBar-MinimizeIcon" >
                            <path d="M 20,20 L 20,12 L 28,12 L 28,20 Z" class="TitleBar-ButtonIcon" />
                            <path d="M 22,12 L 21,10 L 30,10 L 30,18 L 28,18" class="TitleBar-ButtonIcon" />
                    </svg>

                </Button>

                <button id="TitleBar-CloseButton" class="TitleBar-Button">

                    <svg height="28" width=46 id="TitleBar-CloseIcon">
                            <path d="M 18,20 L 28,10" class="TitleBar-ButtonIcon" />
                            <path d="M 18,10 L 28,20" class="TitleBar-ButtonIcon" />
                    </svg>

                </button>

            </div>

        </div>
        `
        return html;
    }

}


module.exports = TitleBar