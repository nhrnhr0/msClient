

import {fetch_wraper} from './api';
import { AUTH_TOKEN_URL, REFRESH_TOKEN_URL, WHO_AM_I_URL } from './consts';
import { get } from 'svelte/store';
import { userInfoStore } from "./../stores/stores";

export function request_login(username, password) {
    let data = {
        'username':username,
        'password':password
    }

    let response = fetch_wraper(AUTH_TOKEN_URL, {method:"POST", body: JSON.stringify(data)})
    return response;

}


export function request_whoAmI() {
    let response = fetch_wraper(WHO_AM_I_URL, {method:"GET"});
    return response;
}


export function request_refresh_token() {
    let data = {
        'refresh': get(userInfoStore).refresh,
    }
    console.log('refresh: ', get(userInfoStore).refresh);
    let response = fetch_wraper(REFRESH_TOKEN_URL, {method: "POST", body:JSON.stringify(data)});
    return response;
}