<script>
import { CLOUDINARY_URL } from "src/api/consts";

import { find_or_get_product_info_by_id, find_or_get_slim_product_by_id } from "src/stores/dexie/products";
import SvelteMarkdown from "svelte-markdown";

import { Spinner } from "sveltestrap";
import MentriesProductTable from "./MentriesProductTable.svelte";


    export let product_id = undefined;
    let slimData = undefined;
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
    $: {
        product_id,
        loading = product_id == undefined;
        find_or_get_slim_product_by_id(product_id).then(data => {
            slimData = data;
        });
        find_or_get_product_info_by_id(product_id).then(data => {
            productInfo = data;
        });
        
    }
    
    let similarProducts = undefined;
</script>
<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Flow+Block&display=swap" rel="stylesheet">
</svelte:head>
    
    <div class="product-show-wrapper-grid" class:loading={loading}>
        <div class="product-image">
                <img src={CLOUDINARY_URL + (slimData || empty_slim)?.cimage} alt="{(slimData || empty_slim)?.title}" />
                <div class="product-price">
                    {(slimData || empty_slim)?.price} ₪
                </div>
        </div>
        <div class="slim-info">
            <div class="info-wraper">
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
                מוצרים דומים
            </h3>
            <div class="similer-products-list">hey
                {#each (similarProducts || []) as product}
                    <div class="product-item">
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
                    </div>
                {/each}
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
                    .product-price {
                        
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
                        position: absolute;
                        top: 15px;
                        left: 15px;
                        font-size: 16px;
                        background-color: rgba(255, 255, 255, 1);
                        width:35px;
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
                .similer-products-list {
                    background: radial-gradient(circle, rgba(255, 255, 255, 0.199) 0%, rgba(255, 255, 255, 0.199) 100%);
                }
            }

        }

    </style>