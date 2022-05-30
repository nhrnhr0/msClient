<script>
    import {
        colorsJsonStore,
        sizesJsonStore
    } from "@src/stores/stores";
    import {
        getLocalStorageStore
    } from "@src/stores/localStorageStore";

    import {
        onMount
    } from "svelte";
    import {
        cartesian
    } from "@src/lib/utils/utils";
    import {
        Spinner
    } from "sveltestrap";
    import {
        morder_edit_add_product_entries
    } from "@src/api/api";


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
    let available_inventory_cartesian = [];

    function refreshData() {
        debugger;
        let sizesSet = new Set();
        let colorsSet = new Set();
        let verientsSet = new Set();
        for (let i = 0; i < product.entries.length; i++) {
            let color = product.entries[i].color || 76;
            let size = product.entries[i].size || 86;
            let varient = product.entries[i].varient;
            sizesSet.add(size);
            colorsSet.add(color);
            verientsSet.add(varient || undefined);
        }
        let ppn__barcodes = new Set();
        let ppn__has_phisical_barcodes = new Set();
        let ppn__providers = new Set();
        for (let i = 0; i < product.available_inventory.length; i++) {
            let color = product.available_inventory[i].color || 76;
            let size = product.available_inventory[i].size || 86;
            let varient = product.available_inventory[i].verient;

            sizesSet.add(size);
            colorsSet.add(color);
            verientsSet.add(varient || undefined);
            ppn__barcodes.add(product.available_inventory[i].ppn__barcode);
            ppn__has_phisical_barcodes.add(product.available_inventory[i].ppn__has_phisical_barcode);
            ppn__providers.add(product.available_inventory[i].ppn__provider__name);
        }
        /*let verientsArr = Array.from(verientsSet);
        if(verientsArr.length == 1 && verientsArr[0] == null) {
            verientsArr = [];
        }*/

        sizes_ids = Array.from(sizesSet);
        colors_ids = Array.from(colorsSet);
        verients_ids = Array.from(verientsSet);
        size_objs = sizes_ids.map(id => ALL_SIZES.find(size => size.id == id));
        size_objs.sort((a, b) => {
            return (b.code.localeCompare(a.code))
        });
        color_objs = colors_ids.map(id => ALL_COLORS.find(color => color.id == id));

        verient_objs = verients_ids.map(id => ALL_VARIENTS.find(verient => verient.id == id));
        // replace undefined with empty string in verient_objs
        console.log('creating cartesian from ', color_objs, verient_objs);
        //verient_objs = verient_objs.filter(verient => verient != undefined);
        //verient_objs = verient_objs.filter(verient => verient != undefined);
        ppn__barcodes = Array.from(ppn__barcodes);
        ppn__has_phisical_barcodes = Array.from(ppn__has_phisical_barcodes);
        ppn__providers = Array.from(ppn__providers);

        //if (verient_objs.length > 0) {
        colors_varients_cartesian = cartesian(color_objs, verient_objs);
        available_inventory_cartesian = cartesian(color_objs, verient_objs, ppn__barcodes, ppn__has_phisical_barcodes,
            ppn__providers);

        /*} else {
            colors_varients_cartesian = color_objs.map(color => [color]);
            available_inventory_cartesian = cartesian(color_objs, ppn__barcodes, ppn__has_phisical_barcodes, ppn__providers);
        }*/


    }

    onMount(async () => {
        done_loading = false;
        ALL_SIZES = await getLocalStorageStore('sizes');
        ALL_COLORS = await getLocalStorageStore('colors');
        ALL_VARIENTS = await getLocalStorageStore('varients');

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
    let add_new_color_flag = false;
    let add_new_varient_flag = false;
    function addSizeBtnClick() {
        add_new_size_flag = true;
    }
    function addColorBtnClick() {
        add_new_color_flag = true;
    }
    function addVarientBtnClick() {
        add_new_varient_flag = true;
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
            if (res['error']) {
                alert(res['error']);
            } else {
                let data = res['data'];
                product.entries = data.entries;
                refreshData();
            }
        }).finally(() => {
            add_entries_form_is_sending = false;
            add_new_size_flag = false;
            add_new_color_flag = false;
            add_new_varient_flag = false;
        });


    }

    /**
     * 
     * @param data [{color: , size: , varient: , ppn__barcode: , ppn__has_phisical_barcode: , ppn__provider__name: }]
     * @param values 
     */
    function findAndReturnValue(data, values, target) {
        if (values.length == 6) {
            console.log('inventory:');
        }
        let ret = undefined;
        let found = false;
        let foundErr;
        let foundIndex = -1;
        for (let i = 0; i < data.length; i++) {
            foundErr = false;
            for (let j = 0; j < values.length; j++) {
                if (data[i][values[j].val] != values[j].key) {
                    foundErr = true;
                    break;
                }
            }
            if (!foundErr) {
                found = true;
                foundIndex = i;
                ret = data[i];
                break;
            }
        }
        console.log(JSON.stringify(ret));
        if (ret) {
            if (target) {
                return [ret[target], foundIndex];
            } else {
                return [ret, foundIndex];
            }
        } else {
            return [undefined, -1];
        }
    }


    function taken_amount_changed(e) {
        let target = e.target;
        let idx = target.dataset.idx;
        let val = parseInt(target.value);
        //let entry = product.entries[idx];
        product.available_inventory[idx].taken = val;
        debugger;
        product.available_inventory[idx] = {
            ...product.available_inventory[idx]
        };

        console.log('taken_amount_changed:', target);
    }

    function order_amount_changed(e) {
        let target = e.target;
        let colorId = target.dataset.colorId;
        let sizeId = target.dataset.sizeId;
        let varientId = target.dataset.varientId;
        let found = false;
        debugger;
        for (let i = 0; i < product.entries.length; i++) {
            if (product.entries[i].color == colorId && product.entries[i].size == sizeId && product.entries[i]
                .varient == varientId) {

                product.entries[i].quantity = parseInt(target.value);
                product.entries[i] = {
                    ...product.entries[i]}
                    found = true;
                break;
            }
        }

        if (!found) {
            product.entries.push({
                color: parseInt(colorId),
                size: parseInt(sizeId),
                varient: varientId? parseInt(varientId): undefined,
                quantity: parseInt(target.value)
            });
        }
    }


    /*function remove_color_row(color) {
        if(confirm('אתה בטוח שברצוך להסיר צבע ' + color.name + '?')) {
            morder_edit_remove_color(color.id).then(res => {
                if (res['error']) {
                    alert(res['error']);
                } else {
                    let data = res['data'];
                    product.colors = data.colors;
                    refreshData();
                }
            });
        }
    }


    function remove_size_col(size) {

    }*/
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
            {#if !add_new_color_flag}
                <button class="btn btn-secondary" on:click="{addColorBtnClick}">+ הוסף צבע</button>
            {:else}
                <form class="order-add-entries-form" on:submit="{add_to_products_entries_form_submit}">
                    <input type="hidden" name="entry_id" value={product['id']} />
                    <input type="hidden" name="size" value={product['entries'][0].size} />
                    <input type="hidden" name="varient" value={product['entries'][0].varient} />
                    <select name="color" class="form-control">
                        {#each ALL_COLORS as color}
                            <option value={color.id}>
                                    {color.name}
                            </option>
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
            {#if !add_new_varient_flag}
                <button class="btn btn-secondary" on:click="{addVarientBtnClick}" >+ הוסף תכונה</button>
            {:else}
                <form class="order-add-entries-form" on:submit="{add_to_products_entries_form_submit}">
                    <input type="hidden" name="entry_id" value={product['id']} />
                    <input type="hidden" name="color" value={product['entries'][0].color} />
                    <input type="hidden" name="size" value={product['entries'][0].size} />
                    <select name="varient" class="form-control">
                        {#each ALL_VARIENTS as varient}
                            <option value={varient.id}>{varient.name}</option>
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
        </div>
        <table class="entries-table">
            <thead>
                <tr>
                    <th>
                        סוג
                    </th>
                        <th>
                            צבע
                        </th>
                        <th>
                            מודל
                        </th>
                        <th>
                            ברקוד
                        </th>
                        <th>
                            ברקוד פיזי
                        </th>
                        <th>
                            ספק
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
                        
                        {#each colors_varients_iter as corlor_varient, idx}
                                <td>
                                    <div class="color-wraper">
                                        
                                        {#if corlor_varient?.color}
                                            <div class="color-box" style="background-color:{corlor_varient.color}"></div>
                                        {/if}
                                        {corlor_varient?.name || ''}
                                        
                                    </div>
                                    
                                </td>
                        {/each}
                        
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        {#each size_objs as size}
                            <td>
                                <input class="amount-input" type="text" data-size-id={size.id} data-color-id={colors_varients_iter[0].id} 
                                    data-varient-id={colors_varients_iter[1]?.id}
                                        value={findAndReturnValue(product.entries, [{
                                            key: size.id,
                                            val: 'size',},
                                            {key: colors_varients_iter[0].id,
                                            val: 'color',},
                                            {key: colors_varients_iter[1]?.id,
                                            val: 'varient',}
                                            ], 'quantity')[0] || ''}
                                        on:input={order_amount_changed}
                                    />
                                    <!-- value="{product.entries.find(entry => entry.size == size.id && entry.color == colors_varients_iter[0].id && entry.varient == colors_varients_iter[1]?.id)?.quantity}" /> -->
                                    
                            </td> 
                            
                        {/each}
                        
                    </tr>
                    <!--
                    <tr>
                        <td style="color:red;">מלאי</td>
                        {#each colors_varients_iter as corlor_varient, idx}
                            <td>
                                <div class="color-wraper">
                                    {#if corlor_varient.color}
                                        <div class="color-box" style="background-color:{corlor_varient.color}"></div>
                                    {/if}
                                    {corlor_varient.name}
                                </div>
                            </td>
                        {/each}
                        {#each available_inventory_cartesian as available_inventory_iter, idx}
                            
                            {#each available_inventory_iter as available_inventory}
                                        <td>
                                            {available_inventory}
                                        </td>
                                    {/each}
                                    {#each size_objs as size}
                                    
                                        <td>
                                            {product.available_inventory.find(entry => entry.size == size.id && entry.color == colors_varients_iter[0].id && entry.varient == colors_varients_iter[1]?.id)?.total}
                                        </td>
                                    
                                    {/each}
                        {/each}

                    </tr>
                    -->
                {/each}

                {#each available_inventory_cartesian as available_inventory_iter, idx}
                    <tr>
                        <td style="color: red;">
                            מלאי
                        </td>
                        
                        {#each available_inventory_iter as available_inventory}
                            <td>
                                {#if typeof available_inventory === 'object' && available_inventory !== null}
                                    <div class="color-wraper">
                                        {#if available_inventory.color}
                                            <div class="color-box" style="background-color:{available_inventory.color}"></div>
                                        {/if}
                                        {available_inventory.name}
                                    </div>
                                {:else if typeof available_inventory == "boolean"}
                                    {#if available_inventory}
                                        ✅
                                    {:else}
                                        ❌
                                    {/if}
                                {:else}
                                    {available_inventory || '-'}
                                {/if}

                            </td>
                        {/each}
                        {#each size_objs as size}
                            {@const [entry, idx] = findAndReturnValue(product.available_inventory, 
                                [
                                    {key: size.id,val: 'size',},
                                    {key: available_inventory_iter[0].id, val: 'color',},
                                    {key: available_inventory_iter[1]?.id, val: 'verient',},
                                    {key: available_inventory_iter[2], val: 'ppn__barcode'},
                                    {key: available_inventory_iter[3], val: 'ppn__has_phisical_barcode',},
                                    {key: available_inventory_iter[4], val: 'ppn__provider__name',},
                                ], undefined)}
                            <td>
                                {#if entry?.frozen}
                                    מלאי קפוא להזמנות אחרות: {entry.frozen}
                                {/if}
                                <div class="input-max-div">
                                    
                                    <input data-row={JSON.stringify(entry)}  data-idx="{idx}" type="number" class="amount-input" data-size-id={size.id} data-color-id={available_inventory_iter[0].id}
                                        disabled={!entry?.total} value={entry?.taken} max="{entry?.total || 0}" on:input={(e)=>{taken_amount_changed(e);}}
                                        />
                                        /
                                    <div>{entry?.total || '-'}</div>
                                </div>
                                <input type="range" class="amount-input" data-idx="{idx}"  data-size-id={size.id} data-color-id={available_inventory_iter[0].id}
                                    data-varient-id={available_inventory_iter[1]?.id} min="0" max="{entry?.total || 0}" value={entry?.taken || 0} 
                                    disabled={!entry?.total} on:input={(e)=>{taken_amount_changed(e);}}
                                    />

                                    
                                    <!--{findAndReturnValue(product.available_inventory, 
                                        [
                                            {key: size.id,val: 'size',},
                                            {key: available_inventory_iter[0].id, val: 'color',},
                                            {key: available_inventory_iter[1]?.id, val: 'verient',},
                                            {key: available_inventory_iter[2], val: 'ppn__barcode'},
                                            {key: available_inventory_iter[3], val: 'ppn__has_phisical_barcode',},
                                            {key: available_inventory_iter[4], val: 'ppn__provider__name',},
                                        ], 'total') || '-'} -->
                                
                                <!--
                                {#if available_inventory_iter[1]?.id}
                                    {product.available_inventory.find(entry => entry.size == size.id && entry.color == available_inventory_iter[0].id && entry.varient == available_inventory_iter[1]?.id && entry.ppn__barcode == available_inventory_iter[2] && entry.ppn__has_phisical_barcode == available_inventory_iter[3] && entry.ppn__provider__name == available_inventory_iter[4])?.total}
                                {:else}
                                    {product.available_inventory.find(entry => entry.size == size.id && entry.color == available_inventory_iter[0].id && entry.ppn__barcode == available_inventory_iter[1] && entry.ppn__has_phisical_barcode == available_inventory_iter[2] && entry.ppn__provider__name == available_inventory_iter[3])?.total}
                                {/if}
                                -->
                            
                            </td>
                            
                        {/each}

                    </tr>
                {/each}
                    <tfoot>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {#each size_objs as size}
                                
                                <td>
                                    <div class="proggress-cell">
                                        <progress value="{product.available_inventory.filter(entry => entry.size == size.id).reduce((acc, entry) => acc + parseInt(entry?.taken || '0'), 0)}" 
                                            max="{product.entries.filter(entry => entry.size == size.id).reduce((acc, entry) => acc + parseInt(entry?.quantity || '0'), 0)}"> 
                                        </progress>
                                        <div class="text">
                                            {product.available_inventory.filter(entry => entry.size == size.id).reduce((acc, entry) => acc + parseInt(entry?.taken || '0'), 0)}
                                            מתוך
                                            {product.entries.filter(entry => entry.size == size.id).reduce((acc, entry) => acc + parseInt(entry?.quantity || '0'), 0)}
                                        </div>
                                    </div>
                                </td>
                            {/each}
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td colspan={size_objs.length}>
                                <div class="proggress-cell">
                                    <progress value="{product.available_inventory.reduce((acc, entry) => acc + parseInt(entry?.taken || '0'), 0)}" 
                                        max="{product.entries.reduce((acc, entry) => acc + parseInt(entry?.quantity || '0'), 0)}"> 
                                        </progress>
                                    <div class="text">
                                        {product.available_inventory.reduce((acc, entry) => acc + parseInt(entry?.taken || '0'), 0)}
                                        מתוך
                                        {product.entries.reduce((acc, entry) => acc + parseInt(entry?.quantity || '0'), 0)}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
        </table>
    </div>
{:else}
    <Spinner></Spinner>
{/if}

<style lang="scss">
    .input-max-div{
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        justify-content: center;
        > * {
            flex: 1;
        }
    }
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
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .action-buttons {
        display: flex;
        justify-content: center;
        margin-bottom: 10px;
        flex-direction: row;
        //width: max-content;
        width: 100%;
        
        gap:5px;
        & .btn {
            width:max-content;
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
        tfoot {
            tr {
                td {
                    padding: 10px;
                    border: 1px solid #fff;
                    .proggress-cell {
                        progress {
                            width: 100%;
                        }
                        .text {
                            margin-top: 5px;
                            
                        }
                    }
                }
            }
        }
    }
</style>