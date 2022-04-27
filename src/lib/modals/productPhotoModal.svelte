<script>
    import {successModalStore, _modal_z_index_incrementor} from "./../../stores/stores";
    import {fly} from "svelte/transition";
    import {activeModalsStore } from '$lib/modals/modalManager';
    import { send_product_photo } from "./../../api/api";
    export let isModalOpen = false;
    let image_src = '';
    let modal_zIndex = 0;
    let is_sending = false;
    let inputfile;
    let mfile;
    let description_bind;
    export function closeModal() {
        if (isOpen()) {
            isModalOpen = false;
            activeModalsStore.modalToggle('productPhotoModal', isModalOpen);
        }
    }

    export function openModal() {
        isModalOpen = !isModalOpen;
        activeModalsStore.modalToggle('productPhotoModal', isModalOpen);
        if (isModalOpen) {
            modal_zIndex = 1200 + (++$_modal_z_index_incrementor * 15);
        }
    }
    export function isOpen() {
        return isModalOpen;
    }
    function onFileSelected(e) {
        inputfile = e.target.files[0];
        mfile = inputfile;
        let reader = new FileReader();
        reader.readAsDataURL(inputfile);
        reader.onload = e => {
            image_src = e.target.result
        };
    }
    function form_submit(e) {
        e.preventDefault();
        if (is_sending) return;
        is_sending = true;

        let formData = new FormData();
        if (mfile) {
            formData.append('file', mfile);
        }
        let description = document.getElementById('description_input').value;
        let buy_price = document.getElementById('buy_price_input').value;
        let want_price = document.getElementById('want_price_input').value;

        formData.append('description', description);
        formData.append('buy_price', buy_price);
        formData.append('want_price', want_price);
        console.log(formData)
        let response = send_product_photo(formData);
        response.then(res => {
            if (res.status === 200) {
                e.target.reset();
                description_bind = '';
                setTimeout(()=> {
                    closeModal();
                    $successModalStore.toggleModal();
                })
            }
        }).catch(err => {
            alert(err);
        }).finally(() => {
            is_sending = false;
        });
        
    }
</script>


<div id="singleAmountModal" style="z-index: {modal_zIndex};" class="modal" class:active={isModalOpen}>
    <div class="overlay" style="z-index: {modal_zIndex+5};" on:click={closeModal}>
        {#if isModalOpen}
        <div class="modal_content" in:fly="{{ y: 200, duration: 200 }}" on:click|stopPropagation="{()=>{}}" style="z-index: {modal_zIndex+10};">
            <div class="modal-header">
                <button title="Close" on:click={closeModal} class="close-btn right">x</button>
                <div class="modal-title">חיפשת מוצר ולא מצאת?</div>
                <button title="Close" on:click={closeModal} class="close-btn left">x</button>
                
            </div>
            <div class="modal-body">
                <form action="product-photo" method="POST" on:submit="{form_submit}">
                    <div class="row">
                            <div class="input-wraper">
                                <div class="form-group">
                                    <div class="md-flex-colum form-control form-control-row">
                                        <img width="75px" height="75px" class="product-image" on:click={inputfile.click()} src={image_src || "https://res.cloudinary.com/ms-global/image/upload/v1649581221/msAssets/upload_camera_s12a01.png"} alt="לחץ להעלאת תמונה"/>
                                        <input on:change="{onFileSelected}" type="file" name="image" bind:this={inputfile} class="input-file" />
                                    </div>
                                </div>
                                <div class="form-group md-flex-colum">
                                    <div class="form-control">
                                        <label for="buy_price">אני קונה את המוצר כרגע ב</label>
                                        <input id="buy_price_input" name="buy_price" required="{false}" step=".01" placeholder="{5.90}"  type="number">
                                    </div>

                                    <div class="form-control">
                                        <label for="buy_price">אני רוצה את המוצר ב</label>
                                        <input id="want_price_input" name="want_price" required="{false}" step=".01" placeholder="{4.5}"  type="number">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="form-control">
                                        <label for="buy_price">תיאור מוצר</label>
                                        <textarea bind:value="{description_bind}" id="description_input" name="description" placeholder="תיאור המוצר" class="input-text"></textarea>
                                    </div>
                                </div>
                            </div>
                    </div>
                    <div class="row">
                        <div class="action-wraper">
                            <button disabled={(description_bind == undefined || description_bind == '') && (image_src == undefined || image_src == '')} class="btn btn-primary" type="submit">
                                {#if is_sending}
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                {:else}
                                    שלח
                                {/if}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    {/if}
    </div>
</div>


<style lang="scss">
    .modal_content {
        max-width: 750px;
        border-radius: 25px;
        border: 1px solid rgb(126, 124, 124);
        background-color: #fff;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    .modal-header {
        .modal-title {
            font-size: 1.5em;
            text-align: center;
            width: 100%;
        }
    }
    
    .modal-body {
        form {
            
            .row {
                .input-wraper {
                    .form-group {
                        display: flex;
                        flex-direction: row;;
                        justify-content: space-around;
                        .form-control {
                            flex:1;
                            flex-grow: 1;
                            flex-shrink: 0;
                            margin:5px;
                            line-height: 2.5;
                            display:flex;
                            flex-direction: column;
                            &.form-control-row {
                                flex-direction: row;
                                justify-content: flex-start;
                                align-items: center;
                            }

                        }
                    }
                }
            }
        
    }
        .action-wraper {
            //border: 1px solid red;
            display: flex;
            justify-content: center;
            align-items: center;
            padding-top: 20px;
            .btn {
                width: 100%;
                height: 50px;
                border-radius: 25px;
                font-size: 1.5em;
                font-weight: bold;
                color: #fff;
                border: none;
                cursor: pointer;
            }
        }
    }
    
    .md-flex-colum {
        @media screen and(max-width: 768px) {
            flex-direction: column!important;
        }
    }
}
    
</style>