<script>
import { browser } from "$app/env";
import { page } from "$app/stores";

import { CLOUDINARY_URL } from "src/api/consts";
import { get_similar_products } from "src/network/get_similar_products";

import { find_or_get_product_info_by_id, find_or_get_slim_product_by_id } from "src/stores/dexie/products";
import { query } from "src/stores/queryStore";
import { onMount } from "svelte";
import SvelteMarkdown from "svelte-markdown";
import { fly } from 'svelte/transition';
import { Spinner } from "sveltestrap";
import MentriesProductTable from "./MentriesProductTable.svelte";


    import {flip} from 'svelte/animate';
	
    export let product_id = undefined;
    export let slimData = undefined;
    let productInfo = undefined;
    let empty_slim = {
        id: undefined,
        title: '',
        description: ``,
        cimage: "",
        price: 0,
        new_price: 0,
    }
    let loading = false;
    const product_regex = /product_id=\d+/gm;
    let similarProducts = undefined;
    /*$: {
        product_id,
        loading = product_id == undefined;
        
        
    }*/
    onMount(async ()=> {
        slimData = await find_or_get_slim_product_by_id(product_id);
        if(browser) {
            productInfo = await find_or_get_product_info_by_id(product_id);
        }
        if(product_id && browser) {
            console.log('get similar products');
            
            get_similar_products(product_id).then(data => {
                similarProducts = data;
                let el = document.querySelector('.similer-products');
                if (el) {
                    el.scrollTop = 0;
                }
            });
        }
    })
    
