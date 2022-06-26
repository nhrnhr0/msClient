
<script>
import { request_provider_info } from "@src/api/api";
import { getLocalStorageStore } from "@src/stores/localStorageStore";

import { onMount } from "svelte";
import { Spinner } from "sveltestrap";
import PivotEditTable from "../PivotEditTable.svelte";


    export let product;
    export let entries;
    let rows = [
        {
            val: 'morder',
            label: 'מס הזמנה',
            hidden: false,
        },
        {
            val: 'force_physical_barcode',
            label: 'חייב ברקוד פיזי',
            hidden: false,
        },
        {
            val: 'color__str',
            label: 'צבע',
            hidden: false,
        },
        {
            val:'varient__str',
            label: 'מודל',
            hidden: false,
        }
    ];
    let colum = 'size';
    let val = 'quantity';
    let providers_info = undefined;
    let ALL_SIZES;
    let sizes_dict = {};


    onMount(async ()=> {
        ALL_SIZES = await getLocalStorageStore('sizes');

        sizes_dict = {};

        ALL_SIZES.forEach(size => {
            sizes_dict[size.id] = size;
        });
        let ppn_id = product.id;
        debugger;
        providers_info = await request_provider_info(ppn_id)
    })
</script>

{#if providers_info}
    <PivotEditTable
        data={providers_info}
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
            debugger;
            return res;
        }}
        >
            <th slot="col-header" let:col_data>
                {sizes_dict[col_data].size}
            </th>

            <td slot="val-cell" let:row_index let:row_data let:row_key>
                {#if providers_info[row_data[row_key]]?.quantity}
                    {providers_info[row_data[row_key]].quantity}
                    /
                    <input class="small-input" type="number" value={0}/>
                {/if}
            </td>
    </PivotEditTable>
{:else}
    <Spinner></Spinner>
{/if}

<style lang="scss">
    .small-input {
        max-width: 55px;
    }
</style>