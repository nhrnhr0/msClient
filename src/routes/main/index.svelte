<script context="module">


import { BASE_URL, CLOUDINARY_URL } from "src/api/consts";
import TopCategories from "src/lib/components/web/view/TopCategories.svelte";
import { my_fetch } from "src/network/my_fetch";
import { onMount,onDestroy } from "svelte";




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
        let url = BASE_URL + '/my-api/get-main-info?' + page.query.toString();
        
        let response = await my_fetch(url,{}, fetch);
        let data = await response.json()
        return {
            props: {
                page_info: data,
            }
        };
    }
</script>

<script>
import SideCategoeis from "src/lib/components/web/view/SideCategoeis.svelte";
import ProductsGrid from "src/lib/components/ProductsGrid.svelte";
import { page } from "$app/stores";
import ProductShow from "src/lib/components/ProductShow.svelte";
import { browser } from "$app/env";


    //export let products = {};
    export let page_info = undefined;
    let old_page_params = '';
    /*$: {
        console.log('newPageUrl', $page.host + $page.path + '?' +  $page.query.toString(),' === old: ', old_page_params);
        if(browser) {
            
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
            }
            old_page_params = query;
        }
    }*/
    onMount(() => {
        // console.log('onMount', { pageData, data });
        // data = pageData.results;
        
    });
    onDestroy(() => {
        // console.log('onDestroy', { pageData, data });
        // data = pageData.results;
        
    });
</script>

<!-- og data -->
<svelte:head>
  <title>{page_info.og_meta?.title || ''}</title>
  <link rel="icon" href="{page_info.og_meta?.icon || ''}" />
  <meta name="title" content="{page_info.og_meta?.title || ''}">
  <meta name="description" content="{page_info.og_meta?.description || ''}">
  <meta name="keywords" content="{page_info.og_meta?.keywords || ''}" />


  <meta property="og:title" content="{page_info.og_meta?.title || ''}" />
  <meta property="og:description" content={page_info.og_meta?.description || ''} />
  <meta property="og:image" content={page_info.og_meta?.icon || ''} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="M.S. Global" />
  <meta property="og:locale" content="IL" />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:title" content="{page_info.og_meta?.title || ''}">
  <meta property="twitter:description" content="{page_info.og_meta?.description || ''}">
  <meta property="twitter:image" content="{page_info.og_meta.icon || ''}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
</svelte:head>
    
    <TopCategories page_info={page_info} />
    <div class="side-and-grid-wraper">
        <hr>
        <SideCategoeis albums={page_info?.top_albums} />
        {#if $page.query.get('product_id')}
            {#key $page.query.get('product_id')}
                <ProductShow productInfo={page_info?.productInfo} product_id={$page.query.get('product_id')} />
            {/key}
        {:else}
            {#key $page.query.toString()}
                <ProductsGrid page_info={page_info} />
            {/key}
        {/if}
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