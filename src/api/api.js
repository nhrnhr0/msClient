

let albumsData = {};
import { getCookie } from "$lib/utils/cookies";
import { BASE_URL, GET_CSRF_TOKEN_URL,LEAD_DISTRIBUTION_URL, STATIC_BASE ,CONTACT_FORM_URL,SEARCH_API_URL , SUBMIT_CART_URL, LOGS_URL, ADMIN_GET_ALL_CAMPAINS_URL,USER_GET_CAMPAINS_URL, TRACK_CART_URL,PRODUCT_QUESTION_URL} from "./consts";
import { userInfoStore } from "./../stores/stores";
import { browser } from '$app/env';
import { get} from 'svelte/store';
//import { request_refresh_token } from "./auth";
export function apiSendLogs(logs) {
    let body = {
        logs: logs,
        uid: get_user_uuid(),
    }
    return fetch_wraper(LOGS_URL, {
        method: 'POST',
        body: JSON.stringify(body)
    })
}
export function fetch_wraper(url, requestOptions, custom_fetch, isRetry = false) {
    console.log('fetch_wraper: ', url);
    let headers_json= {
        'Content-Type': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
    }
    
    if(requestOptions && requestOptions.method == "POST") {
        headers_json['X-CSRFToken']= get_csrf_token();
    }
    else {
    }
    
    if (browser) {
        if (get(userInfoStore).access) {
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
    
    let response;
    try {
        if(custom_fetch) {
            response = custom_fetch(url, requestOptions);
        }
        else {
            response = fetch(url, requestOptions);
        }
    }
    catch (error) {
        console.error(error);
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
      }
    return response.then((data)=>{
        if(data.status == 401) {
            let userInfo = get(userInfoStore);
            userInfo.isLogin = false;
            userInfo.access = null;
            userInfoStore.set(userInfo);
            if(!isRetry) {
                return fetch_wraper(url, requestOptions, custom_fetch, true);
            }
        }
        console.log(url, ' ==> ', data.status);
        let json = data.json();
        return json;
    }).then((info)=> {
        /*if(info.code === "token_not_valid") {
            
            request_refresh_token().then((refresh_response)=> {
                if(refresh_response.access) {
                    let oldStore = get(userInfoStore);
                    oldStore.access = refresh_response.access;
                    userInfoStore.set(oldStore);
                }

                return fetch_wraper(url, requestOptions, custom_fetch);
            });
            
        }*/
        //console.log('info: ', info);
        return info;
    });
//    return response;
}
export function api_get_user_campains() {
    return fetch_wraper(USER_GET_CAMPAINS_URL);
}
export function apiSearchProducts(keyword) {
    const url = SEARCH_API_URL + '?q=' + encodeURIComponent(keyword);
    return fetch_wraper(url);
}
export function get_album_details(albumId, server_fetch) {
    if(albumsData[albumId]) {
        return albumsData[albumId];
    }
    else {
        let response = fetch_wraper(STATIC_BASE + "/_get_album_images/" + albumId,{method:"GET"}, server_fetch);
        
        albumsData[albumId] = response;
        return albumsData[albumId];
    }
}

export async function request_csrf_token() {
    let uid = get_user_uuid();

    let extra = '/'
    if(uid)
        extra +=  uid;
    let response = await fetch_wraper(GET_CSRF_TOKEN_URL + extra);
    let json_response = response;
    set_user_uuid(json_response['uid']);
    return json_response;
}

function set_user_uuid(newUid) {
    localStorage.setItem('uuid', newUid);
}
export function get_user_uuid() {
    return localStorage.getItem('uuid');
}

export function send_product_question(data) {
    return fetch_wraper(PRODUCT_QUESTION_URL, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

export function get_csrf_token() {
    return getCookie('csrftoken');
}
export function track_cart_to_server(data) {
    var requestOptions = {
        method:"POST",
        body: JSON.stringify(data),
    };
    let response 
    response = fetch_wraper(TRACK_CART_URL, requestOptions);
    return response;
}
export function submit_cart_form(data) {
        var requestOptions = {
            method:"POST",
            body: JSON.stringify(data),
        };
        let response 
        response = fetch_wraper(SUBMIT_CART_URL, requestOptions);
        return response;
}
export function submit_contact_form(data) {
    var requestOptions = {
        method: 'POST',
        body: JSON.stringify(data)
    };
    let response 
    response = fetch_wraper(CONTACT_FORM_URL, requestOptions);
    return response;
}

export async function adming_get_campains() {
    let response = await fetch_wraper(ADMIN_GET_ALL_CAMPAINS_URL);
    let json_response = response;
    return json_response;
}


export function submit_distribution_lead(data){
    var requestOptions = {
        method:"POST",
        body: JSON.stringify(data),
    };
    let response 
    response = fetch_wraper(LEAD_DISTRIBUTION_URL, requestOptions);
    return response;
}