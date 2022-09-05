


// if all the albums are is indexdb and are not expired, then return them
// else return the albums from the server and save them in indexdb

import { BASE_URL } from "src/api/consts";
import { my_fetch } from "src/network/my_fetch";

// return a promise
export async function get_albums(ids) {
    
    let albums = await get_albums_from_indexdb(ids);
    if(albums.length === ids.length) {
        return albums;
    }else {
        let albums_from_server = await get_albums_from_server(ids);
        //await save_albums_to_indexdb(albums_from_server);
        return albums_from_server;
    }
}

export async function get_albums_from_indexdb(ids) {
    let albums = [];
    /*for(let id of ids) {
        let album = await get_album_from_indexdb(id);
        if(album) {
            albums.push(album);
        }
    }*/
    return albums;
}
export async function get_albums_from_server(ids) {
    let res = await my_fetch(`${BASE_URL}/get-albums/?ids=${ids}`);
    return res.json();
}