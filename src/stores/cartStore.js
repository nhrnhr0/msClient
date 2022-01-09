import { browser } from "$app/env";
import { flashy_update_cart } from "$lib/flashy";
import { writable, get } from "svelte/store";
let initCart = {};
if(browser) {
    initCart=JSON.parse(localStorage.getItem('cart'));
    if(!initCart) {
        initCart={}   
    }
}

const createCartStore = () => {
    const { subscribe, set, update } = writable(initCart);
    return {
        subscribe,
        set,
        removeFromCart: function(product) {
          let cart = get(this);
          delete cart[product.id];
          set(cart);
        },
        addToCart: function(product) {
          const store = get(this);
          let exist = false;
          if(product && product.id) {
            if(store[product.id]) {
              exist = true;
            } else {
              product.amount = 1;
              store[product.id] = product;
              set(store);
            }
            return exist;
          }
        },
        isInCart: function(product) {
          const store = get(this);
          if(product && product.id) {
            return store[product.id] ? true : false;
          }
          return false;
        },
        clearCart: function() {
          set({});
        },
        
    }
  }

export const cartStore = createCartStore();//writable(initCart);
cartStore.subscribe((value) => {
    if (browser) {
      window.localStorage.setItem('cart', JSON.stringify(value));
      flashy_update_cart(value);
    }
  });





export const cartObjStore = writable({});