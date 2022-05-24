import { browser } from "$app/env";
import { SIZES_API_URL,COLORS_API_URL,VARIANTS_API_URL } from "@src/api/consts";
import { fetch_wraper } from "@src/api/api";

const keyUrlPairs = {
    "sizes": {url: SIZES_API_URL},
    "colors": {url: COLORS_API_URL},
    "varients": {url:VARIANTS_API_URL},
}

export async function getLocalStorageStore (key) {
        if(browser) {
            // set cache lifetime in seconds
            var cachelife = 5; 
            //get cached data from local storage
            var cacheddata = localStorage.getItem(key); 
            if(cacheddata){
                cacheddata = JSON.parse(cacheddata);
                var expired = parseInt(Date.now() / 1000) - cacheddata.cachetime > cachelife;
                }
            //If cached data available and not expired return them. 
            if (cacheddata  && !expired){
                return cacheddata.data;
            }else{
                if(keyUrlPairs[key].requesting !== true){
                    //otherwise fetch data from api then save the data in localstorage 
                    keyUrlPairs[key].requesting = true;
                    let data = undefined;
                    try {
                        console.log('requesting ======> ', keyUrlPairs[key].url);
                        data = await fetch_wraper(keyUrlPairs[key].url);
                        //var data = await res.json();
                        var json = {data: data, cachetime: parseInt(Date.now() / 1000)}
                        localStorage.setItem(key, JSON.stringify(json));
                    }catch(err){
                        console.log(err);
                    }
                    finally{
                        keyUrlPairs[key].requesting = false;
                        return data;
                    }
                    }else {
                        //if data is being requested then wait for it to be fetched and return it
                        while(keyUrlPairs[key].requesting === true){
                            await new Promise(resolve => setTimeout(resolve, 100));
                        }
                        return await getLocalStorageStore(key);
                    }
            }
        }else {
            return {};
        }
}