<script context="module">
import { fetch_wraper } from "./../../api/api";
import { ALL_IMAGE_ID_URL } from "./../../api/consts";


    

    export async function load({fetch}) {
        let response = await fetch_wraper(ALL_IMAGE_ID_URL, {method: "GET"}, fetch);
        console.log(response);
        return {
            props: {
                ids: response.ids
            }
            
        };
    }
    
</script>
<script>
    export let ids;
</script>

{#each ids as id}
    <a href="/products/{id}/">Product {id}</a>
{/each}
