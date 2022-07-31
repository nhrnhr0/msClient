<script context="module">
import { browser } from "$app/env";
import { page } from "$app/stores";

import { BASE_URL, CLOUDINARY_URL } from "src/api/consts";
import TopCategories from "src/lib/components/web/view/TopCategories.svelte";
import { my_fetch } from "src/network/my_fetch";
import { onMount } from "svelte";




    // load function is called when the page is loaded.
    export async function load({ fetch, page, session, contex }) {
        //console.log('load', { fetch, page, session, contex });
        // get top from the query string.
        /*let query= page.query;
        let url = BASE_URL + '/my-api/get-album-images?' + query;
        let page_info = [];
        let response = await my_fetch(url);
        page_info = await response.json();
        // productsManager = new ProductsManager();
        // productsManager.setQuery(query);
        // let products = await productsManager.loadProducts();
        console.log('got response',page_info);

        
        return {
            props: {
                page_info:page_info,
            }
        };*/
        return {
            props: {
                page_info: undefined,
            }
        };
    }
</script>

<script>
import SideCategoeis from "src/lib/components/web/view/SideCategoeis.svelte";
import { Spinner } from "sveltestrap";
import ProductsGrid from "src/lib/components/ProductsGrid.svelte";

    
    //export let products = {};
    export let page_info = undefined;
    let old_page_params = '';
    $: {
        console.log('newPageUrl', $page.host + $page.path + '?' +  $page.query.toString(),' === old: ', old_page_params);
        //data=[];
        if(browser) {
            
            // get all query params from the url.
            let query = $page.query.toString();
            if (old_page_params == query) {
                console.log('new page equal to old page, do nothing');
            }else {
                let url = BASE_URL + '/my-api/get-main-info?' + query;
                
                my_fetch(url).then(response => {
                    response.json().then(data => {
                        page_info = data;
                    });
                });

                /*productsManager.setQuery(query);
                productsManager.loadProducts().then(()=>{
                    console.log('productsManager.getProducts()', productsManager.getProducts());
                    data = productsManager.getProducts();
                });*/
            }
            old_page_params = query;
            //console.log('query', query);
        }
    }
    onMount(() => {
        // console.log('onMount', { pageData, data });
        // data = pageData.results;
    });
</script>
    <TopCategories />
    <div class="side-and-grid-wraper">
        <hr>
        <SideCategoeis albums={page_info?.top_albums} />
        <ProductsGrid page_info={page_info} />
    </div>
    <!--{#each (page_info?.results || []) as catalogImage}
        {@const entry = catalogImage.catalogImage}
        <div class="album">
            <a href="?p={entry.id}">
                <img src="{CLOUDINARY_URL}{entry.cimage}" alt="{entry.title}">
                <span>{entry.title}</span>
            </a>
        </div>
    {/each}-->
    

<style lang="scss">
        .side-and-grid-wraper {
            display:flex;
            flex-direction:row;
            justify-content:space-between;

            max-height:100%;
            .album {
                display:flex;
                flex-direction:column;
                align-items:center;
                justify-content:center;
                margin:10px;
                a {
                    text-decoration:none;
                    img {
                        width:100%;
                        height:auto;
                    }
                    span {
                        font-size:12px;
                        color:#999;
                    }
                }
            }
        }
    
</style>