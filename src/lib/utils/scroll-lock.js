import { browser } from "$app/env";

let $body;
let scrollPosition = 0;
var isSafari = undefined;

if(browser) {
    isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    $body = document.querySelector('body');
    scrollPosition = 0;
    $body.ontouchstart = function(e) {
        e.preventDefault();
    }
}
function getScrollbarWidth() {

    // Creating invisible container
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);
  
    // Creating inner element and placing it in the container
    const inner = document.createElement('div');
    outer.appendChild(inner);
  
    // Calculating difference between container's full width and the child width
    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
  
    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);
  
    return scrollbarWidth;
  
  }
export function sl_enable() {
    
    const scrollbarWidth = getScrollbarWidth();
    scrollPosition = window.pageYOffset;
    $body.style.overflow = 'hidden';
    if(isSafari) {
        $body.style.position = 'fixed';
        $body.style.WebkitOverflowScrolling ='touch';
        $body.style.top = `-${scrollPosition}px`;
        $body.style.width = '100%';
    }else {
        $body.style.marginRight = `${scrollbarWidth}px`;
    }
  }
  export function sl_disable() {
    
    $body.style.removeProperty('overflow');
    $body.style.removeProperty('position');
    $body.style.removeProperty('top');
    $body.style.removeProperty('width');
    if(isSafari) {
        window.scrollTo(0, scrollPosition);
    }
    else {
        $body.style.marginRight = 'auto';
    }
  }