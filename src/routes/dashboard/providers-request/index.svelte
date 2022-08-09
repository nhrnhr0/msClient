
<script context="module">
import { LOAD_ALL_PROVIDER_REQUEST_TO_ORDER } from "src/api/consts";
import { fetch_wraper, fetch_wraper_without_json } from "src/api/api";
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
import PivotEditTable from "src/lib/components/dashboard/PivotEditTable.svelte";
import { Spinner } from "sveltestrap";
import { getLocalStorageStore } from "src/stores/localStorageStore";
import ColorDisplay from "src/lib/components/ColorDisplay.svelte";
import { CLOUDINARY_URL,UPDATE_PROVIDER_REQUEST_ENTRY } from "src/api/consts";
import { notifier } from "@beyonk/svelte-notifications";
import { getContext } from 'svelte';
const { open } = getContext('simple-modal');
import SplitProviderPopup from './SplitProviderPopup.svelte';
import { PROVIDERS_STORE, PROVIDERS_STORE_IDS_AS_KEYS } from "src/stores/localStorageStore";
import { CREATE_PROVIDER_DOCS } from "src/api/consts";
    export let data;
    let rows = [
        {
            val: 'morder',
            label: 'מספר הזמנה',
            hidden: false,
        },
        {
            val: 'product',
            label: 'מוצר',
            hidden: false,
        },
        {
            val: 'force_physical_barcode',
            label: 'ברקוד פיזי',
            hidden: false,
        },
        {
            val:'provider',
            label:'ספק',
            hidden:false,
        },
        {
            val: 'color',
            label: 'צבע',
            hidden: false,
        },
        {
            val:'varient',
            label:'מודל',
            hidden:false,
        }];

        //'morder','product','force_physical_barcode','provider','color','varient']
    let colum = ['size']
    let val = ['quantity']

    let ALL_SIZES;
    let ALL_COLORS; //{"id":89,"name":"","color":"#FF0000","code":""},{"id":76,"name":"no color","color":"#FFFFFF00","code":"00"},...
    let ALL_VARIENTS;
    let ALL_PROVIDERS;
    let colors_dict = {};
    let varients_dict = {};
    let providers_dict = {};
    let sizes_dict = {};

    onMount(async() => {
        console.log('onMount');
        
        ALL_SIZES = await getLocalStorageStore('sizes');
        ALL_COLORS = await getLocalStorageStore('colors');
        ALL_VARIENTS = await getLocalStorageStore('varients');
        ALL_PROVIDERS = await getLocalStorageStore('providers');

        sizes_dict = {};
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

        // create dict based on ALL_SIZES:
        // key: size.id, value: object
        
        ALL_SIZES.forEach(size => {
            sizes_dict[size.id] = size;
        });

        fetch_wraper(LOAD_ALL_PROVIDER_REQUEST_TO_ORDER)
            .then(json => {
                console.log('json', json);
                data = json;
            });
    });
    const ROW_LABELS = {
        id: 'id',
        'morder': 'מספר הזמנה',
        'product': 'מוצר',
        'force_physical_barcode': 'ברקוד פיזי',
        'provider': 'ספק',
        'color' : 'צבע',
        'varient' : 'מודל',
    }


    function providers_input_changed(e) {
        let target = e.target;
        let idx = parseInt(target.parentElement.dataset.rowIdx);
        let val = parseInt(target.value);
        let rowData = JSON.parse(target.parentElement.dataset.rowData);
        let size_key = target.parentElement.dataset.rowKey;
        update_or_create_request_quantity_local(idx, rowData, size_key, val);
    }

    function update_or_create_request_quantity_local(idx, rowData, size_key, val) {
        console.log('update_or_create_request_quantity_local',idx, rowData, size_key, val);
        debugger;
        if(idx === -1) {
            let size = sizes_dict[size_key];
            let newEntry = {
                'id': undefined,
                'provider': rowData.provider,
                'size': size.id,
                'varient': rowData.varient ? rowData.varient : null,
                'color': rowData.color,
                'force_physical_barcode': rowData.force_physical_barcode,
                'quantity': val,
                'morder': rowData.morder,
                'product': rowData.product,
            }
            let idx = is_exist_in_data(newEntry);
            if(idx === -1) {
                idx = data.push(newEntry) - 1;
            } else {
                data[idx].quantity = val;
            }
            // = data.push(newEntry) - 1;
            update_providers_requst_quantity_on_server(newEntry, idx);
        }else {
            let entry = data[idx];
            entry.quantity = parseInt(val);
            update_providers_requst_quantity_on_server(entry, idx);
        }
    }

    function is_exist_in_data(newEntry) {
        debugger;
        let exist = data.findIndex(entry => {
            let found = true;
            for(let i = 0; i< rows.length; i++){
                if(JSON.stringify(newEntry[rows[i]]) !== JSON.stringify(entry[rows[i]])) {
                    found = false;
                    break;
                }
            }
            return found;
        });
        return exist;
    }
    function update_providers_requst_quantity_on_server(entry, idx) {
        // send the new entry to the server
        // and update the entry in the data array
        fetch_wraper(UPDATE_PROVIDER_REQUEST_ENTRY, {
            method: 'POST',
            body: JSON.stringify(entry)
        })
            .then(json => {
                notifier.success('הזמנה עודכנה בהצלחה');
                console.log('json', json);
                if(json.status == 'success') {
                    data[idx] = json.data;
                } else if (json.status == 'Entry deleted') {
                    data.splice(idx, 1);
                } else {
                    notifier.danger('שגיאה בשמירת מידע')
                }
                
            }).catch(err => {
                notifier.danger('הזמנה לא עודכנה');
            });
    }


    function split_provider_btn_click(e) {
        debugger;
        let target = e.target;
        let td = target.closest('td');
        let idx = parseInt(td.dataset.rowIdx)
        let rowData = JSON.parse(td.dataset.rowData);
        //let size_key = target.dataset.rowKey;
        let size_key = td.dataset.rowKey;


        open(SplitProviderPopup, {
            info: data[idx],
            rowData: rowData,
            //quantity: data[idx].quantity,
            //idx: idx,
            size_key: size_key,
            update_or_create_func: update_or_create_request_quantity_local,
        });

    }


    async function create_providers_docs(e) {
        let response = await fetch_wraper_without_json(CREATE_PROVIDER_DOCS, {
            method: 'POST',
            body: JSON.stringify(selectedPivotIndexesArr)
        });
        console.log(response);
        debugger;
        // get the file from the response
        let file = response.data;
        // open the file in a new window
        window.open(file);

        /*
        let reader = json.body.getReader();
        
        const chunks = [];
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            chunks.push(value);
        }
        debugger;
        
        let info = [].concat(chunks);
        console.log('info', info);
        let blob = new Blob(info);
        //let url = URL.createObjectURL(blob);
        
        


        var url = window.URL || window.webkitURL;
        var downloadUrl = url.createObjectURL(blob);

        var a = document.createElement("a");
        a.style.display = "none";
        let fileName = 'דוח הזמנות לספקים.docx';
        if (typeof a.download === "undefined") {
            window.location = downloadUrl;
        } else {
            a.href = downloadUrl;
            a.download = fileName;
            doc.body.appendChild(a);
            a.click();
        }*/
        
    }

    let filter_rules = [
        /*{
            key: 'morder',
            rule: 'equal',
            value: '45',
        },*/
        /*{
            key: 'provider',
            rule: 'contains',
            value: 'ה',
        }*/
    ]
    function filter_data_function(entry) {
        let found = true;
        for(let i = 0; i< filter_rules.length; i++){
            let rule = filter_rules[i];
            let key = rule.key;
            let value = rule.value;
            let rule_func = rule.rule;
            console.log('hey');
            if(rule_func === 'equal') {
                if(entry[key] != value) {
                    found = false;
                    break;
                }
            }else if (rule_func === 'contains') {
                let val = entry[key];
                if(key == 'provider') {
                    val = $PROVIDERS_STORE_IDS_AS_KEYS[val]?.label;
                    console.log($PROVIDERS_STORE_IDS_AS_KEYS);
                }
                if(!val.toString().includes(value)) {
                    found = false;
                    break;
                }
            }
        }
        return found;
    }

    let pivotData;
    function select_row(indexs) {
        for(let i = 0; i < indexs.length; i++) {
            if(indexs[i] != undefined && selectedPivotIndexes.has(indexs[i]) === false) {
                selectedPivotIndexes.add(indexs[i]);
            }else {
                selectedPivotIndexes.delete(indexs[i]);
            }
        }
        selectedPivotIndexesArr = Array.from(selectedPivotIndexes);
    }

    function find_all_indexes_of_value(data, row_data, rows) {
        let idxs = [];
        for(let i = 0; i< data.length; i++){
            let found = true;
            for(let j = 0; j< rows.length; j++){
                if(JSON.stringify(row_data[rows[j]]) !== JSON.stringify(data[i][rows[j]])) {
                    found = false;
                    break;
                }
            }
            if(found) {
                idxs.push(i);
            }
        }
        return idxs;
    }
    let selectedPivotIndexes = new Set();
    let selectedPivotIndexesArr = [];
