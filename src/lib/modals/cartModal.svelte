<script>

import {all_swipers, cartModalStore, productModalStore, successModalStore, userInfoStore, _modal_z_index_incrementor} from "./../../stores/stores";
import { cartStore } from "./../../stores/cartStore"
import { CLOUDINARY_URL, STATIC_BASE, SUBMIT_CART_URL } from "./../../api/consts";
import { subscribe } from "svelte/internal";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardSubtitle,
    CardText,
    CardTitle
  } from 'sveltestrap';
import { get_user_uuid, submit_cart_form } from "./../../api/api"
import { logStore } from "./../../stores/logStore";

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
        
        let item = $cartStore[key];
        let swiper = $all_swipers[item.albums[0]];
        delete $cartStore[key];
        $cartStore =$cartStore;
        swiper.fixDups();
        logStore.addLog(
                            {
                                'a': 'הסר מהעגלה',
                                't': 'remove from cart',
                                'f': {
                                    'type':'cart',
                                },
                                'w':{
                                    'type':'product',
                                    'id':item.id,
                                    'ti':item.title, 
                                }
                            }
                            );
    }

    function open_product_modal(key) {
        let product = $cartStore[key];
        $productModalStore.setProduct(product.albums[0], product.id);
        $productModalStore.toggleModal();

        logStore.addLog(
                            {
                                'a': 'פתיחת מוצר מעגלת קניות',
                                't': 'open product',
                                'f': {
                                    'type': 'cart',
                                },
                                'w':{
                                    'type':'product',
                                    'id':product.id,
                                    'ti':product.title, 
                                }
                            }
                            );
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
            logStore.addLog(
                            {
                                'a': 'שליחת הזמנה',
                                't': 'submit order',
                                'f': {
                                    'type': 'cart',
                                },
                                'w':{
                                    'type':'order',
                                    'data':data,
                                }
                            }
                            );
            let response = submit_cart_form(data);
            response.then((data_json)=> {
                
                    if(data_json['status'] == 'success') {
                        $cartModalStore.toggleModal();
                        $successModalStore.toggleModal();
                        $cartStore = {};
                    }
                
            });
            mform.reset();
        }
    }
</script>

<div id="cartModal" style="z-index: {modal_zIndex};" class="modal" class:active={isModalOpen}>
    <div class="overlay" style="z-index: {modal_zIndex+5};" on:click={toggleModal}></div>
    <div class="modal_content" style="z-index: {modal_zIndex+10};">
        <div class="modal-header">
            <button title="Close" on:click={toggleModal} class="close-btn right">x</button>
            <h1>מוצרים שאהבתי</h1>
            <button title="Close" on:click={toggleModal} class="close-btn left">x</button>
        </div>
        
        <div class="modal-body">
            <div class="inner-body">
                <div class="cart-info">
                    {#if $userInfoStore}
                        {#if $userInfoStore.isLogin}
                        <Card>
                            <CardHeader>
                            <CardTitle>פרטי העסק</CardTitle>
                            </CardHeader>
                            <CardBody>
                            <CardText>
                                <div class="info">
                                    <div class="info-title">שם העסק</div>
                                    <div class="info-res">
                                        <input disabled value={$userInfoStore.me['businessName']}/>
                                    </div>
                                </div>
                                <div class="info">
                                    <div class="info-title">אימייל</div>
                                    <div class="info-res" style="direction:ltr">
                                        <input disabled value={$userInfoStore.me['email']}/>
                                    </div>
                                </div>
                                <div class="info">
                                    <div class="info-title">ח.פ.</div>
                                    <div class="info-res">
                                        <input disabled value={$userInfoStore.me['privateCompany']}/>
                                    </div>
                                </div>
                            </CardText>
                            </CardBody>
                        </Card>
                        
                            
                        {/if}
                        <Card>
                            <CardHeader>
                                <CardTitle>פרטי השולח 
                                {$userInfoStore.isLogin ? '(לא חובה)' : ''}
                                </CardTitle>
                            </CardHeader>
                            <form bind:this={mform} method="POST" action="{SUBMIT_CART_URL}" >
                                <div class="form-control"><input bind:value="{form_name}" name="name" required="{!($userInfoStore && $userInfoStore.isLogin)}" placeholder="שם:" type="text"></div>
                                <div class="form-control"><input bind:value="{form_email}" name="email" placeholder="אימייל:" type="email"></div>
                                <div class="form-control"><input bind:value="{form_phone}" name="tel" required="{!($userInfoStore && $userInfoStore.isLogin)}" placeholder="טלפון:" type="tel"></div>
                                <div class="form-control">
                                    <button class="send-btn" on:click|preventDefault="{cart_submit}">שלח</button>
                                </div>
                            </form>
                        </Card>
                    {/if}
                </div>
                <div class="cart-products">
                    {#if $cartStore && Object.keys($cartStore).length > 0}
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
                    {:else}
                        <div class="empty-cart">
                            <div>עוד לא הוספת מוצרים לסל</div>
                            <div>לחץ על כפתור ההוסף ליד כל מוצר כדי להוסיף אותו</div>
                            <div>אין מה לדאוג, אין התחייבות כספית בשליחת טופס זה</div>
                        </div>
                    {/if}

                </div>
                
            </div>
        </div>
        <div class="modal-footer"></div>
        <!-- End of Dynamic Section -->

    </div>
</div>


<style lang="scss">
    .empty-cart {
        display: flex;
        flex-direction: column;
        justify-content: center;
        
        height: 100%;
        width: 100%;
        font-size: 1.5rem;
        
    }
:global(.card) {
            padding:10px;
            font-size: 1.4em;
            :global(.card-title) {
                font-size: 1.3em;
                font-weight: bold;
                text-decoration: underline;
            }
        }
        .info {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin-bottom: 10px;
            .info-res {
                flex:3;
                input {
                    width: 95%;
                }
            }
            .info-title {
                flex:1;
                .actions {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    .btn {
                        margin-left: 10px;
                    }
                }
            }
        }

    .debug-wraper {
        direction: ltr;
        text-align: left;
    }
    #cartModal {
        .modal_content {
            .modal-header {
                padding:0px;
                .close-btn {

                }
                h1 {
                    text-align: center;
                    margin: auto;
                }
            }

            .modal-body {
                //height: 70vh;
                .inner-body {
                    display:flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    //overflow-y: scroll;
                    height: 100%;
                    @media screen and (max-width: 1000px) {
                        flex-direction: column;
                    }
                    @media screen and (max-width: 870px) {
                            flex-direction: column-reverse;
                        }
                    .cart-info {
                        flex: 1;
                        align-self: flex-start;
                        position: sticky;
                        top: 50px;
                        
                        height: calc(100% - 60px);
                        display: flex;
                        flex-direction: column;
                        justify-content: space-evenly;

                        @media screen and (max-width: 1000px) {
                            
                            flex-direction: row;
                            width: 100%;
                        }
                        @media screen and (max-width: 870px) {
                            flex-direction: column;
                            
                        }
                        .form-control {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            input {
                                width: 90%;
                                font-size: x-large;
                                border: none;
                                border-radius: 25px;
                                margin-bottom: 10px;
                            }
                        }

                        .send-btn {
                            margin-top: 15px;
                            width: 70%;
                            border-radius: 35px;
                            font-size: xx-large;
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
                            //background-color: #faf8e1;
                            background-color: #ffffff;
                            margin-left: 10%;
                            &:hover, &:focus {
                                background-color: rgb(204, 204, 204);
                            }

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

            .modal-footer {
                @include bg-gradient();
            }
        }
    }
    
</style>