import { activeModalsStore } from "src/lib/modals/modalManager";
import { writable } from "svelte/store";



let loginPopupInitialState = {
    isOpen: false,
}

function createLoginPopupStore() {
    const { subscribe, set, update } = writable(loginPopupInitialState);

    return {
        subscribe,
        open: () => {
            activeModalsStore.modalToggle('login_modal_popup', true);
            update(state => ({ ...state, isOpen: true }));
        },
        close: () => {
            activeModalsStore.modalToggle('login_modal_popup', false);
            update(state => ({ ...state, isOpen: false }));
        },
    }
}

export const loginPopupStore = createLoginPopupStore();