import { browser } from "$app/env";
import { flashy_update_cart } from "$lib/flashy";
import { writable, get } from "svelte/store";
let initCart = {};
const LOCAL_STORE_NAME = "cart2";
if(browser) {
    initCart=JSON.parse(localStorage.getItem(LOCAL_STORE_NAME));
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
          this.removeFromCartById(product.id);
        },
        removeFromCartById: function(id) {
          let cart = get(this);
          delete cart[id];
          set(cart);
        },
        getProduct: function(productId) {
          debugger;
            let cart = get(this);
            return cart[productId];
        },
        setProduct: function(product) {
          const store = get(this);
          store[product.id] = product;
          set(store);
          return store[product.id];
        },
        addToCart: function(product) {
          const store = get(this);
          let exist = false;
          if(product && product.id) {
            if(store[product.id]) {
              exist = true;
            } else {
              product.amount = 0;
              store[product.id] = product;
              set(store);
            }
            return exist;
          }
        },
        isInCart: function(product) {
          const store = get(this);
          if(product && product.id) {
            let ret = store[product.id] != undefined? true : false;
            console.log(ret);
            return ret;
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
      window.localStorage.setItem(LOCAL_STORE_NAME, JSON.stringify(value));
      flashy_update_cart(value);
    }
  });





export const cartObjStore = writable({});