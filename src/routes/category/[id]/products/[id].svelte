<script context="module">
import { browser } from "$app/env";
import { isNumeric } from "$lib/utils/utils";
import { onMount } from "svelte";

import { fetch_wraper } from "../../../../api/api";
import { CLOUDINARY_URL, PRODUCTS_API_URL } from "../../../../api/consts";


    export async function load({page, fetch, session, contex}) {
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

    
</script>
<script>
    export let data;
    onMount(()=> {
        sessionStorage.setItem("onLoadTask",JSON.stringify({type: 'product', data: data}));
        window.location.replace("/"); 
    })
    
            
</script>
<svelte:head>
    <!-- Primary Meta Tags -->
    <title>{data?.title}</title>
    <meta name="title" content="{data?.title}">
    <meta name="description" content="{data?.description}">
    <meta name="description" content={data?.description} />
    <meta name="keywords" content={data?.keywords} />



    <meta property="og:title" content={data?.title} />
    <meta property="og:description" content={data?.description} />
    <meta property="og:image" content={CLOUDINARY_URL + 'f_auto,w_auto/' + data?.cimage} />
    <meta property="og:type" content="product" />
    <meta property="og:site_name" content="M.S. Global" />
    <meta property="og:locale" content="IL" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="{data?.title}">
    <meta property="twitter:description" content="{data?.description}">
    <meta property="twitter:image" content="{CLOUDINARY_URL + 'f_auto,w_auto/' + data?.cimage}">
    
</svelte:head>