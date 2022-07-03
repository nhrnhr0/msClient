import { writable } from "svelte/store";
import { _modal_z_index_incrementor } from "./stores";

import { get} from 'svelte/store';

/*export let shereCartStore = writable({
    modal_zIndex: -1,
    _is_modal_open: false,
    isModalOpen: ()=>{
        debugger;
        return _is_modal_open},
    closeModal: ()=>{
        _is_modal_open = false;
        modal_zIndex =  1200 + ((1+get(_modal_z_index_incrementor)) * 15);
        _modal_z_index_incrementor.set(get(_modal_z_index_incrementor) + 1);
    },
    openModal: ()=>{
        _is_modal_open = true;
        modal_zIndex =  1200 + ((1+get(_modal_z_index_incrementor)) * 15);
        _modal_z_index_incrementor.set(get(_modal_z_index_incrementor) + 1);
    },
    temp_cart: undefined,

})*/
export let shereCartStore = createShereCartStore({showModal: false, modal_zIndex: -1,});
function createShereCartStore(defaultValue) {
  const { subscribe, update, set } = writable(defaultValue);

  return {
    subscribe,
    set,
    setCart: (cart) => update((state) => ({ ...state, temp_cart: cart })),
    openModal: () => {
            update((state) => ({ ...state, showModal: true, modal_zIndex:1200 + ((1+get(_modal_z_index_incrementor)) * 15)})),
            _modal_z_index_incrementor.set(get(_modal_z_index_incrementor) + 1);
        },
    closeModal: () => {
            update((state) => ({ ...state, showModal: false, modal_zIndex:1200 + ((1+get(_modal_z_index_incrementor)) * 15)})),
            _modal_z_index_incrementor.set(get(_modal_z_index_incrementor) + 1);
        },
  };
}