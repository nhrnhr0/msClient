<script context="module">
import { browser } from "$app/env";
import { onMount } from "svelte";

import { fetch_wraper } from "./../../api/api";
import { CLOUDINARY_URL, PRODUCTS_API_URL } from "./../../api/consts";


    export async function load({page, fetch, session, contex}) {
        debugger;
        console.log(page);
        console.log("load", page.params);
        let url = PRODUCTS_API_URL + page.params.id + "/";
        console.log(url);
        if(isNumeric(page.params.id)) {
            let response = await fetch_wraper(url , {"method":"GET"}, fetch);
            console.log(response);
            return {
                props: {
                    data: response,
                }
            }
        }
        else {
            
        }
        
        
    }

    function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}
</script>
<script>
    export let data;
    onMount(()=> {
        sessionStorage.setItem("onLoadTask",JSON.stringify({type: 'product', data: data}));
        window.location.replace("/"); 
    })
    
            
</script>
<svelte:head>
    <title>{data?.title}</title>
    <meta name="description" content={data?.description} />
    <meta name="keywords" content={data?.keywords} />
    <meta property="og:title" content={data?.title} />
    <meta property="og:description" content={data?.description} />
    <meta property="og:image" content={CLOUDINARY_URL + 'f_auto,w_auto/' + data?.cimage} />
    <meta property="og:type" content="product" />
    <meta property="og:site_name" content="M.S. Global" />
    <meta property="og:locale" content="IL" />
    
</svelte:head>