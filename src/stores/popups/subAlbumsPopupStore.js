import { browser } from "$app/env";
import { activeModalsStore } from "src/lib/modals/modalManager";
import { get, writable } from "svelte/store";



let subAlbumsPopupInitialState = {
    isOpen: false,
};

function createsubAlbumsPopupStore() {
    const { subscribe, set, update } = writable(subAlbumsPopupInitialState);
    
    return {
        subscribe,
        open: (category) => {
            activeModalsStore.modalToggle('sub_albums_popup_store', true);
            update(state => ({ ...state, isOpen: true ,'category':category}));
        },
        close: () => {
            activeModalsStore.modalToggle('sub_albums_popup_store', false);
            update(state => ({ ...state, isOpen: false,'category':undefined }));
        }
    }
}

export const subAlbumsPopupStore = createsubAlbumsPopupStore();

import { crossfade, scale, } from 'svelte/transition';

export const [send, receive] = crossfade({
    duration: 300,
    //fallback: scale
});
