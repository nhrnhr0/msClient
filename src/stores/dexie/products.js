
import { browser } from "$app/env";
import { db } from "src/db";
import {fetch_product_info_by_id, fetch_slim_product_by_id} from "src/network/my_fetch";


export async function find_or_get_product_info_by_id(id) {
    let ret = undefined;
    if(browser) {
        ret = await db.products.get(id);
    }
    if(!ret) {
        // if the product is not found, get it from the server
        let product = await fetch_product_info_by_id(id);
        // add the product to the db
        if (browser) {
            db.products.put(product);
        }
        return product;
    }
    return ret;
}

