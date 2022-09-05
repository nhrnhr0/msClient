let albumsData = {};
import { getCookie } from "$lib/utils/cookies";
import { BASE_URL,INVENTORY_MANUAL_UPDATE_ENTRY_URL,INVENTORY_EDIT_ENTRY_URL,GET_ALL_USERS_URL,ENTER_DOC_EDIT_URL, GET_CSRF_TOKEN_URL,PRODUCT_PHOTO_URL ,GET_ALL_BUSINESS_TYPES,LEAD_DISTRIBUTION_URL, STATIC_BASE ,CONTACT_FORM_URL,SEARCH_API_URL , MORDER_EDIT_ADD_PROVIDER_ENTRIES,SUBMIT_CART_URL, LOGS_URL, ADMIN_GET_ALL_CAMPAINS_URL,USER_GET_CAMPAINS_URL,PRODUCT_QUESTION_URL, GET_ALL_INTERESTS_URL, SEARCH_PPN_API_URL, ENTER_DOC_REMOVE_PRODUCT, ENTER_DOC_INSERT_INVENTORY_URL, SEARCH_PROVIDERS_API_URL, SEARCH_WAREHOUSES_URL, CREATE_ENTER_DOC_URL, MORDER_GET_API, MORDER_EDIT_ADD_PRODUCT_ENTRIES, MORDER_ADD_NEW_PRODUCT,DELETE_PRODUCT_FROM_MORDER_URL, MORDER_LIST_ORDERS_TO_COLLECT, REQUEST_PROVIDER_INFO_URL, GET_ALL_USERS_BY_BUSINESS_TYPES} from "./consts";

import { userInfoStore } from "./../stores/stores";
import { browser } from '$app/env';
import { get} from 'svelte/store';
import { my_fetch } from "src/network/my_fetch";


export async function request_provider_info(ppn_id) {
    let url = REQUEST_PROVIDER_INFO_URL + '/' + ppn_id;
    let response = await fetch_wraper(url);
    return response;
}

//import { request_refresh_token } from "./auth";
export async function api_get_smartbee_doc(doc_id) {
    let url = `${BASE_URL}/get-smartbee-doc/${doc_id}`;
    let response = await fetch_wraper(url);
    return response;
}

export async function apiGetInventoryHistory(entryId) {
    let url = INVENTORY_EDIT_ENTRY_URL + entryId + '/history/';
    return fetch_wraper(url);
}

export async function get_orders_to_collect() {
    let url = MORDER_LIST_ORDERS_TO_COLLECT
    return await fetch_wraper(url);
}


export async function update_stock_entry(entryId,data) {
    let url = INVENTORY_MANUAL_UPDATE_ENTRY_URL;
    return fetch_wraper(url + entryId, {
        method: "POST",
        body: JSON.stringify(data)
    });
}
export async function move_stock_entry(entryId, data){ 
    let url = INVENTORY_EDIT_ENTRY_URL + entryId;
    return fetch_wraper(url, {method: "POST", body: JSON.stringify(data)});
}

