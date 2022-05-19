

<script>
import { get_warehouses_api,update_stock_entry,apiSearchWarehouses } from '@src/api/api';
import AutoComplete from "simple-svelte-autocomplete";

    import {fly} from 'svelte/transition'
import { Spinner } from 'sveltestrap';
    export let stockId;
    export let is_open;
    export let originalData;

    const warehousesPromise = get_warehouses_api();
    let modal_zIndex = 900;
    let new_warehouse_name;
    let new_warehouse_id;
    let new_quantity = 0;
    function closeModal() {
        is_open = false;
    }

    function autocompleteWarehouseSelected(val) {
        selectedWarehouse = val;
        if (selectedWarehouse) {
            new_warehouse_id = selectedWarehouse.id;
            new_warehouse_name = selectedWarehouse.name;
        }
    }
    async function searchWarehouse(keyword) {
        return await apiSearchWarehouses(keyword);
    }
    let selectedWarehouse;
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
                <AutoComplete tabindex={'1'} id="warhouse_search_input" loadingText="מחפש מחסנים..." createText="לא נמצאו תוצאות חיפוש" showLoadingIndicator=true noResultsText="" onChange={autocompleteWarehouseSelected} create=true placeholder="חיפוש מחסנים..." className="autocomplete-cls" searchFunction={searchWarehouse} delay=200 localFiltering="{false}" labelFieldName="name" valueFieldName="value" bind:value={selectedWarehouse}  >
                    <div slot="loading">
                        <Spinner
                            size="sm"
                            speed="750"
                            unit="em"
                            color="#A82124"
                            thickness="2"
                        />
                        <span>טוען...</span>
                        <!-- spinner -->
                        
                    </div>
                    <div slot="item" let:item={item} let:label={label}>
                      {@html label}
                    </div>
                </AutoComplete>
                <!--
                <select>
                    {#await warehousesPromise}
                        ...
                    {:then warehouses}
                        {#each warehouses as warehouse}
                            <option value={warehouse.id}>{warehouse.name}</option>
                        {/each}
                    {/await}
                </select>-->
                <br>
                כמות: 
                <input min=0 max={originalData.quantity} type="number" bind:value={new_quantity}> / {originalData.quantity}
                <input type=range bind:value={new_quantity} min=0 max={originalData.quantity}>
                <br>
                <button on:click={()=>{
                    let data = {
                        stock_id: stockId,
                        warehouse_id: new_warehouse_id,
                        quantity: new_quantity
                    };
                    update_stock_entry(stockId, data).then((newData)=> {
                        console.log(newData);
                        debugger;
                        closeModal();
                    });
                    
                }}>שמור</button>
                
            </div>
            </div>
        
    {/if}
    </div>
</div>
