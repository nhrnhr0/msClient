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
    function handle_docerise_state(storeData) {
        /*
        let main_wraper_element = document.querySelector('#main_wraper');
		//let sidebar_cart_element = document.querySelector('#sidebar-cart');
		let main_navbar_wraper = document.querySelector('#main-navbar-wraper');
        
        //let storeData = get(store);
        // if the sidebar is opened
        if(storeData.isSideOpen) {
            // if the sidebar need to fleat or move the main_wraper
            if (!storeData.sideFloating) {
                // get the body's scrollbar width
                let scrollbarWidth = window.innerWidth - document.body.offsetWidth;
                console.log(scrollbarWidth);
                main_wraper_element.style.width = `calc(100vw - 315px - ${scrollbarWidth}px)`;
                main_wraper_element.style.position= 'absolute';
                main_wraper_element.style.left= '0px';
				//main_navbar_wraper.style = `width: calc(100vw - 315px - ${scrollbarWidth}px);left: 0px;`
            }
        } else {
            // if the sidebar is closed
            if (!storeData.sideFloating) {
                main_wraper_element.style.width = `auto`;
                main_wraper_element.style.position= 'relative';
                main_wraper_element.style.left= 'none';
                //sidebar_cart_element.style = ``;
                //main_navbar_wraper.style = `width: 100%;`;
            }
        }*/
    }
    return {
        subscribe,
        toggleSide: function() {
            update(state => {
                state.isSideOpen = !state.isSideOpen;
                return state;
            });
            let data = get(this);
            handle_docerise_state(data);
        },
        openSide: () => {
            update(state => ({ ...state, isSideOpen: true }));
            let data = get(this);
            handle_docerise_state(data);
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
            handle_docerise_state(data);
        }
    }
}

export const cartPopupStore = createCartPopupStore();

cartPopupStore.subscribe(value => {
    browser && window.sessionStorage.setItem('cart_popup', JSON.stringify(value));
});