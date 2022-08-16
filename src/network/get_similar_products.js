import { BASE_URL } from "src/api/consts";

import { add_products_slim_to_store } from "src/stores/sessionStorage/slimProducts";
import { my_fetch } from "./my_fetch";


export async function get_similar_products(product_id) {
    let similar_products = await fetch_similar_products(product_id);
    return similar_products;
}

async function fetch_similar_products(product_id) {
    let res = await my_fetch(`${BASE_URL}/my-api/get-similar-products/${product_id}`);
    let data = await res.json();
    add_products_slim_to_store(data);
    return data;
}