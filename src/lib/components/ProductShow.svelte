<script>
import { browser } from "$app/env";
import { page } from "$app/stores";

import { CLOUDINARY_URL } from "src/api/consts";
import { get_similar_products } from "src/network/get_similar_products";

import { query } from "src/stores/queryStore";
import { onMount,onDestroy } from "svelte";
import SvelteMarkdown from "svelte-markdown";
import { fly } from 'svelte/transition';
import { Spinner } from "sveltestrap";
import MentriesProductTable from "./MentriesProductTable.svelte";


    import {flip} from 'svelte/animate';
import { dictCartStore } from "src/stores/cartStore";
import PriceTag from "src/new/priceTag.svelte";
import BigImagePopup from "../popups/bigImagePopup.svelte";
import {send, receive} from './../popups/bigImagePopup';
    export let product_id = undefined;
    //export let slimData = undefined;
    export let productInfo = undefined;
    let loading = false;
    const product_regex = /product_id=\d+/gm;
    let similarProducts = undefined;
    let top_info_w;
    let big_image_selected = false;
    let done_loading = false;
    
    /*$: {
        product_id,
        loading = product_id == undefined;
        
        
    }*/
    $: {
        if(product_id == productInfo?.id && browser) {
            console.log('get similar products');
            
            get_similar_products(product_id).then(data => {
                similarProducts = data;
                /*let el = document.querySelector('.similer-products');
                if (el) {
                    el.scrollTop = 0;
                }*/
                
            });
            let el = document.querySelector('.product-page-wraper');
            if(el) {
                el.scrollTop = 0;
            }
            done_loading = true;
        }
        else {
            done_loading = false;
        }
        
    }
    onMount(async ()=> {
        
    })

    onDestroy(()=> {
        done_loading = false;
    })
    
