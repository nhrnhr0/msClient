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
        //delete $cartStore[key];
        cartStore.removeFromCart(item);
        //$cartStore =$cartStore;
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
    let form_message;
    function cart_submit() {
        if(mform.reportValidity()) {
            let cart_products = [];
            for(let key in $cartStore) {
                let product = $cartStore[key];
                cart_products.push({'id': product.id, 'amount': product.amount});
            }

            let data = {
                name: form_name || '',
                email: form_email || '',
                phone:form_phone || '',
                uuid: get_user_uuid() || '',
                message: form_message || '',
                products: cart_products,
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
                        //$cartStore = {};
                        cartStore.clearCart();
                    }
                
            });
            mform.reset();
        }
    }

    function decrease_product_amount(key) {
        console.log('decrease_product_amount: ', key);
        if($cartStore[key].amount > 1) {
            $cartStore[key].amount--;
        }
    }

    function increase_product_amount(key) {
        console.log('increase_product_amount: ', key);
        if ($cartStore[key].amount < 9999) {
            $cartStore[key].amount++;
        }
    }

    let cart_modal_height = '465'
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
                                <div class="form-control"><textarea bind:value="{form_message}" name="message" required="{false}" placeholder="הודעה:"/>
                                
                                </div>
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
                                <div class="product-amount">
                                    <button on:click|preventDefault="{decrease_product_amount(key)}" class="decrease-amount">-</button>
                                    <input type="number" min="1" max="9999" class="amount-input" name="product_amount" bind:value="{$cartStore[key].amount}" />
                                    <button on:click|preventDefault="{increase_product_amount(key)}" class="increase-amount">+</button>
                                </div>
                                <div class="modal-open-area" title="{$cartStore[key].title}" on:click={open_product_modal(key)}>
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
            height: 70vh;
            display:flex;
            flex-direction: column;
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
                flex:1;
                overflow-y: scroll;
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
                        @media screen and (max-width: 1000px) {
                            flex-direction: column;
                            
                        }
                        .form-control {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            input,textarea {
                                width: 90%;
                                font-size: x-large;
                                border: none;
                                border-radius: 25px;
                                margin-bottom: 10px;
                            }
                            textarea {
                                font-size: 1em;
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
                            > * {
                                height: 50px;
                                //border:1px solid red!important;
                            }

                            .modal-open-area {
                                flex: 1;
                                display: flex;
                                justify-content: flex-end;
                                flex-direction: row-reverse;
                                align-items: center;
                                flex-grow: 1;
                                flex-shrink: 0;
                                ;
                                width: 60%;
                                .title {
                                    flex-grow: 0;
                                    flex-shrink: 1;
                                    flex:1;
                                    font-size: large;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                }
                                .img-wraper {
                                    
                                    margin-left: 10px;
                                    margin-right: 10px;
                                    width: 50px;
                                    height: 50px;
                                    img {
                                        width: 100%;
                                        height: 100%;
                                    }
                                }
                            }

                            
                            .delete-product {
                                //margin-left: 15px;
                                margin-right: 10px;
                                border: none;
                                background: none;
                                
                                height: 50px;
                                width: 20%;
                                flex:1;
                                min-width: 35px;
                                flex-grow: 0;
                                flex-shrink: 1;
                                &:hover, &:focus {
                                    border-bottom-left-radius: 25px;
                                    border-top-left-radius: 25px;
                                    background-color: red;
                                    color: white;
                                }
                            }

                            .product-amount {
                                
                                //width: 50px;
                                height: 50px;
                                border: none;
                                border-radius: 25px;
                                background-color: #faf8e1;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                font-size: x-large;
                                font-weight: bold;
                                transition: all 250ms;
                                //flex:1;
                                
                                &:hover, &:focus {
                                    background-color: #faf8e1;
                                    color: black;
                                    transform: scale(1.5);
                                    width: fit-content;
                                    .amount-input {
                                        width: 70px!important;;
                                    }
                                }
                                .decrease-amount, .increase-amount {
                                    border: none;
                                    background: none;
                                    font-size: x-large;
                                    font-weight: bold;
                                    transition: all 50ms;
                                    &:hover {
                                        //background-color: #faf8e1;
                                        color: black;
                                        transform: scale(1.3)
                                    }
                                }
                                .decrease-amount {
                                    margin-right: 10px;
                                }
                                .increase-amount {
                                    margin-left: 10px;
                                }
                                @media screen and (max-width: 700px) {
                                    .decrease-amount, .increase-amount {
                                        display: none;
                                    }
                                    &:hover, &:focus {
                                        .decrease-amount, .increase-amount {
                                            display:block;
                                        }
                                    }
                                    .modal-open-area {
                                    }
                                }
                                    
                                
                                .amount-input {
                                    width: 60px;
                                    height: 30px;
                                    border: none;
                                    border-radius: 25px;
                                    background-color: #faf8e1;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    font-size: x-large;
                                    font-weight: bold;
                                    //transition: all 1s;
                                    flex:1;
                                    text-align: center;
                                    &:hover {
                                        //background-color: #faf8e1;
                                        //color: black;
                                        //transform: scale(1.1);
                                        
                                    }
                                    /* Chrome, Safari, Edge, Opera */
                                    &::-webkit-outer-spin-button,
                                    &::-webkit-inner-spin-button {
                                        -webkit-appearance: none;
                                        margin: 0;
                                    }

                                    /* Firefox */
                                    &[type=number] {
                                        -moz-appearance: textfield;
                                    }
                                }

                                
                            }
                            

                        }

                        @media screen and (max-width: 1000px) {
                            width: 90%;
                            margin:auto;
                            .product  {
                                margin-left:auto;
                                margin-right:auto;
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