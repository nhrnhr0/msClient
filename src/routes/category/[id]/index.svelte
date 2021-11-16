<script context="module">
import { isNumeric } from "$lib/utils/utils";
    import { onMount } from "svelte";
    
    import { fetch_wraper } from "./../../../api/api";
    import { ALBUMS_API_URL, CLOUDINARY_URL } from "./../../../api/consts";
    
    
        export async function load({page, fetch, session, contex}) {
            //console.log(page);
            //console.log("load", page.params);
            let url = ALBUMS_API_URL + page.params.id + "/";
            //console.log(url);
            if(isNumeric(page.params.id)) {
                let response = await fetch_wraper(url , {"method":"GET"}, fetch);
                //console.log(response);
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
            sessionStorage.setItem("onLoadTask",JSON.stringify({type: 'category', data: data}));
            window.location.replace("/"); 
        })
        
                
    </script>
    <svelte:head>
        <title>{data?.title}</title>
        <meta name="description" content={data?.description} />
        <meta name="keywords" content={data?.keywords} />
        <meta name="title" content="{data?.title}">


        <meta property="og:title" content={data?.title} />
        <meta property="og:description" content={data?.description} />
        <meta property="og:image" content={CLOUDINARY_URL + 'f_auto,w_auto/' + data?.first_image?.cimage} />
        <meta property="og:type" content="category" />
        <meta property="og:site_name" content="M.S. Global" />
        <meta property="og:locale" content="IL" />

        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:title" content="{data?.title}">
        <meta property="twitter:description" content="{data?.description}">
        <meta property="twitter:image" content="{CLOUDINARY_URL + 'f_auto,w_auto/' + data?.cimage}">
        
    </svelte:head>

<a href="./{data.id}/products/">products</a>