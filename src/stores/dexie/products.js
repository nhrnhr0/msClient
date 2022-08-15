
import { browser } from "$app/env";
import { db } from "src/db";
import {fetch_product_info_by_id, fetch_slim_product_by_id} from "src/network/my_fetch";

// adding new batch of products to the db
export function add_products_slim_to_indexdb(products) {
    console.log(products);
    db.slimProducts.bulkPut(products);
}

export function find_slim_product_by_id(id) {
    return db.slimProducts.get(id);
}

export async function find_or_get_slim_product_by_id(id) {
    let ret;
    if (browser) {
        ret = await db.slimProducts.get({id:parseInt(id)});
        //let all = await db.slimProducts.toArray();
        //db.slimProducts.all().then(console.log);
        console.log("find_or_get_slim_product_by_id:", ret);
    } 
    if(!ret) {
        // if the product is not found, get it from the server
        let product = await fetch_slim_product_by_id(id);
        // add the product to the db
        db.slimProducts.put(product);
        return product;
    }
    return ret;
}


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

