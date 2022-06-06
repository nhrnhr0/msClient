

<script context="module">
    import { fetch_wraper } from "@src/api/api";
    
    import { MORDER_GET_ORDER_DETAIL_TO_COLLECT } from "@src/api/consts";
import { onMount } from "svelte";
    
    
</script>
<script>
import { page } from "$app/stores";
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import { CLOUDINARY_URL } from "@src/api/consts";
import StockEditPopup from "@src/lib/components/dashboard/StockEditPopup.svelte";
import { getContext } from 'svelte';

const { open } = getContext('simple-modal');

    export let data;

    async function request_data(ids) {
        let url = MORDER_GET_ORDER_DETAIL_TO_COLLECT + '?orders=' + encodeURIComponent(JSON.stringify(ids));//'dashboard/orders-collection/collect';
        console.log('url: ', url);
        let result = await fetch_wraper(url, {
            method: 'GET',
        });
        return result;
    }

    onMount(async ()=> {
        if(!data) {
            const urlSearchParams = new URLSearchParams(window.location.search);
            const params = Object.fromEntries(urlSearchParams.entries());
            let ids = JSON.parse(params.orders);
            data = await request_data(ids);
        }
        console.log('data: ', data);
        // data values:.values('orderItem__morder', 'orderItem__id', 'orderItem__product__id','orderItem__product__title','orderItem__product__title', 'quantity','color','size','varient','barcode','has_physical_barcode','provider',)   
        let table = new Tabulator('#taken', {
            data: data['taken'],
            layout: 'fitColumns',
            columns: [
                { title: 'מזהה הזמנה', field: 'orderItem__morder' },
                //{ title: 'מזהה פריט הזמנה', field: 'orderItem__id' },
                //{ title: 'מזהה מוצר', field: 'orderItem__product__id' },
                {title: 'תמונת מוצר', field:'orderItem__product__cimage', formatter: "image",  formatterParams: {
                    urlPrefix: CLOUDINARY_URL,
                    height: 40,
                    width: 40,
                }},
                { title: 'שם מוצר', field: 'orderItem__product__title' },
                { title: 'ברקוד', field: 'barcode' },
                { title: 'ספק', field: 'provider__name' },
                { title: 'צריך ברקוד פיזי', field: 'has_physical_barcode' },
                
                { title: 'צבע', field: 'color__color', formatter:function(cell, formatterParams) {
                    return `<div style="display:flex;justify-content:center;align-items:center;"><div style="background-color:${cell.getValue()};width: 25px;height: 25px;"> </div>
                        <span>${cell.getData().color__name}</span></div>`;
                    }, },
                { title: 'גודל', field: 'size__size' },
                { title: 'מודל', field: 'varient__name' },
                
                
                { title: 'כמות', field: 'quantity' },
            ],
            rowFormatter:function(row){
                
                let rowData = row.getData();
                
                let stockData = data['stocks'].filter(x=>x.ppn__product__id == rowData.orderItem__product__id);
                //create and style holder elements
            var holderEl = document.createElement("div");
            var tableEl = document.createElement("div");

            holderEl.style.boxSizing = "border-box";
            holderEl.style.padding = "10px 30px 10px 10px";
            holderEl.style.borderTop = "1px solid #333";
            holderEl.style.borderBotom = "1px solid #333";
            

            tableEl.style.border = "1px solid #333";

            holderEl.appendChild(tableEl);

            row.getElement().appendChild(holderEl);
            
            var subTable = new Tabulator(tableEl, {
                height:"311px",
                //layout:"fitColumns",
                columnDefaults:{
                    resizable:true,
                },
                data:stockData,
                columns:[
                    /**
                 *
                    .values('ppn__product__id', 'ppn__product__title','ppn__provider','ppn__product__cimage', 'quantity','color', 'color__color','color__name','size', 'size__size','verient','verient__name','ppn__barcode','ppn__has_phisical_barcode','ppn__provider', 'warehouse', 'warehouse__name',)
                */
                    /*{title: 'תמונת מוצר', field:'ppn__product__cimage', formatter: "image",  formatterParams: {
                        urlPrefix: CLOUDINARY_URL,
                        height: 40,
                        width: 40,
                    }},
                    { title: 'שם מוצר', field: 'ppn__product__title' },*/
                    {title: 'מחסן', field:'warehouse__name'},
                    { title: 'ברקוד', field: 'ppn__barcode' },
                    { title: 'ספק', field: 'ppn__provider__name' },
                    { title: 'צריך ברקוד פיזי', field: 'ppn__has_phisical_barcode' },
                    
                    { title: 'צבע', field: 'color__color', formatter:function(cell, formatterParams) {

                        return `<div style="display:flex;justify-content:center;align-items:center;"><div style="background-color:${cell.getValue()};width: 25px;height: 25px;"> </div>
                            <span>${cell.getData().color__name}</span></div>`;
                    }, },
                    { title: 'גודל', field: 'size__size' },
                    { title: 'מודל', field: 'verient__name' },
                    
                    
                    { title: 'כמות במלאי', field: 'quantity', formatter:function(cell, formatterParams) {
                        // show stock with ability to edit
                        // create button
                        let button = document.createElement('button');
                        debugger;
                        button.innerText = 'ערוך';
                        let stock_id = cell.getData().id;
                        button.addEventListener('click', ()=> {
                            open(StockEditPopup, {
                                originalData:undefined,
                                stockId:stock_id, 
                                replaceData: undefined,
                                updateData: undefined,
                            })
        
                        });

                        // create a div with the quantity and the button
                        let div = document.createElement('div');
                        div.innerText = cell.getValue();
                        div.appendChild(button);
                        return div;
                        //return `${cell.getValue()} <button class="btn btn-sm btn-primary" onclick="edit_stock(${cell.getData().ppn__id})">ערוך</button>`;
                    }},
                    {title: 'כמות שנאספה', field:'quantity_taken', formatter:function(cell, formatterParams) {
                        return `<input type="number" value="${cell.getValue()}" min="0" max="${cell.getData().quantity}" onchange="update_quantity(${cell.getData().ppn__id}, this.value)">`;
                    },},
                ],
            });
            },
            //groupBy: ['orderItem__morder', 'orderItem__product__title'],
        });
    });
</script>

<svelte:head>
    <link href="https://unpkg.com/tabulator-tables@5.2.4/dist/css/tabulator.min.css" rel="stylesheet">
</svelte:head>

<div id="taken"></div>