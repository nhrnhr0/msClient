
<script export="module">
import { page } from "$app/stores";
import { get_doc_stock_enter,get_doc_stock_enter_provider_requests } from "src/api/api";
import PivotEditTable from "src/lib/components/dashboard/PivotEditTable.svelte";
import ColorDisplay from "src/lib/components/ColorDisplay.svelte";


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
import { getLocalStorageStore } from "src/stores/localStorageStore";
import { Spinner } from "sveltestrap";
import { save_doc_stock_enter_provider_requests } from "src/api/api";
import { goto } from "$app/navigation";
import { notifier } from "@beyonk/svelte-notifications";
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
        let providerRequestsTemp = await providerRequests_request;
        providerRequests = providerRequestsTemp.map(providerRequest => {
            providerRequest['vals'] = {};
            return providerRequest;
        });
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

    let sendingBool = false;
    function submit_to_collect(e) {

        e.preventDefault();
        sendingBool = true;
        let formEl = document.querySelector('#provider-request-form');
        let formData =  new FormData(formEl);
        let sendData = {};
        formData.forEach((value, key) => {
            sendData[key] = value;
        });
        sendData['doc_id'] = doc_id;
        sendData['action'] = e.target.value;
        console.log(sendData);
        let response = save_doc_stock_enter_provider_requests(sendData);
        response.then(res => {
            console.log(res);
            if(res.status == 'success') {
                notifier.success('הפעולה בוצעה בהצלחה',1500);
                setTimeout(() => {
                    //goto('/dashboard/doc-stock-enter/done/'+doc_id, {replaceState: true});
                    window.location.reload();
                }, 1500);
            }else {
                notifier.error(' הפעולה נכשלה' + res.message);
            }
        }).finally(() => {
            sendingBool = false;
        });
        /*
        fetch_wraper('/api/doc_stock_enter/provider_request/',
        */
    }
</script>

{#if providerRequests}
<form id="provider-request-form" action="" method="POST">
    <PivotEditTable
        tableClass="provider-requests-table"
        rows={rows}
        colum={colum}
        val={val}
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
            {#if providerRequests[row_index]?.quantity}
                <h5>
                    צריך להזמנה {providerRequests[row_index]?.quantity}
                    ({Object.values(providerRequests[row_index]['vals']).reduce((acc, cur) => {
                        acc += cur;
                        return acc;
                    }, 0)})
                </h5>
                
                {#each foundEntries as entry, i}
                    {@const exactEntry = entry.entries.filter(e=>e.size == row_key && e.color == row_data.color && e.verient == row_data.varient)}
                    {#if entry.entries.length && exactEntry[0]?.quantity}
                    <div class="cell-wraper">
                        <div class="entry-info">
                            {entry.ppn.barcode || ''}
                            {entry.ppn.has_phisical_barcode? "✅" : "❌"}
                        </div>
                        <div class="input-with-max-cell">
                            <input bind:value={providerRequests[row_index]['vals'][i]} name="cell_entry_{exactEntry[0].id}_request_{providerRequests[row_index].id}" class="input-with-max-cell-child" type="number" max="{Math.min(exactEntry[0]?.quantity, providerRequests[row_index]?.quantity)}">
                            <div class="input-with-max-cell-child max">
                                / {exactEntry[0]?.quantity || '-'}
                                <!--
                                <br>
                                ID: {providerRequests[row_index].id}
                                -->
                            </div>
                        </div>
                    </div>
                    {/if}
                {/each}
            {/if}
            <!--
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
                -->

        </td>
    </PivotEditTable>

    <div class="action-buttons">
        <button disabled={sendingBool} value="collect" class="btn btn-primary" on:click="{submit_to_collect}">העבר לליקוט</button>
        <button disabled={sendingBool} value="collected" class="btn btn-secondary" on:click="{submit_to_collect}">העבר כמלוקט</button>
    </div>
</form>
{:else}
    <Spinner></Spinner>
{/if}
<style lang="scss">
    :global(.provider-requests-table) {
        width: 90%;
        margin: auto;
        border: 1px solid brown;
        text-align: center;
        :global(thead) {
            background-color: #ccc;
            :global(tr) {
                :global(th) {
                    padding: 10px;
                }
            }
        }
        :global(tbody) {
            :global(tr) {
                :global(td) {
                    border: 1px solid black;
                    //padding: 10px;
                }
            }
            // color even rows
            tr:nth-child(even) {
                background-color: #f5f5f5;
            }
        }
    }
    :global(.table-val-cell) {
        padding: 0;
        border: 1px solid black;
        h5 {
            //margin: 0;
            padding: 0.35rem;

        }
        .cell-wraper{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem;
            border: 1px solid black;
                .entry-info {

                }
                .input-with-max-cell {
                    
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-evenly;
                    //border: 1px solid red;
                    input {
                        width:auto;
                        max-width: 80px;
                    }
                }
            }
        }
</style>