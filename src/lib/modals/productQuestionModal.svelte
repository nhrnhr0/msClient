<script>
    import {
successModalStore,
        userInfoStore,
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
        form.reportValidity();
        let formData = new FormData(form);
        let data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        data.question = value;//document.getElementById('popup_input').value;
        is_sending = true;
        send_product_question(data).then((result)=> {
            closeModal();
            value = '';
            $successModalStore.toggleModal();
        }).catch((error)=> {
            alert(error);
        }).finally(()=> {
            is_sending = false;
            
        });
    }
    let last_open_time = undefined;
    export function openModal(_product_id, _product_title) {
        if (last_open_time) {
            let time_diff = Date.now() - last_open_time;
            if (time_diff < 500) {
                return;
            }
        }
        last_open_time = Date.now();


        console.log('openModal', _product_id, _product_title);
        product_id = _product_id
        product_title = _product_title;
        modal_zIndex = 1200 + (++$_modal_z_index_incrementor * 15);
        isModalOpen = true;
        activeModalsStore.modalToggle('productQuestionModal', isModalOpen);
        setTimeout(() => {
                let inputField = document.getElementById('popup_input');
                if(inputField) {
                    inputField.focus();
                }else {
                    console.log('inputField not found, modal is closed');
                }
            }, 0);
    }
    export function closeModal(e) {
        console.log('closeModal', e);  
        if (last_open_time) {
            let time_diff = Date.now() - last_open_time;
            if (time_diff < 500) {
                return;
            }
        }
        isModalOpen = false;
        activeModalsStore.modalToggle('productQuestionModal', isModalOpen);
    }
    /*export function toggleModal(_product_id, _product_title) {
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
    }*/
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

    let email_input;
    let phone_input;
    let email_is_empty = true;
    let phone_is_empty = true;
    $: {
        email_is_empty = email_input == '' || email_input == undefined;
    }
    $: {
        phone_is_empty = phone_input == '' || phone_input == undefined;
    }
</script>


<div id="singleAmountModal" style="z-index: {modal_zIndex};" class="modal" class:active={isModalOpen}>
    <div class="overlay" style="z-index: {modal_zIndex+5};" on:click={closeModal}>
        {#if isModalOpen}
        <div class="modal_content" in:fly="{{ y: 200, duration: 200 }}" on:click|stopPropagation="{()=>{}}" style="z-index: {modal_zIndex+10};">
            <div class="modal-header">
                <button title="Close" on:click={closeModal} class="close-btn right">x</button>
                <div class="modal-title">יש לך שאלה על<div class="mark-strong">{product_title}?</div></div>
                <button title="Close" on:click={closeModal} class="close-btn left">x</button>
                
            </div>
            <div class="modal-body">
                <form action="product-question" method="POST" on:submit="{question_submit}">
                    {#if $userInfoStore == undefined || $userInfoStore.isLogin == false}
                        <div class="user-info">
                            <div class="input-wraper-input">
                                <div class="input-label-text">שם</div>
                                <input class="text-input" name="name" required={true} type="text" placeholder="שם" />
                            </div>
                            <div class="input-wraper-input">
                                <div class="input-label-text">שם העסק</div>
                                <input class="text-input" name="buissnes_name" required={true} type="text" placeholder="שם העסק" />
                            </div>
                            <div class="input-wraper-input">
                                <div class="input-label-text">טלפון</div>
                                <input class="text-input" name="phone" bind:value="{phone_input}" required={email_is_empty} type="text" placeholder="טלפון" />
                            </div>
                            <div class="input-wraper-input">
                                <div class="input-label-text">דוא"ל</div>
                                <input class="text-input" name="email" bind:value="{email_input}" required={phone_is_empty} type="text" placeholder='דוא"ל' />
                            </div>
                        </div>
                    {/if}
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
        .user-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            //text-align: center;
            justify-content: center;
            
            padding-bottom: 9px;
            gap: 10px;
            .input-wraper-input {
                width: 100%;
                height: 100%;
                //border: 1px solid red;
                .input-label-text {
                    font-size: 1.2em;
                    margin-bottom: 5px;
                }
                .text-input {
                    width: 100%;
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
}
    
</style>