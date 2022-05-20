

<script>
    import { onMount } from 'svelte';
    export let data;
    import {TabulatorFull as Tabulator} from 'tabulator-tables';
import DragableEditList from '../DragableEditList.svelte';
import StockEditPopup from './StockEditPopup.svelte';
import {flip} from "svelte/animate";
    import {dndzone} from "svelte-dnd-action";
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
            height:'auto', // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
            data:data, //assign data to table
            layout:"fitColumns", //fit columns to width of table (optional)
            groupBy: ['warehouse_name', 'product_name'],
            columns:[ //Define Table Columns
                {title:"מספר הכנסה", field:"id", sorter:"number", align:"center"},
                
                {title:"מחסן", field:"warehouse_name",headerFilter:true},
                {title:'ספק', field:'provider_name',headerFilter:true},
                {title:"שם מוצר", field:"product_name",headerFilter:true},
                {title:'ברקוד', field:'barcode',headerFilter:true},
                {title:"צבע", field:"color_name",headerFilter:true},
                {title:"מידה", field:"size_name",headerFilter:true},
                {title:"מודל", field:"verient_name",headerFilter:true},
                {title:"כמות", field:"quantity",headerFilter:true},
                {title:"מחיר ממוצע ליח", field:"avgPrice",headerFilter:true},
                {title: "ערוך", field: "edit", formatter: function(cell, formatterParams){
                    let button = window.document.createElement('button');
                    button.innerHTML = 'ערוך';
                    button.onclick = function(){
                        console.log(cell.getData().id);
                        
                        openStockEditPopup(cell.getData().id,cell.getData());
                    };
                    return button
                }, headerFilter:false},
                {title:"נוצר ב", field:"created_at", width:150},
                {title:"עודכן ב", field:"updated_at", width:150},
            ],
        });
    });

    function openStockEditPopup(id, data){
        id_stock_to_edit = id;
        data_stock_to_edit = data;
        show_stock_edit_popup = true;
    }
    function closeStockEditPopup(){
        show_stock_edit_popup = false;
    }
    /*
    let selectedGropingKeys = [];
    function headerKeyClicked(e) {
        let key = {name: e.target.dataset.key,
                    id: e.target.dataset.id,};

        debugger;
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

    let selectedKeys = [];

</script>
<svelte:head>
    <link href="https://unpkg.com/tabulator-tables@5.2.4/dist/css/tabulator.min.css" rel="stylesheet">
</svelte:head>
<div>
    <div class="headers-grouping">
        <div class="dnd-zone" use:dndzone="{{items: HEADER_KEYS_WITH_IDS,}}" on:consider="{handleDndConsider}" on:finalize="{handleDndConsider}">
            {#each HEADER_KEYS_WITH_IDS as item(item.id)}
                <div class="drop-item">
                    <div>{item.name}</div>
                </div>
            {/each}
        </div>
        <div class="dnd-zone" use:dndzone="{{items: selectedKeys,}}" on:consider="{handleDndConsiderResult}" on:finalize="{handleDndConsiderResult}">
            {#each selectedKeys as item(item.id)}
                <div class="drop-item">
                    <div>{item.name}</div>
                </div>
            {/each}
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
  </div>
    <StockEditPopup bind:is_open={show_stock_edit_popup} originalData={data_stock_to_edit} stockId={id_stock_to_edit} ></StockEditPopup>
<div bind:this={tableDom} id="example-table"></div>

<style lang="scss">
    .headers-grouping {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
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