import { fetch_slim_product_by_id } from "src/network/my_fetch";
import { get, writable } from "svelte/store";



export let slimProductsStore = writable({}); // {productID: {product}}

export function add_products_slim_to_store(products) {
    // combine the two dictionaries (prefer the new one)
    let newProducts = {...get(slimProductsStore), ...products};
    slimProductsStore.set(newProducts);
}


export function get_slim_product_by_id_if_exists(id) {
    return get(slimProductsStore)[id];
}

export async function find_or_get_slim_product_by_id(id) {
    let ret = get(slimProductsStore)[id];
    if(!ret) {
        // if the product is not found, get it from the server
        let product = await fetch_slim_product_by_id(id);
        // add the product to the db
        add_products_slim_to_store({[id]: product});
        return product;
    }
    return ret;
}