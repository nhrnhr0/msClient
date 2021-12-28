import { writable } from "svelte/store";
import { browser } from '$app/env';

export let albumsJsonStore = writable([]);

export let cartModalStore = writable();
export let categoryModalStore = writable();
export let productModalStore = writable();
export let productImageModalStore = writable();
export let loginModalStore= writable();
export let userDetailModalStore= writable();
export let _modal_z_index_incrementor = writable(0);

export let sizesJsonStore = writable([]);
export let colorsJsonStore = writable([]);
export let campainsStore = writable([]);
export let all_swipers = writable([]);

export let successModalStore = writable();





// browser storage - userInfoStore
let initUserData = {'isLogin': false};
if(browser) {
    initUserData=JSON.parse(localStorage.getItem('user'));
    if(!initUserData) {
        initUserData={'isLogin': false}   
    }
}
export let userInfoStore = writable(initUserData);

userInfoStore.subscribe((value) => {
    if (browser) {
        window.localStorage.setItem('user', JSON.stringify(value));
    }
});


