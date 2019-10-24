/*!
 * oliverschwamb v0.0.1
 * Oliver Schwamb - UX-Designer
 * (c) 2019 OLIVER SCHWAMB
 * MIT License
 * http://link-to-your-git-repo.com
 */

/*jshint esversion: 6 */
'use strict';

// line-height as mm
let currentLineHeight = 15;
// upper length as percentage
let currentUpperLength = 40;
// line distance as mm
let currentLineDistance = 15/2;
// all values in an array for easy iterating
let markers = [currentLineHeight, currentUpperLength, currentLineDistance];

function getPage(){
    return document.getElementsByClassName("liner_canvas")[0];
}

function setPageHeight(){
    // calculate the pageHeight based on the DIN-Format and set it in client
    // DIN A is pageWidth * squrt(2)
    let pageElement = getPage();
    let pageHeight = pageElement.clientWidth * Math.sqrt(2);
    pageElement.style.height = `${pageHeight}px`;
}

function mmToPixels(pageHeight, value){
    // returns the pixels of the page * the percentage of the value on a DIN A 4 sheet
    return pageHeight * (value/297);
}

function getNumLines(pageHeight, lineHeight, lineDistance){
    // give the height of the page only a certain amount of lines + distances fit onto the page
    return Math.floor(pageHeight / (lineHeight + lineDistance));
}

function getLineValues(pageElement, lineHeightValue, lineDistanceValue){
    let pageHeight = pageElement.clientHeight;
    // calculating line height in pixels based on given ratios
    let lineHeight = mmToPixels(pageHeight, lineHeightValue);
    // calculating line distance in pixels based on given ratios
    let lineDistance = mmToPixels(pageHeight, lineDistanceValue);
    let numLines = getNumLines(pageHeight, lineHeight, lineDistance);
    return {lineHeight, lineDistance, numLines};
}

function setSizeMarker(){
    let labels = document.getElementsByClassName("settings_label");
    for(let idx = 0; idx < labels.length; idx++){
        labels[idx].innerHTML = labels[idx].innerHTML.replace(/\d{1,2}\.?\d{0,1}/, markers[idx]);
    }
}

function renderLines(numLines, lineHeight, lineDistance, pageElement){
    pageElement.innerHTML = "";
    setSizeMarker();
    let i;
    for(i = 0; i<numLines; i++){
        // create divider-element to easier see the lines
        const divider = document.createElement("div");
        divider.classList.add("liner_divider");
        divider.style.height = `${lineDistance}px`;
        // create line
        const line = document.createElement("div");
        line.classList.add("liner_line");
        line.style.height = `${lineHeight}px`;
        const line_middle = document.createElement("div");
        line_middle.classList.add("liner_line--middle");
        line_middle.style.height = `${currentUpperLength}%`;
        pageElement.appendChild(divider);
        pageElement.appendChild(line);
        line.appendChild(line_middle);
    }
}

function setLineValues(){
    //base line-height = 15mm, line-margin: line-height/2
    //297mm  --> ratio = 15mm/297mm
    const pageElement = getPage();
    const {lineHeight, lineDistance, numLines} = getLineValues(pageElement, currentLineHeight, currentLineDistance);
    renderLines(numLines, lineHeight, lineDistance, pageElement);
}

function initializingSizes(){
    // page must be set as the width of the page is relational to the width of the client
    setPageHeight();
    setLineValues();
}


function updateSizes(sizes){

    currentLineHeight = sizes.lineHeight;
    currentUpperLength = sizes.upperLength;
    currentLineDistance = sizes.lineDistance;
    markers = [currentLineHeight, currentUpperLength, currentLineDistance];
}

function handleLineClick(e){
    let button = e.target.closest("button");
    let direction = button.dataset.dir;
    let lineHeight = currentLineHeight;
    let upperLength = currentUpperLength;
    let lineDistance = currentLineDistance;

    if (button.dataset.module === "line-height"){
        if(direction === "+"){
            lineHeight = Math.min(currentLineHeight + 1, 297);
        } else {
            lineHeight = Math.max(currentLineHeight - 1, 0); 
        }
    }
    else if (button.dataset.module === "upper-length"){
        if(direction === "+"){
            upperLength = Math.min(currentUpperLength + 10, 100);
        } else {
            upperLength = Math.max(currentUpperLength - 10, 0);
        }
    }else{
        if(direction === "+"){
            // line distance may never become higher or lower than the page itself
            lineDistance = Math.min(currentLineDistance + 0.5, 297);
        } else {
            lineDistance = Math.max(currentLineDistance - 0.5, 0);          
        }
    }
    updateSizes({
        lineHeight,
        upperLength,
        lineDistance,
    });
    setLineValues();  

}

let buttons = document.querySelectorAll('[data-module]');

buttons.forEach((button) => {
    button.addEventListener("click", handleLineClick);
});

window.addEventListener("load", initializingSizes);