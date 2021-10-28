<script>

import {productModalStore, _modal_z_index_incrementor} from "./../../stores/stores";
import { cartStore } from "./../../stores/cartStore"
import { STATIC_BASE } from "./../../api/consts";

    let isModalOpen;
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
        delete $cartStore[key];
        $cartStore =$cartStore;
        debugger;
    }

    function open_product_modal(key) {
        debugger;
        let product = $cartStore[key];
        $productModalStore.setProduct(product.albums[0], product.id);
        $productModalStore.toggleModal();
    }
</script>

<div id="cartModal" style="z-index: {modal_zIndex};" class="modal" class:active={isModalOpen}>
    <div class="overlay" style="z-index: {modal_zIndex+5};" on:click={toggleModal}></div>
    <div class="modal_content" style="z-index: {modal_zIndex+10};">
        <div class="modal-header">
            <h1>מוצרים שאהבתי</h1>
        </div>
        <div class="modal-body">
            <div class="inner-body">
                <div class="cart-info">
                    <div class="form-control"><input placeholder="שם:" type="text"></div>
                    <div class="form-control"><input placeholder="אימייל:" type="email"></div>
                    <div class="form-control"><input placeholder="טלפון:" type="phone"></div>
                    <button class="send-btn">שלח</button>
                </div>
                <div class="cart-products">
                    {#if cartStore}
                        {#each Object.keys($cartStore) as key}
                            <div class="product">
                                <button on:click="{delete_product_from_cart(key)}"class="delete-product">X</button>
                                <div class="modal-open-area" on:click={open_product_modal(key)}>
                                    <div class="title">{$cartStore[key].title}</div>
                                    <div class="img-wraper"><img src="{STATIC_BASE}{$cartStore[key].image}" alt="{$cartStore[key].title}"></div>
                                </div>
                            </div>

                        {/each}
                    {/if}

                </div>
            </div>
            
        </div>
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
                        .form-control {
                            padding-bottom: 35px;
                            input {
                                width: 70%;
                                font-size: 30px;
                            }
                        }

                        .send-btn {
                            width: 80%;
                            border-radius: 35px;
                            margin-top: 50px;
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
                            background-color: #fffdd0;
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