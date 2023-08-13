<script>
import { _modal_z_index_incrementor } from "./../../stores/stores";
import { activeModalsStore } from "$lib/modals/modalManager";

export let isModalOpen = false;
let modal_zIndex = 0;

export function toggleModal() {
  isModalOpen = !isModalOpen;
  activeModalsStore.modalToggle("successModal", isModalOpen);
  if (isModalOpen) {
    modal_zIndex = 1200 + ++$_modal_z_index_incrementor * 15;
  }
}
export function isOpen() {
  return isModalOpen;
}
</script>

<div id="successModal" style="z-index: {modal_zIndex};" class="modal" class:active={isModalOpen}>
  <div class="overlay" style="z-index: {modal_zIndex + 5};" on:click={toggleModal} />
  <div class="modal_content" style="z-index: {modal_zIndex + 10};">
    <div class="modal-header">
      <h1>הטופס הוגש בהצלחה</h1>
    </div>
    <div class="modal-body">
      <div class="main-content">
        <div class="inner">
          <h1>תודה על הגשת הטופס</h1>
          <h2>נציגנו יצור איתך קשר בקרוב</h2>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="img-container">
        <img height="80" src="https://res.cloudinary.com/ms-global/image/upload/f_auto,q_auto/v1/bizbiz/z6bktayusj7uc7rl2xgg.png" width="198" alt="BizBiz" />
      </div>
    </div>
    <!-- End of Dynamic Section -->
  </div>
</div>

<style lang="scss">
.modal-header {
  h1 {
    margin: auto;
    text-align: center;
  }
}
.modal-body {
  text-align: center;
}
.modal-footer {
  background: linear-gradient(360deg, #414040 10%, #494949 360%);
  .img-container {
    margin: auto;
  }
}
</style>
