<script>
    import {
        _modal_z_index_incrementor
    } from './../../stores/stores';
    import {
    STATIC_BASE
  } from './../../api/consts';
    let isModalOpen = false;
    let modal_zIndex = 0;
    export let product = {'title':'loading...', 'image': ''};

    export function toggleModal() {
        isModalOpen = !isModalOpen;
        if (isModalOpen) {
            modal_zIndex = 1200 + (++$_modal_z_index_incrementor * 15);
        }
    }
    export function isOpen() {
        return isModalOpen;
    }

    export function setProduct(p) {
        product = p
    }
</script>



<div style="z-index: {modal_zIndex};" id="productModal" class="modal" class:active={isModalOpen}>
    <div style="z-index: {modal_zIndex+5};" class="overlay" on:click={toggleModal}></div>
    <div style="z-index: {modal_zIndex+10};" class="modal_content">
        <div class="modal-header">
            <h1>{product['title']}</h1>
        </div>

        <div class="modal-body">
            <div class="img-wraper" style="background-image: url('{STATIC_BASE}{product['image']}');">
            </div>
        </div>


        <div class="modal-fotter">

        </div>
        <button title="Close" on:click={toggleModal} class="close_modal">x</button>
        <button title="Close" on:click={toggleModal} class="close_modal left">x</button>


    </div>
</div>

<style lang="scss">
    .modal_content {
        max-height:95%;
        width: 95%;
        .modal-header {
            h1 {
                text-align: center;
                margin: auto;
            }
        }
    }
    .img-wraper {
        height: 82vh;
        width: 100%;;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
    }
</style>