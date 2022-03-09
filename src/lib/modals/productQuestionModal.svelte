<script>
    import {
successModalStore,
        _modal_z_index_incrementor
    } from "./../../stores/stores";
    import { selectTextOnFocus } from '$lib/ui/inputActions';

    import {
        activeModalsStore
    } from "./modalManager";
    import {
        fly
    } from 'svelte/transition';
import { cartStore } from "./../../stores/cartStore";
import { send_product_question } from "./../../api/api";
    export let isModalOpen = false;
    let product_id;
    let modal_zIndex = 0;
    let product_title;
    let is_sending = false;
    let value ='';
    function question_submit(e) {
        e.preventDefault();
        let form = e.target;
        let formData = new FormData(form);
        let data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        data.question = value;//document.getElementById('popup_input').value;
        is_sending = true;
        send_product_question(data).then((result)=> {
            toggleModal();
            value = '';
            $successModalStore.toggleModal();
        }).catch((error)=> {
            alert(error);
        }).finally(()=> {
            is_sending = false;
            
        });
    }
    export function toggleModal(_product_id, _product_title) {
        product_id = _product_id
        product_title = _product_title;
        isModalOpen = !isModalOpen;
        activeModalsStore.modalToggle('productQuestionModal', isModalOpen);
        if (isModalOpen) {
            modal_zIndex = 1200 + (++$_modal_z_index_incrementor * 15);

            setTimeout(() => {
                document.getElementById('popup_input').focus();
            }, 0);
        }
    }
    export function isOpen() {
        return isModalOpen;
    }
    let is_disabled = true;

    function text_changed(e) {
        value = e.target.value;
        /*if(e.target.value == '') {
            is_disabled = true;
        } else {
            is_disabled = false;
        }*/
    }
</script>


<div id="singleAmountModal" style="z-index: {modal_zIndex};" class="modal" class:active={isModalOpen}>
    <div class="overlay" style="z-index: {modal_zIndex+5};" on:click={toggleModal}>
        {#if isModalOpen}
        <div class="modal_content" in:fly="{{ y: 200, duration: 200 }}" on:click|stopPropagation="{()=>{}}" style="z-index: {modal_zIndex+10};">
            <div class="modal-header">
                
                <div class="modal-title">יש לך שאלה על<div class="mark-strong">{product_title}?</div></div>
                
            </div>
            <div class="modal-body">
                <form action="product-question" method="POST" on:submit="{question_submit}">
                    <div class="row">
                        <div class="input-wraper">
                            <textarea on:input="{text_changed}" id="popup_input" class="text-input" type="number" placeholder="נשמח לעמוד לשירותכם בהקדם"></textarea>
                            <input type="hidden" name="product_id" value="{product_id}">
                            <input type="hidden" name="product_title" value="{product_title}">
                        </div>
                    </div>
                    <div class="row">
                        <div class="action-wraper">
                            <button disabled={is_sending || value == ''} class="btn btn-primary" type="submit">
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
        .input-wraper {
            min-height: 250px;
            //border: 1px solid red;
            
            .text-input {
                width: 100%;
                height: 100%;
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
}
    
</style>