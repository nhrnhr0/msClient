

<script>
import { get_warehouses_api } from '@src/api/api';
import { update_stock_entry } from '@src/api/api';

    import {fly} from 'svelte/transition'
    export let stockId;
    export let is_open;
    export let originalData;

    const warehousesPromise = get_warehouses_api();
    let modal_zIndex = 900;
    let new_warehouse_name;
    let new_quantity = 0;
    function closeModal() {
        is_open = false;
    }
</script>

<div id="stockEditPopup" style="z-index: {modal_zIndex};" class="modal" class:active={is_open}>
    <div class="overlay" style="z-index: {modal_zIndex+5};" on:click={closeModal}>
        {#if is_open}
        <div class="modal_content" in:fly="{{ y: 200, duration: 200 }}" on:click|stopPropagation="{()=>{}}" style="z-index: {modal_zIndex+10};">
            <div class="modal-header">
                <button title="Close" on:click={closeModal} class="close-btn right">x</button>
                <div class="modal-title">עריכה של שורה {stockId}</div></div>
                <button title="Close" on:click={closeModal} class="close-btn left">x</button>
            <div class="modal-body">
                הזזת מחסן
                <br>
                מחסן נוחכי: {originalData.warehouse_name}
                <br>
                מחסן חדש:
                <select>
                    {#await warehousesPromise}
                        ...
                    {:then warehouses}
                        {#each warehouses as warehouse}
                            <option value={warehouse.id}>{warehouse.name}</option>
                        {/each}
                    {/await}
                </select>
                <br>
                כמות: 
                <input min=0 max={originalData.quantity} type="number" bind:value={new_quantity}> / {originalData.quantity}
                <input type=range bind:value={new_quantity} min=0 max={originalData.quantity}>
                <br>
                <button on:click={()=>{
                    let data = {
                        stock_id: stockId,
                        warehouse_id: new_warehouse_name,
                        quantity: new_quantity
                    };
                    update_stock_entry(stockId, data);
                    console.log(data);
                    closeModal();
                }}>שמור</button>
                
            </div>
            </div>
        
    {/if}
    </div>
</div>
