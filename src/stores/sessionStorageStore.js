import { browser } from "$app/env";
import { WAREHOUSES_API_URL,SIZES_API_URL,COLORS_API_URL,VARIANTS_API_URL ,BASE_URL} from "src/api/consts";
import { fetch_wraper } from "src/api/api";
import { derived, writable } from "svelte/store";
import { my_fetch } from "src/network/my_fetch";


const keyUrlPairs = {
    "sizes": {url: SIZES_API_URL},
    "colors": {url: COLORS_API_URL},
    "varients": {url:VARIANTS_API_URL},
    "warehouses": {url:WAREHOUSES_API_URL},
    "providers": {url:`${BASE_URL}/svelte/api/providers/`},
}
export let PROVIDERS_STORE = new writable()
export let SIZES_STORE = new writable()
export let COLORS_STORE = new writable()
export let VARIANTS_STORE = new writable()
export let WAREHOUSES_STORE = new writable()


export let PROVIDERS_STORE_IDS_AS_KEYS = derived(PROVIDERS_STORE,$providers=>{
    let newProviders = {};
    if($providers == undefined){
        return newProviders;
    }
    $providers.forEach(provider=>{
        newProviders[provider.id] = provider
    })
    return newProviders
}
);
const keyToStore = {
    "sizes": SIZES_STORE,
    "colors": COLORS_STORE,
    "varients": VARIANTS_STORE,
    "warehouses": WAREHOUSES_STORE,
    "providers": PROVIDERS_STORE,
}

export async function getSessionStorageStore(key) {
        if(browser) {
            var cacheddata = sessionStorage.getItem(key); 
            if(cacheddata){
                cacheddata = JSON.parse(cacheddata);
                }
            //If cached data available and not expired return them. 
            if (cacheddata ){
                return cacheddata;
            }else{
                if(keyUrlPairs[key].requesting !== true){
                    //otherwise fetch data from api then save the data in sessionStorage 
                    keyUrlPairs[key].requesting = true;
                    let data = undefined;
                    try {
                        console.log('requesting ======> ', keyUrlPairs[key].url);
                        data = await my_fetch(keyUrlPairs[key].url);
                        data = await data.json();
                        localStorage.setItem(key, JSON.stringify(data));
                    }catch(err){
                        console.log(err);
                    }
                    finally{
                        keyUrlPairs[key].requesting = false;
                        //convert data to dict with id as key
                        let newData = {};
                        data.forEach(item=>{
                            newData[item.id] = item;
                        });
                        keyToStore[key].set(newData);
                        return newData;
                    }
                    }else {
                        //if data is being requested then wait for it to be fetched and return it
                        while(keyUrlPairs[key].requesting === true){
                            await new Promise(resolve => setTimeout(resolve, 100));
                        }
                        return await getSessionStorageStore(key);
                    }
            }
        }else {
            return {};
        }
}


