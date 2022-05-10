
<script context="module">
    // load function:
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
import SizeColorEdit from "@src/lib/components/dashboard/SizeColorEdit.svelte";
    let doc_promise;
    let doc_data;
    let grouped_items;
    export let id;
    onMount(async () => {
        reload_doc_info();
    });
    async function searchPPN(keyword) {
        let json = await apiSearchPPN(keyword, doc_data.provider_name);
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
        doc_data = new_doc_data;
    }


    

    function ppn_selected_fill_form(e) {
        if(e != undefined) {
            
            let barcode = e.barcode || '';
            debugger;
            inp_selected_ppn = e.id;
            let buy_price = e.buy_price;
            inp_product_form_cost = buy_price;
            inp_product_form_barcode = barcode;
            inp_product_image = e.product_image;
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
    let inp_product_image
    let selectedPPNToAdd;


    function add_product_to_enter_document(e) {
        e.preventDefault();
        if(isPPNSelected) {
            let data = {
                item_id: inp_selected_ppn,
                item_cost: inp_product_form_cost,
                item_barcode: inp_product_form_barcode,
                doc_id: id,
            };
            console.log('item: ', data);
            addPPNToEnterDoc(data).then((new_doc_data) => {
                set_load_info(new_doc_data)
            });
        }else {
            alert('Please select PPN');
        }
    }

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
        </tr>
    </thead>
    <tbody>
                <tr>
                
                {#if doc_data}
                    <td>{doc_data.id}</td>
                    <td><input type="text" bind:value={doc_data.docNumber} /></td>
                    <td>
                        {doc_data.provider_name}
                    </td>
                    <td>{new Date(doc_data.created_at).toLocaleString('he-IL')}</td>
                    <td>{doc_data.warehouse_name}</td>
                    <td>{doc_data.description}</td>
                {/if}
                
                </tr>
    </table>
    </form>
    <table class="items">
        <thead>
            <tr>
                <th>id</th>
                <th>שם בחשבונית</th>
                <th>מוצר אצלנו</th>
                <th>מחיר אחרון</th>
                <th>כמות כוללת</th>
            </tr>
        </thead>
        <tbody>
            {#if doc_data}
                {#each doc_data.items as item}
                    <tr>
                        <td>{item.id}</td>
                        <td>{item.ppn.providerProductName}</td>
                        <td>{item.ppn.product.title}</td>
                        <td>{item.price}</td>
                        <td>{item.total_quantity}</td>
                    </tr>
                    <tr>
                        <td colspan="5">
                            <SizeColorEdit product={item.ppn.product} />
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

    <form action="POST" on:submit="{add_product_to_enter_document}">
        <h3>הוסף מוצר לטופס</h3>
        <div class="form-group">
            {#if isPPNSelected && inp_product_image}
                <img width="50px" height="50px" src="{CLOUDINARY_URL + inp_product_image}" alt="">
            {/if}
            <label for="sku_ppn_name">שם בחשבונית</label>
            <AutoComplete  id="newPPNEnteryInput" loadingText="מחפש מוצרים..."
                create={false} showLoadingIndicator=true noResultsText=""
                searchFunction={searchPPN} delay={200}
                localFiltering="{false}" labelFieldName="providerProductName"
                valueFieldName="providerProductName" bind:selectedItem={selectedPPNToAdd}
                onChange={(e) => {ppn_selected_fill_form(e)}}
                >
                <div slot="item" let:item={item} let:label={label}>
                    <div class="search-item">
                        <div class="inner">
                            <div class="label">
                                {item.providerProductName} - 
                                <span>{item.product_name}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </AutoComplete>



            <label for="cost_price">מחיר עלות (ללא מע"מ)</label>
            <input type="text" bind:value={inp_product_form_cost}  disabled step="0.01" name="cost_price" />

            <label for="barcode">ברקוד</label>
            <input type="text" bind:value={inp_product_form_barcode} disabled name="barcode" />
            {#if isPPNSelected}
                <a href='{BASE_URL}/admin/inventory/ppn/{inp_selected_ppn}/change/' target="_blank">ערוך מוצר</a>
                <button type="submit">הוסף</button>
            {/if}
        </div>
    </form>
    <form action="/dashboard/inv/create-new-ppn" method="POST">
        <h3>הוסף ppn לא קיים</h3>
        <label for="ppn_name">שם בחשבונית</label>
        <input type="text" name="ppn_name" id="ppn_name" />
        <AutoComplete  id="newPPNEnteryInput" loadingText="מחפש מוצרים..."
                            create={false} showLoadingIndicator=true noResultsText=""
                            searchFunction={searchPPN} delay={200}
                            localFiltering="{false}" labelFieldName="providerProductName"
                            valueFieldName="providerProductName" bind:selectedItem={selectedPPNToAdd}
                        >
                        <div slot="item" let:item={item} let:label={label}>
                            <div class="search-item">
                                <div class="inner">
                                    <div class="label">
                                        {item.providerProductName} - 
                                        <span>{item.product_name}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </AutoComplete>
        <label for="barcode"> ברקוד</label>
        <input type="text" name="barcode" value="">
        <label for="price">מחיר עלות</label>
        <input type="number" step="0.01" name="cost_price" placeholder="מחיר עלות">
        <label for="site_product"></label>
        <input type="text" name="site_product" placeholder="מוצר אצלנו">
        <input type="submit" value="צור PPN">
    </form>

<style lang="scss">
    table.header-table {
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