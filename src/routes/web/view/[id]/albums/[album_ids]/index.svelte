<script context="module">

</script>

<script>
import { onMount } from "svelte";
import {page} from '$app/stores';
import { my_fetch } from "src/network/my_fetch";
import { BASE_URL, CLOUDINARY_URL } from "src/api/consts";
import { Spinner } from "sveltestrap";
import { browser } from "$app/env";

    onMount(async () => {
        console.log('web/view/[id]/albums/[ids]/index onMount');
    });

    let products = [];
    let products_request_url = undefined;
    let products_request;
    let nextUrl = undefined;
    let result_count;
    let requesting = false;
    let scrollPercent;
    $: {
        let topLevelId = $page.params.id;
        let ids = $page.params.album_ids;        
        products_request_url = `${BASE_URL}/api/v1/products?top_level_id=${encodeURI(topLevelId)}&album_ids=${encodeURI(ids)}`;
        console.log(products_request_url);
        requesting = true;
        products_request = my_fetch(products_request_url, {
            method: 'GET',
        });
        products_request.then(response => response.json().then(data => {
            console.log(data);
            //products_ids = data.results.map(product => product.id);
            products = data.results;
            nextUrl = data.next;
            result_count = data.count;
            requesting = false;
        }));
    }
    let currY;
let postHeight;
let scrollHeight;
let percent;
    $: {
        result_count;
        let el = browser && window.document.querySelector('#products-container');
        if (el) {
        // on scroll:
            el.addEventListener('scroll', () => {
                /*debugger;
                currY =  el.scrollTop;
                postHeight = el.getBoundingClientRect().height;
                scrollHeight = document.querySelector("body").clientHeight;
                
                scrollPercent = (currY / (scrollHeight - postHeight)) * 100;*/
                let height = el.clientHeight;
                let scrollHeight = el.scrollHeight - height;
                let scrollTop = el.scrollTop;
                percent = Math.floor(scrollTop / scrollHeight * 100);
                /*
                if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
                    if (!requesting) {
                        requesting = true;
                        if (nextUrl) {
                            products_request = my_fetch(nextUrl, {
                                method: 'GET',
                            });
                            products_request.then(response => response.json().then(data => {
                                console.log(data);
                                //products_ids = data.results.map(product => product.id);
                                products = products.concat(data.results);
                                nextUrl = data.next;
                                result_count = data.count;
                                requesting = false;
                            }));
                        }
                    }
                }*/
            });
        }
    }
</script>

<div class="content">
    
    <div class="total-products">
        {#if requesting}
            <Spinner />
        {:else}
            {result_count} מוצרים
            |
            percent: {percent}
            <div class="bar-long"></div>
        {/if}
    </div>
    <div class="products" id="products-container">
        {#each products as product}
            <div class="product">
                <!--
                    possible paths
                    $page.path /web/view/1/albums/all/
                    $page.path /web/view/1/albums/15-16-17/
                    $page.path /web/view/1/albums/15-16-17-18/pid/1/
                    $page.path /web/view/1/albums/all
                    $page.path /web/view/1/albums/15-16-17
                    $page.path /web/view/1/albums/15-16-17-18/pid/1
                    wanted href:
                    pid=3
                    $page.path /web/view/1/albums/all/pid/3
                    $page.path /web/view/1/albums/15-16-17/pid/3
                    $page.path /web/view/1/albums/15-16-17-18/pid/3
                -->

                <a href="{$page.path.indexOf('pid')==-1? ($page.path+ '/pid/' + product.id): ($page.path.replace('(\/pid\/[0-9]+\/?)' + product.id))}">
                    <img alt="{product.title}" src="{CLOUDINARY_URL}{product.cimage}" width="200" height="200" />
                    <div class="product-title">{product.title}</div>
                    <!-- "show details" and "add to cart" buttons -->
                    <div class="buttons">
                        <button class="btn btn-secondary">הצג פרטים</button>
                        <button class="btn btn-primary">הוסף לסל</button>
                    </div>
                </a>
            </div>
        {/each}
    </div>
</div>


<style lang="scss">
    .content {
        width: 100%;
        height: calc(100vh - 145px);
        margin: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(240, 248, 255, 0.397);
        border: 1px solid red;
        border-radius: 10px;
        // shadow
        box-shadow: -5px 30px 10px rgba(0, 0, 0, 0.4);
        position: relative;
        overflow: hidden;
        .total-products {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 40px;
            background-color: rgba(240, 248, 255, 0.397);
            border-radius: 10px 10px 0 0;
            padding: 10px;
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            color: #000;
        }
        .products {
            height: 100%;
            width: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            margin-top: 85px;
            padding-bottom: 85px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            align-items: center;
            text-decoration: none;
            .product {
                width:auto;
                height: auto;
                //border: 1px solid red;
                display: flex;
                flex:1;
                flex-grow: 0;
                flex-shrink: 1;
                margin:7px;
                a {
                    flex:1;
                    flex-grow: 1;
                    flex-shrink: 1;
                    height: 100%;
                    background-color: rgba(240, 248, 255, 0.397);
                    border-radius: 10px;
                    overflow: hidden;
                    img {
                        width: 200px;
                        height: 200px;
                    }
                    .product-title {
                        font-size: 17px;
                        font-weight: bold;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        //font-weight: bold;
                        color: #000;
                        //padding: 10px;
                        width:200px;
                    }
                    .buttons {
                        display: flex;
                    }
                    
                    text-decoration: none;
                    //border:1px solid blue;
                    
                }
            }
        }
    }
</style>
