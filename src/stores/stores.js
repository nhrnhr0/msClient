import { writable } from "svelte/store";

export let albumsJsonStore = writable([]);

export let categoryModalStore = writable();
export let productModalStore = writable();



export let sizesJsonStore = writable([]);
export let colorsJsonStore = writable([]);