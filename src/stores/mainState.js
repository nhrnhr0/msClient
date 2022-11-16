import { writable, get } from "svelte/store";


// bind a store the the main state
let mainState = {}
export const mainStateStore = writable(mainState);