</script>
<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Flow+Block&display=swap" rel="stylesheet">
</svelte:head>
    <BigImagePopup 
    image_url={CLOUDINARY_URL + productInfo?.cimage}
    bind:big_image_selected={big_image_selected}
    key={productInfo?.id}
    
    />
    <div class="product-page-wraper" class:loading={!done_loading}>
        <div class="product-show-wrapper-grid" >
            <div class="top-info" bind:clientWidth={top_info_w} class:flex-col={top_info_w < 700}>
                <div class="product-image" class:can-make-big={done_loading}>
                    <!--class:bigger-height={product_image_clientHeight > product_image_clientWidth} bind:clientHeight="{product_image_clientHeight}" bind:clientWidth="{product_image_clientWidth}"-->
                    {#if productInfo}
                    {#if $dictCartStore[productInfo.id]}
                        <div class="ribbon ribbon-top-right"><span>המוצר בסל</span></div>
                    {/if}
                    <!--{#if $cartStore[slimData.id]}
                            <div class="stamp animate"></div>
                        {/if}-->
                        <img src={CLOUDINARY_URL + productInfo?.cimage} alt="{productInfo?.title}" on:click="{()=>{big_image_selected = true;}}" />
                        <PriceTag price={productInfo?.price} new_price={productInfo?.new_price} />
                        <!-- {#if slimData.new_price || slimData.price}
                            <div class="product-price">
                                {slimData?.new_price || (slimData)?.price} ₪
                            </div>
                        {/if} -->
                    {:else}
                        <img src="https://via.placeholder.com/300x300" alt=""/>
                    {/if}
                    {#if done_loading}
                        {#if big_image_selected == false}
                            <div class="product-image-2"
                            
                            in:receive={{key:productInfo?.id}}
                            out:send={{key:productInfo?.id}}>
                                <img src={CLOUDINARY_URL + productInfo?.cimage} alt="{productInfo?.title}" on:click="{()=>{big_image_selected = true;}}" />
                            </div>
                        {/if}
                    {/if}
                </div>
                
                <div class="slim-info">
                    <div class="info-wraper">
                        {#if productInfo}
                            <div class="product-title">
                                <h2>
                                    {productInfo?.title}
                                </h2>
                            </div>
                            <div class="product-description">
                                {#if productInfo?.description}
                                    <SvelteMarkdown source={productInfo?.description} />
                                {/if}
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
                                    {productInfo?.title}
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
                    {#key productInfo.id}
                        <MentriesProductTable productInfo={productInfo} />
                    {/key}
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
                            <a rel="prefetch"
                            href="/main?top={product.main_public_album_top__slug}&album={product.main_public_album__slug}&product_id={product.id}">
                            <!-- href={$page.path + '?' + $page.query.toString().replace(product_regex, `product_id=${product.id}`)}>-->
                                <div class="product-image">
                                    {#if $dictCartStore[product.id]}
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
            max-height: 100%;
            overflow-x:hidden;
            > * {
                direction: rtl;
            }
            &.loading {
                position: relative;
                //font-family: 'Flow Block', cursive;
                &:before {
                    content:" ";
                    position:absolute;
                    top:0px;
                    left:0px;
                    bottom: 0px;
                    right: 0px;
                    height: 200%;
                    background-color:rgba(53, 44, 44, 0.719);
                    transition:width 0.3s ease-out;
                    z-index: 999;
                }
            }
            width: 100%;
            background-color: #f5f5f565;
            
            margin-bottom: 70px;
            margin-left: 15px;
            max-height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            height: calc(100vh - 215px);
            height: calc(var(--vh, 1vh) * 100 - 215px);
            @media screen and (max-width: 768px) {
                margin-left: 5px;
            }
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
                flex-direction: row-reverse;
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
                        .product-packing-types {
                            display: flex;
                            flex-direction: row;
                            justify-content: space-around;
                            margin:1%;
                            & > div {
                                flex: 1;
                                padding: 1%;
                                margin:1%;
                                text-align: center;
                                border: 1px black solid;
                                font-weight: bold;
                                font-size: 1.2em;

                                    /*&:hover {
                                        background-color: #3D3D3D;
                                        color: white
                                    }*/
                            }
                            
                        }
                    }
                }
                .product-image {
                    flex:1;
                    cursor: pointer;
                    max-height: 40vh;
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
                    &.can-make-big {
                        cursor: pointer;
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
                            
                            line-height: 2;
                            padding-left: 3px;
                            padding-right: 3px;
                    }

                    img {
                        flex:1;
                        flex-grow: 0;
                        flex-shrink: 1;
                        
                        max-height: inherit;
                        max-width: 100%;
                    }
                    &.bigger-height {
                        
                        img {
                            object-fit: cover;
                        }
                    }

                    .product-image-2 {
                        position: absolute;
                        top: 0px;
                        background: radial-gradient(circle, white 0%, white 32%, #c7c7c7 84%);
                        /* left: 0px; */
                        /* right: 0px; */
                        /* bottom: 0px; */
                        /* margin: 15px; */
                        /* margin-top: 0px; */
                        max-height: 40vh;
                        z-index: -11;

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
                
                
                //overflow: scroll;

                
                .similer-products-list {
                    background: radial-gradient(circle, rgba(255, 255, 255, 0.199) 0%, rgba(255, 255, 255, 0.199) 100%);
                    //box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(114px, 1fr));
                    grid-template-rows: auto auto;
                    grid-auto-rows: 0px;
                    position: relative;
                    overflow: hidden;
                    
                    // grid-template-columns: repeat(6, 1fr);
                    margin-bottom: 25px;
                    height: auto;
                    overflow: hidden;
                    //justify-items: center;
                    //align-items: center;
                    //border:1px solid blue;
                    @media screen and (max-width:512px) {
                        grid-template-columns: repeat(auto-fit, minmax(82px, 1fr));
                    }
                    & .product-item  {
                        
                        margin: 5px;
                        //width: 100%;
                        //width: 110px;
                        width: clamp(64px, 95%, 130px);
                        //flex-grow: 1;
                        position: relative;
                        //max-width: 150px;
                        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.5);
                        margin-left: 3px;
                        margin-right: 3px;
                        background: radial-gradient(circle, rgba(255, 255, 255, 0.199) 0%, rgba(255, 255, 255, 0.199) 100%);
                        transition: all 0.1s ease-in-out;
                        &:hover {
                            //font-weight: bold;
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



    
    
    @media screen and (max-width:600px) {
        .similer-products {
            .similer-products-list {
                //grid-template-columns: repeat(auto-fit, minmax(74px, 1fr));
                & .product-item {
                }
            }
        }
        .product-show-wrapper-grid .top-info {

            .product-image {
                margin-left: 0px;
                margin-right: 0px;
            }
            .slim-info {
                margin-left: 0px;
                margin-right: 0px;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                .product-title {
                    text-align: center;
                }
                .product-price {
                    text-align: center;
                }
            }
        }
    }
    </style>