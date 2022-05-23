
    <script context="module">
    
    /*export async function load({ fetch, page, session, contex}) {
        let response = await fetch_wraper(GET_ALL_INVENTORY, {
      method: 'GET',
      redirect: 'follow'
    }, fetch)

    console.log(response)
    return {
        props: {
            data: response
        }
    }

    }*/
</script>


<script>
import InventoryEditList from "@src/lib/components/dashboard/InventoryEditList.svelte";
import { GET_ALL_INVENTORY } from "@src/api/consts";
import { fetch_wraper } from "@src/api/api";
import { onMount } from "svelte";
import { Spinner } from "sveltestrap";
export let data;
onMount(async () => {
  let response = await fetch_wraper(GET_ALL_INVENTORY, {
    method: "GET",
    redirect: "follow"
  });
  data = response;
});

</script>
{#if data}
    <InventoryEditList data={data}></InventoryEditList>
{:else}
    <Spinner></Spinner>
{/if}

