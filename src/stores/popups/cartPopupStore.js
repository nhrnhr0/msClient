import { browser } from "$app/env";
import { activeModalsStore } from "src/lib/modals/modalManager";
import { get, writable } from "svelte/store";



let cartPopupInitialState = {
    isSideOpen: false,
    isOpen: false,
    // sideFloating = true on mobile
    sideFloating: browser && window.matchMedia("(max-width: 767px)").matches,
}

// check if we already have data in the session storage
let cart_popup_from_session = browser? window.sessionStorage.getItem('cart_popup') : null;
if (cart_popup_from_session) {
    cartPopupInitialState = JSON.parse(cart_popup_from_session);
}

function createCartPopupStore() {
    const { subscribe, set, update } = writable(cartPopupInitialState);
    /*function handle_docerise_state(storeData) {
    }*/
    return {
        subscribe,
        toggleSide: function() {
            update(state => {
                state.isSideOpen = !state.isSideOpen;
                return state;
            });
            let data = get(this);
            //handle_docerise_state(data);
        },
        openSide: () => {
            update(state => ({ ...state, isSideOpen: true }));
            let data = get(this);
            //handle_docerise_state(data);
        },
        open: () => {
            activeModalsStore.modalToggle('login_modal_popup', true);
            update(state => ({ ...state, isOpen: true }));
        },
        close: () => {
            activeModalsStore.modalToggle('login_modal_popup', false);
            update(state => ({ ...state, isOpen: false }));
        },
        closeSide: () => {
            update(state => ({ ...state, isSideOpen: false }));
            let data = get(this);
            //handle_docerise_state(data);
        }
    }
}

export const cartPopupStore = createCartPopupStore();

cartPopupStore.subscribe(value => {
    browser && window.sessionStorage.setItem('cart_popup', JSON.stringify(value));
});