

let albumsData = {};
import { STATIC_BASE } from "./consts";
export function get_album_details(albumId) {
    console.log('get_album_details: ', albumId)
    if(albumsData[albumsData]) {
        return albumsData[albumsData];
    }
    else {
        var myHeaders = new Headers();
        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        let response = fetch(STATIC_BASE + "/_get_album_images/" + albumId, requestOptions).then(response => response.json());
        albumsData[albumId] = response;
        return albumsData[albumId];
    }
}