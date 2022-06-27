
<script export="module">
import { page } from "$app/stores";
import { get_doc_stock_enter,get_doc_stock_enter_provider_requests } from "@src/api/api";
import PivotEditTable from "@src/lib/components/dashboard/PivotEditTable.svelte";
import ColorDisplay from "@src/lib/components/ColorDisplay.svelte";


    async function get_doc_info_from_server(doc_id) {
        return await get_doc_stock_enter(doc_id);
    }


    async function get_provider_requests_to_doc(doc_id) {
        return await get_doc_stock_enter_provider_requests(doc_id);
    }


    let ALL_SIZES;
    let ALL_COLORS;
    let ALL_VARIENTS;
    let sizes_dict = {};
    import { onMount } from "svelte";
import { getLocalStorageStore } from "@src/stores/localStorageStore";
import { Spinner } from "sveltestrap";
    let doc_id = undefined;
    let doc_info = undefined;
    let providerRequests;
    onMount(async()=> {
        ALL_SIZES = await getLocalStorageStore('sizes');
        ALL_COLORS = await getLocalStorageStore('colors');
        ALL_VARIENTS = await getLocalStorageStore('varients');
        sizes_dict = {};
        ALL_SIZES.forEach(size => {
            sizes_dict[size.id] = size;
        });

        doc_id = $page.params.id;
        let doc_info_request =  get_doc_info_from_server(doc_id);

        let providerRequests_request =  get_provider_requests_to_doc(doc_id);
        doc_info = await doc_info_request;
        providerRequests = await providerRequests_request;
    });

    const rows = [
        {
            val: 'id',
            label: 'ID',
            hidden: true,
        },
        {
            val: 'orderItem__product__id',
            label: 'מספר מוצר',
            hidden: true,
        },
        {
            val: 'orderItem__product__title',
            label: 'שם מוצר',
            hidden: false,
        },
        {
            val: 'orderItem__morder__id',
            label: 'מס הזמנה',
            hidden: false,
        },
        {
            val: 'force_physical_barcode',
            label: 'חייב ברקוד פיזי',
            hidden: false,
        },
        {
            val: 'color',
            label: 'צבע',
            hidden: false,
        },
        {
            val:'varient',
            label: 'מודל',
            hidden: false,
        },
    ];
    const colum = 'size';
    const val = 'quantity';
</script>

{#if providerRequests}
    <PivotEditTable
        rows={rows}
        colum={colum}
        val={val}
        providerRequests={providerRequests}
        data={providerRequests}
        columSorter={function(arr){
            console.log(arr);
            if(arr.length == 0) return arr;
            let res = arr.sort(function(a,b){
                let a_val = sizes_dict[a].code;
                let b_val = sizes_dict[b].code;
                return b_val.localeCompare(a_val);
            });
            return res;
        }}
    >
    <td slot="row-cell" let:origianl_indexs let:pivot_idx let:row_data let:row_key>
        {#if row_key == 'color'}
            <ColorDisplay color={ALL_COLORS.find(c=>c.id == row_data[row_key])}></ColorDisplay>
        {:else if row_key == 'varient'}
            {#if row_data[row_key]}
                {ALL_VARIENTS.find(v=>v.id == row_data[row_key]).name}
            {/if}
        {:else if row_key == 'force_physical_barcode'}
            {row_data[row_key]? "✅" : "❌"}
        {:else}
            {row_data[row_key]}
        {/if}

    </td>
    <th slot="col-header" let:col_data>
        {sizes_dict[col_data].size}
    </th>
        <td class="table-val-cell" slot="val-cell" let:row_index let:row_data let:row_key>
            {@const foundEntries = doc_info.items.filter(item => item.ppn.product.id == row_data.orderItem__product__id)}
                <table>
                    {#if providerRequests[row_index]?.quantity}
                        <tr>
                            <td>צריך להזמנה</td>
                            <td>{providerRequests[row_index]?.quantity}</td>
                        </tr>
                        {#each foundEntries as entry, i}
                            {@const exactEntry = entry.entries.filter(e=>e.size == row_key && e.color == row_data.color && e.verient == row_data.varient)}
                            {#if entry.entries.length && exactEntry[0]?.quantity}
                                <tr>
                                    <td>
                                        ברקוד
                                    </td>
                                    <td>
                                        {entry.ppn.barcode || ''}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        ברקוד פיזי
                                    </td>
                                    <td>
                                        {entry.ppn.has_physical_barcode? "✅" : "❌"}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        כמות
                                    </td>
                                    <td>
                                        <div class="input-with-max-cell">
                                            <input class="input-with-max-cell-child" type="number" max="{exactEntry[0]?.quantity}">
                                            <div class="input-with-max-cell-child max">
                                                / {exactEntry[0]?.quantity || '-'}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                {#if i != foundEntries.length - 1}
                                    <tr>
                                        <td colspan="2">
                                            <hr>
                                        </td>
                                    </tr>
                                {/if}
                            {/if}
                        {/each}
                    {/if}
                </table>

        </td>
    </PivotEditTable>
{:else}
    <Spinner></Spinner>
{/if}
<style lang="scss">
    :global(.table-val-cell) {
        padding: 0;
        border: 1px solid black;
        tr {
            td {
                .input-with-max-cell {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                    //border: 1px solid red;
                    input {
                        max-width: 80px;
                    }
                }
            }
        }
    }
</style>