import { writable,get } from "svelte/store";
import { browser } from "$app/env";

let initActiveModals = {};
if(browser) {
    if(!initActiveModals) {
        initActiveModals={}   
    }
}
const createActiveModals = () => {
    const { subscribe, set, update } = writable({});
    return {
        subscribe,
        set,
        update, 
        modalToggle: (modal, state) => {
            update((curr) => {
                if(curr == undefined) {
                    curr= {};
                }
                if(state == true) {
                    curr[modal] = state;
                }else {
                    delete curr[modal];
                }
                
                return curr;
            });
            /*
            let modals = get(this);
            if(modals == undefined) {
                modals = {};
            }
            modals[modal] = state;
            set(modals);*/
        },
        anyOpen: () => {
            
            let modals = get(this);
            for(let modal in modals) {
                if(modals[modal] && modals[modal].state === true) {
                    return true;
                }
            }
            return false;
        },
        isOpen: (modal) => {
            let modals = get(this);
            if(modals == undefined) {
                modals = {};
            }
            return modals[modal] && modals[modal] === true;
        },
    };
}
export const activeModalsStore = createActiveModals();
//export let tempModalStore = new writable();