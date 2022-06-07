

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
import { BASE_URL } from "@src/api/consts";

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
    function hashCode(str) {
  return str.split('').reduce((prevHash, currVal) =>
    (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
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
            //height: '100%',
            width: '100%',
            columns: [
                { title: 'מזהה הזמנה', field: 'orderItem__morder', formatter:function(cell, formatterParams) {
                    let num = hashCode(cell.getValue().toString());
                    // list 20 colors hexcode has much far away from each other
                    let colors_list = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000'];
                    
                    let color = colors_list[num % colors_list.length];

                    return `<div><div style="background-color:${color};width:25px;height:25px"></div><div>${cell.getValue()}</div></div>`;
                }},
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
                    return `<div style="display:flex;justify-content:start;align-items:center;"><div style="background-color:${cell.getValue()};width: 25px;height: 25px;border:1px solid black;"> </div>
                        <span>${cell.getData().color__name}</span></div>`;
                    }, },
                { title: 'גודל', field: 'size__size', sorter:function(a, b, aRow, bRow, column, dir, sorterParams){
                    //a, b - the two values being compared
                    //aRow, bRow - the row components for the values being compared (useful if you need to access additional fields in the row data for the sort)
                    //column - the column component for the column being sorted
                    //dir - the direction of the sort ("asc" or "desc")
                    //sorterParams - sorterParams object from column definition array
                    if(dir == "asc") {
                        return aRow.getData().size__code.localeCompare(bRow.getData().size__code);
                    } else {
                        return bRow.getData().size__code.localeCompare(aRow.getData().size__code);
                    }
                    //return a - b.getData().size__code; //you must return the difference between the two values
                }},
                { title: 'מודל', field: 'varient__name' },
                {title: 'כמות לאיסוף', field: 'quantity'},
                {title: 'נשאר לאסוף', field: 'quantity', formatter:function(cell, formatterParams) {
                    let collected = cell.getData().collected__quantity;
                    if (collected) {
                        debugger;
                        collected = collected;//.map(x => x.quantity).reduce((a, b) => a + b, 0);
                    }else {
                        collected = 0;
                    }
                    return cell.getValue() - collected;
                }},
            ],
            rowFormatter:function(row){
                let rowData = row.getData();
                    let filters = {
                        has_physical_barcode: true,
                        provider: true,
                        //barcode: true,
                        color: true,
                        size: true,
                        varient: true,
                    }

                    let create_toggle = function (labelTxt, field) {
                        let wraper = document.createElement('div');
                        let label = document.createElement('label');
                        label.innerText = labelTxt;
                        let input = document.createElement('input');
                        
                        input.type = 'checkbox';
                        input.checked = filters[field];
                        wraper.addEventListener('click', function (e) {
                            console.log('click: ', e);
                            let inputEl = e.currentTarget.querySelector('input')
                            if(e.target == inputEl) {
                                inputEl.checked = !inputEl.checked;
                            }
                            inputEl.checked = !inputEl.checked;
                            filters[field] = inputEl.checked;
                            let entryStocks = data['stocks'].filter(x=>(
                                x.ppn__product__id == rowData.orderItem__product__id && 
                                (x.ppn__has_phisical_barcode == rowData.has_physical_barcode || !filters.has_physical_barcode) &&
                                (x.ppn__provider == rowData.provider || !filters.provider) &&
                                //(x.ppn__barcode == rowData.barcode || !filters.barcode) &&
                                (x.color__id == rowData.color__id || !filters.color) && 
                                (x.size__id == rowData.size__id || !filters.size) &&
                                (x.verient__id == rowData.varient__id || !filters.varient)
                            ));
                            draw_inventory_tbody(document.querySelector(`#taken_inventory_${rowData.id}`), entryStocks, rowData.id);
                        });
                        wraper.appendChild(input);
                        wraper.appendChild(label);
                        
                        return wraper;
                    }
                    let barcodeFizi_button = create_toggle('צריך ברקוד פיזי', 'has_physical_barcode');
                    let provider_button = create_toggle('ספק', 'provider');
                    //let barcode_button = create_toggle('ברקוד', 'barcode');
                    let color_button = create_toggle('צבע', 'color');
                    let size_button = create_toggle('גודל', 'size');
                    let varient_button = create_toggle('מודל', 'varient');
                    let buttonWraper = document.createElement('div');
                    buttonWraper.style.display = 'flex';
                    buttonWraper.style.justifyContent = 'flex-start';
                    buttonWraper.style.alignItems = 'center';
                    buttonWraper.style.flexDirection = 'row';
                    buttonWraper.style.gap = '10px';
                    buttonWraper.appendChild(barcodeFizi_button);
                    buttonWraper.appendChild(provider_button);
                    //buttonWraper.appendChild(barcode_button);
                    buttonWraper.appendChild(color_button);
                    buttonWraper.appendChild(size_button);
                    buttonWraper.appendChild(varient_button);

                    
                    //cell - the cell component
                    //formatterParams - parameters set for the column
                    //onRendered - function to call when the formatter has been rendered
                    // create 3 toggle buttons: צבע, מידה, ווריאנט
                    /*
                    let color_button = document.createElement('input');
                    let color_label = document.createElement('label');
                    color_label.innerText = 'צבע';
                    color_label.setAttribute('for', 'color_button');
                    
                    color_button.type = 'checkbox';
                    color_button.checked = filters.color;
                    color_button.name='color_button';
                    color_button.addEventListener('click', function(e){
                        console.log('color_button: ', color_button.checked);
                        debugger;
                        if(color_button.checked) {
                            filters.color = true;
                        } else {
                            filters.color = false;
                        }
                        let entryStocks = data['stocks'].filter(x=>(x.ppn__product__id == rowData.orderItem__product__id && (x.color__id == rowData.color__id || !filters.color) && (x.size__id == rowData.size__id || !filters.size) && (x.verient__id == rowData.varient__id || !filters.varient)));
                        draw_inventory_tbody(document.querySelector(`#taken_inventory_${rowData.id}`), entryStocks);
                    });
                    let color_wraper = document.createElement('div');
                    color_wraper.appendChild(color_button);
                    color_wraper.appendChild(color_label);


                    let size_button = document.createElement('input');
                    let size_label = document.createElement('label');
                    size_label.innerText = 'גודל';
                    size_label.setAttribute('for', 'size_button');
                    size_button.type = 'checkbox';
                    size_button.checked = filters.size;
                    size_button.name='size_button';
                    size_button.addEventListener('click', function(e) {
                        if(size_button.checked) {
                            filters.size = true;
                        } else {
                            filters.size = false;
                        }
                        let entryStocks = data['stocks'].filter(x=>(x.ppn__product__id == rowData.orderItem__product__id && (x.color__id == rowData.color__id || !filters.color) && (x.size__id == rowData.size__id || !filters.size) && (x.verient__id == rowData.varient__id || !filters.varient)));
                        draw_inventory_tbody(document.querySelector(`#taken_inventory_${rowData.id}`), entryStocks);
                    });
                    let size_wraper = document.createElement('div');
                    size_wraper.appendChild(size_button);
                    size_wraper.appendChild(size_label);



                    let varient_button = document.createElement('input');
                    let varient_label = document.createElement('label');
                    varient_label.innerText = 'מודל';
                    varient_label.setAttribute('for', 'varient_button');
                    varient_button.type = 'checkbox';
                    varient_button.checked = filters.varient;
                    varient_button.name='varient_button';
                    varient_button.addEventListener('click', function(e) {
                        if(varient_button.checked) {
                            filters.varient = true;
                        } else {
                            filters.varient = false;
                        }
                        let entryStocks = data['stocks'].filter(x=>(x.ppn__product__id == rowData.orderItem__product__id && (x.color__id == rowData.color__id || !filters.color) && (x.size__id == rowData.size__id || !filters.size) && (x.verient__id == rowData.varient__id || !filters.varient)));
                        draw_inventory_tbody(document.querySelector(`#taken_inventory_${rowData.id}`), entryStocks);
                    });
                    let varient_wraper = document.createElement('div');
                    varient_wraper.appendChild(varient_button);
                    varient_wraper.appendChild(varient_label);
                    */
                    
                    let htmlTable = '<table class="inventory-table" style="width:100%;">';
                    htmlTable += `
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>מחסן</th>
                                <th>ברקוד</th>
                                <th>ספק</th>
                                <th>ברקוד פיזי</th>
                                <th>צבע</th>
                                <th>גודל</th>
                                <th>מודל</th>
                                <th>כמות</th>
                                <th>כמות נלקחת</th>
                            </tr>
                        </thead>
                    `
                    let table = document.createElement('div');
                    htmlTable += `<tbody id="taken_inventory_${rowData.id}">`;
                    /*onRendered(function() {
                        debugger;
                        
                    })*/
                    
                    
                    htmlTable += '</tbody>';
                    htmlTable += '</table>';
                    let wraper = document.createElement('div');
                    
                    

                    
                    wraper.appendChild(buttonWraper);
                    table.innerHTML = htmlTable;
                    wraper.appendChild(table);
                    


                    var holderEl = document.createElement("div");

                    holderEl.style.boxSizing = "border-box";
                    holderEl.style.padding = "10px 30px 10px 10px";
                    holderEl.style.borderTop = "1px solid #333";
                    holderEl.style.borderBotom = "1px solid #333";
                    holderEl.appendChild(wraper);
                    row.getElement().appendChild(holderEl);

                    let domTbody = document.querySelector(`#taken_inventory_${rowData.id}`)
                    let entryStocks = data['stocks'].filter(x=>(
                                x.ppn__product__id == rowData.orderItem__product__id && 
                                (x.ppn__has_phisical_barcode == rowData.has_physical_barcode || !filters.has_physical_barcode) &&
                                (x.ppn__provider == rowData.provider || !filters.provider) &&
                                (x.ppn__barcode == rowData.barcode || !filters.barcode) &&
                                (x.color__id == rowData.color__id || !filters.color) && 
                                (x.size__id == rowData.size__id || !filters.size) &&
                                (x.verient__id == rowData.varient__id || !filters.varient)
                            ));
                    draw_inventory_tbody(domTbody, entryStocks,rowData.id);
                    //table.redraw();

                    return wraper;
                },
            /*rowFormatter:function(row){
                
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
                        {title: 'מחסן', field:'warehouse__name'},
                        { title: 'ברקוד', field: 'ppn__barcode' },
                        { title: 'ספק', field: 'ppn__provider__name' },
                        { title: 'צריך ברקוד פיזי', field: 'ppn__has_phisical_barcode' },
                        
                        { title: 'צבע', field: 'color__color', formatter:function(cell, formatterParams) {

                            return `<div style="display:flex;justify-content:start;align-items:center;gap:2px;"><div style="background-color:${cell.getValue()};width: 25px;height: 25px;border:1px solid black;"> </div>
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
            },*/
            //groupBy: ['orderItem__product__title'],

        });
    });

    function save_taken_stocks() {
        let taken_stocks = data['stocks'];
        fetch_wraper(BASE_URL + `/dashboard/orders-collection/collect/save`, {
            method: 'POST',
            body: JSON.stringify(taken_stocks),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(data => {
            console.log(data);
            if (data.status == 'ok') {
                alert('הנתונים נשמרו בהצלחה');
                location.reload();
            }
        }).catch(error => {
            console.log(error.message);
        });
    }

    function update_collected_quantity(id, value,takenInventory_id,stock_entry_id) {
        let row = data['stocks'].find(x=>x.id == id);
        //et rowData = row.getData();
        if(row.collected == undefined) {
            row.collected = {};
        }
        row.collected[takenInventory_id] = value;
        console.log(data['stocks']);
        //row.updateData(rowData);
    }
    function draw_inventory_tbody(domTbody,entryStocks, takenInventory_id) {
        domTbody.textContent  = '';
        if(entryStocks.length > 0) {
            
            entryStocks.forEach(stock=>{
                let input = document.createElement('input');
                input.type = 'number';
                //input.value = stock.collected;
                input.min = 0;
                let takenInventoryItem = data['taken'].find(e=>e.id==takenInventory_id)
                if(takenInventoryItem.collected__warehouseStock__id == stock.id) {
                    input.value = takenInventoryItem.quantity;
                }else {
                    //input.value = 0;
                }

                input.max = stock.quantity;
                input.addEventListener('change', ()=>{
                    let stock_entry_id = stock.id;
                    update_collected_quantity(stock.id, input.value,takenInventory_id, stock_entry_id);
                });
                let trEl = document.createElement('tr');
                let tdEl_stock_id = document.createElement('td');
                tdEl_stock_id.innerText = stock.id;
                let tdEl_warehouse__name = document.createElement('td');
                tdEl_warehouse__name.innerText = stock.warehouse__name;
                let tdEl_barcode = document.createElement('td');
                tdEl_barcode.innerText = stock.ppn__barcode;
                let tdEl_provider = document.createElement('td');
                tdEl_provider.innerText = stock.ppn__provider__name;
                let tdEl_has_phisical_barcode = document.createElement('td');
                // put emojies in the cell
                tdEl_has_phisical_barcode.innerText = stock.ppn__has_phisical_barcode? '✅' : '❌';
                let tdEl_color = document.createElement('td');
                tdEl_color.innerHTML = `
                <div style="display:flex;justify-content:start;align-items:center">
                    <div style="width:25px;height:25px;background-color:${stock.color__color};border:1px solid black;"></div>
                    <div>
                        ${stock.color__name}
                    </div>
                </div>
                `
                //tdEl_color.innerText = stock.color__name;
                let tdEl_size = document.createElement('td');
                tdEl_size.innerText = stock.size__size;
                let tdEl_varient = document.createElement('td');
                tdEl_varient.innerText = stock.verient__name;
                let tdEl_quantity = document.createElement('td');
                tdEl_quantity.innerText = stock.quantity;
                let tdEl_collected = document.createElement('td');
                tdEl_collected.appendChild(input);
                

                trEl.appendChild(tdEl_stock_id);
                trEl.appendChild(tdEl_warehouse__name);
                trEl.appendChild(tdEl_barcode);
                trEl.appendChild(tdEl_provider);
                trEl.appendChild(tdEl_has_phisical_barcode);
                trEl.appendChild(tdEl_color);
                trEl.appendChild(tdEl_size);
                trEl.appendChild(tdEl_varient);
                trEl.appendChild(tdEl_quantity);
                trEl.appendChild(tdEl_collected);
                domTbody.appendChild(trEl);

                
                /*htmlTbody+= `
                        <td>${stock.id}</td>
                        <td>${stock.warehouse__name}</td>
                        <td>${stock.ppn__barcode || ''}</td>
                        <td>${stock.ppn__provider__name}</td>
                        <td>
                            <div style="display:flex;justify-content:start;align-items:center">
                                <div style="width:25px;height:25px;background-color:${stock.color__color};border:1px solid black;"></div>
                                <div>
                                    ${stock.color__name}
                                </div>
                            </div>
                        </td>
                        <td>${stock.size__size}</td>
                        <td>${stock.verient__name || ''}</td>
                        <td>${stock.quantity}</td>
                `
                htmlTbody+= `<td>${input.outerHTML}</td>`*/
            });
        }
                        //domTbody.innerHTML = htmlTbody;
    }
</script>

<svelte:head>
    <link href="https://unpkg.com/tabulator-tables@5.2.4/dist/css/tabulator.min.css" rel="stylesheet">
</svelte:head>
    <div class="container">
    <div id="taken"></div>

    <!-- loating save btn -->
    <button on:click="{save_taken_stocks}" class="fixed-action-btn btn btn-primary">
        שמור
    </button>
    
</div>

<style lang="scss">
    #taken {
        padding-bottom: 350px;
    }
    .fixed-action-btn {
        position: fixed;
        left: 24px;
        bottom: 24px;
        padding: 15px;
        //background-color: #fff;
        
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
    }
    :global(#taken) {
        :global(.tabulator-tableholder) {
            //overflow-x: hidden;
            max-width: 100%;
            :global(.tabulator-table) {
                
                :global(.tabulator-row) {
                    border-bottom:2px solid blue;
                }
            }
        }
    }
    :global(.inventory-table) {
        border-collapse: collapse;
        width: 100%;
        text-align: center;
        height: 350px;
        :global(thead) {
            background-color: #333;
            color: white;
            font-weight: bold;
            
        }
            
        :global(tbody) {
            
            background-color: rgb(29, 28, 28);
            color:white;
            :global(tr:nth-child(even)) {
                background-color: #333;
            }
            :global(tr > td) {
                border: 1px solid rgb(202, 202, 202);
                padding: 5px;
            }
            
        }
    }
</style>