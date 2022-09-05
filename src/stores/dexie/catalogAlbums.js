import { db } from "src/db";


import  {fetch_catalog_albums} from "src/stores/dexie/api_wrapers";


export async function get_catalog_album_by_id(id) {
    let album =  await db.catalogAlbums.get(id);
    if(!album) {
        album = await fetch_catalog_albums(id);
    }
    return album;
}