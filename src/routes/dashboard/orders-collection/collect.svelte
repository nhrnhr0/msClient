

<script context="module">
    import { fetch_wraper } from "@src/api/api";
    
    import { MORDER_GET_ORDER_DETAIL_TO_COLLECT } from "@src/api/consts";
import { onMount } from "svelte";
    
    
</script>
<script>
import { page } from "$app/stores";

    export let data;

    async function request_data(ids) {
        let url = MORDER_GET_ORDER_DETAIL_TO_COLLECT + '?orders=' + encodeURIComponent(JSON.stringify(ids));//'dashboard/orders-collection/collect';
        debugger;
        console.log('url: ', url);
        let result = await fetch_wraper(url, {
            method: 'GET',
        });
        return result;
    }

    onMount(async ()=> {
        if(!data) {
            debugger;
            const urlSearchParams = new URLSearchParams(window.location.search);
            const params = Object.fromEntries(urlSearchParams.entries());
            let ids = JSON.parse(params.orders);
            data = await request_data(ids);
        }
    });
</script>

{JSON.stringify(data)} 
