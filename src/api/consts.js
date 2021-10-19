


export const BASE_API_URL = (import.meta.env.DEV ? 'http://localhost:8000' : 'http://localhost:8000' ) + '/client-api/'; //'http://localhost:8000' + '/client-api/';//
export const ALBUMS_API_URL = BASE_API_URL +  'albums/';
export const SIZES_API_URL = BASE_API_URL + 'sizes/';
export const COLORS_API_URL = BASE_API_URL + 'colors/';
export const STATIC_BASE = (import.meta.env.DEV ? 'http://localhost:8000' : 'http://localhost:8000' ); //'http://localhost:8000' //