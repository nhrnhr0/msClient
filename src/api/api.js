

let albumsData = {};
import { getCookie } from "$lib/utils/cookies";
import { BASE_URL, GET_CSRF_TOKEN, STATIC_BASE ,CONTACT_FORM_URL, SUBMIT_CART_URL} from "./consts";
export function get_album_details(albumId, server_fetch) {
    console.log('get_album_details: ', albumId)
    if(albumsData[albumId]) {
        console.log('return ',  albumId, ' from cache');
        return albumsData[albumId];
    }
    else {
        console.log('return ',  albumId, ' from server');
        var myHeaders = new Headers({'Content-Type': 'application/json'});
        var requestOptions = {
        method: 'GET',
        mode:'cors',
        credentials: 'include',//'',
        headers: myHeaders,
        redirect: 'follow'
        };
        console.log('fetch from: ', STATIC_BASE + "/_get_album_images/" + albumId);
        let response 
        if(server_fetch) {
            response = server_fetch(STATIC_BASE + "/_get_album_images/" + albumId, requestOptions).then(response => response.json());
        }else {
            response = fetch(STATIC_BASE + "/_get_album_images/" + albumId, requestOptions).then(response => response.json());
        }
        albumsData[albumId] = response;
        return albumsData[albumId];
    }
}

export async function request_csrf_token() {
    let uid = get_user_uuid();
    
    var myHeaders = new Headers({'Content-Type': 'application/json'});
    var requestOptions = {
    method: 'GET',
    mode:'cors',
    credentials: 'include',//'',
    headers: myHeaders,
    redirect: 'follow'
    };

    let extra = '/'
    if(uid)
        extra +=  uid;
    let response = await fetch(GET_CSRF_TOKEN + extra,requestOptions);
    let json_response = await response.json();
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
    debugger;
    console.log(data);
    var myHeaders = new Headers({
        'Content-Type': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
        'X-CSRFToken': get_csrf_token()
      
      });
        var requestOptions = {
        method: 'POST',
        mode:'cors',
        credentials: 'include',//'',
        headers: myHeaders,
        body: JSON.stringify(data),
        redirect: 'follow'
        };
        let response 
        response = fetch(SUBMIT_CART_URL, requestOptions)//.then(response => response.json());
        return response;
}
export function submit_contact_form(data) {
    var myHeaders = new Headers({
        'Content-Type': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
        'X-CSRFToken': get_csrf_token()
      
      });
        var requestOptions = {
        method: 'POST',
        mode:'cors',
        credentials: 'include',//'',
        headers: myHeaders,
        body: JSON.stringify(data),
        redirect: 'follow'
        };
        let response 
        response = fetch(CONTACT_FORM_URL, requestOptions)//.then(response => response.json());
        return response;
}