import { browser } from "$app/env";




// doing fetch to a url with max retrys, and return a promise, add credentials to the request if needed
const WAIT_ON_ERROR_MILS = 1000
const MAX_RETRY = 10;
export function my_fetch(url, options) {
    return new Promise((resolve, reject) => {
        let retry = 0;
        
        let fetch_func = () => {
            console.log(`${browser?'browser':'server'} fetching ======> `, url);
            if(browser) {
            }
            
            fetch(url, options)
                .then(res => {
                    if (res.ok) {
                        resolve(res);
                    } else {
                        console.error(`${browser?'browser':'server'} fetching error ======> `, url, res.status, res.statusText);
                        if (retry < MAX_RETRY) {
                            retry++;
                            setTimeout(fetch_func, WAIT_ON_ERROR_MILS);
                        } else {
                            reject(res);
                        }
                    }
                }).catch(err => {
                    console.error(err);
                    if (retry < MAX_RETRY) {
                        retry++;
                        setTimeout(fetch_func, WAIT_ON_ERROR_MILS);
                    } else {
                        reject(err);
                    }
                }
                );
        }
        fetch_func();
    }
    );
}