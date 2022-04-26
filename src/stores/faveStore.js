import { browser } from "$app/env";
import { writable, get } from "svelte/store";

let initFaveList = {
};
const LOCAL_STORE_NAME = "faveList";
if(browser) {
    initFaveList=JSON.parse(localStorage.getItem(LOCAL_STORE_NAME));
    if(!initFaveList) {
        initFaveList={}   
    }
}

const createFaveListStore = () => {
    const { subscribe, set, update } = writable(initFaveList);
    return {
        subscribe,
        //set,
        addToFaveList: function(product_id) {
            update(faveList => {
                faveList[product_id]=true;
                return faveList;
            });
        },
        removeFromFaveList: function(product_id) {
            update(faveList => {
                delete faveList[product_id];
                return faveList;
            });
        },
        
        saveToLocalStorage: function() {
            if(browser) {
                console.log('saving to local storage');
                localStorage.setItem(LOCAL_STORE_NAME, JSON.stringify(get(this)));
            }
        },
        clearCart: function() {
            set({});
        },
        
    }
}

export const fave_list = createFaveListStore();//writable(initCart);
fave_list.subscribe((value) => {
    fave_list.saveToLocalStorage();
});