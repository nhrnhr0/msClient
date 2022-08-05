import { browser } from "$app/env";
import { update_cart_to_server } from "$lib/flashy";
import { writable, get } from "svelte/store";
import {cartModalStore} from "./../stores/stores";

let initCart = {};
const LOCAL_STORE_NAME = "cart6";
if(browser) {
    initCart=JSON.parse(localStorage.getItem(LOCAL_STORE_NAME));
    if(!initCart) {
        initCart={}   
    }
}

// const createCartStore = () => {
//     const { subscribe, set, update } = writable(initCart);
//     return {
//         subscribe,
//         set,
//         removeFromCart: function(product) {
//           this.removeFromCartById(product.id);
//         },
//         removeFromCartById: function(id) {
//           let cart = get(this);
//           delete cart[id];
//           set(cart);
//         },
//         getProduct: function(productId) {
//             let cart = get(this);
//             return cart[productId];
//         },
//         setProduct: function(product) {
//           const store = get(this);
//           store[product.id] = product;
//           set(store);
//           return store[product.id];
//         },
//         addToCart: function(product) {
//           const store = get(this);
//           let exist = false;
//           if(product && product.id) {
//             if(store[product.id]) {
//               exist = true;
//             } else {
//               product.amount = product.amount || 0;
//               product.print = product.print || false;
//               product.embro = product.embro || false;
//               store[product.id] = product;
//               set(store);
//             }
//             if (Object.keys(store).length == 1) {
//                 if (get(cartModalStore).isOpen() == false) {
//                   get(cartModalStore).toggleModal();
//                 }
//             }
//             return exist;
//           }
//         },
//         isInCart: function(product) {
//           const store = get(this);
//           if(product && product.id) {
//             let ret = store[product.id] != undefined? true : false;
//             console.log(ret);
//             return ret;
//           }
//           return false;
//         },
//         clearCart: function() {
//           set({});
//         },
        
//     }
//   }
function createCartStore() {
  return writable(initCart);
}
export const cartStore = createCartStore();//writable(initCart);
cartStore.subscribe((value) => {
      if (browser) {
        window.localStorage.setItem(LOCAL_STORE_NAME, JSON.stringify(value));
      }
    }
);

//let _updated_to_server = false;

// cartStore.subscribe((value) => {
//     if (browser) {
//       window.localStorage.setItem(LOCAL_STORE_NAME, JSON.stringify(value));
//       if(_updated_to_server == false) {
//         _updated_to_server = true;
//         setTimeout(() => {
//           _updated_to_server = false;
//           update_cart_to_server(get(cartStore));
//         }, 3000);
//       }
//     }
//   });





export const cartDomElementStore = writable({});