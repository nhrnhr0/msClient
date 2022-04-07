import { writable } from "svelte/store";
import { browser } from '$app/env';

export let albumsJsonStore = writable([]);

export let cartModalStore = writable();
export let categoryModalStore = writable();
export let productModalStore = writable();
export let productImageModalStore = writable();
export let productQuestionModalStore = writable();
export let loginModalStore= writable();
export let userDetailModalStore= writable();
export let productCartModalStore= writable();
//export let singleAmountPopupStore= writable();
export let _modal_z_index_incrementor = writable(0);

export let sizesJsonStore = writable([]);
export let colorsJsonStore = writable([]);
export let campainsStore = writable([]);
export let all_swipers = writable([]);

export let successModalStore = writable();





// browser storage - userInfoStore
let initUserData = {'isLogin': undefined};
if(browser) {
    if(typeof(Storage) !== "undefined") {
        initUserData=JSON.parse(localStorage.getItem('user'));
    }else{
        initUserData=JSON.parse(sessionStorage.getItem('user'));
    }
    if(!initUserData) {
        initUserData={'isLogin': undefined}
    }
}
export let userInfoStore = writable(initUserData);

userInfoStore.subscribe((value) => {
    if (browser) {
        if(typeof(Storage) !== "undefined") {
            window.localStorage.setItem('user', JSON.stringify(value));
        }else {
            window.sessionStorage.setItem('user', JSON.stringify(value));
        }
    }
});


