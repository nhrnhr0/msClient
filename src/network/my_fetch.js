import { browser } from "$app/env";
import { get} from 'svelte/store';
import { BASE_URL } from "src/api/consts";
import { userInfoStore } from "src/stores/stores";




// doing fetch to a url with max retrys, and return a promise, add credentials to the request if needed
const WAIT_ON_ERROR_MILS = 1000
const MAX_RETRY = 10;
export function my_fetch(url, options, custom_fetch=undefined, retry_on_failure=true) {
    return new Promise((resolve, reject) => {
        let retry = 0;
        if(retry_on_failure == false) {
            retry = MAX_RETRY;
        }
        let fetch_func = () => {
            console.log(`${browser?'browser':'server'} fetching ======> `, url);
            let inner_custom_fetch = custom_fetch || fetch;
            let opts = defult_request_options(options)
            inner_custom_fetch(url,opts)
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


function defult_request_options(requestOptions,headers_json= {}) {
        //console.log('fetch_wraper: ', url);
        headers_json= Object.assign({}, {
            'Content-Type': 'application/json',
            'Content-Type': 'application/json; charset=UTF-8',
        },headers_json);
        
        /*if(requestOptions && requestOptions.method != "GET") {
            headers_json['X-CSRFToken']= get_csrf_token();
        }
        else {
        }*/
        if (browser) {
            if (get(userInfoStore)?.access) {
                headers_json['Authorization'] = "Token " +get(userInfoStore).access;
            }
        }
        var myHeaders = new Headers(headers_json);
        var requestOptions = Object.assign({}, {
                method: "GET",
                mode:'cors',
                credentials: 'include',//'',
                headers: myHeaders,
                redirect: 'follow'
            },requestOptions);
        return requestOptions;
}

export async function fetch_product_info_by_id(id) {
    let res = await my_fetch(`${BASE_URL}/my-api/get-product-info?pid[]=${id}`);
    let data = await res.json();
    return data[0];
}

export async function fetch_slim_product_by_id(id) {
    let res = await my_fetch(`${BASE_URL}/my-api/get-product-slim?pid[]=${id}`);
    let data = await res.json();
    return data[0];
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