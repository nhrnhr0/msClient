
<script context="module">
    // load function:
    export async function load({ page, fetch, session, stuff }) {
        /*console.log('params: ', page.params);
        console.log('fetch: ', fetch);
        console.log('session: ', session);
        console.log('stuff: ', stuff);*/
        return {
            props: {
                id: page.params.id
            }
        }
    }
</script>
<script>
import { get_doc_stock_enter } from "@api/api";
import { CLOUDINARY_URL } from "@src/api/consts";
import { onMount } from "svelte";
    let doc_promise;
    let doc_data;
    let grouped_items;
    export let id;
    onMount(async () => {
        load_doc_info();
    });


    async function load_doc_info() {
        doc_promise = get_doc_stock_enter(id);
        console.log(doc_promise);
        doc_data = await doc_promise;
        
        grouped_items = group_items(doc_data.items);
        console.log('grouped_items: ', grouped_items);
    }

    function group_items(items) {
        let grouped_items = {};
        items.forEach(item => {
            if (!grouped_items[item.sku_product_name]) {
                grouped_items[item.sku_product_name] = {
                    product_id: item.product_id,
                    product_name: item.product_name,
                    product_image: item.product_image,
                    items: []
                };
            }
            grouped_items[item.product_id].items.push(item);
        });
        return grouped_items;
    }
</script>

<table>
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
                    <td>{doc_data.docNumber}</td>
                    <td>{doc_data.provider_name}</td>
                    <td>{new Date(doc_data.created_at).toLocaleString('he-IL')}</td>
                    <td>{doc_data.warehouse_name}</td>
                    <td>{doc_data.description}</td>
                {/if}
                </tr>
    </table>

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
                {#each Object.entries(grouped_items) as item}
                {JSON.stringify(item)}
                    <tr>
                        <td>{item.product_id}</td>
                        <td>{item.product_name}</td>
                        <td>{item.product_image}</td>
                        <td>{item.last_price}</td>
                        <td>{item.total_amount}</td>
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