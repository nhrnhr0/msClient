

<script>
    import { onMount } from 'svelte';
    export let data;
    import {TabulatorFull as Tabulator} from 'tabulator-tables';
    import Modal from 'svelte-simple-modal';

import DragableEditList from '../DragableEditList.svelte';
import StockEditPopup from './StockEditPopup.svelte';
import {flip} from "svelte/animate";
    import {dndzone} from "svelte-dnd-action";
    import { getContext } from 'svelte';
    import {dateCellFormatter} from '@src/lib/utils/utils';
import { BASE_URL,CLOUDINARY_URL } from '@src/api/consts';

    const { open } = getContext('simple-modal');

    let tableDom;

    let table;
    const COMPERASON_TYPES = ['=','!=', '<', '>', '<=', '>=','like',];

    // edit stock popup
    let id_stock_to_edit;
    let data_stock_to_edit;
    let show_stock_edit_popup;

    let HEADER_KEYS = ['id', 'warehouse_name', 'provider_name', 'product_name', 'barcode','color_name','size_name','verient_name','quantity','avgPrice',]
    let HEADER_KEYS_WITH_IDS = HEADER_KEYS.map((v, index)=> {
        return {
            id: index,
            name: v,
        }
    })





    //define some sample data
    /*var tabledata = [
        {id:1, name:"Oli Bob", age:"12", col:"red", dob:""},
        {id:2, name:"Mary May", age:"1", col:"blue", dob:"14/05/1982"},
        {id:3, name:"Christine Lobowski", age:"42", col:"green", dob:"22/05/1982"},
        {id:4, name:"Brendon Philips", age:"125", col:"orange", dob:"01/08/1980"},
        {id:5, name:"Margret Marmajuke", age:"16", col:"yellow", dob:"31/01/1999"},
    ];*/
    onMount(()=> {
        //create Tabulator on DOM element with id "example-table"
        table = new Tabulator("#example-table", {
            textDirection:"rtl",
            height:'auto', // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
            data:data, //assign data to table
            layout:"fitColumns", //fit columns to width of table (optional)
            groupBy: ['warehouse_name', 'product_name'],
            columns:[ //Define Table Columns
                {title:"id", field:"id", sorter:"number", align:"center"},
                
                {title:"מחסן", field:"warehouse_name",headerFilter:true},
                {title:'ספק', field:'provider_name',headerFilter:true},
                {title:"שם מוצר", field:"product_name",headerFilter:true,width:'150', formatter:function(cell, formatterParams){
                    // return the image (cimage + BASE_URL) and the title (product_name/cell.getValue())
                    return `<img width:"25px" height="25px" src="${CLOUDINARY_URL + '/' + cell.getRow().getData().product_image}" title="${cell.getValue()}"/><div>${cell.getValue()}</div>`;
                    
                }},
                {title:'ברקוד', field:'barcode',headerFilter:true},
                {title:"ברקוד פיזי", field:"has_phisical_barcode",headerFilter:true, formatter:function(cell, formatterParams){
                    return cell.getValue() ? '✅' : '❌';
                }},
                {title:"צבע", field:"color_name",headerFilter:true},
                {title:"מידה", field:"size_name",headerFilter:true},
                {title:"מודל", field:"verient_name",headerFilter:true},
                {title:"כמות", field:"quantity",headerFilter:true},
                {title:"מחיר ממוצע ליח", field:"avgPrice",headerFilter:true},
                {title: "ערוך", field: "edit", formatter: function(cell, formatterParams){
                    let buttonWraper = document.createElement('div');
                    buttonWraper.classList.add('edit-button-wrapper');
                    let button = window.document.createElement('button');
                    button.classList.add('btn-secondary');
                    button.classList.add('btn');
                    button.classList.add('edit-btn');
                    button.innerHTML = 'ערוך';
                    button.onclick = function(){
                        console.log(cell.getData().id);
                        
                        openStockEditPopup(cell.getData().id,cell.getData());
                    };
                    buttonWraper.appendChild(button);
                    return buttonWraper;
                }, headerFilter:false},
                {title:"נוצר ב", field:"created_at", width:150,formatter:dateCellFormatter, headerFilter:false},
                {title:"עודכן ב", field:"updated_at", width:150,formatter:dateCellFormatter, headerFilter:false},
            ],
        });
    });



    function openStockEditPopup(id, data){
        id_stock_to_edit = id;
        data_stock_to_edit = data;
        /*show_stock_edit_popup = true;*/
        //open(CreateEnterDocPopup, { refresh: refresh_data })
        open(StockEditPopup, {
            originalData:data_stock_to_edit,
            stockId:id_stock_to_edit, 
            replaceData: replaceData,
            updateData: updateData,
        })
        
    }
    function closeStockEditPopup(){
        show_stock_edit_popup = false;
    }
    /*
    let selectedGropingKeys = [];
    function headerKeyClicked(e) {
        let key = {name: e.target.dataset.key,
                    id: e.target.dataset.id,};

        let selectedGropingKeys2 = new Set(selectedGropingKeys);
        selectedGropingKeys2.add(key);
        selectedGropingKeys = [...new Set(selectedGropingKeys2)];

    }
*/
    $: {
        if(selectedKeys.length){
            let vals = selectedKeys.map(key => key.name);
            table.setGroupBy(vals);
        }else if (table){
            table.setGroupBy('');
        }
    }

    const flipDurationMs = 300;
    function handleDndConsider(e) {
        HEADER_KEYS_WITH_IDS = e.detail.items;
    }

    function handleDndConsiderResult(e) {
        selectedKeys = e.detail.items;
    }

    function replaceData(data){
        let original = data.originalData;
        let newData = data.replaceData;
        table.updateOrAddData(newData);
    }
    function updateData(data) {
        let newData = data;
        if(isIterable(newData) == false){
            newData = [newData];
        }
        table.updateOrAddData(newData);
    }

    function isIterable(input) {  
        if (input === null || input === undefined) {
            return false
        }

        return typeof input[Symbol.iterator] === 'function'
    }

    let selectedKeys = [];
    let showInventoryGroups = false;
    let show_empty_stock = false;
    $: {
        if (show_empty_stock && table) {
            table.clearFilter('quantity');
        }else if(table){
            
            table.setFilter('quantity', '>', 0);
        }
    }
