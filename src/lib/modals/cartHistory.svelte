<script>
  import { fly, fade } from "svelte/transition";
  import { cartHistoryModalStore } from "../../stores/stores";
  import { fetch_wraper } from "../../api/api";
  import { CART_HISTORY_URL } from "../../api/consts";
  import { onMount } from "svelte";

  let isLoading = false;

  onMount(async () => {
    isLoading = true;
    try {
      $cartHistoryModalStore.cartHistory = await fetch_wraper(
        CART_HISTORY_URL,
        { method: "GET" }
      );
      console.log($cartHistoryModalStore.cartHistory);
    } catch (error) {
      console.error(
        "There was an error while fetching the cart history",
        error
      );
    }
    isLoading = false;
  });
</script>

<div
  id="cart-history-modal"
  class={`modal ${$cartHistoryModalStore.showModal ? "active" : ""}`}
>
  <div class="overlay">
    <div
      class="modal_content"
      in:fly={{ y: 200, duration: 350 }}
      on:click|stopPropagation|preventDefault={() => {}}
      out:fade
    >
      <div class="modal-header">
        <button
          title="Close"
          on:click={() => {
            cartHistoryModalStore.closeModal();
          }}
          class="close-btn right">x</button
        >
        <h5 class="modal-title">לקופה</h5>
        <button
          title="Close"
          on:click={() => {
            cartHistoryModalStore.closeModal();
          }}
          class="close-btn left">x</button
        >
      </div>
      <div class="modal-body">Modal body</div>
    </div>
  </div>
</div>

<style>
</style>
