

/*const BASE_SERVER_URL = import.meta.env['VITE_SERVER_LOCATION']

export const SEARCH_API_URL = BASE_SERVER_URL + '/search';
export const BASE_API_URL = BASE_SERVER_URL  + '/client-api/';
export const ALBUMS_API_URL = BASE_API_URL +  'albums/';
export const SIZES_API_URL = BASE_API_URL + 'sizes/';
export const COLORS_API_URL = BASE_API_URL + 'colors/';


export const STATIC_BASE = import.meta.env['VITE_STATIC_LOCATION']*/



debugger;
const BASE_URL = import.meta.env['VITE_SERVER_LOCATION']; //(import.meta.env.DEV ? 'http://localhost:8000' : 'http://localhost:8000' )
export const SEARCH_API_URL = BASE_URL + '/search';
export const BASE_API_URL = BASE_URL  + '/client-api/';
export const ALBUMS_API_URL = BASE_API_URL +  'albums/';
export const SIZES_API_URL = BASE_API_URL + 'sizes/';
export const COLORS_API_URL = BASE_API_URL + 'colors/';


export const STATIC_BASE = (import.meta.env.DEV ? 'http://localhost:8000' : 'http://localhost:8000' ); //'http://localhost:8000' //