import { BASE_URL } from "src/api/consts";
import { my_fetch } from "./my_fetch";


export async function fetch_main_page_albums(fetch=undefined) {
    let res = await my_fetch(BASE_URL + '/get-main-page-albums/', {}, fetch);
    let data = await res.json();
    return data;
}