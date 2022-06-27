
<script context="module">
    // load function:

    export const prerender = false;
    export async function load({ page, fetch, session, stuff }) {
        /*console.log('params: ', page.params);
        console.log('fetch: ', fetch);
        console.log('session: ', session);
        console.log('stuff: ', stuff);*/
        return {
            props: {
                id: page.params.id,
            }
        }
    }
</script>
<script>
import { get_doc_stock_enter, } from "@api/api";
import { CLOUDINARY_URL } from "@src/api/consts";
import AutoComplete from "simple-svelte-autocomplete";
import { apiSearchPPN,addPPNToEnterDoc } from "@src/api/api";
import { onMount } from "svelte";
import { BASE_URL } from "@src/api/consts";
import SizeColorTable from "@src/lib/components/dashboard/SizeColorTable.svelte";
import { writable } from "svelte/store";
import { save_enter_doc_edit_to_server, remove_product_from_enter_doc_api } from "@src/api/api";
import { Spinner } from "sveltestrap";
import { insert_doc_to_inventory_api,get_warehouses_api } from "@src/api/api";
import ProvidersFill from "@src/lib/components/dashboard/doc-stock-enter/ProvidersFill.svelte";
import { goto } from "$app/navigation";
    let doc_promise;
    let doc_data = writable(undefined);
    let grouped_items;
    export let id;
    onMount(async () => {
        get_all_warehouses();
        reload_doc_info();
    });
    let warehouses;
    async function get_all_warehouses() {
        warehouses = await get_warehouses_api();
    }
    async function searchPPN(keyword) {
        let json = await apiSearchPPN(keyword, $doc_data.provider_name);
        let data = json;
        console.log(data);
        return data;
    }

    async function get_load_info() {
        return await get_doc_stock_enter(id);
    }
    async function reload_doc_info() {
        let new_doc_data = await get_load_info();
        set_load_info(new_doc_data);
    }

    function set_load_info(new_doc_data) {
        doc_data.set(new_doc_data)
    }


    

    function ppn_selected_fill_form(e) {
        if(e != undefined) {
            
            let barcode = e.barcode || '';
            debugger;
            inp_selected_ppn = e.id;
            let buy_price = e.buy_price;
            inp_product_form_cost = buy_price;
            inp_product_form_barcode = barcode;
            inp_product_form_warehouse = e.default_warehouse
            inp_product_image = e.product_image;
            inp_product_form_has_phisical_barcode = e.has_phisical_barcode;
            console.log('ppn_selected_fill_form: ', e);
            isPPNSelected = true;
        }else {
            isPPNSelected = false;
        }
        
    }
    let isPPNSelected = false;
    let inp_selected_ppn = '';
    let inp_product_form_cost = '';
    let inp_product_form_barcode = '';
    let inp_product_form_has_phisical_barcode = false;
    let inp_product_form_warehouse = '';
    let inp_product_image
    let selectedPPNToAdd;
    let sending_data_to_server = false;
    function save_document_to_server() {
        let data = {
            id: id,
            doc_data: $doc_data
        }
        sending_data_to_server = true;
        let result = save_enter_doc_edit_to_server(data);
        debugger;
        result.then((dat) => {
            debugger;
            set_load_info(dat);
            sending_data_to_server = false;
        }).catch((e) => {
            debugger;
            alert(e);
            sending_data_to_server = false;
        });
        return result;
    }

    function add_product_to_enter_document(e) {
        e.preventDefault();
        if(isPPNSelected) {
            sending_data_to_server = true;
            let data = {
                item_id: inp_selected_ppn,
                item_cost: inp_product_form_cost,
                item_barcode: inp_product_form_barcode,
                has_phisical_barcode: inp_product_form_has_phisical_barcode,
                doc_id: id,
            };
            console.log('item: ', data);
            save_document_to_server().then(()=> {
                addPPNToEnterDoc(data).then((new_doc_data) => {
                set_load_info(new_doc_data);
                    //e.target.reset();  // reset form
                }).finally(() => {
                    sending_data_to_server = false;
                });
            })
            
        }else {
            alert('Please select PPN');
        }
    }

    function remove_product_from_enter_doc(item_id) {
        let data = {
            item_id: item_id,
            doc_id: id,
        };
        console.log('item: ', data);
        let result = confirm('Are you sure you want to remove this item?');
        if(result) {
            sending_data_to_server = true;
            remove_product_from_enter_doc_api(data).then((new_doc_data) => {
                set_load_info(new_doc_data)
            }).finally(() => {
                sending_data_to_server = false;
            });
        }

    }
    function insert_doc_to_inventory() {
        let data = {
            id: id,
            doc_data: $doc_data
        }
        console.log('item: ', data);
        let result = confirm('Are you sure you want to insert this document to inventory?');
        if(result) {
            sending_data_to_server = true;
            save_enter_doc_edit_to_server(data).then((new_doc_data) => {
                set_load_info(new_doc_data)
                insert_doc_to_inventory_api($doc_data.id).then((json_reponse) => {
                    //set_load_info(new_doc_data)
                    if(json_reponse['status'] == 'success') {
                        alert('Document inserted to inventory');
                        goto('/dashboard/doc-stock-enter/done/' + id);
                    }
                }).finally(() => {
                    sending_data_to_server = false;
                });

            }).finally(() => {
                sending_data_to_server = false;
            });
        }
    }




    // new products funtionality:
    let inp_new_product_name = '';
    let inp_new_product_price = '';
    let inp_new_product_barcode1 = '';
    let inp_new_product_barcode2 = '';
    let inp_new_product_comments = '';







