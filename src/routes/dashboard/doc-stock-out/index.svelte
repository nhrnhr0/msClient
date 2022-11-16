


<script>
import { fetch_wraper } from "src/api/api";
import { GET_ALL_ORDERS } from "src/api/consts";
import OrdersList from "src/lib/components/dashboard/doc_stock_out/OrdersList.svelte";

import { onMount } from "svelte";
import { Spinner } from "sveltestrap";


    /*export function load({ fetch, page, session, contex }) {
        let response = fetch_wraper(GET_ALL_ORDERS, {
            method: 'GET',
            redirect: 'follow'
        }, fetch);

        return {
            props: {
                data: response
            }
        }
    }*/
    onMount(()=> {
        let response = fetch_wraper(GET_ALL_ORDERS, {
            method: 'GET',
            redirect: 'follow'
        });
        response.then(data => {
            orders = data;
        });
    });
    let orders;
</script>


{#if orders}
    <OrdersList orders={orders}></OrdersList>
{:else}
    <Spinner></Spinner>
{/if}
