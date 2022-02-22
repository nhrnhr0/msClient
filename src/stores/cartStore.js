import { browser } from "$app/env";
import { update_cart_to_server } from "$lib/flashy";
import { writable, get } from "svelte/store";
import debounce from 'lodash/debounce';

let initCart = {};
const LOCAL_STORE_NAME = "cart3";
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
let throut_to_server = debounce((value)=>{
  console.log('updateing cart to server');
  update_cart_to_server(value)
}, 2500);
cartStore.subscribe((value) => {
    if (browser) {
      window.localStorage.setItem(LOCAL_STORE_NAME, JSON.stringify(value));
      
      throut_to_server(value);
    }
  });





export const cartDomElementStore = writable({});