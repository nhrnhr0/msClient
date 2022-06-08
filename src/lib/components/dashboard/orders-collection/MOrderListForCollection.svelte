

<script>
import { get_orders_to_collect,fetch_wraper } from "@src/api/api";
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import {dateCellFormatter} from '@src/lib/utils/utils';
import { goto } from '$app/navigation';

import { onMount } from "svelte";
import { Spinner } from "sveltestrap";
import { BASE_URL } from "@src/api/consts";
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

    function send_order_to_smartbee() {
        let url = BASE_URL + '/dashboard/orders-collection/smartbee/'+selected[0].id;
        let response = fetch_wraper(url, {"method":"POST"});
        console.log(response)
    }

    /*function start_collecting_btn_click() {
        let url = '/dashboard/orders-collection/collect?orders=' + encodeURIComponent(JSON.stringify(selected.map(x=>parseInt(x.id))));
        goto(url);
    }*/

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
                {title:"id", field:"id", sorter:"number", },
                {title:'נוצר ב', field:"created", sorter:"date", formatter:dateCellFormatter},
                
                {title: 'שם', field:"name", sorter:"string", },
                {title: 'עסק', field:"client_businessName", sorter:"string", },
                /*{title: 'כמות לאיסוף', field: 'taken_count', sorter:"number", },
                {title: 'כמות נאספה', field: 'collected_sum', sorter:"number", },*/
                {title: 'כמות לאיסוף', field:'taken_count', formatter: (cell, formatterParams) => {
                    let count = cell.getValue();
                    let sum = cell.getRow().getData().collected_sum;
                    return `${count} / ${sum}`;
                }},
                {title: 'אחוזים שנאספו', field:'taken_count', formatter: (cell, formatterParams) => {
                    let count = cell.getValue();
                    let sum = cell.getRow().getData().collected_sum;
                    let prc = 0;
                    if (count == 0 || sum == 0) {
                        prc = 0;
                    }
                    else if (count == sum){
                        prc = 100;
                    }
                    else {
                        prc = (sum/ parseFloat(count) * 100).toString();
                    }
                    // color = rgb(0, 255, 0)-rgb(255, 0, 0) based on prc
                    let prc255 = (prc/100 * 255);
                    let color = `rgb(${255-prc255}, ${prc255}, 0)`;

                    return `<div style="display:flex; justify-content:start;"><div style="background-color: ${color};width:25px;height:25px"></div>${prc}%</div>`;
                }},
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
    <a href='/dashboard/orders-collection/collect?orders={encodeURIComponent(JSON.stringify(selected.map(x=>parseInt(x.id))))}' class="btn btn-primary">התחל ליקוט ל {selected.length} הזמנות</a>
{/if}

{#if selected && selected.length == 1}
    <button on:click={send_order_to_smartbee}>הפק חשבונית בסמרטבי</button>
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


