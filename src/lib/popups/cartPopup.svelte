<script>
import { cartPopupStore } from "src/stores/popups/cartPopupStore";
import CartPopupAside from "./cartPopup/cartPopupAside.svelte";
import MainCartPopup from "./cartPopup/MainCartPopup.svelte";

</script>
{#if $cartPopupStore.isSideOpen}
    <CartPopupAside />
{/if}
{#if $cartPopupStore.isOpen}
    <MainCartPopup />
{/if}