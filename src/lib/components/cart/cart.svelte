<script>
    import {faShoppingCart} from '$lib/my-font-awsome';
    import { cartStore } from './../../../stores/cartStore'
    import Fa from 'svelte-fa/src/fa.svelte'
    import { onDestroy } from 'svelte';
    //import CartModal from '$lib/modals/cartModal.svelte';
    import {cartModalStore} from "./../../../stores/stores";
import { cartPopupStore } from 'src/stores/popups/cartPopupStore';
	let isBooped = false;
    export function setIsBooped(val) {
		isBooped = val;
	}

    /*let unsub = cartStore.subscribe(()=> {
        if(Object.keys($cartStore).length > 0) {
            isBooped = true;
        }
    })*/
    onDestroy(()=> {
        //unsub();
    });
    function open_cart() {
        cartPopupStore.toggleSide();
    }
</script>

<div class="cart-btn-wraper">
<div id="cart-btn" class="popup-animation cart" on:click={open_cart}>
    <Fa size="2x" icon={faShoppingCart} />
    {#if $cartStore.length > 0}
            <div class="items-counter">
                <div class="num">{$cartStore.length}</div>
            </div>
    {/if}
    
</div>
<div class="text">העגלה שלי</div>
</div>



<style lang="scss">
    .popup-animation {
        &:hover {
                animation: pop-animation 0.4s ease-in-out forwards;
            }
    }
    .cart-btn-wraper {
        position: relative;
        .text {
            font-size: 0.8rem;
            color: black;
            text-align: center;
            position: absolute;
            top: 100%;
            width: max-content;
            left: 0;
            right: 0;
            z-index: 1;
            transform: translate(25%, -25%);
            @media screen and (max-width: 824px) {
                display: none;
            }
        }
    #cart-btn {
        position: relative;
        cursor: pointer;
        //.items-counter-wraper {
            
            .items-counter {
                //border:1px solid red;
                position: absolute;
                top:0px;
                right:0px;
                transform: translate(50%,-50%);
                background-color: #FF0000;//rgb(48, 48, 219);
                border-radius: 50%;
                display: inline-block;
                height: 25px;
                width: 25px;
                .num {
                    font-weight: bold;
                    color:white;
                    text-align: center;
                    //border:1px solid peru;
                }
            }
        //}
            :global(svg) {
                width: 32px;
                height: 32px;
            }
        }   
    }

</style>