</script>
<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Flow+Block&display=swap" rel="stylesheet">
</svelte:head>
        <div class="product-show-wrapper-grid" class:loading={loading}>
            <div class="product-image">
                {#if slimData}
                    <img src={CLOUDINARY_URL + (slimData || empty_slim)?.cimage} alt="{(slimData || empty_slim)?.title}" />
                    <div class="product-price">
                        {(slimData || empty_slim)?.price} ₪
                    </div>
                {:else}
                    <img src="https://via.placeholder.com/300x300" alt=""/>
                    <div class="product-price">
                        <Spinner />
                    </div>
                {/if}
            </div>
            <div class="slim-info">
                <div class="info-wraper">
                    {#if productInfo}
                        <div class="product-title">
                            <h2>
                                {(slimData || empty_slim)?.title}
                            </h2>
                        </div>
                        <div class="product-description">
                            <SvelteMarkdown source={productInfo?.description} />
                        </div>

                        <div class="product-packing-types">
                            {#if productInfo && productInfo.amountSinglePack != 0}
                            <div class="product-single-amount">
                                כמות במארז: {productInfo.amountSinglePack}
                            </div>
                            {/if}
                            {#if productInfo && productInfo.amountCarton != 0}
                            <div class="product-carton-amount">
                                כמות בקרטון: {productInfo.amountCarton}
                            </div>
                            {/if}
                            
                        </div>
                    {:else}
                        <!-- replcea the html content with spiners in the right height as placeholders -->
                        <div class="product-title">
                            <h2>
                                {(slimData || empty_slim)?.title}
                            </h2>
                        </div>
                        <div class="product-description">
                            <Spinner/>
                        </div>
                    {/if}
                </div>
            </div>
            <div class="product-mentries">
                {#if productInfo}
                    <MentriesProductTable productInfo={productInfo} />
                {:else}
                    <div class="loading-title">
                        <Spinner />
                    </div>
                {/if}
            </div>
            <div class="similer-products">
                <h3>
                    מוצרים דומים:
                </h3>
                <div class="similer-products-list">
                    {#if similarProducts}
                        {#each (similarProducts) as product}
                            <div class="product-item">
                                <a href={$page.path + '?' + $page.query.toString().replace(product_regex, `product_id=${product.id}`)}>
                                <div class="product-image">
                                    <img src={CLOUDINARY_URL + product.cimage} alt="{product.title}" />
                                </div>
                                <div class="product-title">
                                    <h2>
                                        {product.title}
                                    </h2>
                                </div>
                                <div class="product-price">
                                    {product.price} ₪
                                </div>
                                </a>
                            </div>
                        {/each}
                    {:else}
                        <div class="loading-title">
                            <Spinner />
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    
    <style lang="scss">
        .product-show-wrapper-grid {
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
            border-radius: 10px;
            direction: ltr;
            > * {
                direction: rtl;
            }
            &.loading {
                font-family: 'Flow Block', cursive;
            }
            width: 100%;
            background-color: #f5f5f565;
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            grid-template-rows: repeat(12, 1fr);
            grid-column-gap: 0px;
            grid-row-gap: 0px;
            margin-bottom: 70px;
            margin-left: 5px;
            .slim-info {
                background: radial-gradient(circle, rgba(255, 255, 255, 0.199) 0%, rgba(255, 255, 255, 0.199) 100%);
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
                margin-right: 15px;
                margin-top: 15px;
                border-radius: 15px;
                margin-left: 5px;
                //grid-area: 1 / 7 / 7 / 13;
                //grid-area: 1 / 1 / 7 / 7;
                //grid-area: 7 / 1 / 13 / 13;
                grid-area: 1 / 9 / 7 / 13;
                .info-wraper {
                    max-height: 100%;
                    overflow-y: auto;
                    .product-title {
                        
                    }
                    
                }
            }
            .product-image {
                background: radial-gradient(circle, white 0%, white 32%, #c7c7c7 84%);
                //grid-area: 1 / 7 / 7 / 13;
                grid-area: 1 / 5 / 7 / 9;
                position: relative;
                //background: radial-gradient(circle, rgba(255, 255, 255, 0.199) 0%, rgba(255, 255, 255, 0.199) 100%);
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                display: flex;
                justify-content: center;
                align-items: center;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
                margin-left: 15px;
                margin-top: 15px;
                margin-right: 5px;
                border-radius: 15px;
                img {
                    width: auto;
                    height: 100%;
                    
                }
                .product-price {
                    /*position: absolute;
                    bottom: 5%;
                    right: 90%;*/
                        display: flex;
                        justify-content:center;
                        flex-direction:row;
                        align-items:center;
                        position: absolute;
                        top: 15px;
                        left: 15px;
                        font-size: 22px;
                        background-color: rgba(255, 255, 255, 1);
                        width:auto;
                        padding-left: 5px;
                        padding-right: 5px;
                        text-align: center;
                        border-radius: 25px;
                        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
                }
            }

            .product-mentries {
                //grid-area: 7 / 1 / 13 / 13;
                grid-area: 7 / 5 / 13 / 13; 
            }

            .similer-products {
                grid-area: 1 / 1 / 13 / 5;
                margin-bottom: 15px;
                max-height: 100%;;
                overflow: scroll;
                
                .similer-products-list {
                    //background: radial-gradient(circle, rgba(255, 255, 255, 0.199) 0%, rgba(255, 255, 255, 0.199) 100%);
                    //box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    
                    & .product-item  {
                        
                        position: relative;
                        
                        margin-left: 5px;
                        margin-right: 5px;
                        &:hover {
                            font-weight: bold;
                        }
                        a {
                            color:black;
                            .product-image {
                                img {
                                    width: 100%;
                                }
                            }
                            .product-title {
                                h2 {
                                    font-size: 16px;
                                    margin-bottom: 0px;
                                }
                            }

                            /*.product-price {
                                position: absolute;
                                top: 0%;
                                left: 0%;
                                font-size: 18px;
                                display: flex;
                                justify-content:center;
                                flex-direction:row;
                                align-items:center;
                                
                                width:auto;
                            }*/
                        }
                    }
                }
            }

            @media screen and (max-width: 1090px) {
                overflow-y: scroll;
                .slim-info {
                    grid-area: 1 / 7 / 6 / 13; 
                }
                .product-image {
                    grid-area: 1 / 1 / 6 / 7;
                }
                .product-mentries {
                    grid-area: 6 / 1 / 10 / 13; 
                }
                .similer-products {
                    grid-area: 10 / 1 / 13 / 13;
                    overflow: visible;
                }
            }

            @media screen and (max-width: 841px) {
                display: flex;
                flex-direction: column;
                .product-image {
                    margin:10px;
                    max-height: 250px;
                }

                .slim-info {
                    margin:10px;
                }
                .product-mentries {
                    margin:5px;
                }
                .similer-products {
                }
            }

        }

    </style>