</script>

{#if data}
    <PivotEditTable
        bind:data={data}
        bind:pivotData={pivotData}
        ordering={['morder', 'product', 'force_physical_barcode', 'provider', 'color', 'varient']},
        filter_func={filter_data_function}

        rows={rows}
        colum={colum}
        val={val}
        columSorter={function(arr){
            console.log(arr);
            if(arr.length == 0) return arr;
            return arr.sort(function(a,b){
                let a_val = sizes_dict[a].code
                let b_val = sizes_dict[b].code;
                return b_val.localeCompare(a_val);
            });
        }}>

    >
    
    <th slot="col-header" let:col_data>
        {sizes_dict[col_data].size}
    </th>
    <!--
    <template use:fragment slot="col-header" let:col_data>
        <th>{sizes_dict[col_data].size}</th>
    </template>
    -->
    <th  slot="row-header" let:row_data>
        {row_data['label']}
    </th>
    <!--
        <template use:fragment slot="row-header" let:row_data>
                <th>
                    {ROW_LABELS[row_data]}
                </th>
        </template>
        -->

        <template use:fragment slot="row-cell" let:origianl_indexs let:pivotIdx let:row_data let:row_key>
            {#if row_key == 'color'}

                <td><ColorDisplay color={colors_dict[row_data[row_key]]} /></td>
            {:else if row_key == 'force_physical_barcode'}
                    <td>{row_data[row_key] ?  '✅':'❌'}</td>
            {:else if row_key == 'varient'}
                    <td>{varients_dict[row_data[row_key]]?.name || ''}</td>
            {:else if row_key == 'provider'}
                    <td>{providers_dict[row_data[row_key]]?.label || ''}</td>
            {:else if row_key == 'product'}
                    <td>
                        <div class="product-wraper">
                            <img src={CLOUDINARY_URL + row_data[row_key]?.cimage} width="25" height="25" alt="{row_data[row_key]?.title || ''}"/>
                            {row_data[row_key]?.title || ''}
                        </div>
                    </td>
            {:else if row_key == 'morder'}
                <td class="morder-cell" class:active={origianl_indexs.some(x=> selectedPivotIndexesArr.includes(x))} on:click="{select_row(origianl_indexs)}">
                    {row_data[row_key]}
                </td>
            {:else}
                <!-- defult case -->
                <td>{row_data[row_key]}</td>
            
            {/if}
        </template> 

        <template use:fragment slot="val-cell" let:row_index let:row_key let:row_data>
            <td  data-row-key={row_key} data-row-idx={row_index!=undefined?row_index:-1} data-row-data={JSON.stringify(row_data)} >
                <input class="small-input" type="number" value="{data[row_index]?.quantity}" on:change="{providers_input_changed}"/>
                
                    <button on:click={split_provider_btn_click} class="btn split-btn" class:active={row_index != undefined}>
                        <!--{JSON.stringify(row_index)} / {JSON.stringify(data.length)}-->
                        <img src="https://res.cloudinary.com/ms-global/image/upload/v1655204675/msAssets/icon-changelink_utqtio.svg" alt="פצל">
                    </button>
            </td>
        </template>

    </PivotEditTable>
    <a href="{CREATE_PROVIDER_DOCS}?ids={encodeURI(JSON.stringify(selectedPivotIndexesArr.map(idx => data[idx].id)))}" download="ספקים.docx">צור מסמכי ספקים</a>
    <!--
    <button on:click="{create_providers_docs}"></button>
    -->
{:else}
    <Spinner/>
{/if}

<style lang="scss">
    .morder-cell {
        &.active {
            background-color: rgb(77, 132, 233);
        }
    }
    .select-btn {
        border: 1px solid blue!important;
        width: 100%;
        padding: auto;
        margin: 0px;

    }
    .product-wraper{
        display: flex;
        align-items: center;
        justify-content: start;
    }
    .split-btn {
        //width: 20px;
        //height: 20px;
        background-color: rgb(221, 217, 217);
        border: 1px solid #ccc;
        //display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        outline: none;
        transition: all .2s ease-in-out;
        visibility: hidden;
        opacity: 0;
        padding-top: 0px;
        padding-bottom: 0px;;
        padding-left: 5px;
        padding-right: 5px;
        &.active {
            visibility: visible;
            opacity: 1;
        }
        &:hover {
            background-color: rgb(177, 177, 177);
            border: 1px solid #ccc;
        }
    }
    .small-input {
        width: 50px;
    }

    :global(table) {
        width: 100%;
        :global(thead)  {
            :global(th) {
                text-align: center;
                padding: 5px;
                background-color: #ccc;
                border:1px solid black;
            }
        }
        :global(tbody) {
            
            :global(tr:nth-child(even)) {
                background-color: #f5f5f5;
            }

            :global(td) {
                text-align: center;
                padding: 5px;
                border:1px solid black;
            }
            :global(tr:hover) {
                background-color: #ccc;
            }
        }
    }
</style>