const { remote } = require("electron");
const domify = require("domify");
const defaultCSS = require("defaultcss");
const Hotkeys = require("hotkeys-js");


/**
 * @fileoverview 
 * Portable titlebar js file for creating a windows-titlebar.
 * Import this file into html and create a TitleBar object.
 * Two default styles: bright & dark (default:white)
 * call obj.append(target) for appending the Titlebar to the target (default:body)
 * @param options - set default and set colors in options (set to {} for default and an icon...)
 * @param icon - path to icon for icon on the right (set to null for no icon but a menu)
 * @param menu - set window menu in the title bar in json format (set to null for no menu but a title)
 * @param Title - set window Title in the middle of the titlebar
 */


class TitleBar{
    /**
     * Create Title bar
     * @constructor
     * @param {Object=} options - Titlebar config (Object)
     * @param {Boolean=} options.darkMode - set default to dark (bool) (default=bright)
     * @param {String=} options.backgroundColor - Background of the title bar (String)
     * @param {String=} options.iconColor - color of the button icons (String)
     * @param {String=} options.iconColor_hover - color of the button icons when hovering (String)
     * @param {String=} options.buttonBackground_hover - Background of button when hovering (String)
     * @param {String=} options.closeButtonBackground_hover - Background of the closebutton when hovering (String)
     * @param {String=} options.closeIconColor_hover - color of the close icon when hovering (String)
     * @param {String=} options.titleColor - text-color of the title in the middle
     * 
     * @param {Object=} options.menu - options for window-menu on the left (object)
     * @param {String=} options.menu.textColor - text-color of all buttons in menu (String)
     * @param {String=} options.menu.popupBackgroundColor - background-color of menu popup (String)
     * @param {String=} options.menu.hotkeyColor - text-color of hotkey indicator in popup (String)
     * @param {String=} options.menu.ButtonBackground_hover - Background of Menu-buttons when hovering (String)
     * @param {String=} options.menu.popupButtonBackground_hover - Background of popupButton when hovering (String)
     * @param {String=} options.menu.ButtonBackground_focused - Background of Menu-buttons when focused (String)
     * @param {String=} options.menu.popupLineColor - color of horizontal line in popup (String)
     * 
     * 
     * @param {String=} icon - icon on the left (relative path from html)
     * 
     * @param {Array=} menu - Window-menu on the left in json format (array) 
     * @param {Object=} menu[x] - Menu-button (object)
     * @param {String=} menu[x].text - Menu-button text
     * @param {Object=} menu[x].click - Menu-button click event (function/eventHandler) (when defined, popup won't open) 
     * @param {Array=} menu[x].popup - Menu-button popup (array)
     * @param {Object=} menu[x].popup[x] - Menu-button popup item (object)
     * @param {Boolean=} menu[x].popup[x].line - Menu-button popup line (bool:false) (determent if item is a line or a button)
     * @param {String=} menu[x].popup[x].text - Menu-button popup Button-text (String)
     * @param {String=} menu[x].popup[x].hotkey - Menu-button popup Hotkey (String) (syntax of hotkey-js module)
     * @param {String=} menu[x].popup[x].click - Menu-button popup buttonclick event (function/eventListener)
     * 
     * @param {String=} Title - Title text in the middle (String) (also html as string)
     */
    constructor(options = {}, icon = null, menu = [],Title=null){

        if(options.darkMode === true){

            this.options = {
                backgroundColor: "rgb(51,51,51)",
                iconColor: "rgb(150,150,150)",
                iconColor_hover: "white",
                buttonBackground_hover: "rgba(150,150,150,0.2)",
                closeButtonBackground_hover: "red",
                closeIconColor_hover: "white",
                titleColor:"rgb(150,150,150)",

                menu:{
                    textColor:"rgb(150,150,150)",
                    popupBackgroundColor: "rgb(31,31,31)",
                    hotkeyColor: "rgb(100,100,100)",
                    buttonBackground_hover: "rgba(150,150,150,0.3)",
                    popupButtonBackground_hover: "rgb(0, 78, 122);",
                    ButtonBackground_focused: "rgba(150,150,150,0.3)",
                    popupLineColor: "rgb(150,150,150)",
                }
            }
        }
        else{

            this.options = {
                backgroundColor: "white",
                iconColor: "rgb(100,100,100)",
                iconColor_hover: "black",
                buttonBackground_hover: "rgba(150,150,150,0.4)",
                closeButtonBackground_hover: "red",
                closeIconColor_hover: "white",
                titleColor:"rgb(100,100,100)",

                menu:{
                    textColor:"rgb(100,100,100)",
                    popupBackgroundColor: "white",
                    hotkeyColor: "rgb(150,150,150)",
                    buttonBackground_hover: "rgba(150,150,150,0.4)",
                    popupButtonBackground_hover: "rgba(150,150,150,0.3)",
                    ButtonBackground_focused: "rgba(150,150,150,0.3)",
                    popupLineColor: "rgb(100,100,100)",
                }
            }
        }
        

        this.options.backgroundColor = ( (options.backgroundColor != null) ? options.backgroundColor : this.options.backgroundColor)
        this.options.iconColor = ( (options.iconColor != null) ? options.iconColor : this.options.iconColor)
        this.options.iconColor_hover = ( (options.iconColor_hover != null) ? options.iconColor_hover : this.options.iconColor)
        this.options.buttonBackground_hover = ( (options.buttonBackground_hover != null) ? options.buttonBackground_hover : this.options.buttonBackground_hover)
        this.options.closeButtonBackground_hover = ( (options.closeButtonBackground_hover != null) ? options.closeButtonBackground_hover : this.options.closeButtonBackground_hover)
        this.options.closeIconColor_hover = ( (options.closeIconColor_hover != null) ? options.closeIconColor_hover : this.options.closeIconColor_hover)
        this.options.titleColor = ( (options.titleColor != null) ? options.titleColor : this.options.titleColor)

        if(options.menu!=undefined||options.menu!=null){

        this.options.menu.textColor = ( (options.menu.textColor != null) ? options.menu.textColor : this.options.menu.textColor)
        this.options.menu.popupBackgroundColor = ( (options.menu.popupBackgroundColor != null) ? options.menu.popupBackgroundColor : this.options.menu.popupBackgroundColor)
        this.options.menu.hotkeyColor = ( (options.menu.hotkeyColor != null) ? options.menu.hotkeyColor : this.options.menu.hotkeyColor)
        this.options.menu.ButtonBackground_hover = ( (options.menu.ButtonBackground_hover != null) ? options.menu.ButtonBackground_hover : this.options.menu.ButtonBackground_hover)
        this.options.menu.popupButtonBackground_hover = ( (options.menu.popupButtonBackground_hover != null) ? options.menu.popupButtonBackground_hover : this.options.menu.popupButtonBackground_hover)
        this.options.menu.ButtonBackground_focused = ( (options.menu.ButtonBackground_focused != null) ? options.menu.ButtonBackground_focused : this.options.menu.ButtonBackground_focused)
        this.options.menu.popupLineColor = ( (options.menu.popupLineColor != null) ? options.menu.popupLineColor : this.options.menu.popupLineColor)
        
        }

        if (!Array.isArray(menu)){
            
            menu = [];
        }

        this.menu = menu;

        this.icon = icon;
        
        this.title = ((Title!=null)? Title : "");

        this.titleView = domify(this.makeHTML(),document);

        this.fullscreen = false;

        
        
        

    }
    
