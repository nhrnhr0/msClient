/*const BASE_SERVER_URL = import.meta.env['VITE_SERVER_LOCATION']

export const SEARCH_API_URL = BASE_SERVER_URL + '/search';
export const BASE_API_URL = BASE_SERVER_URL  + '/client-api/';
export const ALBUMS_API_URL = BASE_API_URL +  'albums/';
export const SIZES_API_URL = BASE_API_URL + 'sizes/';
export const COLORS_API_URL = BASE_API_URL + 'colors/';


export const STATIC_BASE = import.meta.env['VITE_STATIC_LOCATION']*/


export const BASE_URL = import.meta.env['VITE_SERVER_LOCATION'];
export const CRM_BASE_API = BASE_URL + '/crm-api/';
export const BASE_API_URL = BASE_URL  + '/client-api/';
export const CART_HISTORY_URL = BASE_URL + "/cart-history";

export const SEARCH_API_URL = BASE_URL + '/search';
export const ADMIN_API_URL = BASE_URL + '/admin-api';
export const ALBUMS_API_URL = BASE_API_URL +  'albums/';
export const PRODUCTS_API_URL = BASE_API_URL + 'images/';
export const SIZES_API_URL = BASE_API_URL + 'sizes/';
export const COLORS_API_URL = BASE_API_URL + 'colors/';
export const VARIANTS_API_URL = BASE_API_URL + 'get-all-variants/';
export const WAREHOUSES_API_URL = BASE_URL + '/get-all-warehouses-api/'
export const LOGOS_API_URL = BASE_API_URL + 'logos/';
export const GET_CSRF_TOKEN_URL = BASE_URL + '/api/set_csrf_token';
export const CONTACT_FORM_URL = BASE_URL + '/contact-form';
export const SUBMIT_CART_URL = BASE_URL + '/cart-form';
export const TRACK_CART_URL = BASE_URL + '/track-cart';
export const MAIN_PAGE_API = BASE_URL + '/main_page_api/';
export const PRODUCT_QUESTION_URL = BASE_URL + '/product-question';
export const PRODUCT_PHOTO_URL = BASE_URL + '/product-photo';
//export const AUTH_TOKEN_URL = BASE_URL + '/api/token/';
//export const REFRESH_TOKEN_URL = BASE_URL + '/api/token/refresh/';
export const AUTH_TOKEN_URL = BASE_URL + '/api/get-token/';
export const WHO_AM_I_URL = BASE_URL + '/api/who-am-i/'
export const AUTH_LOGOUT_URL = BASE_URL + '/api/logout/';
export const ALL_IMAGE_ID_URL = BASE_URL + '/api/all-image-ids/';
export const LOGS_URL = BASE_URL + '/api/logs/';
export const ADMIN_GET_ALL_CAMPAINS_URL = ADMIN_API_URL + '/get-all-campaigns/';
export const USER_GET_CAMPAINS_URL = BASE_API_URL + 'get-user-campains/';
export const GET_ALL_USERS_URL = BASE_URL + '/api/get-all-users/';
export const SEARCH_PROVIDERS_API_URL = BASE_URL + '/search-providers';
export const SEARCH_WAREHOUSES_URL = BASE_URL + '/search-warehouses';
export const CREATE_ENTER_DOC_URL = BASE_URL + '/inv/create-enter-doc/';
export const GET_ALL_ORDERS = BASE_URL + '/api/get-all-orders';
// export const GET_ALL_PROVIDERS_URL = BASE_URL + '/svelte/api/providers/';
// CRM
export const LEAD_DISTRIBUTION_URL = BASE_API_URL + 'lead-distribution/';
export const GET_ALL_INTERESTS_URL = CRM_BASE_API + 'get-all-interests/';
export const GET_ALL_BUSINESS_TYPES = CRM_BASE_API + 'get-all-business-types/'
export const SEARCH_PPN_API_URL = BASE_URL + '/search-ppn';
export const ENTER_DOC_EDIT_URL = BASE_URL + '/enter-doc-edit/';
export const ENTER_DOC_REMOVE_PRODUCT = BASE_URL + '/enter-doc-remove-product/';
export const ENTER_DOC_INSERT_INVENTORY_URL = BASE_URL + '/enter-doc-insert-inventory/';
export const GET_ALL_INVENTORY = BASE_URL + '/get-all-inventory-api/';
export const GET_STOCK_BY_ID_URL = BASE_URL + '/get-stock-by-id-api/';
export const INVENTORY_EDIT_ENTRY_URL = BASE_URL + '/inventory-edit-entry/';
export const INVENTORY_MANUAL_UPDATE_ENTRY_URL = BASE_URL + '/inventory-manual-update-entry/';
//http://127.0.0.1:8000/api/token/
//export const OG_META_ALBUMS_URL = BASE_API_URL + 'og-meta-albums/';
export const MORDER_GET_API = BASE_URL + '/morders/api-get-order-data2';
export const MORDER_EDIT_ADD_PRODUCT_ENTRIES = BASE_URL + '/morders/edit-order-add-product-entries/v2';
export const MORDER_EDIT_ADD_PROVIDER_ENTRIES = BASE_URL + '/morders/edit-order-add-provider-entries/';
export const MORDER_ADD_NEW_PRODUCT = BASE_URL + '/morders/api-edit-order/add-new-product'
export const DELETE_PRODUCT_FROM_MORDER_URL = BASE_URL + '/morders/api-edit-order/delete-product-from-morder';
export const MORDER_LIST_ORDERS_TO_COLLECT = BASE_URL + '/morders/list-orders-to-collect'
export const MORDER_GET_ORDER_DETAIL_TO_COLLECT = BASE_URL + '/morders/get-order-detail-to-collect'
export const LOAD_ALL_PROVIDER_REQUEST_TO_ORDER = BASE_URL + '/load-all-provider-request';
export const UPDATE_PROVIDER_REQUEST_ENTRY = BASE_URL + '/update-provider-request-entry';
export const CREATE_PROVIDER_DOCS = BASE_URL + '/create-provider-docs';
export const STATIC_BASE = import.meta.env['VITE_SERVER_LOCATION'];
export const CLOUDINARY_URL =
  "https://res.cloudinary.com/ms-global/image/upload/";
export const REQUEST_PROVIDER_INFO_URL = BASE_URL + '/request-provider-info';

export const CART_HISTORY_URL = BASE_URL + 'cart-history'