export async function morder_edit_add_provider_entry(entryId, data) {
    let url = MORDER_EDIT_ADD_PROVIDER_ENTRIES + entryId;
    return fetch_wraper(url, {
        method: "POST",
        body: JSON.stringify(data)
    });
}
export async function morder_edit_add_product_entries(form_data_obj) {
    return await fetch_wraper(MORDER_EDIT_ADD_PRODUCT_ENTRIES, {method:"POST", body:JSON.stringify(form_data_obj)});
}
export async function get_warehouses_api() {
    let url = BASE_URL + "/get-all-warehouses-api/";
    return fetch_wraper(url);
}
export function insert_doc_to_inventory_api(doc_id) {
    return fetch_wraper(ENTER_DOC_INSERT_INVENTORY_URL + doc_id, {
        method: "POST",
    });
}
export function save_enter_doc_edit_to_server(data) {
    return fetch_wraper(ENTER_DOC_EDIT_URL, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

export function remove_product_from_enter_doc_api(data) {
    return fetch_wraper(ENTER_DOC_REMOVE_PRODUCT, {
        method: 'DELETE',
        body: JSON.stringify(data)
    });
}


export function apiSubmitCreateDocStockEnter(data) {
    return fetch_wraper(CREATE_ENTER_DOC_URL, {
        method: "POST",
        body: JSON.stringify(data)
    });
}
export function apiSearchWarehouses(keyword) {
    let url = SEARCH_WAREHOUSES_URL + "?q=" + keyword;
    return fetch_wraper(url);
}

export function apiSearchPPN(keyword, provider) {
    const url = SEARCH_PPN_API_URL + '?q=' + encodeURIComponent(keyword) + '&provider=' + encodeURIComponent(provider);
    return fetch_wraper(url);
}


export async function apiGetMOrder(order_id, data, method="GET") {
    const response = await fetch_wraper(`${MORDER_GET_API}/${order_id}`, {
        body: JSON.stringify(data),
        method: method,
    });

    return response;
}

export function admin_get_enter_docs() {
    return fetch_wraper(`${BASE_URL}/inv/doc-stock-list-api`, {
        method: "GET",
    });
}
export function addPPNToEnterDoc(data) {
    return fetch_wraper(`${BASE_URL}/inv/enter-doc/add-doc-stock-enter-ppn`, {
        method: "POST",
        body: JSON.stringify(data)
    });
}
export function get_doc_stock_enter(doc_id) {
    return fetch_wraper(`${BASE_URL}/inv/doc-stock-detail-api/${doc_id}`, {
        method: "GET",
    });
}

export function save_doc_stock_enter_provider_requests(data) {
    return fetch_wraper(`${BASE_URL}/inv/enter-doc/save-doc-stock-enter-provider-requests`, {
        method: "POST",
        body: JSON.stringify(data)
    });
}
export function get_doc_stock_enter_provider_requests(doc_id) {
    return fetch_wraper(`${BASE_URL}/inv/doc-stock-enter-provider-requests-api/${doc_id}`, {
        method: "GET",
    })
}

export async function get_products_info(product_ids) {
    let url = `${BASE_URL}/get-products-info?product_ids=${product_ids}`;
    let response = await fetch_wraper(url);
    return response;
}
export async function apiGetAllUsers() {
    return my_fetch(GET_ALL_USERS_URL).then(response => response.json());
}
export function apiSendLogs(logs) {
  let body = {
    logs: logs,
    uid: get_user_uuid(),
  };
  return fetch_wraper(LOGS_URL, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

function fetch_wraper_prep(url, requestOptions, headers_json = {}) {
  console.log("fetch_wraper: ", url);
  headers_json = Object.assign(
    {},
    {
      "Content-Type": "application/json",
      "Content-Type": "application/json; charset=UTF-8",
    },
    headers_json
  );

  if (requestOptions && requestOptions.method == "POST") {
    headers_json["X-CSRFToken"] = get_csrf_token();
  } else {
  }

  if (browser) {
    if (get(userInfoStore).access) {
      headers_json["Authorization"] = "Token " + get(userInfoStore).access;

    }
  }
  var myHeaders = new Headers(headers_json);
  var requestOptions = Object.assign(
    {},
    {
      method: "GET",
      mode: "cors",
      credentials: "include", //'',
      headers: myHeaders,
      redirect: "follow",
    },
    requestOptions
  );
  return requestOptions;
}

export async function fetch_wraper_async(
  url,
  requestOptions,
  custom_fetch,
  isRetry = false
) {
  requestOptions = fetch_wraper_prep(url, requestOptions);
  let response;
  try {
    if (custom_fetch) {
      response = await custom_fetch(url, requestOptions);
    } else {
      response = await fetch(url, requestOptions);
    }
  } catch (error) {
    console.error(error);
    // expected output: ReferenceError: nonExistentFunction is not defined
    // Note - error messages will vary depending on browser
  }

  if (response.status == 401) {
    let userInfo = get(userInfoStore);
    // userInfo.isLogin = false;
    // userInfo.access = null;
    // userInfoStore.set(userInfo);
    if (!isRetry) {
      return fetch_wraper_async(url, requestOptions, custom_fetch, true);
    }
  }
  console.log(url, " ==> ", response.status);
  let json = await response.json();
  return json;
}

export function fetch_wraper_without_json(
  url,
  requestOptions,
  custom_fetch,
  isRetry = false
) {
  requestOptions = fetch_wraper_prep(url, requestOptions);
  let response;
  try {
    if (custom_fetch) {
      response = custom_fetch(url, requestOptions);
    } else {
      response = fetch(url, requestOptions);
    }
  } catch (error) {
    console.error(error);
    // expected output: ReferenceError: nonExistentFunction is not defined
    // Note - error messages will vary depending on browser
  }
  return response;
}
function formData_fetch_wraper(url, formData) {
  let headers_json = {};
  if (browser) {
    if (get(userInfoStore).access) {
      headers_json["Authorization"] = "Token " + get(userInfoStore).access;
    }
    headers_json["X-CSRFToken"] = get_csrf_token();
  }

  var myHeaders = new Headers(headers_json);
  var requestOptions = {
    method: "POST",
    mode: "cors",
    credentials: "include", //'',
    headers: myHeaders,
    redirect: "follow",
    body: formData,
  };
  return fetch(url, requestOptions);
}
export function fetch_wraper(
  url,
  requestOptions,
  custom_fetch,
  isRetry = false,
  headers_json = {}
) {
  requestOptions = fetch_wraper_prep(url, requestOptions, headers_json);
  let response;
  try {
    if (custom_fetch) {
      response = custom_fetch(url, requestOptions);
    } else {
      response = fetch(url, requestOptions);
    }
  } catch (error) {
    console.error(error);
    // expected output: ReferenceError: nonExistentFunction is not defined
    // Note - error messages will vary depending on browser
  }
  return response
    .then((data) => {
      if (data.status == 401) {
        let userInfo = get(userInfoStore);
        userInfo.isLogin = false;
        userInfo.access = null;
        userInfoStore.set(userInfo);
        if (!isRetry) {
          return fetch_wraper(url, requestOptions, custom_fetch, true);
        }
      }
      console.log(url, " ==> ", data.status);
      let json = data.json();
      return json;
    })
    .then((info) => {
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
// export function getAllProviders() {
//     return fetch_wraper(GET_ALL_PROVIDERS_URL);
// }
export function apiSearchProviders(keyword) {
    const url = SEARCH_PROVIDERS_API_URL + '?q=' + encodeURIComponent(keyword);
    return fetch_wraper(url);
}

export function apiSearchProducts(keyword) {
  const url = SEARCH_API_URL + "?q=" + encodeURIComponent(keyword);
  return fetch_wraper(url);
}
export function get_album_details(
  albumId,
  server_fetch = undefined,
  force_new = false
) {
  if (albumsData[albumId] && !force_new) {
    return albumsData[albumId];
  } else {
    let response = fetch_wraper(
      STATIC_BASE + "/_get_album_images/" + albumId,
      { method: "GET" },
      server_fetch
    );

    albumsData[albumId] = response;
    return albumsData[albumId];
  }

}

export async function request_csrf_token() {
  let uid = get_user_uuid();

  let extra = "/";
  if (uid) extra += uid;
  let response = await fetch_wraper(GET_CSRF_TOKEN_URL + extra);
  let json_response = response;
  set_user_uuid(json_response["uid"]);
  return json_response;
}

export async function apiDeleteProductFromMorder(data) {
    let response = await fetch_wraper(DELETE_PRODUCT_FROM_MORDER_URL, {method:"DELETE", body: JSON.stringify(data)});
    return response;
}

export async function apiAddNewProductToMorder(data) {
    const response = await fetch_wraper(`${MORDER_ADD_NEW_PRODUCT}`, {
        method: 'POST',
        body: JSON.stringify(data)
    });
    return response;
}

function set_user_uuid(newUid) {
  localStorage.setItem("uuid", newUid);
}
export function get_user_uuid() {
  return localStorage.getItem("uuid");
}
export async function send_product_photo(formData) {
  let headers_json = {};
  if (browser) {
    if (get(userInfoStore).access) {
      headers_json["Authorization"] = "Token " + get(userInfoStore).access;
    }
    headers_json["X-CSRFToken"] = get_csrf_token();
  }

  var myHeaders = new Headers(headers_json);
  var requestOptions = {
    method: "POST",
    mode: "cors",
    credentials: "include", //'',
    headers: myHeaders,
    redirect: "follow",
    body: formData,
  };
  return fetch(PRODUCT_PHOTO_URL, requestOptions);
}

/*export async function send_product_photo(formData) {
  return formData_fetch_wraper(PRODUCT_PHOTO_URL, formData);
}*/

export function send_product_question(data) {
  return fetch_wraper(PRODUCT_QUESTION_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function get_csrf_token() {
  return getCookie("csrftoken");
}
export function track_cart_to_server(data) {
  var requestOptions = {
    method: "POST",
    body: JSON.stringify(data),
  };
  let response;
  response = fetch_wraper(TRACK_CART_URL, requestOptions);
  return response;
}
export function submit_cart_form(data) {
  var requestOptions = {
    method: "POST",
    body: JSON.stringify(data),
  };
  let response;
  response = my_fetch(SUBMIT_CART_URL, requestOptions);
  return response;

}
export function submit_contact_form(data) {
  var requestOptions = {
    method: "POST",
    body: JSON.stringify(data),
  };
  let response;
  response = fetch_wraper(CONTACT_FORM_URL, requestOptions);
  return response;
}

export async function adming_get_campains() {
  let response = await fetch_wraper(ADMIN_GET_ALL_CAMPAINS_URL);
  let json_response = response;
  return json_response;
}
export async function loadBusinessTypes() {
  let response;
  response = await fetch_wraper_async(GET_ALL_BUSINESS_TYPES);
  return response;
}

export async function getAllUsersByBusinessTypes(queryParams = {}) {
  let response;
  response = await fetch_wraper_async(
    GET_ALL_USERS_BY_BUSINESS_TYPES + "?" + new URLSearchParams(queryParams)
  );
  return response;
}

export async function loadBusinessTypesGroups() {
  let response;
  response = await fetch_wraper_async(GET_ALL_BUSINESS_TYPES_GROUPS);
  return response;
}
export async function loadAllIntrests() {
  let response;
  response = await fetch_wraper_async(GET_ALL_INTERESTS_URL);
  return response;
}

export function submit_distribution_lead(data) {
  var requestOptions = {
    method: "POST",
    body: JSON.stringify(data),
  };
  let response;
  response = fetch_wraper(LEAD_DISTRIBUTION_URL, requestOptions);
  return response;
}

export const maps_key = import.meta.env["VITE_MAPS_API_KEY"];
export async function save_lead_to_server(data) {
    let response =await fetch_wraper(SAVE_LEAD_URL, {method:"POST", body: JSON.stringify(data)});
    return response;
}

