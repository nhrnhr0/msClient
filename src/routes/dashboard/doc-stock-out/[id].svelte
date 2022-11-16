

<script context="module">
import { apiGetMOrder } from "src/api/api";
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import AutoComplete from "simple-svelte-autocomplete";

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
    
import { CLOUDINARY_URL } from "src/api/consts";
import { page } from "$app/stores";
import { Label, Spinner } from "sveltestrap";
import MorderProductEdit from "$lib/components/dashboard/doc_stock_out/MorderProductEdit.svelte";
import { BASE_URL } from "src/api/consts";
import { apiAddNewProductToMorder, apiSearchProducts,apiDeleteProductFromMorder } from "src/api/api";
import { notifier } from "@beyonk/svelte-notifications";
let loading = false;
function setNewData(data) {
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
    apiGetMOrder(data.id, data, "POST").then(
        function(resp) {
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
                {title:'הודעה', field:'message',editor:true, formatter:"textarea",variableHeight:true},
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
            window.open(`${BASE_URL}/admin/morders/morder/${cell.getRow().getData().id}/change/?_to_field=id&_popup=1`, 'newwindow', 'width=800,height=500');
            return false;
        }
        return domEl;
    }
    function autocompleteItemSelected(val) {
        console.log('autocompleteItemSelected: ' , val);
        selectedProduct = val;
    }

    let selectedProduct;
    let addNewProductFormSubmitSending = false;
    let deleteProductFormSubmitSending = false;
    function addNewProductFormSubmit(e) {
        e.preventDefault();
        addNewProductFormSubmitSending = true;
        let sendData = {};
        sendData['order_id'] = data.id;
        sendData['product_id'] = selectedProduct.id;
        console.log('data: ', sendData);
        apiAddNewProductToMorder(sendData).then((newEntry)=> {
            e.target.reset();
            data.products.push(newEntry.data);
            console.log('newEntry: ', newEntry);
            console.log('data.products', data.products);
            data.products.sort((a, b)=> {
                return a.product.title.localeCompare(b.product.title);
            });
            //data.products = 
            /*
            data.products.map((product, index)=> {
                
            });
            */
            products_data = [...data.products];
            notifier.success('המוצר התווסף בהצלחה');
        }).catch(err=>{
            console.log(err);
            notifier.danger(err.message);
        }).finally(()=>{
            addNewProductFormSubmitSending = false;
        });
        
        //productAmountEditModel.hide();
    }

    $: {
        console.log('products_data updated: ', products_data);
        products_data && products_data.map((product, index)=> {
            product.order_sum = product.entries.reduce((acc, entry) => acc + parseInt(entry?.quantity || '0'), 0)
                product.take_sum = product.available_inventory.reduce((acc, entry) => acc + parseInt(entry?.taken || '0') + parseInt(entry?.toOrder || '0'), 0)
                product.provider_sum = product.toProviders.reduce((acc, entry) => acc + parseInt(entry?.quantity || '0'), 0)
                product.take_sum_prc = ((product.take_sum/product.order_sum)*100 || 0).toFixed(2);
                product.provider_sum_prc = ((product.provider_sum/product.order_sum)*100 || 0).toFixed(2);
                return product;
        });
    }

    async function searchProducts(keyword) {
            let json = await apiSearchProducts(keyword);
            let data = json;
            return data.all
        }


    function deleteProductPrompt(e) {
        e.preventDefault();
        let is_sure = confirm('האם אתה בטוח שברצונך למחוק את המוצר?');
        if(is_sure) {
            deleteProductFormSubmitSending = true;
            let row = e.target.closest('tr');
            let id = row.dataset.productId;
            let index = data.products.findIndex(product=>{
                return product.id == id;
            });
            if(index == -1){
                return;
            }
            let product = data.products[index];
            let sendData = {};
            sendData['entry_id'] = product.id;
            apiDeleteProductFromMorder(sendData).then(()=>{
                data.products.splice(index, 1);
                products_data = [...data.products];
                notifier.success('מוצר נמחק בהצלחה');
            }).catch(err=>{
                console.log(err);
                notifier.danger('אירעה שגיאה במחיקת המוצר' + err.message);
            }).finally(()=>{
                deleteProductFormSubmitSending = false;
            });
        }
    }


    let fold_states = {};
</script>
<svelte:head>
    <link href="https://unpkg.com/tabulator-tables@5.2.4/dist/css/tabulator.min.css" rel="stylesheet">
</svelte:head>
    {#if data}
    

    



        <div id="headers-table"></div>

        <div id="new-product-form">
            <h3>הוסף מוצר</h3>
            <form method="post" on:submit="{addNewProductFormSubmit}">
                <div class="form-group">
                    <label for="product_name">שם מוצר</label>
                    <div class="search-wraper">
                        
                        <AutoComplete id="search_input" on:focus loadingText="מחפש מוצרים..." createText="לא נמצאו תוצאות חיפוש" showLoadingIndicator=true noResultsText="" onChange={autocompleteItemSelected} create=true placeholder="חיפוש..." className="autocomplete-cls" searchFunction={searchProducts} delay=200 localFiltering="{false}" labelFieldName="title" valueFieldName="value">
                            <div slot="item" let:item={item} let:label={label}>
                                <div class="search-item">
                                    <div class="inner">
                                        <img alt="{item.title}" style="height:25px;" src="{CLOUDINARY_URL}f_auto,w_auto/{item.cimage}" />
                                        {@html label}
                                    </div>
                                </div>
                            </div>
                        </AutoComplete>
                    {#if selectedProduct}
                        <div class="selected-product">
                            <div class="inner">
                                <img alt="{selectedProduct?.title}" style="height:25px;" src="{CLOUDINARY_URL}f_auto,w_auto/{selectedProduct?.cimage}" />
                                {@html selectedProduct?.title}
                            </div>
                        </div>
                    
                        <button>
                        {#if addNewProductFormSubmitSending }
                            <Spinner></Spinner>
                        {:else}
                            הוסף
                        {/if}</button>
                    {:else}
                        <button disabled>הוסף</button>
                    {/if}
                    </div>
                </div>
            </form>
        </div>

        
        <div class="freeze-inventry">
            <h6 style="text-align:center;">
                הקפא מלאי
                <label class="switch">
                    <input bind:checked={data.freezeTakenInventory} type="checkbox">
                    <span class="slider"></span>
                </label>
                הפשר מלאי
            </h6>
            <h6 style="text-align:center;">
                הזמנה
                <label class="switch">
                    <input bind:checked={data.isOrder} type="checkbox">
                    <span class="slider"></span>
                </label>
                הצעת מחיר
            </h6>
            <h6 style="text-align:center;">
                שלח חוסרים לספקים
                <label class="switch">
                    <input bind:checked={data.sendProviders} type="checkbox">
                    <span class="slider"></span>
                </label>
                חכה
            </h6>
            <h6 style="text-align:center;">
                התחל ליקוט
                <label class="switch">
                    <input bind:checked={data.startCollecting} type="checkbox">
                    <span class="slider"></span>
                </label>
                חכה
            </h6>
        </div>
        <table id="productsTable" class="products-table">
            <thead>
                <tr>
                    <th width="10px"></th>
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
                    <th>
                        מחק
                    </th>
                </tr>
            </thead>
            <tbody>
                {#each products_data as product}
                    <tr class="view" data-product-id={product.id}>
                        <td on:click="{()=>{fold_states[product.id]=!fold_states[product.id]}}">
                            <div class="fold-arrow" class:active={fold_states[product.id]}>
                            </div>
                        <td on:click="{()=>{fold_states[product.id]=!fold_states[product.id]}}">
                            <img width="50px" height="50px" src="{CLOUDINARY_URL + product.product_cimage}" alt="">
                        </td>
                        <td on:click="{()=>{fold_states[product.id]=!fold_states[product.id]}}">
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
                        <td>
                            <button class="delete-btn" disabled={deleteProductFormSubmitSending} on:click="{deleteProductPrompt}">
                                {#if deleteProductFormSubmitSending}
                                    <Spinner></Spinner>
                                {:else}
                                    <svg fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="30px" height="30px" class="delete-btn-click-area"><path class="delete-btn-click-area" d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"/></svg>
                                {/if}
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="10">
                            <div class="progress">
                                <div class="progress-bar bg-success" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={product.take_sum_prc} style="width:{product.take_sum_prc}%" >{product.take_sum_prc}%
                                    
                                </div>

                                <div class="progress-bar bg-warning" role="progressbar" style="width: {product.provider_sum_prc}%" aria-valuenow="{product.provider_sum_prc}" aria-valuemin="0" aria-valuemax="100">{product.provider_sum_prc}%

                                </div>
                                <div class="progress-bar bg-danger" role="progressbar" style="width: {((100-(parseFloat(product.take_sum_prc)+parseFloat(product.provider_sum_prc))) || 0).toFixed(2)}%" aria-valuemin="0" aria-valuemax="100">{((100-(parseFloat(product.take_sum_prc)+parseFloat(product.provider_sum_prc))) || 0).toFixed(2)}%

                                </div>
                            </div>
                            
                            <div class="text">
                                {product.take_sum_prc}% מהמלאי + {product.provider_sum_prc}% מהספקים = {(parseFloat(product.take_sum_prc)+parseFloat(product.provider_sum_prc)).toFixed(2)}% מההזמנה
                                <br>
                                {product.take_sum} מוצרים מהמלאי + {product.provider_sum} מוצרים מהספקים = {product.take_sum+product.provider_sum} מוצרים מתוך {product.order_sum} מוצרים
                            </div>
                            
                        </td>
                    </tr>
                    <tr class="fold" class:active={fold_states[product.id]==true}>
                        <td colspan="10">
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
.css-tooltip{
  position: relative;
  
}
//.css-tooltip:hover:after{
.css-tooltip:after{
  content:attr(data-tooltip);
  background:#000;
  padding:5px;
  border-radius:3px; 
  display: inline-block;
  position: absolute;
  transform: translate(-50%,-100%); 
  margin:0 auto;
  color:#FFF;
  min-width:100px;
  min-width:150px;
  top:-5px;
  left: 50%;
  text-align:center;
}
//.css-tooltip:hover:before 
.css-tooltip:before {
  top:-5px;
  left: 50%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
  border-color: rgba(0, 0, 0, 0);
  border-top-color: #000;
  border-width: 5px;
  margin-left: -5px;
       transform: translate(0,0px); 
}



    /*.tooltip{ 
        position:relative;
        float:right;
    }
    .tooltip > .tooltip-inner {background-color: #eebf3f; padding:5px 15px; color:rgb(23,44,66); font-weight:bold; font-size:13px;}
    .popOver + .tooltip > .tooltip-arrow {	border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 5px solid #eebf3f;}*/
    .fold {
        display: none;
        &.active {
            display: table-row;
        }
    }
    .fold-arrow {
        /*left: -19px;
        top: 3px;
        width: 0;*/
        height: 0;
        //border-style: solid;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent; 
        border-right:16px solid black; 
        //border-color: transparent transparent transparent black;
        transition: all 0.2s ease-in;

        &.active {
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-top: 16px solid black;
        }
    }
    .delete-btn {
        background: none;
        border:none;
        padding: 5px;
        &:hover {
            svg {
                fill: rgb(255, 0, 0);
            }
        }
    }

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
        //width: 100%;
        max-width: 95vw;
        margin: 0 auto;
        min-height: max-content;
        min-height: 150px;
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
                &:nth-child(3n +1) {
                    background: rgb(221, 221, 221);
                }
                &:hover {
                    background: #ccc;
                }
            }
            

            
    }
}
</style>