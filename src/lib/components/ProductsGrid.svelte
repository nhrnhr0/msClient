<script context="module">
import { browser } from "$app/env";
import { page } from "$app/stores";




</script>

<script>
import { CLOUDINARY_URL } from "src/api/consts";

    export let products;
    export let query;
    let loading = false;
    let my_products = [];
    $: {
        if(products!=undefined) {
            my_products = [...products];
            loading = false;
        }else {
            loading = true;
        }
    }
</script>
    <div class="products-wraper">
        {#each my_products as product_data}
            {@const product=product_data.catalogImage}
            <div class="product" data-product-id={product.id}>
                <div class="product-image">
                    <img src={CLOUDINARY_URL + product.cimage} alt="{product.title}" />
                </div>
                <div class="product-info">
                    <div class="product-title">
                        {product.title}
                    </div>
                    <div class="product-price">
                        {product.price}
                    </div>
                </div>
            </div>
        {/each}
    </div>

    <style lang="scss">
        .products-wraper {
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
            & .product {
                background: radial-gradient(circle,white 0%,white 32%,#c7c7c7 84%);
                border:1px solid olive;
                display: flex;
                flex:1 0 0;
                
                flex-direction: column;
                & .product-image {
                    
                    width:175px;
                    height:175px;
                    img {
                        width: 100%;
                    }
                }
                & .product-info {
                    & .product-title {
                        margin-right: 4px;
                        margin-left: 4px;
                        font-size: 16px;
                        color: #999;
                        text-align: center;
                        height: 48px;
                        line-height: 1;
                    }

                    & .product-price {
                        background-color: #fff;
                        font-size: 12px;
                        border:1px solid green;
                        height: 35px;
                        width:auto;
                    }
                }
            }
        }
    </style>