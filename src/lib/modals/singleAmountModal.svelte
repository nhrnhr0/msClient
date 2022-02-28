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
    export function toggleModal(_product_id, _product_title) {
        product_id = _product_id
        product_title = _product_title;
        isModalOpen = !isModalOpen;
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
</script>


<div id="singleAmountModal" style="z-index: {modal_zIndex};" class="modal" class:active={isModalOpen}>
    <div class="overlay" style="z-index: {modal_zIndex+5};" on:click={toggleModal}>
        {#if isModalOpen}
        <div class="modal_content" in:fly="{{ y: 200, duration: 200 }}" on:click|stopPropagation="{()=>{}}" style="z-index: {modal_zIndex+10};">
            <div class="modal-header">
                
                <div class="modal-title">בחר/י כמות ל-<b>{product_title}</b></div>
                
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="input-wraper">
                        <input id="popup_amount_input" on:keyup={(e)=> {e.key === 'Enter' && toggleModal()}} use:selectTextOnFocus bind:value={$cartStore[product_id].amount} class="amount-input" type="number" >
                    </div>
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
        .input-wraper {
            .amount-input {
                width: 100%;
                height: 30px;
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 5px;
                margin-top: -30px;
                margin-left: -50px;
                font-size: 20px;
                font-weight: bold;
                text-align: center;
                background-color: #fff;
                color: #000;
                outline: none;
            }
        }
    }
}
    
</style>