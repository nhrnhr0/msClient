import { browser } from "$app/env";
import { writable } from "svelte/store";
let initCart = {};
if(browser) {
    initCart=JSON.parse(localStorage.getItem('cart'));
    if(!initCart) {
        initCart={}   
    }
}

export const cartStore = writable(initCart);

cartStore.subscribe((value) => {
    if (browser) {
      window.localStorage.setItem('cart', JSON.stringify(value));
    }
  });





export const cartObjStore = writable({});