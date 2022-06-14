
<script context="module">
import { LOAD_ALL_PROVIDER_REQUEST_TO_ORDER } from "@src/api/consts";
import { fetch_wraper } from "@src/api/api";
import { onMount } from "svelte";
import fragment from 'svelte-fragment';


    let data;
        /**
         *
         * example result:
{
"id": 3,
"provider": 12,
"size": 90,
"varient": null,
"color": 76,
"force_physical_barcode": false,
"quantity": 10,
"morder": 6,
"product": {
"id": 741,
"title": "FREE FLOW"
}
},
{
"id": 7,
"provider": 8,
"size": 90,
"varient": 1,
"color": 84,
"force_physical_barcode": false,
"quantity": 55,
"morder": 2,
"product": {
"id": 5,
"title": "פנדה מונביסו"
}
},

         * 
        */
</script>

<script>
import PivotEditTable from "@src/lib/components/dashboard/PivotEditTable.svelte";
import { Spinner } from "sveltestrap";
import { getLocalStorageStore } from "@src/stores/localStorageStore";
import ColorDisplay from "@src/lib/components/ColorDisplay.svelte";

    export let data;
    let rows = ['morder','product','force_physical_barcode','provider','color','varient',]
    let colum = ['size']
    let val = ['quantity']

    let ALL_SIZES;
    let ALL_COLORS; //{"id":89,"name":"","color":"#FF0000","code":""},{"id":76,"name":"no color","color":"#FFFFFF00","code":"00"},...
    let ALL_VARIENTS;
    let ALL_PROVIDERS;
    let colors_dict = {};
    let varients_dict = {};
    let providers_dict = {};

    onMount(async() => {
        console.log('onMount');
        
        ALL_SIZES = await getLocalStorageStore('sizes');
        ALL_COLORS = await getLocalStorageStore('colors');
        ALL_VARIENTS = await getLocalStorageStore('varients');
        ALL_PROVIDERS = await getLocalStorageStore('providers');

        colors_dict = {};
        varients_dict = {};
        providers_dict = {};


        // create dict based on ALL_COLORS:
        // key: color.id, value: object
        ALL_COLORS.forEach(color => {
            colors_dict[color.id] = color;
        });

        // create dict based on ALL_VARIENTS:
        // key: varient.id, value: object
        
        ALL_VARIENTS.forEach(varient => {
            varients_dict[varient.id] = varient;
        });
        
        // create dict based on ALL_PROVIDERS:
        // key: provider.id, value: object
        
        ALL_PROVIDERS.forEach(provider => {
            providers_dict[provider.id] = provider;
        });

        fetch_wraper(LOAD_ALL_PROVIDER_REQUEST_TO_ORDER)
            .then(json => {
                console.log('json', json);
                data = json;
            });
    });
    const ROW_LABELS = {
        'morder': 'מספר הזמנה',
        'product': 'מוצר',
        'force_physical_barcode': 'ברקוד פיזי',
        'provider': 'ספק',
        'color' : 'צבע',
        'varient' : 'מודל',
    }
</script>
{JSON.stringify(ALL_COLORS)}
{#if data}
    <PivotEditTable
        data={data}
        rows={rows}
        colum={colum}
        val={val}


    >
    <template use:fragment slot="not-working" let:col_data>
        not working?!!!!!!!!!!!
    </template>
    <template use:fragment slot="col-header" let:col_data>
        <th>{col_data}</th>
    </template>
        <template use:fragment slot="row-header" let:row_data>
                <th>
                    {ROW_LABELS[row_data]}
                </th>
        </template>
        <template use:fragment slot="row-cell" let:row_data let:row_key>
            {#if row_key == 'color'}

                <td><ColorDisplay color={colors_dict[row_data[row_key]]} /></td>
            {:else if row_key == 'force_physical_barcode'}
                    <td>{row_data[row_key] ?  '✅':'❌'}</td>
            {:else}
                <!-- defult case -->
                <td>{row_data[row_key]}</td>
            
            {/if}
        </template> 

    </PivotEditTable>
{:else}
    <Spinner/>
{/if}
