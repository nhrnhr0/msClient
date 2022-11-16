<!--
<script>

import { onMount } from "svelte";
import { Spinner } from "sveltestrap";
import ColorDisplay from "../../ColorDisplay.svelte";
import PivotEditTable from "../PivotEditTable.svelte";


    export let item;
    export let freeProviders;
    let rows = [
        {
            val: 'id',
            label: 'ID',
            hidden: true,
        },
        {
            val: 'orderItem__morder__id',
            label: 'מס הזמנה',
            hidden: false,
        },
        {
            val: 'force_physical_barcode',
            label: 'חייב ברקוד פיזי',
            hidden: false,
        },
        {
            val: 'color',
            label: 'צבע',
            hidden: false,
        },
        {
            val:'varient',
            label: 'מודל',
            hidden: false,
        }
    ];
    let colum = 'size';
    let val = 'quantity';
    //let providers_info = undefined;
    let ALL_SIZES;
    let ALL_COLORS;
    let ALL_VARIENTS;
    let sizes_dict = {};

    let filtered_free_providers= undefined;
    let product_id;
    onMount(async ()=> {
        ALL_SIZES = await getLocalStorageStore('sizes');
        ALL_COLORS = await getLocalStorageStore('colors');
        ALL_VARIENTS = await getLocalStorageStore('varients');
        sizes_dict = {};

        ALL_SIZES.forEach(size => {
            sizes_dict[size.id] = size;
        });
        let ppn_id = item.ppn.id;
        
        product_id = item.ppn.product.id;
        filtered_free_providers = freeProviders.filter(entry => {
            return entry.orderItem__product__id === product_id;
        });

        //providers_info = await request_provider_info(ppn_id)
    })


    function providerRequestsChanged(e) {
        let entry_data = JSON.parse(e.target.dataset?.entry ?? '{}');
        let entry_id = entry_data?.id;
        if(entry_id) {
            let foundEntry = item.providerRequests.find(entry => {
                if(entry.id === entry_id) {
                    return true;
                }
            });
            foundEntry.quantity = parseInt(e.target.value);
            //foundEntry = {...foundEntry};
            item.providerRequests = [...item.providerRequests];
        }else {
            
            let providerRequest_id = entry_data?.providerRequest;
            if(providerRequest_id == undefined) {
                
                let row_index = parseInt(e.target.dataset?.rowIdx ?? '-1');
                if(row_index != -1 && filtered_free_providers[row_index]) {
                    let providerRequest_id = filtered_free_providers[row_index].id;
                    let providerRequest = item.providerRequests.find(entry => {
                        if(entry.providerRequest === providerRequest_id) {
                            return true;
                        }
                    });
                    if (providerRequest) {
                        providerRequest.quantity = parseInt(e.target.value);
                        item.providerRequests = [...item.providerRequests];
                    }else {
                        
                        item.providerRequests.push({
                            id: null,
                            providerRequest: filtered_free_providers[row_index].id,
                            quantity: parseInt(e.target.value),
                        });
                        item.providerRequests = [...item.providerRequests];
                    }
                }
                // add to item.providerRequests new entry 
            }
            else {
                let providerRequest = item.providerRequests.find(entry => {
                        if(entry.providerRequest === providerRequest_id) {
                            return true;
                        }
                    });
                if (providerRequest) {
                    providerRequest.quantity = parseInt(e.target.value);
                    item.providerRequests = [...item.providerRequests];
                }
            }
        }
        console.log(entry_data);
    }
</script>

{#if filtered_free_providers}
    <PivotEditTable
        data={filtered_free_providers}
        rows={rows}
        colum={colum}
        val={val}
        columSorter={function(arr){
            console.log(arr);
            if(arr.length == 0) return arr;
            let res = arr.sort(function(a,b){
                let a_val = sizes_dict[a].code
                let b_val = sizes_dict[b].code;
                return b_val.localeCompare(a_val);
            });
            
            return res;
        }}
        >
            <td slot="row-cell" let:origianl_indexs let:pivot_idx let:row_data let:row_key>
                {#if row_key == 'color'}
                    <ColorDisplay color={ALL_COLORS.find(c=>c.id == row_data[row_key])}></ColorDisplay>
                {:else if row_key == 'varient'}
                    {#if row_data[row_key]}
                        {ALL_VARIENTS.find(v=>v.id == row_data[row_key]).name}
                    {/if}
                {:else if row_key == 'force_physical_barcode'}
                    {row_data[row_key]? "✅" : "❌"}
                {:else}
                    {row_data[row_key]}
                {/if}

            </td>
            <th slot="col-header" let:col_data>
                {sizes_dict[col_data].size}
            </th>

            <td slot="val-cell" let:row_index let:row_data let:row_key>
                {@const entr = item.providerRequests.find(pr => pr.providerRequest == filtered_free_providers[row_index]?.id)}
                {#if filtered_free_providers[row_data[row_key]]?.quantity}
                    {filtered_free_providers[row_data[row_key]].quantity}
                    /
                    <input on:change="{providerRequestsChanged}" data-entry={JSON.stringify(entr)} data-row-idx={row_index} data-row-key={row_key} class="small-input" type="number" value={entr?.quantity}/>
                {/if}
            </td>
    </PivotEditTable>
    <br>
    
    <div style="display:flex;justify-content:start; align-items:center">
        {JSON.stringify(item.providerRequests)}
    </div>
{:else}
    <Spinner></Spinner>
{/if}

<style lang="scss">
    .small-input {
        max-width: 55px;
    }
</style>
-->