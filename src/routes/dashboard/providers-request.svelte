
<script context="module">
import { LOAD_ALL_PROVIDER_REQUEST_TO_ORDER } from "@src/api/consts";
import { fetch_wraper } from "@src/api/api";
import { onMount } from "svelte";


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

    export let data;
    let rows = ['id','provider','varient','color','force_physical_barcode','morder','product',]
    let colum = ['size']
    let val = ['quantity']

    onMount(() => {
        console.log('onMount');
        fetch_wraper(LOAD_ALL_PROVIDER_REQUEST_TO_ORDER)
            .then(json => {
                console.log('json', json);
                data = json;
            });
    });

</script>
{#if data}
    <PivotEditTable
        data={data}
        rows={rows}
        colum={colum}
        val={val}
    />
{:else}
    <Spinner/>
{/if}
