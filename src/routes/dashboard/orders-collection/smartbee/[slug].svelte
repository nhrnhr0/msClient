<script context="module">
import { api_get_smartbee_doc } from "src/api/api";
import { onMount } from "svelte";
import { page } from "$app/stores";
</script>
<script>
import { Spinner } from "sveltestrap";

    export let data;

    onMount(async ()=> {
        console.log("load ====> ", $page.params.slug);
        let response = await api_get_smartbee_doc($page.params.slug);
        debugger;
        console.log("response ====> ", response);
        data = response;
    })
</script>
{#if data == undefined}
    <Spinner></Spinner>
{:else}
    <pre>
        {JSON.stringify(data, null, 4)}
    </pre>
{/if}