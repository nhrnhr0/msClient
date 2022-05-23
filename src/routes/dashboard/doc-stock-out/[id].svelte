

<script context="module">
import { apiGetMOrder } from "@src/api/api";
import {TabulatorFull as Tabulator} from 'tabulator-tables';

import { onMount } from "svelte";
    export function load({ fetch, page, session, contex }) {
        return {
            props: {
                id: page.params.id
            }
        }
    }

    
    
</script>
<script>
import { page } from "$app/stores";
import { Spinner } from "sveltestrap";
async function load_order_from_server(_id) {
        let resp = await apiGetMOrder(_id);
        console.log('resp:', resp);
        data  = JSON.parse(JSON.stringify(resp));
        headers_data = [{
            id: data.id,
            agent: data.agent,
            agent_name: data.agent_name,
            client: data.client,
            status: data.status,
            created: data.created,
            updated: data.updated,
            message: data.message,
            name: data.name,
            phone: data.phone,
            email: data.email,
            client_businessName: data.client_businessName,
        }];

        products_data = data.products;
    }
    let data;
    let headers_data;
    let products_data;
    let headersTable;
    let productsTable;
    export let id;

    onMount(async ()=> {
        id = $page.params.id;
        debugger;
        await load_order_from_server(id);

        debugger;

        headersTable = new Tabulator("#headers-table", {
            data:headers_data,
            //autoColumns:true,
            layout:"fitColumns",
            textDirection:"rtl", 
            columns: [
                {title:'תאריך יצירה', field:'created'},
                {title:'תאריך שינוי', field:'updated'},
                {title:'id', field:'id'},
                {title:'שם', field:'name'},
                {title:'אימייל', field:'email'},
                {title:'הודעה', field:'message',editor:true},
                {title: 'טפלון', field: 'phone'},
                {title: 'סטטוס', field: 'status', editor:"select", editorParams:{values:['new', 'done'],multiselect:false}},
                {title: 'שם לקוח', field: 'client_name'},
                {title: 'סוכן', field:'agent'},
                //{title: 'מוצרים', field:'products', formatter:products_formatter},
            ]
        });

        productsTable = new Tabulator('#productsTable', {
            data:products_data,
            layout:"fitColumns",
            textDirection:"rtl",
            columns: [
                {title:'שם מוצר', field:'product_name'},
                {title:'מחיר', field:'price',formatter:"money", formatterParams:{symbol:"₪", decimal:".", thousands:","},editor:true},
                {title: 'הדפסה', field: 'prining',hozAlign:"center", editor:true, formatter:"tickCross"},
                {title: 'רקמה', field: 'embroidery',hozAlign:"center", editor:true, formatter:"tickCross"},
                {title: 'חשוב להזמנה', field: 'ergent',hozAlign:"center", editor:true, formatter:"tickCross"},
                {title: 'ברקוד', field: 'pbarcode',hozAlign:"center",},
                {title: 'הערות', field: 'comment'},
                {title: '', field:'entries', formatter:products_formatter},
            ]
        })

        function products_formatter(cell, formatterParams, onRendered) {
            let products = cell.getValue();
            let row = cell.getRow()._row.element;
            debugger;
            let html = '<div>'
            products.forEach(product => {
                html += `<div>${product.size_name}</div>`;
            });
            html += '</div>';
            let element = document.createElement('div');
            element.classList.add('products-table');
            element.innerHTML = html;
            row.appendChild(element);
            
        }
    });
    


    
</script>
<svelte:head>
    <link href="https://unpkg.com/tabulator-tables@5.2.4/dist/css/tabulator.min.css" rel="stylesheet">
</svelte:head>
{#if data}
    <div id="headers-table"></div>
    <div id="productsTable"></div>
    {JSON.stringify(data)}
{:else}
    <Spinner></Spinner>
{/if}

<style lang="scss">
    :global(.products-table) {
        background-color: blue;
        border: 1px solid red;;
    }
    #headers-table{
        width: 100%;
    }
</style>