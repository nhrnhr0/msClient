

/*const BASE_SERVER_URL = import.meta.env['VITE_SERVER_LOCATION']

export const SEARCH_API_URL = BASE_SERVER_URL + '/search';
export const BASE_API_URL = BASE_SERVER_URL  + '/client-api/';
export const ALBUMS_API_URL = BASE_API_URL +  'albums/';
export const SIZES_API_URL = BASE_API_URL + 'sizes/';
export const COLORS_API_URL = BASE_API_URL + 'colors/';


export const STATIC_BASE = import.meta.env['VITE_STATIC_LOCATION']*/



export const BASE_URL = import.meta.env['VITE_SERVER_LOCATION'];
export const SEARCH_API_URL = BASE_URL + '/search';
export const BASE_API_URL = BASE_URL  + '/client-api/';
export const ALBUMS_API_URL = BASE_API_URL +  'albums/';
export const SIZES_API_URL = BASE_API_URL + 'sizes/';
export const COLORS_API_URL = BASE_API_URL + 'colors/';
export const LOGOS_API_URL = BASE_API_URL + 'logos/';
export const GET_CSRF_TOKEN_URL = BASE_URL + '/api/set_csrf_token';
export const CONTACT_FORM_URL = BASE_URL + '/contact-form';
export const SUBMIT_CART_URL = BASE_URL + '/cart-form';
//export const AUTH_TOKEN_URL = BASE_URL + '/api/token/';
//export const REFRESH_TOKEN_URL = BASE_URL + '/api/token/refresh/';
export const AUTH_TOKEN_URL = BASE_URL + '/api/get-token/';
export const WHO_AM_I_URL = BASE_URL + '/api/who-am-i/'
export const AUTH_LOGOUT_URL = BASE_URL + '/api/logout/';
//http://127.0.0.1:8000/api/token/

export const STATIC_BASE = import.meta.env['VITE_SERVER_LOCATION'];


export const CLOUDINARY_URL = 'https://res.cloudinary.com/ms-global/image/upload/';