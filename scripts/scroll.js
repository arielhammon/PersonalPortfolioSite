window.onresize = doResizeOps;
window.onscroll = doScrollOps;
var doc = document.documentElement;
var dynamicBgImage = document.getElementById("bg-dynamic");
var spacer = document.getElementById("spacer-a");
var navBar = document.getElementById("navbar");
var navLinks = document.getElementsByClassName("nav-link"); //array
var navBrand = document.getElementsByClassName("navbar-brand")[0];
const triggerBgRatio = 0.28; // 0.28 is the ratio where horizon of background image occurs at the top of the screen
const fg10 = "rgba(var(--fg1-color),1)";
const fg15 = "rgba(var(--fg1-color),.5)";
const fg30 = "rgba(var(--fg3-color),1)";
const bg10 = "rgba(var(--bg1-color),1)";
const bg15 = "rgba(var(--bg1-color),.5)";
const bg20 = "rgba(var(--bg2-color),1)";
const bg25 = "rgba(var(--bg2-color),.5)";
const navBorder = ".5px solid rgba(0,0,0,.5)";

initializePage();

function placeAboutSection() {
    let y = dynamicBgImage.offsetHeight;
    spacer.style.height = (y*0.6 - spacer.offsetTop) + "px";
}

function scrollBgImage() {
    let y = doc.scrollTop;
    //adjusting the coefficient alters the speed of the effect
    dynamicBgImage.style.top = (-0.5*y) + "px";
}

function getScrollBgRatio() {return doc.scrollTop/dynamicBgImage.offsetHeight;}

function changeNavColor(opacity) {
    if (getScrollBgRatio() < triggerBgRatio) {
        navBar.style.backgroundColor = (opacity<1) ? bg25 : bg20;
        if (opacity>=1) {
            setNavLinksColor(fg30);
            navBrand.children[0].style.color = fg30; // selects span element
        } else {
            setNavLinksColor(fg15);
            navBrand.children[0].style.color = fg10;
        }
    } else {
        navBar.style.backgroundColor = (opacity<1) ? bg15: bg10;
        if (opacity>=1) {
            setNavLinksColor(fg10);
        } else {
            setNavLinksColor(fg15);
        }
    }
}

function navBrandMouseOver() {
    changeNavColor(1);
}
function navBrandMouseOut() {
    changeNavColor(.5);
    spyNav();
}

function doNavLinkBgColor(event) {
    let innerObj = null;
    let outerObj = null;
    if (event.target.tagName == "SPAN") {
        innerObj = event.target;
        outerObj = event.target.parentElement;
    } else {
        innerObj = event.target.children[0];
        outerObj = event.target;
    }
    outerObj.style.border = navBorder;
    if (getScrollBgRatio() < triggerBgRatio) {
        innerObj.style.color = fg30;
        outerObj.style.backgroundColor = bg20;
    } else {
        innerObj.style.color = fg10;
        outerObj.style.backgroundColor = bg10;
    }
}

function doNavLinkNoColor(event) {
    let object1 = null;
    let object2 = null;
    if (event.target.tagName == "SPAN") {
        object1 = event.target;
        object2 = event.target.parentElement;
    } else {
        object1 = event.target.children[0];
        object2 = event.target;
    }
    object1.style = "";
    object2.style = "";
    spyNav();
}

function setNavLinksColor(color) {
    for (let i=0; i<navLinks.length; i++) {
        navLinks[i].children[0].style.color = color; //the selecting the span elements
    }
}

function spyNav() {
    let links = document.getElementsByClassName("nav-link");
    let link = undefined;
    let element = undefined;
    let str = "";
    let isID = false;

    function portionOfElementInClient(element, clientTop, clientBottom) {
        //clientTop is a number [0,1] which represents the top of the middle portion of the viewing window
        //clientBottom is a number [0,1] which represents the bottom of the middle portion of the viewing window
        let dt = doc.scrollTop + doc.clientHeight*clientTop;
        let db = doc.scrollTop + doc.clientHeight*clientBottom;
        let et = element.offsetTop;
        let eb = et + element.offsetHeight;
        if ((et>dt && et<db) || (eb>dt && eb<db) || (et<dt && eb>dt) || (et<db && eb>db)) {
            return true;
        } else {
            return false;
        }
    } //end function

    for (let i=0; i < links.length; i++) {
        link = links[i];
        str = link.getAttribute("href");
        isID = (str.substr(0,1) == "#");
        str = str.substr(1,str.length-1);
        if (isID) {
            element = document.getElementById(str);
        } else {
            element = null;
        }
        if (element !== null) {
            //determine if portion of element occupies middle portion of screen
            if (portionOfElementInClient(element,1/5,4/5)) {
                //make element's navlink active
                link.classList.add("active")
                //make all other elements' navlinks inactive
                for (let j=0; j < links.length; j++) {
                    if (i !== j) {links[j].classList.remove("active");}
                }
            } else {
                link.classList.remove("active");
            }
        }
    }
    // for simplicity of setting styles, run another loop through
    for (let i=0; i < links.length; i++) {
        link = links[i];
        if (link.className.includes("active")) {
            link.style.border = navBorder;
            if (getScrollBgRatio() < triggerBgRatio) {
                link.children[0].style.color = fg30;
                link.style.backgroundColor = bg20;
            } else {
                link.children[0].style.color = fg10;
                link.style.backgroundColor = bg10;
            }
        } else {
            link.style.border = "";
            link.children[0].style.color = fg15;            
            link.style.backgroundColor = "";
        }
    }
}

function doScrollOps() {
    scrollBgImage();
    changeNavColor(.5);
    spyNav();
}

function doResizeOps() {
    placeAboutSection();
    doScrollOps;
}

function initializePage() {
    placeAboutSection();
    changeNavColor(.5);
    spyNav();
    navBrand.onmouseover = navBrandMouseOver;
    navBrand.onmouseout = navBrandMouseOut;
    var navLink;
    for (let i = 0; i < navLinks.length; i++) {
        navLink = navLinks[i];
        navLink.onmouseover = doNavLinkBgColor;
        navLink.onclick = doNavLinkNoColor;
        navLink.onmouseout = doNavLinkNoColor;
    }
}