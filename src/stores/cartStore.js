import { browser } from "$app/env";
import { update_cart_to_server } from "$lib/flashy";
import { writable, get, derived } from "svelte/store";
import {cartModalStore} from "./../stores/stores";

let initCart = {};
const LOCAL_STORE_NAME = "cart8";
if(browser) {
    initCart=JSON.parse(localStorage.getItem(LOCAL_STORE_NAME));
    if(!initCart) {
        initCart=[];
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
  const { subscribe, set, update } = writable(initCart);
  return {
    subscribe,
    //set,
    //update,
    clearCart: () => {
      set([]);
    },
    removeFromCart: function(product) {
      this.removeFromCartById(product.id);
    },
    removeFromCartById: function(id) {
      update((cart) => {
        return cart.filter((item) => item.id != id);
      });
    },
    productLength: function() {
      return get(this).length;
    },
    getProduct: function(productId) {
      let cart = get(this);
      return cart.find((item) => item.id == productId);
    },
    updateProduct: function(product) {
      update((cart) => {
        let index = cart.findIndex((item) => item.id == product.id);
        if (index != -1) {
          cart[index] = product;
        }
        return cart;
      });
    },
    setProduct: function(product) {
      update((cart) => {
        let exist = false;
        let newCart = cart.map((item) => {
          if (item.id == product.id) {
            exist = true;
            return product;
          } else {
            return item;
          }
        });
        if (!exist) {
          newCart.push(product);
        }
        return newCart;
      });
    },


  }
}
export const cartStore = createCartStore();//writable(initCart);
cartStore.subscribe((value) => {
      if (browser) {
        window.localStorage.setItem(LOCAL_STORE_NAME, JSON.stringify(value));
      }
    }
);
export const dictCartStore = derived(cartStore, ($cartStore) => {
  let ret = {};
  $cartStore.forEach((item) => {
    ret[item.id] = item;
  });
  return ret;
});

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