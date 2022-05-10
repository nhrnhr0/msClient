<script context="module">

import { onMount } from "svelte";

  
  export let sizes;
  export let colors;
</script>
<script>
    import { colorsJsonStore, sizesJsonStore } from "@src/stores/stores";
import { fetch_wraper,get_album_details } from "@src/api/api";
import { MAIN_PAGE_API } from "@src/api/consts";
import { browser } from "$app/env";
    onMount(async()=> {
        let response = await fetch_wraper(MAIN_PAGE_API, {
      method: 'GET',
      redirect: 'follow'
    }, fetch)
    let json = await response
    let logos_json = json.logos
    let albums_json = json.albums
    albums_json = albums_json.filter(album => album.is_public)
    let colors_json = json.colors
    let sizes_json = json.sizes
    let sizes_ret = {};
    for (let i = 0; i < sizes_json.length; i++) {
      sizes_ret[sizes_json[i].id] = sizes_json[i];
    }

    let colors_ret = {};
    for (let i = 0; i < colors_json.length; i++) {
      colors_ret[colors_json[i].id] = colors_json[i];
    }
        debugger;
        console.log('onMount __layout.reset.svelte dashboard');
        console.log('colorsJsonStore: ', colorsJsonStore);
        console.log('sizesJsonStore: ', sizesJsonStore);
        console.log('colors: ', colors_ret)
        console.log('sizes: ', sizes_ret)

        sizesJsonStore.set(sizes_ret);
        colorsJsonStore.set(colors_ret);
    })
</script>

<slot></slot>