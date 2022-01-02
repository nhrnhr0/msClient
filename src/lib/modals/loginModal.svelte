<script>    
    import {
userInfoStore,
        _modal_z_index_incrementor
    } from './../../stores/stores';
    import {Input}  from 'sveltestrap';
import { request_login, request_whoAmI } from './../../api/auth';
import {activeModalsStore } from '$lib/modals/modalManager';

    let modal_zIndex = 0;
    let isModalOpen;
    let username, password;
    let error_detail = '';
    function login() {
        error_detail = '';
        let response = request_login(username, password);
        response.then(data=> {
            if(data['detail']) {
                error_detail = data['detail']
            }else if(data['non_field_errors'] && data['non_field_errors'].length > 0) {
                error_detail = data['non_field_errors'][0];
            }else {
                //localStorage.setItem('refresh', data.refresh);
                $userInfoStore.access = data.token;
                
                let whoAmI = request_whoAmI();
                whoAmI.then(me=> {
                    $userInfoStore.me=me;
                    $userInfoStore.isLogin=true;
                    setTimeout(()=> {
                        toggleModal();
                        alert('Login Successful:' + JSON.stringify($userInfoStore));
                    },1);
                })
                
            }
        }).catch(error => console.log('error', error));

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
                <button class="btn btn-dark" on:click|preventDefault={login}>התחבר</button>
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