<script>
import { colorsJsonStore, sizesJsonStore } from "@src/stores/stores";
import { getLocalStorageStore } from "@src/stores/localStorageStore";

import { onMount } from "svelte";
import { cartesian } from "@src/lib/utils/utils";
import { Spinner } from "sveltestrap";
import { morder_edit_add_product_entries } from "@src/api/api";


    export let product;
    let sizes_ids = [];
    let colors_ids = [];
    let verients_ids = [];

    let size_objs = [];
    let color_objs = [];
    let verient_objs = [];

    let ALL_SIZES;
    let ALL_COLORS;
    let ALL_VARIENTS;
    let done_loading = false;
    let colors_varients_cartesian = [];

    function refreshData() {
        let sizesSet =new Set();
        let colorsSet = new Set();
        let verientsSet = new Set();
        for(let i = 0; i < product.entries.length; i++) {
            let color = product.entries[i].color || 76;
            let size = product.entries[i].size || 86;
            let varient = product.entries[i].varient;
            sizesSet.add(size);
            colorsSet.add(color);
            verientsSet.add(varient);
        }
        debugger;
        let verientsArr = Array.from(verientsSet);
        if(verientsArr.length == 1 && verientsArr[0] == null) {
            verientsArr = [];
        }
        
        sizes_ids = Array.from(sizesSet);
        colors_ids = Array.from(colorsSet);
        verients_ids = Array.from(verientsSet);
        size_objs = sizes_ids.map(id => ALL_SIZES.find(size => size.id == id));
        debugger;
        size_objs.sort((a, b) =>{
            return (b.code.localeCompare(a.code))
        });
        color_objs = colors_ids.map(id => ALL_COLORS.find(color => color.id == id));
        
        verient_objs = verients_ids.map(id => ALL_VARIENTS.find(verient => verient.id == id));
        // replace undefined with empty string in verient_objs
        console.log('creating cartesian from ', color_objs, verient_objs);
        verient_objs = verient_objs.filter(verient => verient != undefined);
        //verient_objs = verient_objs.filter(verient => verient != undefined);
        debugger;
        if (verient_objs.length > 0) {
            colors_varients_cartesian = cartesian(color_objs, verient_objs);
        } else {
            colors_varients_cartesian = color_objs.map(color => [color]);
        }
    }

    onMount(async()=>{ 
        done_loading = false;
        ALL_SIZES = await getLocalStorageStore('sizes');
        ALL_COLORS = await getLocalStorageStore('colors');
        ALL_VARIENTS = await getLocalStorageStore('varients');

        debugger;
        refreshData();
        //
        done_loading = true;
        /*if($verientsJsonStore == undefined) {
            alert('error');
        }else {
            verient_objs = verients_ids.map(id => $verientsJsonStor.find(verient => verient.id == id));
        }*/

        //console.log('product:', sizes, colors, verients);
    })


    let add_new_size_flag = false;
    function addSizeBtnClick() {
        add_new_size_flag = true;
    }

    let add_entries_form_is_sending = false;;
    function add_to_products_entries_form_submit(e) {
        e.preventDefault();
        add_entries_form_is_sending = true;
        let form = e.target;
        let formData = new FormData(form);
        let form_data_obj = {};
        for (let pair of formData.entries()) {
            form_data_obj[pair[0]] = pair[1];
        }
        
        console.log(form_data_obj);
        morder_edit_add_product_entries(form_data_obj).then(res => {
            console.log(res);
            if(res['error']) {
                alert(res['error']);
            }else {
                let data = res['data'];
                product.entries = data.entries;
                refreshData();
            }
        }).finally(() => {
            add_entries_form_is_sending = false;
        });
        

    }
</script>
{#if done_loading}
    <div class="sub-tr">
    <div class="action-buttons">
        {#if !add_new_size_flag}
            <button class="btn btn-secondary" on:click={addSizeBtnClick} >+ הוסף מידה</button>
        {:else}
            <form class="order-add-entries-form" on:submit="{add_to_products_entries_form_submit}">
                <input type="hidden" name="entry_id" value={product['id']} />
                <input type="hidden" name="color" value={product['entries'][0].color} />
                <input type="hidden" name="varient" value={product['entries'][0].varient} />
                <select name="size" class="form-control">
                    {#each ALL_SIZES as size}
                        <option value={size.id}>{size.size}</option>
                    {/each}
                </select>
                <button class="btn btn-secondary" type="submit">
                {#if add_entries_form_is_sending}
                    <Spinner />
                {:else}
                    הוסף
                {/if}
                </button>
            </form>
        {/if}
        <button class="btn btn-secondary" >+ הוסף צבע</button>
        <button class="btn btn-secondary" >+ הוסף תכונה</button>
    </div>
    <table class="entries-table">
        <thead>
            <tr>
                <th>
                    סוג
                </th>
                <th colspan="{colors_varients_cartesian[0].length}">
                    מידות
                </th>
                {#each size_objs as size}
                    <th>
                        {size.size}
                    </th>
                {/each}
            </tr>
        </thead>
        <tbody>
            
            {#each colors_varients_cartesian as colors_varients_iter}
                <tr>
                    <!-- colors_varients_iter: {JSON.stringify(colors_varients_iter)} -->
                    
                    <td style="color:green;">
                        הזמנה
                    </td>
                    
                    {#each colors_varients_iter as corlor_varient}
                            <td>
                                <div class="color-wraper">
                                    {#if corlor_varient.color}
                                        <div class="color-box" style="background-color:{corlor_varient.color}"></div>
                                    {/if}
                                    {corlor_varient.name}
                                </div>
                            </td>
                    {/each}
                    
                    
                    {#each size_objs as size}
                        <td>
                            <input class="amount-input" type="text" data-size-id={size.id} data-color-id={colors_varients_iter[0].id} 
                                data-varient-id={colors_varients_iter[1]?.id}
                                value="{product.entries.find(entry => entry.size == size.id && entry.color == colors_varients_iter[0].id && entry.varient == colors_varients_iter[1]?.id)?.quantity}" />
                            
                            
                        </td> 
                    {/each}
                </tr>
                <tr>
                    <td style="color:red;">מלאי</td>
                    {#each colors_varients_iter as corlor_varient}
                        <td>
                            <div class="color-wraper">
                                {#if corlor_varient.color}
                                    <div class="color-box" style="background-color:{corlor_varient.color}"></div>
                                {/if}
                                {corlor_varient.name}
                            </div>
                        </td>
                    {/each}
                    {#each size_objs as size}
                        <td>
                            
                        </td>
                    {/each}
                </tr>
            {/each}
            
    </table>
    </div>
{:else}
    <Spinner></Spinner>
{/if}

<style lang="scss">
    .color-wraper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .color-box {
            width: 15px;
            height: 15px;
            border-radius: 50%;
            margin-left: 5px;
        }
    }
    .order-add-entries-form {
        display: flex;
        flex-direction: row;
    }
    .sub-tr {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .action-buttons {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        flex-direction: column;
        width: fit-content;
        gap:5px;
        & .btn {
            width:100%;
        }
    }
    .amount-input {
        // min width 50px - 100%
        min-width: 50px;
        width: 100%;

        text-align: center;
    }
    .entries-table {
        border-collapse: collapse;
        width: auto;
        margin:auto;
        text-align: center;
        thead {
            background-color: #f5f5f5;
            tr {
                th {
                    padding: 10px;
                    border: 1px solid #ddd;
                    
                }
            }
        }
        tbody {
            tr {
                td {
                    padding: 10px;
                    border: 1px solid #fff;
                }
            }
        }
    }
</style>