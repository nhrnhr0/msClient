<script>
  import { fly, fade } from "svelte/transition";
  import { cartHistoryModalStore } from "../../stores/stores";
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