</script>
<svelte:head>
    <link href="https://unpkg.com/tabulator-tables@5.2.4/dist/css/tabulator.min.css" rel="stylesheet">
</svelte:head>
<div>
    <button class:active={showInventoryGroups} on:click="{()=>{console.log('button click');showInventoryGroups = !showInventoryGroups;}}" class="accordion">קבוצות מלאים</button>
    <div class="panel" class:active={showInventoryGroups}>
        <div class="headers-grouping">
            <div class="content">
            <h3>שדות לבחירה</h3>
            <div class="dnd-zone" use:dndzone="{{items: HEADER_KEYS_WITH_IDS,}}" on:consider="{handleDndConsider}" on:finalize="{handleDndConsider}">
                {#each HEADER_KEYS_WITH_IDS as item(item.id)}
                    <div class="drop-item">
                        <div>{item.name}</div>
                    </div>
                {/each}
            </div>
            </div>
            <div class="content">
                <h3>קבוצות רצויות</h3>
                <div class="dnd-zone" use:dndzone="{{items: selectedKeys,}}" on:consider="{handleDndConsiderResult}" on:finalize="{handleDndConsiderResult}">
                    {#each selectedKeys as item(item.id)}
                        <div class="drop-item">
                            <div>{item.name}</div>
                        </div>
                    {/each}
                </div>
            </div>
        <!--
            <div class="headers-grouping-options">
                {#each HEADER_KEYS as header,i}
                    <div class="headers-grouping-option">
                        <input data-key={header} data-id={i} on:click="{headerKeyClicked}" type="checkbox" >
                            {header}
                    </div>
                {/each}
            </div>
            <div class="headers-droping-area">
                <DragableEditList bind:list={selectedGropingKeys} />
            </div>
        -->
        </div>
    </div>
    <!--
    <select id="filter-field-1">
        <option></option>
        <option value="created_at">נוצר ב</option>
        <option value="updated_at">עודכן ב</option>
        <option value="warehouse_name">מחסן</option>
        <option value="provider_name">ספק</option>
        <option value="product_name">שם מוצר</option>
        <option value="color_name">צבע</option>
        <option value="size_name">מידה</option>
        <option value="verient_name">מודל</option>
        <option value="quantity">כמות</option>
        <option value="avgPrice">מחיר ממוצע ליח</option>
    </select>
  
    <select id="filter-type-1">
        {#each COMPERASON_TYPES as type}
            <option value="{type}">{type}</option>
        {/each}
    </select>
  
    <input id="filter-value" type="text" placeholder="value to filter">
  
    <button id="filter-clear">Clear Filter</button>
-->
  </div>
  <div class="checkbox">
        <input bind:checked="{show_empty_stock}" id="show_empty_stock" type="checkbox">
        <label for="show_empty_stock">הצג מקומות עם מלאי 0</label>
  </div>
  <!--
    <StockEditPopup on:table_replace={replaceData} bind:is_open={show_stock_edit_popup} originalData={data_stock_to_edit} stockId={id_stock_to_edit} ></StockEditPopup>
    -->
    <!--<Modal
    styleWindow={{ border: '1px solid red', boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.15)' }}
    >
    </Modal>-->
<div bind:this={tableDom} id="example-table"></div>

<style lang="scss">
    #example-table {
        width: 100%;
        height: 100%;
        max-width: 95vw;
        margin: auto;
    }
    :global(.edit-button-wrapper) {
        display: flex;
        justify-content: center;
        align-items: center;
    }
.accordion {
    &:before {
        content: '>>';
        
    }
    &.active {
        &:before {
            content: '↓';
        }
    }
  background-color: #eee;
  color: #444;
  cursor: pointer;
  padding: 18px;
  width: 100%;
  border: none;
  text-align: right;
  outline: none;
  font-size: 15px;
  transition: 0.4s;
  &.active, &:hover {
    background-color: #ccc; 
    }
}


.panel {
  padding: 0 18px;
  display: none;
  background-color: white;
  overflow: hidden;
  &.active {
    display: block;
    }
}






    .headers-grouping {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        .content {
            height: 100%;
        }
        .dnd-zone {
            flex:1;
            min-height: 150px;
            border: 1px solid blue;

            .drop-item {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 3px;
                background-color: #d8d3d3;
                margin: 10px;
                border-radius: 25px;
                cursor: move;
            }
        }
    }
    //@import  "tabulator-tables";
    //@import  "~/tabulator-tables/dist/css/tabulator.min.css";
</style>