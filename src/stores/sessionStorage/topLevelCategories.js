import { browser } from "$app/env";
import { fetch_categories } from "../dexie/api_wrapers";



const TOP_LEVEL_CATEGORIES_KEY = 'topLevelCategories';

export async function get_topLevelCategories(fetch=undefined) {
    debugger;
    let sessionData = undefined;
    if(browser) {
        sessionData = window.sessionStorage.getItem(TOP_LEVEL_CATEGORIES_KEY);
    }
    if(sessionData) {
        return JSON.parse(sessionData);
    }
    
    let res = await fetch_categories(fetch);
    if(browser) {
        window.sessionStorage.setItem(TOP_LEVEL_CATEGORIES_KEY, JSON.stringify(res));
    }
    return res;
}

