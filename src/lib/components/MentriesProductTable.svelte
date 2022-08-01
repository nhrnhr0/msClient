<script>
import { getSessionStorageStore } from "src/stores/sessionStorageStore";

import { onMount } from "svelte";
import { Spinner } from "sveltestrap";
import ColorDisplay from "./ColorDisplay.svelte";

    let ALL_SIZES;
    let ALL_COLORS;
    let ALL_VARIENTS;
    export let productInfo;
    onMount(async ()=> {
        // get all the sizes, colors, and varients
        let ALL_SIZES_promise = getSessionStorageStore('sizes');
        let ALL_COLORS_promise = getSessionStorageStore('colors');
        let ALL_VARIENTS_promise = getSessionStorageStore('varients');
        Promise.all([ALL_SIZES_promise, ALL_COLORS_promise, ALL_VARIENTS_promise]).then(values => {
            ALL_SIZES = values[0];
            ALL_COLORS = values[1];
            ALL_VARIENTS = values[2];
        });
    })

    let rows_keys;
    let row_vals;
    let colum_key;
    let colum_vals;
    let val_key;
    let val_vals;
    
    $: {
        productInfo;
        if(productInfo) {
            let color_ids = productInfo.colors;
            let varient_ids = productInfo.varients.map(v=>v.id);
            let size_ids = productInfo.sizes;
            let colors_and_varients_cartesian_product = [];
            color_ids.forEach(color_id => {
                if(varient_ids.length > 0) {
                    varient_ids.forEach(varient_id => {
                        colors_and_varients_cartesian_product.push({
                            color_id,
                            varient_id
                        });
                    });
                }else {
                    colors_and_varients_cartesian_product.push({
                        color_id
                    });
                }
            });
            rows_keys = varient_ids.length > 0? [{name:'צבע', key:'color_id'}, {name:'מודל', key:'varient_id'}] : [{name:'צבע', key:'color_id'}];
            row_vals = colors_and_varients_cartesian_product;
            colum_key = 'מידה';
            colum_vals = size_ids;
            val_key = 'כמות';
        }
    }


    function get_size_rep(size_id) {
        return ALL_SIZES[size_id]
    }
    function get_color_rep(color_id) {
        return ALL_COLORS[color_id]
    }
    function get_varient_rep(varient_id) {
        return ALL_VARIENTS[varient_id]
    }
