import { browser } from "$app/env";
import { BASE_URL, COLORS_API_URL, SIZES_API_URL, VARIANTS_API_URL } from "src/api/consts";
import { my_fetch } from "src/network/my_fetch";



export async function sessionStorageApi(key, get_data_func) {
    if(browser) {
        
        if(window.sessionStorage.getItem(key)){
            return JSON.parse(window.sessionStorage.getItem(key));
        }else {
            let data = await get_data_func();
            
            window.sessionStorage.setItem(key, JSON.stringify(data));
            return data;
        }
    }else {
        return get_data_func(); 
    }
}

export async function session_get_all_colors() {
        return await sessionStorageApi('colors',async () => {
            let res =  await my_fetch(COLORS_API_URL);
            return res.json();
        }
    );
}

export async function session_get_all_sizes() {
        return await sessionStorageApi('sizes',async () => {
            let res =  await my_fetch(SIZES_API_URL);
            return res.json();
        }
    );
}

export async function session_get_all_varients() {
        return await sessionStorageApi('varients',async () => {
            let res =  await my_fetch(VARIANTS_API_URL);
            return res.json();
        }
    );
}


/*export async function session_get_main_categories() {
        return await sessionStorageApi('main_categories',async () => {
            let res =  await my_fetch(`${BASE_URL}/get-main-categories/`);
            return res.json();
        }
    );
}*/
