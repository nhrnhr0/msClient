import { activeModalsStore } from "src/lib/modals/modalManager";
import { writable } from "svelte/store";



let sesuccessPopupInitialState = {
    isOpen: false,
}

function createsuccessPopupStore() {
    const { subscribe, set, update } = writable(sesuccessPopupInitialState);

    return {
        subscribe,
        open: () => {
            activeModalsStore.modalToggle('success_modal_popup', true);
            update(state => ({ ...state, isOpen: true }));
        },
        close: () => {
            activeModalsStore.modalToggle('success_modal_popup', false);
            update(state => ({ ...state, isOpen: false }));
        },
    }
}

export const successPopupStore = createsuccessPopupStore();
