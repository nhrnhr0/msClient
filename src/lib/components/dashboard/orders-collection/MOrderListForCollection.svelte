

<script>
import { get_orders_to_collect } from "@src/api/api";
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import {dateCellFormatter} from '@src/lib/utils/utils';
import { goto } from '$app/navigation';

import { onMount } from "svelte";
import { Spinner } from "sveltestrap";
    export let data;
    export let selected;
    let loading = false;
    onMount(async()=> {
        loading = true;
        if(!data) {
            data = await request_data();
        }
        refresh_table(data);
        loading = false;
    });

    async function request_data() {
        let data =await get_orders_to_collect();
        return data;
    }

    function start_collecting_btn_click() {
        let url = '/dashboard/orders-collection/collect?orders=' + encodeURIComponent(JSON.stringify(selected.map(x=>parseInt(x.id))));
        goto(url);
    }

    function refresh_table(data) {
        //data = [...data];
        console.log('refresh_table ==> ', data);
        debugger;
        let table = new Tabulator("#collection-list", {
            textDirection:"rtl",
            height:'auto', // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
            data:data, //assign data to table
            layout:"fitColumns", //fit columns to width of table (optional)
            groupBy: [],
            selectable:true, //make rows selectable
            columns:[ //Define Table Columns
                {title:'נוצר ב', field:"created", sorter:"date", formatter:dateCellFormatter},
                {title:"id", field:"id", sorter:"number", },
                {title: 'שם', field:"name", sorter:"string", },
                {title: 'עסק', field:"client_businessName", sorter:"string", },
                
            ],
            });
            table.on("rowSelectionChanged", function(data, rows){
                selected = rows.map(row => row.getData());
            });
    }
    
</script>
<svelte:head>
    <link href="https://unpkg.com/tabulator-tables@5.2.4/dist/css/tabulator.min.css" rel="stylesheet">
</svelte:head>
{#if loading}
    <Spinner></Spinner>
{/if}


<div id="collection-list"></div>
{#if selected && selected.length > 0}
    <button on:click={start_collecting_btn_click} class="btn btn-primary">התחל ליקוט ל {selected.length} הזמנות</button>
{/if}

<style lang="scss">
    .collection-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
    }
</style>


