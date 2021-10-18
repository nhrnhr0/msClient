import { writable } from "svelte/store";

export let albumsJsonStore = writable([])

export let categoryModalStore = writable()