<script>
    import {
        userInfoStore
    } from "../../stores/stores";


    export let price; // the product's price
    export let newPrice; // a new price if this client gets a discount on the product
    export let currencySymbol = '₪'; // the currency symbol of the product
    export let should_show_prices = false;
    export let show_prices = undefined;
    export let out_of_stock = false;
    $: {
        if (show_prices === true) {
            should_show_prices = true;
        } else if (show_prices === false) {
            should_show_prices = false;
        } else if (show_prices === null || show_prices == undefined) {
            should_show_prices = ($userInfoStore && $userInfoStore.isLogin && $userInfoStore.me && $userInfoStore.me
                .show_prices == true && out_of_stock == false);
        }
    }
    export let ClassName;
</script>

<div class="price-tag {ClassName}" class:active={should_show_prices} class:discount={newPrice!=undefined}>
    <del>
        <span class="amount">{currencySymbol}{price}</span>
    </del>
    <ins>
        <span class="amount">
            {currencySymbol}{newPrice ? newPrice : price}
        </span>
    </ins>
</div>
<style lang="scss">
    .price-tag {
        line-height: 1;
        padding: 5px;
        font-weight: bold;
        border-radius: 25px;
        background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
        display: none;
        font-size: x-large;
        color: black;

        &.active {
            display: block;
        }

        /*&.discount {
            .price-tag-text {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                .price-tag-text-price {
                    font-size: smaller;
                    text-decoration: line-through;
                }
                .price-tag-text-new-price {
                    color: red;
                }
            }
                
            }*/
            del {
                display: none;
            }
            ins {
                text-decoration: none;
            }
        &.discount {
            del {
                flex:1;
                font-size: smaller;
                color: rgba(red, 0.5);
                text-decoration: none;
                position: relative;
                display: block;
                text-align: center;
                &:before {
                    content: " ";
                    display: block;
                    width: 100%;
                    border-top: 2px solid rgba(red, 0.8);
                    height: 9px;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    transform: rotate(-7deg);
                }
            }

            ins {
                flex:2;
                color: green;
                //font-size: xx-large;// 32px;
                text-decoration: none;
            }
        }
    }
</style>