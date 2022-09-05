<script context="module">
    import MOrderListForCollection from "src/lib/components/dashboard/orders-collection/MOrderListForCollection.svelte";

    let selected_collections;
</script>
<MOrderListForCollection bind:selected={selected_collections}>

</MOrderListForCollection>