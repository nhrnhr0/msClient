<script>
import { cartPopupStore } from "src/stores/popups/cartPopupStore";
import CartPopupAside from "./cartPopup/cartPopupAside.svelte";

</script>
{#if $cartPopupStore.isSideOpen}
    <CartPopupAside />
{/if}