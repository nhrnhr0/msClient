

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
    
import { CLOUDINARY_URL } from "@api/consts";
import { page } from "$app/stores";
import { Label, Spinner } from "sveltestrap";
import MorderProductEdit from "$lib/components/dashboard/doc_stock_out/MorderProductEdit.svelte";
import { BASE_URL } from "@api/consts";
let loading = false;
function setNewData(data) {
    debugger;
    headers_data = [...[{
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
        }]];

        products_data = [...data.products];

        if(headersTable) {
            headersTable.setData(headers_data);
        }

        debugger;
}
async function load_order_from_server(_id) {
        loading = true;
        let resp = await apiGetMOrder(_id);
        console.log('resp:', resp);
        data  = JSON.parse(JSON.stringify(resp));
        setNewData(data);
        loading = false;
    }

function save_order_to_server(e) {
    e.preventDefault();
    loading = true;
    console.log('data:', data);
    apiGetMOrder(data.id, data, "POST").then(
        function(resp) {
            debugger;
            console.log('resp:', resp);
            data  = resp
            setNewData(data);
            
        }
    ).finally(function() {
        loading = false;
    });
}
    let data;
    let headers_data;
    let products_data;
    let headersTable;
    let productsTable;
    let errorMessage = undefined;
    export let id;


    onMount(async ()=> {
        id = $page.params.id;
        errorMessage = undefined;
        try{
            await load_order_from_server(id);
        }catch(e){
            console.log(e);
            errorMessage = e.message;
        }

        debugger;
        headersTable = new Tabulator("#headers-table", {
            data:headers_data,
            //autoColumns:true,
            layout:"fitColumns",
            textDirection:"rtl", 
            columns: [
                {title:'תאריך יצירה', field:'created', formatter:il_date_formatter},
                {title:'תאריך שינוי', field:'updated', formatter:il_date_formatter},
                /*{title:'id', field:'id'},*/
                {title:'שם', field:'name'},
                {title:'אימייל', field:'email'},
                {title:'הודעה', field:'message',editor:true},
                {title: 'טפלון', field: 'phone'},
                {title: 'סטטוס', field: 'status', editor:"select", editorParams:{values:['new', 'done'],multiselect:false}},
                {title: 'שם לקוח', field: 'client_businessName'},
                {title: 'סוכן', field:'agent_name'},
                {title: 'ערוך', formatter:a_link_edit_formatter, editor:false},
                //{title: 'מוצרים', field:'products', formatter:products_formatter},
            ]
        });

        /*productsTable = new Tabulator('#productsTable', {
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

        function products_formrubhקונatter(cell, formatterParams, onRendered) {
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
            
        }*/
    });
    

    function il_date_formatter(cell, formatterParams, onRendered){
        return new Date(cell.getValue()).toLocaleString("he-IL");
    }

    function a_link_edit_formatter(cell, formatterParams, onRendered){
        let domEl = document.createElement('a');
        domEl.innerText = 'ערוך';
        domEl.href = `${BASE_URL}/admin/morders/morder/${cell.getRow().getData().id}/change/?_to_field=id&_popup=1`;
        domEl.target = '_blank';
        domEl.onclick = function(e) {
            debugger;
            window.open(`${BASE_URL}/admin/morders/morder/${cell.getRow().getData().id}/change/?_to_field=id&_popup=1`, 'newwindow', 'width=800,height=500');
            return false;
        }
        return domEl;
    }
    
</script>
<svelte:head>
    <link href="https://unpkg.com/tabulator-tables@5.2.4/dist/css/tabulator.min.css" rel="stylesheet">
