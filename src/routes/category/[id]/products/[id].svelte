<script context="module">
import { browser } from "$app/env";
import { isNumeric } from "$lib/utils/utils";
import { onMount } from "svelte";

import { fetch_wraper } from "../../../../api/api";
import { CLOUDINARY_URL, PRODUCTS_API_URL } from "../../../../api/consts";


    export async function load({fetch, page, session, contex}) {
        //console.log(page);
        //let url = PRODUCTS_API_URL + page.params.id + "/";
        let params = page.params;
        let server_url = PRODUCTS_API_URL + params.id + "/";
        //console.log(url);
        if(isNumeric(params.id)) {
            let response = await fetch_wraper(server_url , {"method":"GET"}, fetch);
            //console.log(response);
            response.description = response.description.replace(/(\r\n|\n|\r)/gm, "");
            let category_regex = '\/category\/(.+)\/products';
            let category = ['0','1']
            if(browser) {
                category = window.location.href.match(category_regex);
            }
            //let favicon = `${CLOUDINARY_URL}u_v1649744644:msAssets:image_5_qo7yhx.jpg/${response?.cimage}`;
            let favicon = `${CLOUDINARY_URL}/c_scale,w_365/c_scale,u_v1649744644:msAssets:image_5_qo7yhx.jpg,w_500/${response?.cimage}`;
            return {
                props: {
                    data: response,
                    album: category[1],
                    favicon: favicon
                }
            }
        }
        else {
            
        }
        
        
    }

    
</script>
<script>
    export let data;
    export let album;
    export let favicon;
    onMount(()=> {
        sessionStorage.setItem("onLoadTask",JSON.stringify({type: 'product', data: data, album: album}));
        window.location.replace("/"); 
    })
    
            
</script>
<svelte:head>
    <!-- Primary Meta Tags -->
    <title>{data?.title}</title>
    <link rel="icon" href="{favicon}">
    <meta name="title" content="{data?.title}">
    <meta name="description" content="{data?.description}">
    <meta name="keywords" content={data?.keywords} />



    <meta property="og:title" content={data?.title} />
    <meta property="og:description" content={data?.description} />
    <meta property="og:image" content={favicon} />
    <meta property="og:type" content="product" />
    <meta property="og:site_name" content="M.S. Global" />
    <meta property="og:locale" content="IL" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="{data?.title}">
    <meta property="twitter:description" content="{data?.description}">
    <meta property="twitter:image" content="{favicon}">
    
</svelte:head>