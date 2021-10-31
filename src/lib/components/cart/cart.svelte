<script>
    import {faShoppingCart} from '$lib/my-font-awsome';
    import { cartStore } from './../../../stores/cartStore'
    import Fa from 'svelte-fa/src/fa.svelte'
	import boop from '$lib/components/boop/boop'
import { onDestroy } from 'svelte';
    //import CartModal from '$lib/modals/cartModal.svelte';
    import {cartModalStore} from "./../../../stores/stores"
	let isBooped = false;
    function setIsBooped(val) {
		isBooped = val;
	}

    let unsub = cartStore.subscribe(()=> {
        if(Object.keys($cartStore).length > 0) {
            isBooped = true;
        }
    })
    onDestroy(()=> {
        unsub();
    });
    function open_cart() {
        $cartModalStore.toggleModal();
    }
</script>
<div id="cart-btn" class="cart" on:click={open_cart} on:mouseenter={() => isBooped = true} use:boop={{isBooped, scale:1.2, timing: 200, setter: setIsBooped}}>

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
        //.items-counter-wraper {
            
            .items-counter {
                //border:1px solid red;
                position: absolute;
            top:0px;
            right:0px;
            transform: translate(50%,-50%);
                background-color: rgb(48, 48, 219);
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