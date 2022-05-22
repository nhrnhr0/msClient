

<script>
import { apiGetInventoryHistory, get_warehouses_api,move_stock_entry,apiSearchWarehouses,update_stock_entry } from '@src/api/api';
import AutoComplete from "simple-svelte-autocomplete";
import { writable } from 'svelte/store';
import {notifier } from '@beyonk/svelte-notifications'
    import {fly} from 'svelte/transition'
import { Spinner } from 'sveltestrap';
import { getContext, onMount } from 'svelte';
const { close } = getContext('simple-modal');

    export let stockId;
    //export let is_open = true;
    export let originalData;
    export let replaceData,updateData;
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    const triggerTableReplaceEvent = (data) => {
        //dispatch("table_replace", data);
        replaceData(data);
    }
    const triggerTableUpdateEvent = (data) => {
        //dispatch("table_update", data);
        updateData(data);
    }
    const warehousesPromise = get_warehouses_api();
    let modal_zIndex = 900;
    let new_warehouse_name;
    let new_warehouse_id;
    let new_quantity = 0;
    let historyPromise;
    onMount(async() => {
        console.log('====> onMount', stockId);
        historyPromise = apiGetInventoryHistory(stockId);
    });

    function closeModal() {
        //is_open = false;
        close();
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
    function change_amount_save_click(e) {
        let data = {
            id: stockId,
            quantity: edit_quantity,
            reson: edit_reson
        };
        debugger;
        update_stock_entry(stockId, data).then((val)=> {
            if (val['error']) {
                notifier.error(val['error']);
            } else {
                notifier.success("Successfully updated");
                triggerTableUpdateEvent(val);
                closeModal();
            }
        });
    }

    function edit_reson_changed(val) {
        edit_reson = val;
    }

    let edit_quantity;
    let edit_reson  ='';


    const EDIT_RESONS = ['אבד','ספירה מחודשת','נמצא מוצר', 'בלאי']
    function get_edit_resones() {
        let results = EDIT_RESONS;
        return results;
    }
    
</script>

<div id="stockEditPopup" style="z-index: {modal_zIndex};">
    <div class="overlay" style="z-index: {modal_zIndex+5};" on:click={closeModal}>
        {#if originalData && stockId}
        <div class="modal_content" in:fly="{{ y: 200, duration: 200 }}" on:click|stopPropagation="{()=>{}}" style="z-index: {modal_zIndex+10};">
            <div class="modal-body">
                <div class="content">
                    <div class="wraper">
                        <div class="card-design inventory-move">
                            <h3>הזזת מחסן</h3>
                            <br>
                            מחסן נוחכי: {originalData?.warehouse_name}
                            <br>
                            <br>
                            מחסן חדש:
                            <AutoComplete tabindex={'1'} id="warhouse_search_input" loadingText="מחפש מחסנים..." createText="לא נמצאו תוצאות חיפוש" showLoadingIndicator=true onChange={autocompleteWarehouseSelected} create=true placeholder="חיפוש מחסנים..." className="autocomplete-cls" searchFunction={searchWarehouse} delay=200 localFiltering="{false}" labelFieldName="name" valueFieldName="value" bind:value={selectedWarehouse}  >
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
                            <button on:click="{()=>{new_quantity  = originalData.quantity}}">הכל</button>
                            <br>
                            <div class="fotter">
                                <button class="btn btn-primary" on:click={()=>{
                                    let data = {
                                        stock_id: stockId,
                                        warehouse_id: new_warehouse_id,
                                        quantity: new_quantity
                                    };
                                    move_stock_entry(stockId, data).then((newData)=> {
                                        console.log(newData);
                                        debugger;
                                        if(newData['error']) {
                                            notifier.danger(newData['error']);
                                            alert(newData['error']);
                                        }
                                        else {
                                            debugger;
                                            let originalData = newData.old;
                                            let replaceData = newData.new;
                                            notifier.success('העדכון בוצע בהצלחה');
                                            triggerTableReplaceEvent({originalData, replaceData});
                                            closeModal();
                                        }
                                    });
                                    
                                }}>שמור</button>
                            </div>
                            
                            </div>
                            
                        <div class="card-design inventory-change">
                            <h3>שינוי כמות</h3>
                            <br>
                            כמות נוכחית: {originalData.quantity}
                            <br>
                            כמות חדשה:
                            <input min=0 type="number" bind:value={edit_quantity} name="edit-quantity">
                            <br>
                            סיבה:
                            <input type="text" list="edit-reson-list" bind:value="{edit_reson}" name="edit-reson">
                            <datalist id="edit-reson-list">
                                {#each get_edit_resones() as reson}
                                    <option value={reson}>{reson}</option>
                                {/each}
                            </datalist>
                            <div class="fotter">
                                <button class="btn btn-primary" on:click="{change_amount_save_click}">שמור</button>
                            </div>
                        </div>
                    </div>
                    <div class="card-design history">
                        <h3>היסטוריה: </h3>
                        {#if historyPromise}
                        {#await historyPromise}
                            ...
                        {:then history}
                            <table class="history-table">
                                <thead>
                                    <tr>
                                        <th>
                                            id
                                        </th>
                                        <th>
                                            תאריך
                                        </th>
                                        <th>
                                            מקור
                                        </th>
                                        <th>
                                            יעד
                                        </th>
                                        <th>
                                            כמות
                                        </th>
                                        <th>
                                            סיבה
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#each history as row}
                                        <tr>
                                            <td>
                                                {row.id}
                                            </td>
                                            <td>
                                                {new Date(row.created_at).toLocaleString("he-IL")}
                                            </td>
                                            <td >
                                                {row.old_quantity}
                                            </td>
                                            <td>
                                                {row.new_quantity}
                                            </td>
                                            <td>
                                                ({row.new_quantity - row.old_quantity})
                                            </td>
                                            <td>
                                                {@html row.note || ''}
                                            </td>
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                            
                        {/await}
                            
                        {/if}
                    </div>
                </div>
            </div>
            </div>
        
    {/if}
    </div>
</div>

<style lang="scss">
    .history-table {
        width: 100%;
        border-collapse: collapse;
        thead {
            th {
                border-bottom: 1px solid #ccc;
                padding: 10px;
            }
        }
        tbody {
            tr {
                td {
                    padding: 10px;
                }
            }
        }
    }
:global(.my-class-window) {
    width: 70rem!important;
    
}
:global(.autocomplete){
    min-width: 200px;
    display: inline-block;
    max-width: 100%;
    position: relative;
    vertical-align: top;
    height: 2.25em;
}

    .modal-body {
        padding: 20px;
        min-height: 50vh;
        background-color: #ccc;
        .wraper {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            gap: 30px;
            
        }
    }
    .card-design {
        position: relative;
        flex:1;
        padding: 20px;
        padding: 20px;
        border-radius: 5px;
        background-color: #fff;
        box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
        h3 {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
            border-bottom: 1px solid black;
        }
        input {
            width: auto;
            line-height: 2;
            margin-bottom: 10px;
            border-radius: 5px;
            border: 1px solid #ccc;
            padding: 5px;
        }
        .fotter {
            display: flex;
            justify-content: flex-end;
            //margin-top: 10px;
            
            button {
                position: absolute;
                bottom: 5px;
                left: 15px;
            }
        }
        &.history {
            margin-top: 20px;
        }
    }
</style>