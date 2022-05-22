
<script>
import { admin_get_enter_docs } from './../../../api/api'

import { onMount } from "svelte";
import { BASE_URL } from '@api/consts';
  import { getContext } from 'svelte';
  const { open } = getContext('simple-modal');
  import CreateEnterDocPopup from '@lib/popups/CreateEnterDocPopup.svelte';
  const showSurprise = () => open(Popup, { message: "It's a modal!" });

    let enter_docs_promise;// admin_get_enter_docs();
    onMount(()=> {
        refresh_data();
    })

    function refresh_data() {
        enter_docs_promise = admin_get_enter_docs();
    }

    function create_new_enter_doc_btn(e) {
        
        open(CreateEnterDocPopup, { refresh: refresh_data })
    }
</script>


<h1 class="header-title">טפסי הכנסה למלאי <button class="btn btn-primary" on:click={create_new_enter_doc_btn}>צור חדש</button> </h1>
<table>
    <thead>
        <tr>
            <th>מספר הכנסה</th>
            <th>תאריך הכנסה</th>
            <th>מספר חשבונית</th>
            <th>ספק</th>
            <th>מחסן</th>
            <th>מכניס ההזמנה</th>
            <th>האם מוכל</th>
            <th>ערוך</th>
        </tr>
    </thead>
    <tbody>
        {#if enter_docs_promise}
            {#await enter_docs_promise}
                loading...
            {:then enter_docs}
                {#each enter_docs as enter_doc}
                <tr>
                    <td><a href="/dashboard/doc-stock-enter/{enter_doc.id}">{enter_doc.id}</a></td>
                    <td>{new Date(enter_doc.created_at).toLocaleString('he-IL')}</td>
                    <td>{enter_doc.docNumber}</td>
                    <td>{enter_doc.provider_name}</td>
                    <td>{enter_doc.warehouse_name}</td>
                    <td>{enter_doc.username}</td>
                    <td>{enter_doc.isAplied? '✅':'❌'}</td>
                    <td><a href="{BASE_URL}/admin/inventory/docstockenter/{enter_doc.id}/change/"
                        onclick="window.open('{BASE_URL}/admin/inventory/docstockenter/{enter_doc.id}/change/?_to_field=id&_popup=1', 
                            'newwindow', 
                            'width=800,height=500'); 
                                return false;">ערוך</a></td>
                    
                </tr>
                {/each}
            {:catch error}
                {error.message}
            {/await}
        {/if}
    </tbody>
</table>

<style lang="scss">
    .header-title {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 1rem;
        text-align: center;
    }

    table {
        width: 100%;
        thead {
            tr {
                th {
                    text-align: center;
                    background-color: #f5f5f5;
                }
            }
        }
        tbody {
            tr {
                td {
                    text-align: center;
                    
                }
                &:nth-child(odd) {
                    background-color: #b3b3b3;
                }

                &:nth-child(even) {
                    background-color: #d3d3d3;
                }
            }
        }
    }
</style>