</svelte:head>
    {#if data}
    

        <div id="headers-table"></div>
        <div class="freeze-inventry">
            <h3 style="text-align:center;">
                להקפיא מלאי?
                <label class="switch">
                    <input bind:checked={data.freezeTakenInventory} type="checkbox">
                    <span class="slider"></span>
                </label>
            </h3>
            <h3 style="text-align:center;">
                הפוך להזמנה
                <label class="switch">
                    <input bind:checked={data.isOrder} type="checkbox">
                    <span class="slider"></span>
                </label>
            </h3>
        </div>
        <table id="productsTable" class="products-table">
            <thead>
                <tr>
                    <th>
                        תמונה
                    </th>
                    <th>
                        שם מוצר
                    </th>
                    <th>
                        מחיר (ללא מע"מ)
                    </th>
                    <th>
                        הדפסה
                    </th>
                    <th>
                        רקמה
                    </th>
                    <th>
                        חשוב להזמנה
                    </th>
                    <th>
                        ברקוד
                    </th>
                    <th>
                        הערות
                    </th>
                </tr>
            </thead>
            <tbody>
                {#each products_data as product}
                    <tr class="view">
                        <td>
                            <img width="50px" height="50px" src="{CLOUDINARY_URL + product.product_cimage}" alt="">
                        </td>
                        <td>
                            {product.product_name}
                        </td>
                        <td>
                            <input type="number" bind:value={product.price} /> ₪
                        </td>
                        <td>
                            <input type="checkbox" bind:checked={product.prining} />
                            <textarea type="text" bind:value={product.priningComment} disabled={!product.prining} />
                        </td>
                        <td>
                            <input type="checkbox" bind:checked={product.embroidery} />
                            <textarea type="text" bind:value={product.embroideryComment} disabled={!product.embroidery} />
                        </td>
                        <td>
                            <input type="checkbox" bind:checked={product.ergent} />
                        </td>
                        <td>
                            {product.pbarcode || ''}
                        </td>
                        <td>
                            <textarea type="text" bind:value={product.comment} />
                        </td>
                    </tr>
                    <tr class="fold">
                        <td colspan="8">
                            <MorderProductEdit bind:product={product} />
                            <!--<MorderProductEdit2 
                                data={product.entries}
                                rows={[
                                    {key: 'color_name', label: 'צבע'},
                                    {key: 'varient_name', label: 'מודל',},
                                    /*{key: 'barcode', label: 'ברקוד', },
                                    {key: 'has_phisical_barocde',label: 'ברקוד פיזי',},
                                    {key: 'provider', label: 'ספק',},*/
                                    ]}
                                col = {{key: 'size_name', label: 'גודל'}}
                                val= {{key: 'quantity' , label: 'כמות'}}
                                />-->
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {:else}
        {#if errorMessage}
            {errorMessage}
        {:else}
            <Spinner></Spinner>
        {/if}
    {/if}

<button disabled={loading} class="float-save-btn btn btn-primary" on:click={save_order_to_server}>
    {#if loading}
        <Spinner></Spinner>
    {:else}
        עדכן מידע לשרת
    {/if}
</button>

<style lang="scss">

.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
    & input { 
        opacity: 0;
        width: 0;
        height: 0;
        &:checked + .slider {
            background-color: #2196F3;
        }
        &:focus + .slider {
            box-shadow: 0 0 1px #2196F3;
        }
        &:checked + .slider:before {
            -webkit-transform: translateX(26px);
            -ms-transform: translateX(26px);
            transform: translateX(26px);
        }
    }
    & .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
        &:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            -webkit-transition: .4s;
            transition: .4s;
        }

    }

}

    .float-save-btn {
        position: fixed;
        bottom: 15px;
        left: 15px;
        
    }
    /*:global(.products-table) {
        background-color: blue;
        border: 1px solid red;;
    }*/
    #headers-table{
        width: 100%;
        max-width: 95vw;
        margin: 0 auto;
    }

    :global(.products-table) {
        width: 100%;
        max-width: 95vw;
        margin:auto;
        thead {
            background-color: #f5f5f5;
            tr {
                th {
                    padding: 10px;
                    border-bottom: 1px solid #eaeaea;
                }
            }
        }
        tbody {
            tr {
                td {
                    padding: 10px;
                    border-bottom: 1px solid #eaeaea;
                }
                &:nth-child(even) {
                    background: rgb(221, 221, 221);
                }
                &:hover {
                    background: #ccc;
                }
            }
            

            
    }
}
</style>