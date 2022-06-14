
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
import { CLOUDINARY_URL,UPDATE_PROVIDER_REQUEST_ENTRY } from "@src/api/consts";
import { notifier } from "@beyonk/svelte-notifications";

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
        debugger;
        let rowData = JSON.parse(target.parentElement.dataset.rowData);
        let size_key = target.parentElement.dataset.rowKey;

        if(idx === -1) {
            // let provider = providers_dict[rowData.provider];
            // let color = colors_dict[rowData.color];
            let size = sizes_dict[size_key];
            // let varient = varients_dict[rowData.varient];
            // let force_physical_barcode = rowData.force_physical_barcode == true;
            
            /*
            let newEntry = {
                color: color.id,
                color__color: color.color,
                color__str: color.name,
                force_physical_barcode: force_physical_barcode,
                id: undefined,
                provider: provider.value,
                provider__str: provider.label,
                quantity: val,
                size: size.id,
                size__code: size.code,
                size__str: size.size,
                varient: varient? varient.id : '',
                varient__str: varient? varient.name : '',
            }
            */
            /*let newEntry = {...rowData, ...{
                quantity: val,
                size: size.id,
                size__code: size.code,
                size__str: size.size,
            }};*/
            /**
             {'108': 0, 'morder': 46, 'product': {'id': 139, 'title': 'גרבי ספורט', 'cimage': 'v1635672331/site/products/%D7%92%D7%A8%D7%91%D7%99_%D7%A1%D7%A4%D7%95%D7%A8%D7%98_uBLcEGO_F2qhVi2_bSu2lWG_YL4VqpL_bwqc2vL_o2BI4nt.png'}, 'force_physical_barcode': False, 'provider': 10, 'color': 77, 'varient': None, 'quantity': 44, 'size': 89, 'size__code': 'bd', 'size__str': 'L'}
            */
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
            data.push(newEntry);
            update_providers_requst_quantity(newEntry);
            data = [...data];
        }else {
            let entry = data[idx];
            entry.quantity = parseInt(val);
            update_providers_requst_quantity(entry);
            data = [...data];
        }
    }


    function update_providers_requst_quantity(entry) {
        // send the new entry to the server
        // and update the entry in the data array
        debugger;
        fetch_wraper(UPDATE_PROVIDER_REQUEST_ENTRY, {
            method: 'POST',
            body: JSON.stringify(entry)
        })
            .then(json => {
                notifier.success('הזמנה עודכנה בהצלחה');
            }).catch(err => {
                notifier.error('הזמנה לא עודכנה');
            });
    }


    function split_provider_btn_click(e) {
        let target = e.target;
        let idx = parseInt(target.dataset.rowIdx);
        let rowData = JSON.parse(target.dataset.rowData);
        let size_key = target.dataset.rowKey;
    }
</script>
{#if data}

    <PivotEditTable
        bind:data={data}
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
    <template use:fragment slot="not-working" let:col_data>
        not working?!!!!!!!!!!!
    </template>
    <template use:fragment slot="col-header" let:col_data>
        <th>{sizes_dict[col_data].size}</th>
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
            {:else}
                <!-- defult case -->
                <td>{row_data[row_key]}</td>
            
            {/if}
        </template> 

        <template use:fragment slot="val-cell" let:row_index let:row_key let:row_data>
            <td  data-row-key={row_key} data-row-idx={row_index!=undefined?row_index:-1} data-row-data={JSON.stringify(row_data)} >
                <input class="small-input" type="number" value="{data[row_index]?.quantity}" on:change="{providers_input_changed}"/>
                
                    <button on:click={split_provider_btn_click} class="btn split-btn" class:active={row_index != undefined}>
                        {JSON.stringify(data[row_index]&& data[row_index]['id'])}
                        <img src="https://res.cloudinary.com/ms-global/image/upload/v1655204675/msAssets/icon-changelink_utqtio.svg" alt="פצל">
                    </button>
            </td>
        </template>

    </PivotEditTable>
{:else}
    <Spinner/>
{/if}

<style lang="scss">
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