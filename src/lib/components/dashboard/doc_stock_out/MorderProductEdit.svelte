<script>
    import {
        colorsJsonStore,
        sizesJsonStore
    } from "@src/stores/stores";
    import {
        getLocalStorageStore
    } from "@src/stores/localStorageStore";
    import AutoComplete from "simple-svelte-autocomplete";


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
        morder_edit_add_product_entries,
        morder_edit_add_provider_entry
    } from "@src/api/api";
    import { apiSearchProviders } from "@src/api/api";


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



    
    // selected results of the autocompeltes
    let selectedProvider;
    let selectedSize;
    let selectedVarient;
    let selectedColor;
    let provider_need_phisical_barcode = false;
    let provider_quantity;

    function addProviderEntry() {
        let data = {
            //entry_id: product.id,
            provider: selectedProvider?.id,
            size: selectedSize?.id,
            varient: selectedVarient?.id,
            color: selectedColor?.id,
            need_phisical_barcode: provider_need_phisical_barcode,
            quantity: provider_quantity
        }
        morder_edit_add_provider_entry(product.id, data).then((new_providers) => {
            product.toProviders = new_providers;
        });
    }


    // search function for the autocompete
    async function searchProviders(keyword) {
        let providers = await apiSearchProviders(keyword)
        return providers;
    }
    
    function searchSizes(keyword) {
        return ALL_SIZES.filter(size => size.size.toLowerCase().includes(keyword.toLowerCase()));
    }
    function searchVarients(keyword) {
        return ALL_VARIENTS.filter(varient => varient.name.toLowerCase().includes(keyword.toLowerCase()));
    }
    function searchColors(keyword) {
        return ALL_COLORS.filter(color => color.name.toLowerCase().includes(keyword.toLowerCase()));
    }

    // trigger when autocomplete option is selected (save the selected option):
    function autocompleteSizeSelected(size) {
        selectedSize = size;
    }
    function autocompleteVarientSelected(varient) {
        selectedVarient = varient;
    }
    
    function autocompleteProviderSelected(provider) {
        selectedProvider = provider;
    }
    function autocompleteColorSelected(color) {
        selectedColor = color;
    }
    

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
        //let ppn__barcodes = new Set();
        let ppn__has_phisical_barcodes = new Set();
        let ppn__providers = new Set();
        for (let i = 0; i < product.available_inventory.length; i++) {
            let color = product.available_inventory[i].color || 76;
            let size = product.available_inventory[i].size || 86;
            let varient = product.available_inventory[i].verient;

            sizesSet.add(size);
            colorsSet.add(color);
            verientsSet.add(varient || undefined);
            //ppn__barcodes.add(product.available_inventory[i].ppn__barcode);
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
            let ret = (b.code.localeCompare(a.code))
            if (ret == 0) {
                return (b.id - a.id);
            }
        });
        color_objs = colors_ids.map(id => ALL_COLORS.find(color => color.id == id));

        verient_objs = verients_ids.map(id => ALL_VARIENTS.find(verient => verient.id == id));
        // replace undefined with empty string in verient_objs
        console.log('creating cartesian from ', color_objs, verient_objs);
        //verient_objs = verient_objs.filter(verient => verient != undefined);
        //verient_objs = verient_objs.filter(verient => verient != undefined);
        //ppn__barcodes = Array.from(ppn__barcodes);
        ppn__has_phisical_barcodes = Array.from(ppn__has_phisical_barcodes);
        ppn__providers = Array.from(ppn__providers);

        //if (verient_objs.length > 0) {
        colors_varients_cartesian = cartesian(color_objs, verient_objs);
        available_inventory_cartesian = cartesian(color_objs, verient_objs, ppn__has_phisical_barcodes,
            ppn__providers); //ppn__barcodes

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

    /*function toOrder_amount_changed(e) {
        let target = e.target;
        let idx = target.dataset.idx;
        debugger;
        let val = parseInt(target.value);
        if (isNaN(val)) {
            val = 0;
        }
        if(idx == -1) {
            let color = target.dataset.colorId;
            let size = target.dataset.sizeId;
            let varient = target.dataset.varientId;
            debugger;
            let newEntry = {
                color:parseInt(color),
                size: parseInt(size),
                verient: varient? parseInt(varient) : null,
                toOrder: val,
                ppn__barcode: target.dataset.ppnBarcode,
                ppn__has_phisical_barcode: target.dataset.ppnhasphisicalbarcode == "true",
                ppn__provider__name : target.dataset.ppnprovidername

            }
            product.available_inventory.push(newEntry);
        }else {
            product.available_inventory[idx].toOrder = val;
            product.available_inventory[idx] = {
                ...product.available_inventory[idx]
            };
        }
    }*/
    function taken_amount_changed(e) {
        let target = e.target;
        let idx = target.dataset.idx;
        let val = parseInt(target.value);
        //let entry = product.entries[idx];
        if(val > product.available_inventory[idx].total) {
            product.available_inventory[idx].taken = product.available_inventory[idx].total
            target.value = product.available_inventory[idx].total;
        }else {
            product.available_inventory[idx].taken = val;
        }
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
                    <input type="hidden" name="color" value={product['entries'][0]?.color || 76} />
                    <input type="hidden" name="varient" value={product['entries'][0]?.varient || null} />
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
                    <input type="hidden" name="size" value={product['entries'][0].size || 108} />
                    <input type="hidden" name="varient" value={product['entries'][0].varient || null} />
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
                    <input type="hidden" name="color" value={product['entries'][0]?.color || 76} />
                    <input type="hidden" name="size" value={product['entries'][0]?.size || 108} />
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
                                    
                                    {key: available_inventory_iter[2], val: 'ppn__has_phisical_barcode',},
                                    {key: available_inventory_iter[3], val: 'ppn__provider__name',},
                                ], undefined)}
                            <td>
                                מלאי:
                                {#if entry?.frozen}
                                    (קפוא {entry.frozen})
                                {/if}
                                <div class="input-max-div">
                                    <input data-row={JSON.stringify(entry)}  data-idx="{idx}" type="number" class="amount-input" data-size-id={size.id} data-color-id={available_inventory_iter[0].id}
                                        disabled={!entry?.total} value={entry?.taken} max={entry?.total || 0} on:input={(e)=>{taken_amount_changed(e);}}
                                        />
                                        /
                                    <div>{entry?.total || '-'}</div>
                                </div>
                                <div class="range-wraper">
                                    <!-- class:overdraft={entry?.taken - entry?.total > 0}-->
                                <input type="range" class="amount-input-range" data-idx="{idx}"  data-size-id={size.id} data-color-id={available_inventory_iter[0].id}
                                    data-varient-id={available_inventory_iter[1]?.id} min="0" max={entry?.total || 0} value={entry?.taken || 0} 
                                    disabled={!entry?.total} on:input={(e)=>{taken_amount_changed(e);}}
                                    />
                                </div>
                                <!--
                                להזמנה מספקים:
                                <div class="input-max-div">
                                    <input data-row={JSON.stringify(entry)}   data-varient-id={available_inventory_iter[1]?.id} data-idx="{idx}" type="number" class="amount-input" data-size-id={size.id} data-color-id={available_inventory_iter[0].id} 
                                    value={entry?.toOrder || 0} on:input={(e)=>{toOrder_amount_changed(e);}}
                                    data-ppn-barcode={available_inventory_iter[2]} data-ppnHasPhisicalBarcode={available_inventory_iter[3]}
                                    data-ppnProviderName={available_inventory_iter[4]}
                                        />
                                </div>
                                
                                {#if entry?.frozen}
                                            <br>
                                            מלאי קפוא להזמנות אחרות:
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
                            {#each size_objs as size}
                                
                                <td>
                                    <div class="proggress-cell">
                                        <progress value="{product.available_inventory.filter(entry => entry.size == size.id).reduce((acc, entry) => acc + (parseInt(entry?.taken || '0')), 0)}" 
                                            max="{product.entries.filter(entry => entry.size == size.id).reduce((acc, entry) => acc + parseInt(entry?.quantity || '0'), 0)}">
                                        </progress>
                                        <div class="text">
                                            {product.available_inventory.filter(entry => entry.size == size.id).reduce((acc, entry) => acc + (parseInt(entry?.taken || '0')), 0)}
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
                            <td colspan={size_objs.length}>
                                <div class="proggress-cell">
                                    <progress value="{product.available_inventory.reduce((acc, entry) => acc + parseInt(entry?.taken || '0') + parseInt(entry?.toOrder || '0'), 0)}" 
                                        max="{product.entries.reduce((acc, entry) => acc + parseInt(entry?.quantity || '0'), 0)}"> 
                                        </progress>
                                    <div class="text">
                                        {product.available_inventory.reduce((acc, entry) => acc + parseInt(entry?.taken || '0') + parseInt(entry?.toOrder || '0'), 0)}
                                        מתוך
                                        {product.entries.reduce((acc, entry) => acc + parseInt(entry?.quantity || '0'), 0)}
                                    </div>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td colspan={size_objs.length + 6}>
                                <h5>השלמות מספקים</h5>
                                <button class="btn btn-secondary">מלא אוטומטית</button>
                            </td>
                            
                        </tr>
                        <tr>
                            <td colspan="{size_objs.length + 6}">
                                <table>
                                    <thead>
                                        <th>ספק</th>
                                        <th>מידה</th>
                                        <th>מודל</th>
                                        <th>צבע</th>
                                        <th>חייב ברקוד פיזי</th>
                                        <th>כמות</th>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <AutoComplete tabindex={'0'} id="provider_search_input" on:focus loadingText="מחפש ספקים..." createText="לא נמצאו תוצאות חיפוש" showLoadingIndicator=true noResultsText="" onChange={autocompleteProviderSelected} create=true placeholder="בחירת ספק..." className="autocomplete-cls" searchFunction={searchProviders} delay=200 localFiltering="{false}" labelFieldName="name" valueFieldName="value" >
                                                    <div slot="loading">
                                                        <Spinner
                                                            size="sm"
                                                            speed="750"
                                                            unit="em"
                                                            color="#A82124"
                                                            thickness="2"
                                                        />
                                                        <span>טוען...</span>
                                                        <!-- spinner -->
                                                        
                                                    </div>
                                                    <div slot="item" let:item={item} let:label={label}>
                                                      {@html label}
                                                    </div>
                                                </AutoComplete>                
                                            </td>
                                            <td>
                                                <AutoComplete tabindex={'1'} id="size_search_input" on:focus loadingText="מחפש ספקים..." createText="לא נמצאו תוצאות חיפוש" showLoadingIndicator=true noResultsText="" onChange={autocompleteSizeSelected} create=true placeholder="בחירת מידה..." className="autocomplete-cls" searchFunction={searchSizes} delay=200 localFiltering="{false}" labelFieldName="size" valueFieldName="id" >
                                                    <div slot="loading">
                                                        <Spinner
                                                            size="sm"
                                                            speed="750"
                                                            unit="em"
                                                            color="#A82124"
                                                            thickness="2"
                                                        />
                                                        <span>טוען...</span>
                                                        <!-- spinner -->
                                                        
                                                    </div>
                                                    <div slot="item" let:item={item} let:label={label}>
                                                      {@html label}
                                                    </div>
                                                </AutoComplete>
                                            </td>
                                            <td>
                                                <AutoComplete tabindex={'2'} id="varient_search_input" on:focus loadingText="מחפש מודלים..." createText="לא נמצאו תוצאות חיפוש" showLoadingIndicator=true noResultsText="" onChange={autocompleteVarientSelected} create=true placeholder="בחירת מודל..." className="autocomplete-cls" searchFunction={searchVarients} delay=200 localFiltering="{false}" labelFieldName="name" valueFieldName="id" >
                                                    <div slot="loading">
                                                        <Spinner
                                                            size="sm"
                                                            speed="750"
                                                            unit="em"
                                                            color="#A82124"
                                                            thickness="2"
                                                        />
                                                        <span>טוען...</span>
                                                        <!-- spinner -->
                                                        
                                                    </div>
                                                    <div slot="item" let:item={item} let:label={label}>
                                                      {@html label}
                                                    </div>
                                                </AutoComplete>
                
                                            </td>
                                            <td>
                                                <AutoComplete tabindex={'3'} id="color_search_input" on:focus loadingText="מחפש צבעים..." createText="לא נמצאו תוצאות חיפוש" showLoadingIndicator=true noResultsText="" onChange={autocompleteColorSelected} create=true placeholder="בחירת צבע..." className="autocomplete-cls" searchFunction={searchColors} delay=200 localFiltering="{false}" labelFieldName="name" valueFieldName="id" >
                                                    <div slot="loading">
                                                        <Spinner
                                                            size="sm"
                                                            speed="750"
                                                            unit="em"
                                                            color="#A82124"
                                                            thickness="2"
                                                        />
                                                        <span>טוען...</span>
                                                        <!-- spinner -->
                                                        
                                                    </div>
                                                    <div slot="item" let:item={item} let:label={label}>
                                                      {@html label}
                                                    </div>
                                                </AutoComplete>
                                                
                                            </td>
                                            <td>
                                                <input type="checkbox" name="need_phisical_barcode" id="need_phisical_barcode" bind:checked="{provider_need_phisical_barcode}" />
                                            </td>
                                            <td>
                                                <input type="number" placeholder="כמות" id="provider_quantity" bind:value="{provider_quantity}" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                {#if selectedProvider}
                                                    <div class="form-selected-cell">
                                                        <button on:click="{()=> {selectedProvider=undefined}}" class="clear-btn">x</button>
                                                        {@html selectedProvider.name}
                                                    </div>
                                                {/if}
                                            </td>
                                            <td>
                                                {#if selectedSize}
                                                    <div class="form-selected-cell">
                                                        <button on:click="{()=> {selectedSize=undefined}}" class="clear-btn">x</button>
                                                        {@html selectedSize.size}
                                                    </div>
                                                {/if}
                                            </td>
                                            <td>
                                                {#if selectedVarient}
                                                    <div class="form-selected-cell">
                                                        <button on:click="{()=> {selectedVarient=undefined}}" class="clear-btn">x</button>
                                                        {@html selectedVarient.name}
                                                    </div>
                                                {/if}
                                            </td>
                                            <td>
                                                {#if selectedColor}
                                                    <div class="form-selected-cell">
                                                        <button on:click="{()=> {selectedColor=undefined}}" class="clear-btn">x</button>
                                                        {@html selectedColor.name}
                                                    </div>
                                                {/if}
                                            </td>
                                            <td>
                                                
                                            </td>
                                            <td>
                                                <button class="btn btn-secondary" disabled={selectedProvider == undefined || selectedSize == undefined || selectedColor == undefined || provider_quantity == undefined || provider_quantity <= 0}
                                                    on:click={addProviderEntry}>הוסף</button>
                                            </td>

                                        </tr>
                                    </tbody>
                                </table>
                                
                            </td>
                        </tr>
                        <tr>
                            <td colspan={size_objs.length + 6}>
                                <div class="progress-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ספק</th>
                                                <th>חייב ברקוד פיזי?</th>
                                                <th>צבע</th>
                                                <th>מודל</th>
                                                {#each size_objs as size}
                                                    <th>{size.size}</th>
                                                {/each}
                                            </tr>
                                        </thead>
                                        <tbody>

                                        </tbody>
                                    </table>
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
    .range-wraper {
        position: relative;
        .amount-input-range {
            width: 100%;
            //background: red;

            &.overdraft {
                &::-webkit-slider-runnable-track {
                    background: red;
                
                }
            }
            
            
        }
        .input-max-inventiry {
            border: 1px solid red;
            position: absolute;
            top: 0px;
            left: var(--pos);
        }
    }
    
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