</script>
<form action="/dashboard/inv/doc-stock-enter/[id]/edit" method="POST">
<table class="header-table">
    <thead>
        <tr>
            <th>מספר</th>
            <th>מספר חשבונית</th>
            <th>ספק</th>
            <th>תאריך</th>
            <th>מחסן</th>
            <th>תיאור</th>
            <th>ערוך</th>
        </tr>
    </thead>
    <tbody>
                <tr>
                
                {#if $doc_data}
                    <td>{$doc_data.id}</td>
                    <td>{$doc_data.docNumber}</td>
                    <td>
                        {$doc_data.provider_name}
                    </td>
                    <td>{new Date($doc_data.created_at).toLocaleString('he-IL')}</td>
                    <td>{$doc_data.warehouse_name}</td>
                    <td>{$doc_data.description}</td>
                    <td>
                        {#if $doc_data.isAplied}
                            לא ניתן לערוך
                        {:else}
                            <a href="{BASE_URL}/admin/inventory/docstockenter/{$doc_data.id}/change/"
                            onclick="window.open('{BASE_URL}/admin/inventory/docstockenter/{$doc_data.id}/change/?_to_field=id&_popup=1', 
                                'newwindow', 
                                'width=800,height=500'); 
                                    return false;">ערוך</a>
                        {/if}
                {/if}
                
                </tr>
    </table>
    </form>
    <table class="items">
        <thead>
            <tr>
                <th>תמונה</th>
                <th>ברקוד</th>
                <th>ברקוד פיזי</th>
                <th>שם בחשבונית</th>
                <th>מוצר אצלנו</th>
                <th>מחיר קנייה (ללא מע"מ)</th>
                <th>כמות כוללת</th>
                <th>מחק</th>
            </tr>
        </thead>
        <tbody>
            {#if $doc_data}
                {#each $doc_data.items as item}
                    <tr class="part-1">
                        <td><img width="50px" height="50px" src={CLOUDINARY_URL + item.ppn.product.cimage} alt="{item.ppn.product.title}" /></td>
                        <td><input type="text" disabled={$doc_data.isAplied} bind:value={item.ppn.barcode}/></td>
                        <td><input type="checkbox" disabled={$doc_data.isAplied} bind:checked={item.ppn.has_phisical_barcode}/></td>
                        <td>{item.ppn.providerProductName}</td>
                        <td>{item.ppn.product.title}</td>
                        <td>₪<input type="number" step="0.01" disabled={$doc_data.isAplied} bind:value={item.price} /></td>
                        <!--
                        <td>
                            {#if warehouses}
                            <select bind:value={item.warehouse}>
                                {#each warehouses as warehouse}
                                    <option  value="{warehouse.id}" selected={item.warehouse == warehouse.id} >{warehouse.name}</option>
                                {/each}
                            </select>
                            {/if}
                        </td>
                        -->
                        <td>{item.total_quantity}</td>
                        <td>
                            <button class="btn btn-danger" disabled={sending_data_to_server || ($doc_data && $doc_data.isAplied)} on:click={() => {

                                remove_product_from_enter_doc(item.id);
                            }}>
                                מחק
                            </button>
                            <!--
                            <a href="{BASE_URL}/admin/inventory/productenteritems/{item.id}/delete/" class="btn btn-danger"
                            onclick="window.open('{BASE_URL}/admin/inventory/productenteritems/{item.id}/delete?_to_field=id&_popup=1', 
                            'newwindow', 
                            'width=800,height=500'); 
                                return false;">מחק</a>-->
                    </tr>
                    <tr  class="part-2">
                        <td colspan="8">
                            <!--
                            <SizeColorEdit product={item.ppn.product} entries={item.entries}/>
                            -->
                            {#if item.entries}
                                <SizeColorTable disabled={$doc_data.isAplied} product={item.ppn.product} bind:entries={item.entries}/>
                            {/if}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8">
                            <ProvidersFill bind:item={item} bind:freeProviders={$doc_data.freeProviders} />
                        </td>
                    </tr>
                {/each}

                <!--
                    {#each doc_data.items as item}
                        <tr>
                            <td>{item.id}</td>
                            <td>{item.sku_ppn_name}</td>
                            <td><img src="{CLOUDINARY_URL + item.sku_product_name}" alt="">{item.sku_product_name}</td>
                            <td>{item.price} ש"ח</td>
                    {/each}
                        -->
            {/if}
        </tbody>
    </table>
    <div class="floating-submit-container">
        <button class="btn btn-primary" disabled={sending_data_to_server || ($doc_data && $doc_data.isAplied)} on:click={save_document_to_server} >
            {#if sending_data_to_server || $doc_data == undefined}
                <Spinner />
            {:else}
                שמור     
            {/if}
        </button>

        <button disabled={($doc_data && $doc_data.isAplied)} class="btn btn-secondary" on:click="{insert_doc_to_inventory}"
        >הכנס מסמך למלאי</button>
    </div>
    
    <form class="add-product-to-doc" action="POST" on:submit="{add_product_to_enter_document}">
        <h3>הוסף מוצר לטופס</h3>
        <h6><a href="{BASE_URL}/admin/inventory/ppn/add/" target="_blank" 
            onclick="window.open('{BASE_URL}/admin/inventory/ppn/add?_to_field=id&_popup=1',
                        'newwindow',
                        'width=800,height=500');
                            return false;">הוסף ppn לא קיים</a></h6>
        <div class="form-group">
            {#if isPPNSelected && inp_product_image}
                <img width="50px" height="50px" src="{CLOUDINARY_URL + inp_product_image}" alt="">
            {/if}
            <label for="sku_ppn_name">שם בחשבונית</label>
            <AutoComplete disabled={$doc_data && $doc_data.isAplied} id="newPPNEnteryInput" loadingText="מחפש מוצרים..."
                create={false} showLoadingIndicator=true noResultsText=""
                searchFunction={searchPPN} delay={200}
                localFiltering="{false}" labelFieldName="providerProductName"
                valueFieldName="providerProductName" bind:selectedItem={selectedPPNToAdd}
                onChange={(e) => {ppn_selected_fill_form(e)}}
                >
                <div slot="item" let:item={item} let:label={label}>
                    <div class="ppn-search-item">
                        <div class="inner">
                            <div class="label">
                                <div class="img">
                                    <img width="50px" height="50px" src="{CLOUDINARY_URL + item.product_image}" alt="">
                                </div>
                                <div class="info">
                                    <div class="title">
                                        <b>{item.product_name}</b>
                                    </div>
                                    <div class="subtitles">
                                        <span>מק"ט: <b>{item.providerProductName || ''}</b></span>
                                        <span>ברקוד: <b>{item.barcode || ''}</b></span>
                                        <br>
                                        <span>ברקוד פיזי? {item.has_phisical_barcode?'✔️':'❌'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AutoComplete>



            <label for="cost_price">מחיר עלות (ללא מע"מ)</label>
            <input type="text" bind:value={inp_product_form_cost}  disabled={!isPPNSelected} step="0.01" name="cost_price" />

            <label for="barcode">ברקוד</label>
            
            <input type="text" bind:value={inp_product_form_barcode} disabled={!isPPNSelected} name="barcode" />

            
            <input type="checkbox" bind:checked={inp_product_form_has_phisical_barcode} disabled={!isPPNSelected} name="has_phisical_barcode" />
            <label for="has_phisical_barcode">
                קיים ברקוד פיזי
            </label>
            <!--
            <label for="warehouse">מחסן</label>
            {#if warehouses}
                <select disabled={!isPPNSelected} bind:value="{inp_product_form_warehouse}">
                    {#each warehouses as warehouse}
                        <option  value="{warehouse.id}" selected={inp_product_form_warehouse == warehouse.id} >{warehouse.name}</option>
                    {/each}
                </select>
            {/if}
            -->
            
            {#if isPPNSelected}
                <a href="{BASE_URL}/admin/inventory/ppn/{inp_selected_ppn}/change/" target="_blank"
                onclick="window.open('{BASE_URL}/admin/inventory/ppn/{inp_selected_ppn}/change?_to_field=id&_popup=1', 
                            'newwindow', 
                            'width=800,height=500'); 
                                return false;">ערוך מוצר</a>
                <button type="submit">
                    {#if sending_data_to_server}
                        <Spinner />
                    {:else}
                        הוסף
                    {/if}
                </button>
            {/if}
        </div>
    </form>
        

        <div class="products-not-in-website">
            <h3>מוצרים שאינם באתר</h3>
            {#if $doc_data}
                <div class="form-group">
                    <fieldset>
                        <legend>שורה חדשה</legend>
                    <div class="new-line">
                    <label for="product_name">שם מוצר</label>
                    <input disabled={$doc_data.isAplied} type="text" bind:value={inp_new_product_name} name="product_name" />
                    <label for="product_price">מחיר</label>
                    <input disabled={$doc_data.isAplied} type="text" bind:value={inp_new_product_price} name="product_price" />
                    <label for="product_barcode">ברקוד</label>
                    <input disabled={$doc_data.isAplied} type="text" bind:value={inp_new_product_barcode1} name="product_barcode" />
                    <label for="product_barcode2">ברקוד נוסף</label>
                    <input disabled={$doc_data.isAplied} type="text" bind:value={inp_new_product_barcode2} name="product_barcode2" />
                    <label for="comments">הערות</label>
                    <textarea disabled={$doc_data.isAplied} name="comments" bind:value="{inp_new_product_comments}"></textarea>
                    <button on:click="{()=>{
                        if(! $doc_data.new_products) {
                            $doc_data.new_products = [];
                        }
                        $doc_data.new_products = [...$doc_data.new_products,
                            {product_name: inp_new_product_name,
                            product_price: inp_new_product_price,
                            product_barcode1: inp_new_product_barcode1,
                            product_barcode2: inp_new_product_barcode2,
                            product_comments: inp_new_product_comments,}];
                        inp_new_product_name = '';
                        inp_new_product_price = '';
                        inp_new_product_barcode1 = '';
                        inp_new_product_barcode2 = '';
                        inp_new_product_comments = '';}}" disabled={($doc_data && $doc_data.isAplied)} class="btn btn-primary" type="button">הוסף</button>
                    </div>
                    </fieldset>
                </div>
                <div class="form-group">
                    
                    <fieldset>
                        <legend>שורות קיימות</legend>

                    {#if $doc_data.new_products}
                        {#each $doc_data.new_products as newProduct}
                        
                        <div class="exist-line">
                            <label for="product_name">שם מוצר</label>
                            <input type="text" bind:value={newProduct.product_name} name="product_name" />
                            <label for="product_price">מחיר</label>
                            <input type="text" bind:value={newProduct.produc_price} name="product_price" />
                            <label for="product_barcode">ברקוד</label>
                            <input type="text" bind:value={newProduct.product_barcode1} name="product_barcode" />
                            <label for="product_barcode2">ברקוד נוסף</label>
                            <input type="text" bind:value={newProduct.product_barcode2} name="product_barcode2" />
                            <label for="comments">הערות</label>
                            <textarea name="comments" bind:value={newProduct.product_comments} ></textarea>
                            <button class="btn btn-danger" on:click="{()=>{$doc_data.new_products = $doc_data.new_products.filter(product=>product != newProduct);}}" type="button">מחק</button>
                            
                        </div>
                        <br>
                        {/each}
                    {/if}
                    </fieldset>
                </div>
            {/if}
        </div>

<style lang="scss">
    :global(.ppn-search-item) {
        .inner {
            .label {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                flex-direction: row;
            }
        }
        
    }
    .products-not-in-website {
        padding-bottom: 80px;
        .new-line {
            margin-top: 35px;
            margin-bottom: 35px;
            border-radius: 25px;
            background-color: #9b9b9b;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
        }
        .exist-line {
            border-radius: 25px;
            background-color: #cccaca;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
        }
    }
    form.add-product-to-doc {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 50px;
        background-color: #d4d4d4;
        margin-left: 15px;
        margin-right: 15px;
    }
    tr.part-1 {
        background-color: #3f3f3f;
        color:white;
    }
    tr.part-2 {
        background-color: #d8d8d8;
        td {
            
            :global(table.product-table) {
                
                margin: auto;
                :global(tr) {
                    :global(td) {
                        border: 1px solid black;
                    }
                }
            }
        }
    }
    .floating-submit-container {
        position: fixed;
        bottom: 20px;
        left: 10px;
        z-index: 9999;
    }
    table.header-table {
        width: 100%;
        border-collapse: collapse;
        text-align: center;
        thead {
            background-color: #9b9b9b;
            tr{
                th {
                    padding: 10px;
                    
                }
            }
        }
        tbody {
            tr {
                td {
                    padding: 10px;
                }
            }
        }
    }

    table.items {
        width: 100%;
        border-collapse: collapse;
        text-align: center;
        thead {
            background-color: #f2f2f2;
            tr{
                th {
                    padding: 10px;
                    
                }
            }
        }
        tbody {
            tr {
                td {
                    padding: 10px;
                }
            }
        }
    }
</style>