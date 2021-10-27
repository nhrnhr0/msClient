<script>
    let isModalOpen;
    let modal_zIndex = 0;

    export function toggleModal() {
        isModalOpen = !isModalOpen;
    }
    export function isOpen() {
        return isModalOpen;
    }
</script>

<div id="cartModal" style="z-index: {modal_zIndex};" class="modal" class:active={isModalOpen}>
    <div class="overlay" style="z-index: {modal_zIndex+5};" on:click={toggleModal}></div>
    <div class="modal_content" style="z-index: {modal_zIndex+10};">
        <div class="modal-header">
        </div>
        <div class="modal-body">
        </div>
        <div class="modal-footer">
        </div>
        <!-- End of Dynamic Section -->
        <button title="Close" on:click={toggleModal} class="close_modal">x</button>
    </div>
</div>


<style lang="scss">
    
</style>