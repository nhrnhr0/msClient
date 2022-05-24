<script>
import { colorsJsonStore, sizesJsonStore } from "@src/stores/stores";
import { getLocalStorageStore } from "@src/stores/localStorageStore";

import { onMount } from "svelte";
import { cartesian } from "@src/lib/utils/utils";
import { Spinner } from "sveltestrap";


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

    onMount(async()=>{ 
        done_loading = false;
        let sizesSet =new Set();
        let colorsSet = new Set();
        let verientsSet = new Set();
        ALL_SIZES = await getLocalStorageStore('sizes');
        ALL_COLORS = await getLocalStorageStore('colors');
        ALL_VARIENTS = await getLocalStorageStore('varients');
        debugger;
        for(let i = 0; i < product.entries.length; i++) {
            let color = product.entries[i].color || 76;
            let size = product.entries[i].size || 86;
            let varient = product.entries[i].varient;
            sizesSet.add(size);
            colorsSet.add(color);
            verientsSet.add(varient);
        }

        sizes_ids = Array.from(sizesSet);
        colors_ids = Array.from(colorsSet);
        verients_ids = Array.from(verientsSet);
        size_objs = sizes_ids.map(id => ALL_SIZES.find(size => size.id == id));
        color_objs = colors_ids.map(id => ALL_COLORS.find(color => color.id == id));
        verient_objs = verients_ids.map(id => ALL_VARIENTS.find(verient => verient.id == id));
        // replace undefined with empty string in verient_objs
        console.log('creating cartesian from ', color_objs, verient_objs);
        verient_objs = verient_objs.filter(verient => verient != undefined);
        //verient_objs = verient_objs.filter(verient => verient != undefined);
        debugger;
        if (verient_objs.length > 0) {
            colors_varients_cartesian = cartesian(color_objs.map(v=>v.name), verient_objs.map(v=>v.name));
        } else {
            colors_varients_cartesian = color_objs.map(v=>[v.name]);
        }
        //
        done_loading = true;
        /*if($verientsJsonStore == undefined) {
            alert('error');
        }else {
            verient_objs = verients_ids.map(id => $verientsJsonStor.find(verient => verient.id == id));
        }*/

        //console.log('product:', sizes, colors, verients);
    })
</script>
{#if done_loading}
cart: {JSON.stringify(colors_varients_cartesian)}

    <table class="entries-table">
        <thead>
            <tr>
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
                    {#each colors_varients_iter as corlor_varient}
                            <td>
                                {corlor_varient}
                            </td>
                    {/each}
                    {#each size_objs as size}
                        <td>
                            color: {colors_varients_iter[0]}<br>
                            size: {size} <br>
                            var: {colors_varients_iter[1]} <br>
                            entries: {JSON.stringify(product.entries)}
                            <input type="text" data-size-id={size} data-color-id={colors_varients_iter[0]} 
                                data-varient-id={colors_varients_iter[1]} 
                                value="{product.entries.find(entry => entry.size == size.id && entry.color == colors_varients_iter[0] && entry.varient == colors_varients_iter[1])?.quantity}" />
                        </td>
                    {/each}
                </tr>
            {/each}
    </table>
{:else}
    <Spinner></Spinner>
{/if}

<style lang="scss">
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