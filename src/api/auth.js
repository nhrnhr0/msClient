

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
export async function request_login(username, password) {
    let data = {
        'username':username,
        'password':password
    }

    let response = await my_fetch(AUTH_TOKEN_URL, {method:"POST", body: JSON.stringify(data)}, null, false);
    let json = await response.json();
    return json;

}

export async function request_logout() {
    let response = await my_fetch(AUTH_LOGOUT_URL, {method:"GET"});
    let json = await response.json();
    return json;
}
export async function request_whoAmI() {
    let response = await my_fetch(WHO_AM_I_URL, {method:"GET"});
    let json = response.json();
    return json;
}

export async function update_userInfoStore() {
    debugger;
    let resp = await request_whoAmI();
    let new_store_data = get(userInfoStore);
    if(resp?.status != 'not logged in') {
        new_store_data.me = resp;
        new_store_data.isLogin=true;
    }else {
        new_store_data = {isLogin:false}
    }
    userInfoStore.set(new_store_data);
}

/*export function request_refresh_token() {
    let data = {
        'refresh': get(userInfoStore).refresh,
    }
    let response = fetch_wraper(REFRESH_TOKEN_URL, {method: "POST", body:JSON.stringify(data)});
    return response;
}*/