<script>
    import {
        _modal_z_index_incrementor
    } from "./../../stores/stores";
    import { selectTextOnFocus } from '$lib/ui/inputActions';

    import {
        activeModalsStore
    } from "./modalManager";
    import {
        fly
    } from 'svelte/transition';
import { cartStore } from "./../../stores/cartStore";
    export let isModalOpen = false;
    let product_id;
    let modal_zIndex = 0;
    let product_title;
    let opend_at = 0;
    export function toggleModal(_product_id, _product_title) {
        product_id = _product_id
        product_title = _product_title;
        opend_at = Date.now();
        isModalOpen = !isModalOpen;
        console.log('SingleAountModal toggleModal', isModalOpen, product_id, product_title);
        activeModalsStore.modalToggle('singleAmountodal', isModalOpen);
        if (isModalOpen) {
            modal_zIndex = 1200 + (++$_modal_z_index_incrementor * 15);

            setTimeout(() => {
                document.getElementById('popup_amount_input').focus();
            }, 0);
        }
    }
    export function isOpen() {
        return isModalOpen;
    }

    function overlay_clicked() {
        if(Date.now() - opend_at < 500) {
            return;
        }
        toggleModal();
    }

    function add_to_amount(amount) {
        $cartStore[product_id].amount += amount
    }
</script>


<div id="singleAmountModal" style="z-index: {modal_zIndex};" class="modal" class:active={isModalOpen}>
    <div class="overlay" style="z-index: {modal_zIndex+5};" on:click={overlay_clicked}>
        {#if isModalOpen}
        <div class="modal_content" in:fly="{{ y: 200, duration: 200 }}" on:click|stopPropagation="{()=>{}}" style="z-index: {modal_zIndex+10};">
            <div class="modal-header">
                
                <div class="modal-title">בחר/י כמות ל-<b>{product_title}</b></div>
                
            </div>
            <div class="modal-body">
                <div class="mrow">
                    <button class="btn btn-danger" on:click={()=>{cartStore.removeFromCartById(product_id);toggleModal();}}>הסר מהעגלה</button>
                </div>
                <div class="mrow">
                    <div class="input-wraper">
                        <input id="popup_amount_input" on:keyup={(e)=> {e.key === 'Enter' && toggleModal()}} use:selectTextOnFocus bind:value={$cartStore[product_id].amount} class="amount-input" type="number" >
                    </div>
                </div>
                <div class="mrow buttons-row">
                    <button on:click={()=> {add_to_amount(6)}} class="option">+6</button>
                    <button on:click={()=> {add_to_amount(12)}} class="option">+12</button>
                    <button  on:click={()=> {add_to_amount(24)}} class="option">+24</button>
                </div>
            </div>
        </div>
    {/if}
    </div>
</div>


<style lang="scss">
    .modal_content {
        max-width: 500px;
        border-radius: 25px;
        border: 1px solid rgb(126, 124, 124);
        background-color: #fff;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    .modal-header {
        .modal-title {
            font-size: 1.5em;
            text-align: center;
            width: 100%;
        }
    }
    .modal-body {
        .buttons-row {
            display: flex;;
            justify-content: space-around;
            padding-top:25px;
            .option {
                width: 120px;
                height: 75px;
                border-radius: 25px;
                text-align: center;
                font-weight: bold;
                border: 1px solid #ccc;
                @include bg-gradient(); 
                font-size: 1.5em;
                margin: 0 5px;
                box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.4);
                outline: none;
                transition:ease-in-out 0.2s;
                &:hover, &:focus {
                    border: 1px solid rgb(71, 71, 71);
                    box-shadow: 0px 0px 22px rgba(0, 0, 0, 0.4);
                }

            }
        }
        .input-wraper {
            .amount-input {
                width: 100%;
                height: 50px;
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 5px;
                margin-top: 15px;
                font-size: 1.9em;
                font-weight: bold;
                text-align: center;
                background-color: #fff;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.4);
                color: #000;
                
            }
        }
    }
}
    
</style>