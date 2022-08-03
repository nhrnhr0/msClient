

import {fetch_wraper} from './api';
import { AUTH_TOKEN_URL, WHO_AM_I_URL, AUTH_LOGOUT_URL } from './consts';
import { get } from 'svelte/store';
import { userInfoStore } from "./../stores/stores";
import { my_fetch } from 'src/network/my_fetch';
export function request_update_user_detail(username, old_password, new_password) {
    return fetch_wraper(WHO_AM_I_URL, {
        method: 'POST',
        body: JSON.stringify({
            username,
            old_password,
            new_password
        })
    });
}
export function request_login(username, password) {
    let data = {
        'username':username,
        'password':password
    }

    let response = my_fetch(AUTH_TOKEN_URL, {method:"POST", body: JSON.stringify(data)}, null, false)
    return response;

}

export function request_logout() {
    let response = my_fetch(AUTH_LOGOUT_URL, {method:"GET"})
    return response;
}
export function request_whoAmI() {
    let response = fetch_wraper(WHO_AM_I_URL, {method:"GET"});
    return response;
}


/*export function request_refresh_token() {
    let data = {
        'refresh': get(userInfoStore).refresh,
    }
    let response = fetch_wraper(REFRESH_TOKEN_URL, {method: "POST", body:JSON.stringify(data)});
    return response;
}*/