</script>
<div class="wraper">
    {#if ALL_VARIENTS && ALL_COLORS && ALL_SIZES && productInfo}
        <!--
            create a table with row_keys as the rows (color, modal / only color)
            and colum_keys as the columns (size)
        -->
        {#if productInfo.show_sizes_popup}
            <div class="my-table-responsive">
                <h4 class="table-title">בבקשה בחר את הצבעים והמידות שברצוך להזמין:</h4>
                <table class="my-table my-table-striped">
                    <thead>
                        <tr>
                            <th colspan="{rows_keys.length}"></th>
                            <th colspan="{colum_vals.length}">{colum_key}</th>
                        </tr>
                        <tr>
                            {#each rows_keys as row_key, i}
                                <th >{row_key.name}</th>
                            {/each}
                            {#each colum_vals as size_id}
                                <th>{get_size_rep(size_id).size}</th>
                            {/each}
                        </tr>
                    </thead>
                    <tbody>
                        {#each row_vals as row_val}
                            <tr>
                                {#each rows_keys as row_key,i}
                                    <td class="sticky-col"  style="--right-idx: {i}">{
                                        #if row_key.key === 'color_id'}
                                            <ColorDisplay color={get_color_rep(row_val[row_key.key])} />
                                        {:else}
                                            {get_varient_rep(row_val[row_key.key]).name}
                                        {/if}
                                    </td>
                                {/each}
                                {#each colum_vals as size_id}
                                    <td>
                                        <input type="number" class="my-form-control" />
                                    </td>
                                {/each}

                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {:else}
            <!-- explain this product come as a package with this sides and color and you not not able select sizes, color, varients -->
            <div class="show_sizes_popup_false">
            <h4>מוצר זה מגיע כחבילה ולא ניתן לפרק צבעים ומידות</h4>
            {#if productInfo.colors.length > 1}
                <div class="disclaimer">
                    <h5>חבילה יכולה להכיל את הצבעים הבאים: 
                        <div class="flex-list">
                            {#each productInfo.colors as color_id}
                                <div class="item">
                                    <ColorDisplay hideName='{true}' width='{'auto'}' color={get_color_rep(color_id)} />
                                </div>
                            {/each}
                        </div>
                    </h5>
                </div>
            {/if}
            {#if productInfo.varients.length > 1}
                <div class="disclaimer">
                    <h5>חבילה יכולה להכיל את המודלים הבאים:
                        <div class="flex-list">
                            {#each productInfo.varients as varient_id}
                                <div class="item">
                                    {get_varient_rep(varient_id).name}
                                </div>
                            {/each}
                        </div>
                    </h5>
                </div>
            {/if}
            {#if productInfo.sizes.length > 1}
                <div class="disclaimer">
                        <h5>חבילה יכולה להכיל את המידות הבאות:
                            <div class="flex-list">
                                {#each productInfo.sizes as size_id}
                                    <div class="item">
                                        {get_size_rep(size_id).size}
                                    </div>
                                {/each}
                            </div>
                        </h5>
                </div>
            {/if}

            <div class="solo-form-input">
                <label for="amount">כמות</label>
                <input name="amount" type="number" class="my-form-control my-form-control-single" />
                <div class="action-buttons">
                    <button class="amount-btn btn">+6</button>
                    <button class="amount-btn btn">+12</button>
                    <button class="amount-btn btn">+24</button>
                </div>
            </div>
            </div>
        {/if} <!--{#if productInfo.show_sizes_popup}-->
    {:else} <!--{#if ALL_VARIENTS && ALL_COLORS && ALL_SIZES && productInfo}-->
        <div>
            <Spinner />
        </div>
    {/if}
</div>

<style lang="scss">
    .my-form-control{
        width: 75px;
    }
    .wraper {
        background: radial-gradient(circle, rgba(255, 255, 255, 0.199) 0%, rgba(255, 255, 255, 0.199) 100%);
        //width:100%;
        height: calc(100% - 30px);

        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
        border-radius: 15px;
        margin-top: 10px;
        margin-bottom: 10px;
        margin-left: 15px;
        margin-right: 15px;
        .my-table-responsive {

            overflow-x: auto;
            width: 97%;
            height: 100%;
            margin: auto;
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            flex-direction: column;
            
            .table-title {
                margin-top: 15px;
                text-align: center;
                width:100%;
                text-decoration: underline;
            }
            
            .my-table {
                
                border-collapse: collapse;
                overflow: scroll;
                scroll-behavior: smooth;
                
                
                overflow: scroll;
                margin: auto;
                margin-top: 25px;
                margin-bottom: 25px;
                thead {
                    tr {
                        th {
                            text-align: center;
                            //font-size: 20px;
                            font-weight: bold;
                            background-color: #4b4a4aab;
                            color:white;
                        }

                        th {
                            //width: 75px;
                            text-align: center;
                        }
                    }
                }
                tr{
                    td,th {
                        border:1px solid black;
                        &.sticky-col {
                            border:none;
                            outline: 1px solid black;
                            //  style="--right-idx: {i}"
                            right: calc(75px * var(--right-idx));
                            //width:75px;
                            position: -webkit-sticky;
                            position: sticky;
                            
                            //min-width: 80px;
                            position: sticky;
                            position: -webkit-sticky;
                            position: sticky;
                            //right: 0px;
                            //border: 1px solid #777777;
                            //border-radius: 5px;
                            padding: 5px;
                            
                            background-color: rgba(238, 238, 238, 0.851);
                        }
                    }
                }
            }
        }
        .show_sizes_popup_false {

            text-align: center;
            .disclaimer {
                margin-top: 10px;
                margin-bottom: 10px;
                margin-left: 15px;
                margin-right: 15px;
                padding: 10px;
                border-radius: 15px;
                background-color: rgba(238, 238, 238, 0.851);
                display: flex;
                justify-content:center;
                align-items: center;
                
                h5 {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex:1;
                    .flex-list {
                        display: flex;
                        gap:5px;
                        .flex-item {
                            margin-left: 10px;
                            margin-right: 10px;
                            margin-top: 10px;
                            margin-bottom: 10px;
                        }
                    }
                }
                
            }
        }
            .solo-form-input {
                .my-form-control-single {
                    width: 275px;
                    line-height: 2;
                }
                .action-buttons {
                    margin-top: 15px;
                    .amount-btn {
                        @include bg-gradient();

                        width: 120px;
                        height: 75px;
                        border-radius: 25px;
                        text-align: center;
                        font-weight: 700;
                        font-size: 1.5em;
                        margin: 0 5px;
                        box-shadow: 0 0 5px #0006;
                        outline: none;
                        transition: ease-in-out .2s;
                    }
                }
            }
            
        }
        
</style>