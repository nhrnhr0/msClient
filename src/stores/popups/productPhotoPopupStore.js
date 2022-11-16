import { browser } from "$app/env";
import { activeModalsStore } from "src/lib/modals/modalManager";
import { get, writable } from "svelte/store";



let productPhotoPopupInitialState = {
    isOpen: false,
};

function createProductPhotoPopupStore() {
    const { subscribe, set, update } = writable(productPhotoPopupInitialState);
    /*function handle_docerise_state(storeData) {
    }*/
    return {
        subscribe,
        open: () => {
            activeModalsStore.modalToggle('product_photo_popup', true);
            update(state => ({ ...state, isOpen: true }));
        },
        close: () => {
            activeModalsStore.modalToggle('product_photo_popup', false);
            update(state => ({ ...state, isOpen: false }));
        }
    }
}

export const productPhotoPopupStore = createProductPhotoPopupStore();
