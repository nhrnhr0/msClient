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
import { cartStore } from "src/stores/cartStore";
import PriceTag from "src/new/priceTag.svelte";
	
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
    let top_info_w;
    let product_image_clientHeight;
    let product_image_clientWidth;
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
    <div class="product-page-wraper">
        <div class="product-show-wrapper-grid" class:loading={loading}>
            <div class="top-info" bind:clientWidth={top_info_w} class:flex-col={top_info_w < 700}>
                <div class="product-image">
                    <!--class:bigger-height={product_image_clientHeight > product_image_clientWidth} bind:clientHeight="{product_image_clientHeight}" bind:clientWidth="{product_image_clientWidth}"-->
                    {#if slimData}
                    {#if $cartStore[slimData.id]}
                        <div class="ribbon ribbon-top-right"><span>המוצר בסל</span></div>
                    {/if}
                    <!--{#if $cartStore[slimData.id]}
                            <div class="stamp animate"></div>
                        {/if}-->
                        <img src={CLOUDINARY_URL + (slimData || empty_slim)?.cimage} alt="{(slimData || empty_slim)?.title}" />
                        <PriceTag price={slimData?.price} new_price={slimData?.new_price} />
                        <!-- {#if slimData.new_price || slimData.price}
                            <div class="product-price">
                                {slimData?.new_price || (slimData)?.price} ₪
                            </div>
                        {/if} -->
                    {:else}
                        <img src="https://via.placeholder.com/300x300" alt=""/>
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
                                    {#if $cartStore[product.id]}
                                        <div class="ribbon ribbon-top-right"><span>המוצר בסל</span></div>
                                    {/if}
                                    <img src={CLOUDINARY_URL + product.cimage} alt="{product.title}" />
                                    <PriceTag new_price={product.new_price} price={product.price} top={'3px'} left={'3px'} font_size={'0.8em'} />
                                </div>
                                <div class="product-title">
                                        {product.title}
                                </div>
                                <!-- <div class="product-price">
                                    {product.price} ₪
                                </div> -->
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
        .product-page-wraper {
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            padding: 5px;
            margin:5px;
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
            
            margin-bottom: 70px;
            margin-left: 5px;
        }
        .product-item:hover {
        .product-image {
                        img {
                            transform: scale(1.1);
                            //z-index: -1;
                            filter: brightness(1.3);//brightness(0.8);
                        }
                    }
                }
        .product-show-wrapper-grid {
            
            .top-info {
                display: flex;
                &.flex-col {
                    flex-direction: column;
                        .product-image {
                            max-height: 45vh;
                            flex:1;
                            position: relative;
                        }
                        .slim-info {
                            
                        }
                    
                }
                .slim-info {
                    background: radial-gradient(circle, rgba(255, 255, 255, 0.199) 0%, rgba(255, 255, 255, 0.199) 100%);
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
                    margin-right: 15px;
                    margin-left: 15px;
                    margin-top: 15px;
                    border-radius: 15px;
                    flex:1;
                    .info-wraper {
                        max-height: 100%;
                        overflow-y: auto;
                        .product-title {
                            
                        }
                        
                    }
                }
                .product-image {
                    flex:1;
                    max-height: 33vh;
                    background: radial-gradient(circle, white 0%, white 32%, #c7c7c7 84%);
                    // background: radial-gradient(circle, #f9f295b5 0%, #f9f295ba 32%, #e0aa3eb8 84%);
                    // // #FCFFE7 #E0D8B0 #DEA057 #CE9461
                    // background: radial-gradient(circle, #FCFFE7 0%, #E0D8B0 32%, #DEA057 84%);
                    //grid-area: 1 / 7 / 7 / 13;
                    position: relative;
                    //background: radial-gradient(circle, rgba(255, 255, 255, 0.199) 0%, rgba(255, 255, 255, 0.199) 100%);
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    justify-content: center;
                    align-items: center;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
                    margin-left: 15px;
                    margin-top: 15px;
                    margin-right: 15px;
                    border-radius: 15px;
                    display: flex;
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
                            
                            line-height: 2;
                            padding-left: 3px;
                            padding-right: 3px;
                    }

                    img {
                        flex:1;
                        flex-grow: 0;
                        flex-shrink: 1;
                        
                        max-height: inherit;
                        max-width: inherit;
                    }
                    &.bigger-height {
                        
                        img {
                            object-fit: cover;
                        }
                    }
                }
            }

            .product-mentries {
            }

            // @media screen and (max-width: 841px) {
            //     display: flex;
            //     flex-direction: column;
            //     .product-image {
            //         margin:10px;
            //         max-height: 250px;
            //     }

            //     .slim-info {
            //         margin:10px;
            //     }
            //     .product-mentries {
            //         margin:5px;
            //     }
            // }

        }
        .similer-products {
                margin-bottom: 15px;
                height: 100%;
                //overflow: scroll;

                
                .similer-products-list {
                    background: radial-gradient(circle, rgba(255, 255, 255, 0.199) 0%, rgba(255, 255, 255, 0.199) 100%);
                    //box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    

                    & .product-item  {
                        margin: 5px;
                        width: 100%;
                        position: relative;
                        max-width: 150px;
                        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.5);
                        margin-left: 5px;
                        margin-right: 5px;
                        background: radial-gradient(circle, rgba(255, 255, 255, 0.199) 0%, rgba(255, 255, 255, 0.199) 100%);
                        transition: all 0.1s ease-in-out;
                        &:hover {
                            font-weight: bold;
                            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
                            background: radial-gradient(circle, rgba(167, 166, 166, 0.199) 0%, rgba(177, 175, 175, 0.199) 100%);
                        }
                        a {
                            color:black;
                            .product-image {
                                img {
                                    width: 100%;
                                }
                            }
                            .product-title {
                                    font-size: 16px;
                                    margin-bottom: 0px;
                                    text-align: center;
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
    </style>