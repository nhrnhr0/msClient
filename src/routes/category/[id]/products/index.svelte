<script context="module">
import { isNumeric } from "$lib/utils/utils";

import { fetch_wraper } from ".../../../../api/api";
import { ALL_IMAGE_ID_URL } from ".../../../../api/consts";
import { get_album_details } from ".../../../../api/api";
import { ALBUMS_API_URL } from "./../../../../api/consts";

    export async function load({page, fetch, session, contex}) {
        debugger;
        console.log(page.params.id);
        if(isNumeric(page.params.id)) {
            let response = await get_album_details(page.params.id, fetch)
            console.log(response);
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
</script>

{#each products as product}
    <a href="./products/{product.id}/">Product {product.id}</a>
{/each}
