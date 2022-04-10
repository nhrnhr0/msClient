

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

export const SEARCH_API_URL = BASE_URL + '/search';
export const ADMIN_API_URL = BASE_URL + '/admin-api';
export const ALBUMS_API_URL = BASE_API_URL +  'albums/';
export const PRODUCTS_API_URL = BASE_API_URL + 'images/';
export const SIZES_API_URL = BASE_API_URL + 'sizes/';
export const COLORS_API_URL = BASE_API_URL + 'colors/';
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

// CRM
export const LEAD_DISTRIBUTION_URL = BASE_API_URL + 'lead-distribution/';
export const GET_ALL_INTERESTS_URL = CRM_BASE_API + 'get-all-interests/';
export const GET_ALL_BUSINESS_TYPES = CRM_BASE_API + 'get-all-business-types/'

//http://127.0.0.1:8000/api/token/
//export const OG_META_ALBUMS_URL = BASE_API_URL + 'og-meta-albums/';

export const STATIC_BASE = import.meta.env['VITE_SERVER_LOCATION'];


export const CLOUDINARY_URL = 'https://res.cloudinary.com/ms-global/image/upload/';