    append(target=document.body){

        target.appendChild(this.titleView);

        if(this.menu!=null||this.menu!={}){
            target.querySelector("#TitleBar-left").appendChild(domify(this.createMenuHTML(this.menu),document));
            this.setHotkeys(this.menu);
        }

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

        if (this.icon != null){
            document.getElementById("TitleBar-icon").src = this.icon;
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
        /*button and titlebar style*/

        #TitleBar{
            background-color: ${this.options.backgroundColor};
            width: 100%;
            height:30px;
            display:flex;
            flex-direction:row;

            font:400 13.333px Arial;
            -webkit-app-region:drag;
            
            min-width:138px;
            
        }
        
        #TitleBar-right{
            flex: 1 0 auto;
            
            display: flex;
            flex-direction: row;

            justify-content:flex-end;
        }

        #TitleBar-right button{
            -webkit-app-region:no-drag;
        }

        #TitleBar-middle{
            margin:0;
            line-height:30px;
            color:${this.options.titleColor};
            flex: 1 1 auto;

            min-width:0; 

            overflow:hidden;

            text-align:center;
           
        }
        
        #TitleBar-left{
            
            height:30px;
            display:flex;
            flex-direction:row;

            min-width:0; 
            overflow:hidden;

            flex: 1 1 auto;
        }

        #TitleBar-left button{
            -webkit-app-region: no-drag;
        }
        
        #TitleBar-icon{
            -webkit-app-region:drag;
            margin:3px;
            height:24px;
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

        /*menu style*/
        

        ul{
            list-style: none;
            padding:0;
          }
          
          #TitleBar-Menu{
              display:flex;
              flex-direction: row;
              padding:0;
              margin:0;
              
          }
          
          .TitleBar-MenuPopup{
              position:absolute;
              background-color:${this.options.menu.popupBackgroundColor};
              visibility:hidden;
             
          }
          
          .TitleBar-MenuPopup{
              padding: 5px 0;
              box-shadow: -2px 2px 3px rgba(10,10,10,0.6) , 0 3px 3px  rgba(10,10,10,6.4)  , 2px 2px 3px  rgba(10,10,10,0.6);
          }
          
          .TitleBar-MenuPopupButton{
              color:${this.options.menu.textColor};
              text-align: left;
              
              width:100%;
              padding:6px 20px;
              background:none;
              border:none;
          
              
          }
          .TitleBar-MenuPopupButton:hover{
              background-color:${this.options.menu.popupButtonBackground_hover};
          }
          
          
          .TitleBar-MenuButton{
              color:${this.options.menu.textColor};
              background:none;
              border: none;
              height:30px;
              padding:0 7px;
          }

          .TitleBar-MenuButton:hover{
            background-color:${this.options.menu.buttonBackground_hover};
          }

          .TitleBar-MenuButtonActive{
            color:${this.options.menu.textColor};
            background:${this.options.menu.ButtonBackground_focused};
            border: none;
            height:30px;
            padding:0 7px;
          }
          
          .TitleBar-MenuPopupKeyshortcut{
              display:inline;
              color:${this.options.menu.hotkeyColor};
            float:right;
            margin-left:20px;
          }

          
          
          .TitleBar-MenuPopupLine{
              Margin:2px 10px;
              border-bottom:${this.options.menu.popupLineColor} 1px solid;
          }
          
          
        `
        return css;

    }

    makeHTML(){
        console.log(this.title);
        let html = `
        <div id="TitleBar">

            <img src=""id="TitleBar-icon"></img>
            <div id="TitleBar-left" >
                
            </div>

            <div id="TitleBar-middle">
                ${this.title}
            </div>

            <div id="TitleBar-right">
                <Button id="TitleBar-HideButton" class="TitleBar-Button">

                    <svg height="27" width=46 id="TitleBar-HideIcon">
                        <line class="TitleBar-ButtonIcon"  y1="15" y2="15" x1="18" x2="28">
                    </svg>

                </Button>

                <Button id="TitleBar-MaxMinimizeButton" class="TitleBar-Button">

                    <svg height="27" width=46 id="TitleBar-MaximizeIcon">
                        <rect class="TitleBar-ButtonIcon" y="10" x="19" width="10" height="10">
                    </svg>

                    <svg height="27" width=46 id="TitleBar-MinimizeIcon" >
                            <path d="M 20,20 L 20,12 L 28,12 L 28,20 Z" class="TitleBar-ButtonIcon" />
                            <path d="M 22,12 L 21,10 L 30,10 L 30,18 L 28,18" class="TitleBar-ButtonIcon" />
                    </svg>

                </Button>

                <button id="TitleBar-CloseButton" class="TitleBar-Button">

                    <svg height="27" width=46 id="TitleBar-CloseIcon">
                            <path d="M 18,20 L 28,10" class="TitleBar-ButtonIcon" />
                            <path d="M 18,10 L 28,20" class="TitleBar-ButtonIcon" />
                    </svg>

                </button>
            </div>
        </div>
        `
        return html;
    }

    setHotkeys(menu){
        if(menu!=null){
            for(let item of menu){
    
                if(item !=null & item.popup != null){
        
                    
                    for(let button of item.popup){
                        if(button.hotkey != null & button.hotkey!="" & button.click !=null){
        
                            let hotkey = button.hotkey;
                            hotkey.trim();
                            hotkey.toLowerCase();
        
                            Hotkeys(hotkey,function(event,handler){
                                event.preventDefault();
                                button.click();
                            });
                        }
                    }       
                }
            }
        }
        
    }

    createMenuHTML(menu){
        if(menu!=null){
            
            let clicks = [];
    
            let html = "";
        
            html += `<ul id="TitleBar-Menu">\n`;
        
            let i1 = 0;
            let i2 = 0;
        
            for (let item of menu){
                i2 = 0;
                html += `<li class="TitleBar-MenuItem">\n`;
        
                if(item.click!=null){
                    html += `<Button class="TitleBar-MenuButton" onclick="menuButton_events(this,${i1})">${item.text}</Button>\n`
                }
                else{
                    if(item.popup!=[] || item.popup!=null){
                        html += `<Button class="TitleBar-MenuButton" onclick="menuButton_click(this,${i1})" onmouseover="menuButton_mouseover(this,${i1})">${item.text}</Button> 
                            <div class="TitleBar-MenuPopup">
                            <ul>\n`
                        
                        for (let button of item.popup){
                            html += `<li>\n`;
                                if(!button.line){
                                    if(button.hotkey!=null&button.hotkey!=undefined&button.hotkey!=""){
                                        html +=  `<button class="TitleBar-MenuPopupButton" onclick="popupButton_events(this,${i1},${i2})"> ${button.text} <div class="TitleBar-MenuPopupKeyshortcut">${button.hotkey}</div> </button>\n`;
                                    }
                                    else{
                                        html +=  `<button class="TitleBar-MenuPopupButton" onclick="popupButton_events(this,${i1},${i2})"> ${button.text}</button>\n`;
                                    }
                                    
                                }
                                else{
                                    html +=  `<div class="TitleBar-MenuPopupLine"></div>\n`;
                                }
        
                            html += `</li>\n`;
                            i2++;
                        }
                        html+= `</ul>\n`
                    }
                }
        
                html += `</li>\n`;
                i1++;
            }
        
            html += `</ul>\n`;
        
            return html;
        }

        return "";
        
    
    }

}


//logic for menu
let openedMenuItem;
let openedIndex = - 1;

let opened = false;

document.addEventListener("click",function(ev){

    if(!opened){

        if(openedMenuItem!=null){

            let rect = openedMenuItem.getBoundingClientRect();

            if(!(rect.left < ev.clientX & ev.clientX < rect.right & rect.top < ev.clientY & ev.clientY < rect.bottom)){
            
                openedIndex = -1;
                openedMenuItem = null;

                let items = document.getElementsByClassName("TitleBar-MenuPopup")
                for (let item of items){
                    item.style.visibility = "hidden";
                    removeButtonFocus(item.parentNode.querySelector(".TitleBar-MenuButtonActive"));
                }
            }
        }   
    }
    opened = false;
    
    

});

function menuButton_click(sender,index){

    if(openedIndex == -1){

        opened = true;
        let popup = sender.parentNode.querySelector(".TitleBar-MenuPopup");
        popup.style.visibility = "visible";
        openedMenuItem = popup;
        openedIndex = index;
        setButtonFocus(sender)
    }

}

function menuButton_mouseover(sender,index){
    if(openedIndex!=index & openedIndex!=-1){

        openedMenuItem.style.visibility = "hidden";
        removeButtonFocus(openedMenuItem.parentNode.querySelector(".TitleBar-MenuButtonActive"));
        openedIndex = index;

        let popup = sender.parentNode.querySelector(".TitleBar-MenuPopup");
        popup.style.visibility = "visible";
        openedMenuItem = popup;
        setButtonFocus(sender);
        
    }
}

function setButtonFocus(button){
    if(button!=null){
        console.log("addFocus:",button);
        button.classList.remove("TitleBar-MenuButton");
        button.classList.add("TitleBar-MenuButtonActive");
    }
    
}
function removeButtonFocus(button){
    if(button!=null)
    {
        console.log("removeFocus:",button);
        button.classList.remove("TitleBar-MenuButtonActive");
        button.classList.add("TitleBar-MenuButton");
    }
}

function menuButton_events(sender,index){
    menu[index].click();
}

function popupButton_events(sender,i1,i2){
    menu[i1].popup[i2].click();
}