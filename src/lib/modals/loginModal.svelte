<script>    
    import {
albumsJsonStore,
campainsStore,
userInfoStore,
        _modal_z_index_incrementor
    } from './../../stores/stores';
    import { cartStore } from './../../stores/cartStore';
    import {Input}  from 'sveltestrap';
    import Spinner from 'svelte-spinner';
import { request_login, request_whoAmI } from './../../api/auth';
import {activeModalsStore } from '$lib/modals/modalManager';
import { get_album_details } from './../../api/api';

    let modal_zIndex = 0;
    let isModalOpen;
    let username, password;
    let error_detail = '';
    let is_requesting = false;
    async function update_cart_pricess() {
        
        // iterate $cartStore keys and add price to the object's key
        for(let itemIdx in $cartStore) {
            debugger;
            let item = $cartStore[itemIdx];
            let price = item.price;
            console.log('product: ', item);
            console.log('price: ', price);
            
            if (price == 0) {
                //let itemWithPrice = album.filter(item => item.id == item.id);
                let found = false;
                for(let album_idx in item.albums) {
                    let album_id = item.albums[album_idx];
                    let album = await get_album_details(album_id, undefined, true);
                    for (let i = 0; i < album.length; i++) {
                        if (album[i].id == item.id) {
                            price = album[i].price;
                            found = true;
                            break;
                        }
                    }
                    if (found) break;
                }
                //let price = itemWithPrice.price
                $cartStore[itemIdx].price = price
                $cartStore[itemIdx] = {...$cartStore[itemIdx]}
            }
        }
        
        
    }
    function login() {
        is_requesting = true;
        error_detail = '';
        let response = request_login(username, password);
        response.then(async data=> {
            if(data['detail']) {
                error_detail = data['detail']
            }else if(data['non_field_errors'] && data['non_field_errors'].length > 0) {
                error_detail = data['non_field_errors'][0];
            }else {
                //localStorage.setItem('refresh', data.refresh);
                $userInfoStore.access = data.token;
                let me = data.me;
                $userInfoStore.me=me;
                $userInfoStore.isLogin=true;
                update_campains_with_local_data(me.campains)
                if (me.show_prices) {
                    await update_cart_pricess();
                }
                setTimeout(()=> {
                        toggleModal();
                        location.reload();

                    },1);
                /*
                let whoAmI = request_whoAmI();
                whoAmI.then(me=> {
                    
                    setTimeout(()=> {
                        toggleModal();
                    },1);
                    is_requesting = false;
                })
                */
            }
        }).catch(error => console.log('error', error))
        .finally(()=> {
            is_requesting = false;
        });

    }

    function update_campains_with_local_data(campains) {
        let campains_response = campains;
        campainsStore.set(campains_response);
        //let campain_album = campains_response[0].album;
        let temp_albums = $albumsJsonStore;
        for(let i = 0; i < campains_response.length; i++) {
        let campain_album = campains_response[i].album;
        temp_albums.unshift(campain_album);
        }
        albumsJsonStore.set(temp_albums);
    }
    export function toggleModal() {
        isModalOpen = !isModalOpen;
        activeModalsStore.modalToggle('loginModal', isModalOpen);
        if (isModalOpen) {
            modal_zIndex = 1200 + (++$_modal_z_index_incrementor * 15);


        }
    }
    export function isOpen() {
        return isModalOpen;
    }
    let show_password = false;
</script>


<div style="z-index: {modal_zIndex};" id="loginModal" class="modal" class:active={isModalOpen}>
    <div style="z-index: {modal_zIndex+5};" class="overlay" on:click={toggleModal}></div>
    <div style="z-index: {modal_zIndex+10};" class="modal_content">
        <div class="modal-header">
            <button title="Close" on:click={toggleModal} class="close-btn right">x</button>
            <h1>התחברות</h1>
            <button title="Close" on:click={toggleModal} class="close-btn left">x</button>
        </div>

        <div class="modal-body">
            <form action="" method="POST">
                <Input name="username" bind:value={username} placeholder="שם משתמש" type="text" />
                <Input name="password" data="current-password" bind:value={password} placeholder="סיסמא" type="{show_password?'text': 'password'}" />                 
                <!-- checkbox to show password when typing -->
                
                <div class="checkbox form-control">
                    <label>
                        הצג סיסמא
                        <input type="checkbox" style="width: 20px;height: 20px;" bind:checked="{show_password}" />
                    </label>
                </div>
                
                    <button class="btn btn-dark submit-btn" on:click|preventDefault={login}>
                        {#if is_requesting}
                        <div class="loader-wraper">
                            <Spinner
                                size="40"
                                speed="750"
                                color="#A82124"
                                thickness="2"
                                gap="40"
                            />
                        </div>
                        
                        {/if}
                        <div class="text">
                            התחבר
                        </div>  

                    </button>
                
                <div>{error_detail}</div>
            </form>
        </div>
            

        <div class="modal-fotter">

        </div>

    </div>
</div>

<style lang="scss">
    #loginModal {
        
        .modal_content {
            max-width: 876px;
            //width: auto;
            .modal-header {
                h1 {
                    margin: auto;
                }
            }
            .modal-body {
                min-height: 40vh;
                width: auto;
                
                
                display:flex;
                justify-content: center;
                align-items: center;
                direction: ltr;
                form {
                    
                    width:100%;
                    font-weight: 2rem;
                    //min-width: 40vw;
                    display: flex;
                    flex-direction: column;

                    .submit-btn {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: row-reverse;

                    }
                    
                    margin:auto;
                    :global(.form-control) { 
                        line-height: 2;
                        margin-bottom: 25px;
                        font-size: 2rem;
                        &::-webKit-input-placeholder { /* WebKit browsers */
                            text-align: center;
                        }
                        &::-moz-placeholder { /* Mozilla Firefox 4 to 18 */
                            text-align: center;
                        }
                        &::-moz-placeholder { /* Mozilla Firefox 19+ but I'm not sure about working */
                            text-align: center;
                        }
                        &:-ms-input-placeholder { /* Internet Explorer 10+ */
                            direction: rtl;
                        }
                    }
                    .btn {
                        line-height: 1;
                        font-size: 3rem;
                    }
                }
            }
        }
    }
</style>