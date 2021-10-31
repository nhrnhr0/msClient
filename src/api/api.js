

let albumsData = {};
import { STATIC_BASE } from "./consts";
export function get_album_details(albumId, server_fetch) {
    console.log('get_album_details: ', albumId)
    if(albumsData[albumId]) {
        console.log('return ',  albumId, ' from cache');
        return albumsData[albumId];
    }
    else {
        console.log('return ',  albumId, ' from server');
        var myHeaders = new Headers();
        var requestOptions = {
        method: 'GET',
        credentials: 'same-origin',//'',
        headers: myHeaders,
        redirect: 'follow'
        };
        console.log('fetch from: ', STATIC_BASE + "/_get_album_images/" + albumId);
        let response 
        if(server_fetch) {
            response = server_fetch(STATIC_BASE + "/_get_album_images/" + albumId, requestOptions).then(response => response.json());
        }else {
            response = fetch(STATIC_BASE + "/_get_album_images/" + albumId, requestOptions).then(response => response.json());
        }
        albumsData[albumId] = response;
        return albumsData[albumId];
    }
}
