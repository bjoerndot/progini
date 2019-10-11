/*!
 * oliverschwamb v0.0.1
 * Oliver Schwamb - UX-Designer
 * (c) 2019 OLIVER SCHWAMB
 * MIT License
 * http://link-to-your-git-repo.com
 */

'use strict';

console.log("I'M here")

// line-height as mm
var currentLineHeight = 15

function getPage(){
    return document.getElementsByClassName("liner_canvas")[0]
};

function setPageHeight(){
    var pageElement = getPage();
    var pageWidth = pageElement.clientWidth
    // DIN A4 is pageWidth * squrt(2)
    var pageHeight = pageWidth * Math.sqrt(2)
    pageElement.style.height = `${pageHeight}px`
}

function calculateLineHeight(pageHeight, lineHeightValue){
    return pageHeight * (lineHeightValue/297)
}

function getNumLines(pageHeight, lineHeight){
    return Math.floor(pageHeight / (lineHeight+lineHeight/2))
}

function getLineValues(pageElement, lineHeightValue){
    var pageHeight = pageElement.clientHeight;
    var lineHeight = calculateLineHeight(pageHeight, lineHeightValue)
    var numLines = getNumLines(pageHeight, lineHeight);
    return {lineHeight, numLines}
}

function setSizeMarker(){
    console.log(currentLineHeight)
    var sizeMarker = document.getElementsByClassName("settings_label")[0];
    sizeMarker.innerHTML = sizeMarker.innerHTML.replace(/\d{2}/, currentLineHeight)
};

function renderLines(numLines, lineHeight, pageElement){
    pageElement.innerHTML = "";
    setSizeMarker();
    var i;
    for(i = 0; i<numLines; i++){
        // create divider-element to easier see the lines
        var divider = document.createElement("div")
        divider.classList.add("liner_divider")
        divider.style.height = `${lineHeight/2}px`
        // create line
        var line = document.createElement("div")
        line.classList.add("liner_line")
        line.style.height = `${lineHeight}px`
        pageElement.appendChild(divider);
        pageElement.appendChild(line);
    }
}

function setLineHeigt(){
    //base line-height = 15mm, line-margin: line-height/2
    //297mm  --> ratio = 15mm/297mm
    var pageElement = getPage();
    var {lineHeight, numLines} = getLineValues(pageElement, currentLineHeight)
    renderLines(numLines, lineHeight, pageElement)

};

function initializingSizes(){
    setPageHeight();
    setLineHeigt();
}

function changeLineHeight(){
    var pageElement = getPage();
    const {lineHeight, numLines} = getLineValues(pageElement, currentLineHeight)
    renderLines(numLines, lineHeight, pageElement)
};

function handleLineClick(e){
    var direction = e.target.dataset.dir
    if(direction === "+"){
        currentLineHeight++;
        changeLineHeight();   
    } else {
        currentLineHeight--;  
        changeLineHeight();  
    }
}

var buttons = document.querySelectorAll('[data-module]');
var actions = []
console.log(buttons)
buttons.forEach((button) => {
    button.addEventListener("click", handleLineClick)
});

window.addEventListener("load", initializingSizes)