<script>
    import {faShoppingCart} from '$lib/my-font-awsome';
    import { cartStore } from './../../../stores/cartStore'
    import Fa from 'svelte-fa/src/fa.svelte'
    import { onDestroy } from 'svelte';
    //import CartModal from '$lib/modals/cartModal.svelte';
    import {cartModalStore} from "./../../../stores/stores";
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
        $cartModalStore.toggleModal();
    }
</script>

<div id="cart-btn" class="cart" on:click={open_cart}>
    <Fa size="2x" icon={faShoppingCart} />
    {#if Object.keys($cartStore).length > 0}
            <div class="items-counter">
                <div class="num">{Object.keys($cartStore).length}</div>
            </div>
    {/if}
</div>



<style lang="scss">

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
    }

</style>