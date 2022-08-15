<script context="module">




</script>

<script>
import { page } from "$app/stores";
import { BASE_URL, CLOUDINARY_URL } from "src/api/consts";
import { my_fetch } from "src/network/my_fetch";
import { Spinner } from "sveltestrap";
import {add_products_slim_to_indexdb} from 'src/stores/dexie/products';
import { cartStore,dictCartStore } from 'src/stores/cartStore';
import PriceTag from "src/new/priceTag.svelte";
import { onMount } from "svelte";
import { browser } from "$app/env";
import { goto } from "$app/navigation";
    export let page_info;
    let next_page = undefined;
    let bottom_loading = false;
    let main_loading = false;

    let my_products = [];
    /*$: {
        if(products!=undefined) {
            my_products = [...products];
            main_loading = false;
        }else {
            
            // scroll top:
            if (browser) {
                let el = document.querySelector('.products-wraper');
                if (el) {
                    //el.scrollTo({ top: 0, behavior: 'smooth' })
                    el.scrollTop = 0;
                }
            }
            main_loading = true;
        }
    }*/
    onMount(async () => {
            //my_products = [];
            if($page.query.toString() != '') {
                next_page = BASE_URL + '/my-api/get-album-images' + '?' + $page.query.toString();
                main_loading = true;
                let el = document.querySelector('.products-wraper');
                if (el) {
                    //el.scrollTo({ top: 0, behavior: 'smooth' })
                    el.scrollTop = 0;
                }
                load_more_products(true).then(() => {
                    main_loading = false;
                });
            }
        });
    let percent;
    function products_grid_scrolled(e) {
        let el = e.target;
        let height = el.clientHeight;
        let scrollHeight = el.scrollHeight - height;
        let scrollTop = el.scrollTop;
        percent = Math.floor(scrollTop / scrollHeight * 100);
        if(percent > 85 && !bottom_loading) {
            debugger;
            if(next_page) {
                bottom_loading = true;
                load_more_products();
            }
        }
    }

    function load_more_products(reset=false) {
        console.log(next_page);

        return my_fetch(next_page).then(response => {
                return response.json();
            }).then(data => {
                if(data.results) {
                    add_products_slim_to_indexdb(data.results);
                }
                if(reset) {
                    my_products = [...data.results];
                }else {
                    my_products = [...my_products, ...data.results];
                }
                page_info = {...data};
                bottom_loading = false;
                next_page = data.next;
            });
    }

    function product_clicked(e) {
        let el = e.currentTarget;
        let id = el.dataset.productId;
        console.log('product_clicked',id);
        let new_query = new URLSearchParams($page.query);
        new_query.set('product_id', id);
        let new_url = $page.path + '?' + new_query.toString();
        //$page.query('product', id);
        goto(new_url);
    }
    
    /*$: {
        if(products){
            selected_product = products.find(p => p.catalogImage.id == $page.query.get('product_id'));
            let new_query = $page.query;
            new_query.delete('product_id');
            backUrl = $page.path + '?' + new_query.toString();
        }
    }*/
</script>
<div class="products-wraper" on:scroll="{products_grid_scrolled}">
            {#if main_loading}
                <div class="spinner-container">
                    <Spinner></Spinner>
                </div>
            {/if}
            {#each my_products as product}
                
                <div class="product" data-product-id={product.id} on:click="{product_clicked}">
                    <div class="product-image">
                        {#if $dictCartStore[product.id]}
                            <div class="ribbon ribbon-top-right"><span>המוצר בסל</span></div>
                        {/if}
                        <img src={CLOUDINARY_URL + product.cimage} alt="{product.title}" />
                        <PriceTag price={product.price} new_price={product.new_price} top={'4px'} left={'4px'} font_size={'0.8em'} />

                    </div>
                    <div class="product-info">
                        <div class="product-title">
                            {product.title}
                        </div>
                        <!-- {#if product.price != 0}
                            <div class="product-price">
                                {product.price} ₪
                            </div>
                        {/if} -->
                    </div>
                </div>
            {/each}
            {#if bottom_loading}
                <h2 class="loading-title"><Spinner /></h2>
            {/if}
</div>


    <style lang="scss">











        .loading-title {
            width:100%;
            text-align: center;
            text-align: center;
            
        }
        .spinner-container {
            position: absolute;
            top:0;
            left:0;
            bottom: 0;
            right: 0;
            background-color: rgba(0,0,0,0.2);
            z-index:1;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .products-wraper {
            position: relative;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-items: flex-start;
            align-content: flex-start;
            width: 100%;
            //height: 100%;
            overflow: scroll;
            padding: 0;
            margin: 0;
            background-color: rgba(255, 255, 255, 0.199);
            gap: 5px;
            transition: all 3s ease-in-out;

            margin-bottom: 92px;
            & .product {
                position: relative;
                cursor: pointer;
                display: flex;
                flex:1 0 0;
                
                flex-direction: column;
                & .product-image {
                    background: radial-gradient(circle,white 0%,white 32%,#c7c7c7 84%);
                    //background: radial-gradient(circle, #f9f295b5 0%, #f9f295ba 32%, #e0aa3eb8 84%);
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    overflow: hidden;
                    img {
                        width: 175px;
                        height: 175px;
                        
                    }
                }
                & .product-info {
                    background: rgb(117, 116, 116);
                    z-index: 1;
                    & .product-title {
                        margin-right: 4px;
                        margin-left: 4px;
                        font-size: 16px;
                        color: white;
                        text-align: center;
                        height: 48px;
                        line-height: 1;
                    }

                    & .product-price {
                        position: absolute;
                        top: 15px;
                        left: 15px;
                        font-size: 16px;
                        background-color: rgba(255, 255, 255, 1);
                        width:auto;
                        text-align: center;
                        border-radius: 25px;
                        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
                        line-height: 2;
                        padding-left: 3px;
                        padding-right: 3px;
                        
                    }
                }

                &:hover {
                    & .product-image {
                        img {
                            transform: scale(1.1);
                            //z-index: -1;
                            filter: brightness(1.3);//brightness(0.8);
                        }
                    }
                    & .product-info {
                        background: rgb(117, 116, 116);
                        & .product-title {
                            font-weight: bold;
                        }
                    }
                }
            }
        }
    </style>