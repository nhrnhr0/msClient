import { browser } from "$app/env";

let $body;
let scrollPosition = 0;
var isSafari = undefined;

if(browser) {
    isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    $body = document.querySelector('body');
    scrollPosition = 0;
}

export function sl_enable() {
    console.log('enable scroll lock',scrollPosition);
    scrollPosition = window.pageYOffset;
    $body.style.overflow = 'hidden';
    if(isSafari) {
        $body.style.position = 'fixed';
        $body.style.top = `-${scrollPosition}px`;
        $body.style.width = '100%';
    }
  }
  export function sl_disable() {
    console.log('disable scroll lock',scrollPosition);
    $body.style.removeProperty('overflow');
    $body.style.removeProperty('position');
    $body.style.removeProperty('top');
    $body.style.removeProperty('width');
    if(isSafari) {
        window.scrollTo(0, scrollPosition);
    }
  }