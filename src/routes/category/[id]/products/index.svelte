<script context="module">
import { isNumeric } from "$lib/utils/utils";

import { fetch_wraper } from ".../../../../api/api";
import { ALL_IMAGE_ID_URL } from ".../../../../api/consts";
import { get_album_details } from ".../../../../api/api";
import { ALBUMS_API_URL } from "./../../../../api/consts";
import { onMount } from "svelte";
import { flashy_page_view } from "$lib/flashy";

    export async function load({fetch, page, session, contex}) {
        //console.log(page.params.id);
        let params = page.params;
        if(isNumeric(params.id)) {
            let response = await get_album_details(params.id, fetch)
            //console.log(response);
            return {
                props: {
                    products: response,
                }
            }
        }
        
    }
    
</script>
<script>
    export let products;
    onMount(()=> {
        flashy_page_view();
        var loc = window.location.href;
        loc = loc.replace('/products', '');
        window.location.replace(loc);
    })
</script>

{#each products as product}
    <a href="./products/{product.id}/">Product {product.id}</a>
{/each}
