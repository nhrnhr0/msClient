

let albumsData = {};
import { getCookie } from "$lib/utils/cookies";
import { BASE_URL, GET_CSRF_TOKEN_URL, STATIC_BASE ,CONTACT_FORM_URL, SUBMIT_CART_URL} from "./consts";

function fetch_wraper(url, requestOptions, custom_fetch){
    let headers_json= {
        'Content-Type': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
    }
    if(requestOptions && requestOptions.method == "POST") {
        headers_json['X-CSRFToken']= get_csrf_token();
    }
    console.log('set scft token: ', headers_json['X-CSRFToken']);
    var myHeaders = new Headers(headers_json);
    var requestOptions = Object.assign({}, {
            method: "GET",
            mode:'cors',
            credentials: 'include',//'',
            headers: myHeaders,
            redirect: 'follow'
        },requestOptions);
    
    let response;
    if(custom_fetch) {
        response = custom_fetch(url, requestOptions).then(response => response.json());
    }
    else {
        response = fetch(url, requestOptions).then(response => response.json());
    }
    return response;
}

export function get_album_details(albumId, server_fetch) {
    console.log('get_album_details: ', albumId)
    if(albumsData[albumId]) {
        console.log('return ',  albumId, ' from cache');
        return albumsData[albumId];
    }
    else {
        console.log('return ',  albumId, ' from server');
        console.log('fetch from: ', STATIC_BASE + "/_get_album_images/" + albumId);
        let response = fetch_wraper(STATIC_BASE + "/_get_album_images/" + albumId,{method:"GET"}, server_fetch)

        albumsData[albumId] = response;
        return albumsData[albumId];
    }
}

export async function request_csrf_token() {
    let uid = get_user_uuid();

    let extra = '/'
    if(uid)
        extra +=  uid;
    let json_response = await fetch_wraper(GET_CSRF_TOKEN_URL + extra);
    set_user_uuid(json_response['uid']);
    console.log('response: ', json_response);
    console.log(document.cookie);
}

function set_user_uuid(newUid) {
    localStorage.setItem('uuid', newUid);
}
export function get_user_uuid() {
    return localStorage.getItem('uuid');
}

export function get_csrf_token() {
    return getCookie('csrftoken');
}

export function submit_cart_form(data) {
    console.log(data);
        var requestOptions = {
            method:"POST",
            body: JSON.stringify(data),
        };
        let response 
        response = fetch_wraper(SUBMIT_CART_URL, requestOptions)//.then(response => response.json());
        return response;
}
export function submit_contact_form(data) {
    var requestOptions = {
        method: 'POST',
        body: JSON.stringify(data)
    };
    let response 
    response = fetch_wraper(CONTACT_FORM_URL, requestOptions)//.then(response => response.json());
    return response;
}