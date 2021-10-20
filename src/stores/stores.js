import { writable } from "svelte/store";

export let albumsJsonStore = writable([]);

export let categoryModalStore = writable();
export let productModalStore = writable();

export let _modal_z_index_incrementor = writable(0);

export let sizesJsonStore = writable([]);
export let colorsJsonStore = writable([]);