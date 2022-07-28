import { browser } from "$app/env";
import { BASE_URL } from "src/api/consts";




// doing fetch to a url with max retrys, and return a promise, add credentials to the request if needed
const WAIT_ON_ERROR_MILS = 1000
const MAX_RETRY = 10;
export function my_fetch(url, options, custom_fetch=undefined) {
    return new Promise((resolve, reject) => {
        let retry = 0;
        
        let fetch_func = () => {
            console.log(`${browser?'browser':'server'} fetching ======> `, url);
            if(browser) {
            }
            custom_fetch = custom_fetch || fetch;
            custom_fetch(url, options)
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

/*
const LOCAL_STORE_PREFIX = 'products_manager_';
export class ProductsManager {
    constructor() {
        
    }

    setQuery(query) {
        this.url = BASE_URL + '/my-api/get-album-images?' + query;
        this.products = [];
        this.nextUrl = null;
        //this.custom_fetch = custom_fetch;
        // load products from session storage if available
        if (browser) {
            let products = window.localStorage.getItem(LOCAL_STORE_PREFIX + this.url);
            // load the next url if available   
            let nextUrl = window.localStorage.getItem(LOCAL_STORE_PREFIX + this.url + '_next');
            if (products) {
                this.products = JSON.parse(products);
                this.nextUrl = nextUrl;
            }else {
                //this.loadProducts();
            }
        }
    }

    async loadProducts() {
        let res = await my_fetch(this.url, {
            method: 'GET',
            credentials: 'include'
        });
        // append products to the store
        //this.products = res.json();
        let response = await res.json();
        
        this.products = this.products.concat(response.results);
        this.nextUrl = response.next;

        if (browser) {
            window.localStorage.setItem(LOCAL_STORE_PREFIX + this.url, JSON.stringify(this.products));
            // store the last cursor
            window.localStorage.setItem(LOCAL_STORE_PREFIX + this.url + '_next', this.nextUrl);
        }
        return this.products;
    }

    loadNextProducts() {
        if (this.nextUrl) {
            my_fetch(this.nextUrl, {
                method: 'GET',
                credentials: 'include'
            }).then(res => {
                // append products to the store
                //this.products = res.json();
                let response = res.json();
                this.products.concat(response.results);
                this.nextUrl = response.next;

                if (browser) {
                    window.localStorage.setItem(LOCAL_STORE_PREFIX + this.url, JSON.stringify(this.products));
                    // store the last cursor
                    window.localStorage.setItem(LOCAL_STORE_PREFIX + this.url + '_next', this.nextUrl);
                }
            }).catch(err => {
                console.error(err);
            }
            );
        }
    }

    getProducts() {
        return this.products;
    }

    getNextUrl() {
        return this.nextUrl;
    }

    hasNext() {
        return this.nextUrl != null;
    }
}*/