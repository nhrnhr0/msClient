<script context="module">
import { browser } from "$app/env";
import { page } from "$app/stores";

import { BASE_URL, CLOUDINARY_URL } from "src/api/consts";
import TopCategories from "src/lib/components/web/view/TopCategories.svelte";
import { my_fetch, ProductsManager } from "src/network/my_fetch";
import { onMount } from "svelte";




    // load function is called when the page is loaded.
    let productsManager;
    export async function load({ fetch, page, session, contex }) {
        //console.log('load', { fetch, page, session, contex });
        // get top from the query string.
        let query= page.query;
        productsManager = new ProductsManager();
        productsManager.setQuery(query);
        let products = await productsManager.loadProducts();
        // let url = BASE_URL + '/my-api/get-album-images?' + query;
        // let custom_fetch = undefined;
        // if (!browser) {
        //     custom_fetch = fetch;
        // } else {
        // }
        // let response = await my_fetch(url, {}, custom_fetch=custom_fetch);
        // let pageData = await response.json();

        console.log('got response',);

        
        return {
            props: {
                products:products,
            }
        };
    }
</script>

<script>
import SideCategoeis from "src/lib/components/web/view/SideCategoeis.svelte";

    
    //export let products = {};
    export let products = [];
    let old_page_params = '';
    let productsManager = new ProductsManager();
    page.subscribe((newPageUrl)=> {
        //data=[];
        if(browser) {
            console.log('newPageUrl', newPageUrl);
            // get all query params from the url.
            let query = newPageUrl.query.toString();
            if (old_page_params == query) {
            }else {
                console.log('old_page_params', old_page_params);
                productsManager.setQuery(query);
                productsManager.loadProducts().then(()=>{
                    console.log('productsManager.getProducts()', productsManager.getProducts());
                    data = productsManager.getProducts();
                });
            }
            old_page_params = query;
            console.log('query', query);
        }
    });
    onMount(() => {
        // console.log('onMount', { pageData, data });
        // data = pageData.results;
    });
</script>
<TopCategories />
<SideCategoeis products={products} />
{#each products as catalogImage}
{@const entry = catalogImage.catalogImage}
    <div class="album">
        <a href="?p={entry.id}">
            <img src="{CLOUDINARY_URL}{entry.cimage}" alt="{entry.title}">
            <span>{entry.title}</span>
        </a>
    </div>
{/each}