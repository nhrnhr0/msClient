<script>

import {all_swipers, cartModalStore, productModalStore, successModalStore, _modal_z_index_incrementor} from "./../../stores/stores";
import { cartStore } from "./../../stores/cartStore"
import { CLOUDINARY_URL, STATIC_BASE, SUBMIT_CART_URL } from "./../../api/consts";
import { subscribe } from "svelte/internal";
import { get_user_uuid, submit_cart_form } from "./../../api/api"

    let isModalOpen = false;
    let modal_zIndex = 0;

    export function toggleModal() {
        isModalOpen = !isModalOpen;
        if(isModalOpen) {
            modal_zIndex = 1200 + (++$_modal_z_index_incrementor * 15);
        }
    }
    export function isOpen() {
        return isModalOpen;
    }

    function delete_product_from_cart(key) {
        console.log('delete_product_from_cart');
        
        let item = $cartStore[key];
        let swiper = $all_swipers[item.albums[0]];
        delete $cartStore[key];
        $cartStore =$cartStore;
        swiper.fixDups();
    }

    function open_product_modal(key) {
        let product = $cartStore[key];
        $productModalStore.setProduct(product.albums[0], product.id);
        $productModalStore.toggleModal();
    }
    let mform;
    let form_name;
    let form_email;
    let form_phone;
    function cart_submit() {
        if(mform.reportValidity()) {
            let data = {
                name: form_name || '',
                email: form_email || '',
                phone:form_phone || '',
                uuid: get_user_uuid() || '',
                products: Object.keys($cartStore),
            };
            let response = submit_cart_form(data);
            response.then((data_json)=> {
                
                    console.log('data_json: ', data_json);
                    if(data_json['status'] == 'success') {
                        $cartModalStore.toggleModal();
                        $successModalStore.toggleModal();
                        $cartStore = {};
                    }
                    console.log('cart info: ', data_json);
                
            });
            mform.reset();
        }
    }
</script>

<div id="cartModal" style="z-index: {modal_zIndex};" class="modal" class:active={isModalOpen}>
    <div class="overlay" style="z-index: {modal_zIndex+5};" on:click={toggleModal}></div>
    <div class="modal_content" style="z-index: {modal_zIndex+10};">
        <div class="modal-header">
            <h1>מוצרים שאהבתי</h1>
        </div>
        <form bind:this={mform} method="POST" action="{SUBMIT_CART_URL}" >
        <div class="modal-body">
            <div class="inner-body">
                <div class="cart-info">
                    <div class="form-control"><input bind:value="{form_name}" name="name" required="true" placeholder="שם:" type="text"></div>
                    <div class="form-control"><input bind:value="{form_email}" name="email" placeholder="אימייל:" type="email"></div>
                    <div class="form-control"><input bind:value="{form_phone}" name="tel" required="true" placeholder="טלפון:" type="tel"></div>
                    <button class="send-btn" on:click|preventDefault="{cart_submit}">שלח</button>
                </div>
                <div class="cart-products">
                    {#if cartStore}
                        {#each Object.keys($cartStore) as key}
                            <div class="product">
                                <button on:click|preventDefault="{delete_product_from_cart(key)}"class="delete-product">X</button>
                                <div class="modal-open-area" on:click={open_product_modal(key)}>
                                    <div class="title">{$cartStore[key].title}</div>
                                    <div class="img-wraper">
                                        <img src="{CLOUDINARY_URL}f_auto,w_auto/{$cartStore[key].cimage}" alt="{$cartStore[key].title}">
                                    </div>
                                </div>
                            </div>

                        {/each}
                    {/if}

                </div>
                
            </div>
        </div>
        </form>
        <div class="modal-footer">
        </div>
        <!-- End of Dynamic Section -->
        <button title="Close" on:click={toggleModal} class="close_modal">x</button>
        <button title="Close" on:click={toggleModal} class="close_modal left">x</button>

    </div>
</div>


<style lang="scss">
    .debug-wraper {
        direction: ltr;
        text-align: left;
    }
    #cartModal {
        .modal_content {
            .modal-header {
                h1 {
                    text-align: center;
                    margin: auto;
                }
            }

            .modal-body {
                height: 70vh;
                .inner-body {
                    display:flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    overflow-y: scroll;
                    height: 100%;
                    .cart-info {
                        flex: 1;
                        align-self: flex-start;
                        position: sticky;
                        top: 50px;
                        
                        height: calc(100% - 60px);
                        display: flex;
                        flex-direction: column;
                        justify-content: space-evenly;
                        .form-control {
                            input {
                                width: 70%;
                                font-size: 30px;
                            }
                        }

                        .send-btn {
                            width: 80%;
                            border-radius: 35px;
                            font-size: xxx-large;
                            font-weight: bold;
                            transition: all 1s;
                            @include bg-gradient();
 
                        }
                    }

                    .cart-products {
                        flex: 1;
                        align-self: flex-start;
                        position: static;
                        padding-top:50px;
                        
                        .product {
                            cursor: pointer;
                            border-radius: 25px;
                            border: 1px solid black;
                            display:flex;
                            flex-direction: row-reverse;
                            justify-content: flex-end;
                            margin-bottom: 25px;
                            align-items: center;

                            flex:1;
                            flex-grow: 0;
                            flex-shrink: 1;
                            //@include bg-gradient();
                            background-color: #faf8e1;
                            margin-left: 10%;

                            .modal-open-area {
                                width: 100%;
                                display: flex;
                                justify-content: flex-end;
                                flex-direction: row-reverse;
                                align-items: center;
                            }

                            .title {
                                font-size: x-large;
                            }
                            .img-wraper {
                                margin-left: 30px;
                                margin-right: 10px;
                                width: 50px;
                                height: 50px;
                                img {
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                            .delete-product {
                                margin-left: 15px;
                                margin-right: auto;
                                border: none;
                                background: none;
                                &:hover {
                                    border-radius: 9999px;
                                    background-color: red;
                                    color: white;
                                    transform: scale(1.5)
                                }
                            }
                            

                        }
                    }
                }
            }
        }
    }
    
</style>