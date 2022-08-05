

import { browser } from "$app/env";
import { BASE_URL } from "src/api/consts";
import { db } from "src/db";
import { my_fetch } from "src/network/my_fetch";

/*
fetch top level categories from the server

*/
async function fetch_top_level_categories() {
    let res =  await my_fetch(`${BASE_URL}/get-main-categories/`);
    let data = await res.json(); // data = [{id:1,name:'...'},{id:2,name:'...'}]
    // add timestamp to the data
    data.map(item => {
        item.timestamp = Date.now();
    });
    if (browser) {
        db.topLevelCategories.clear().then(()=> { db.topLevelCategories.bulkPut(data) })
        
    }
    return data;
    // store the data in the db
}
// indexdb_get_main_categories description:
// if there is no data in the indexdb, fetch it from the server and save it in the indexdb (all the rows)
// if there is data in the indexdb, and the data is not expired, return the data from the indexdb
// if there is data in the indexdb, and the data is expired, fetch it from the server and save it in the indexdb (all the rows)
// toplevelcategories: id, name, image, albums, timestemp
const API_EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 1 day
export async function indexdb_get_main_categories() {
    //return fetch_top_level_categories();
    //let data = await db.topLevelCategories.get();//.toArray();
    let data = [];
    if(browser) {
        data = await db.topLevelCategories.toArray();
    }
    
    if (data.length === 0) {
        data = await fetch_top_level_categories();
    }
    else {
        let now = Date.now();
        let last_update = data[0]?.timestamp;
        if (now - last_update > API_EXPIRATION_TIME) {
            data = await fetch_top_level_categories();
        }
    }
    return data;
}