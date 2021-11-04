<script>    
    import {
        userInfoStore,
        _modal_z_index_incrementor
    } from './../../stores/stores';
    import {Input}  from 'sveltestrap';
import { request_update_user_detail } from './../../api/auth'
import { onDestroy } from 'svelte';
    let modal_zIndex = 0;
    let isModalOpen;
    let error_detail = '';

    function update_user_detail() {
        request_update_user_detail(username,first_name,last_name,old_password,new_password).then((response) => {
            if (response.status == "success") {
                $userInfoStore.me = response;
                toggleModal();
            }else {
                error_detail = response.detail;
            }
        
        });
    }

    let username = '';
    let first_name = '';
    let last_name = '';
    let old_password = '';
    let new_password = '';
    

    let unsub = userInfoStore.subscribe((newValue)=>{
        if(newValue) {
            username = newValue['username'];
            first_name = newValue['first_name'];
            last_name = newValue['last_name'];
            old_password = '';
            new_password = '';
        }
    })

    onDestroy(()=> {
        unsub();
    })

    export function toggleModal() {
        isModalOpen = !isModalOpen;
        if (isModalOpen) {
            modal_zIndex = 1200 + (++$_modal_z_index_incrementor * 15);
            username = $userInfoStore.me['username'];
            first_name = $userInfoStore.me['first_name'];
            last_name = $userInfoStore.me['last_name'];
            old_password = '';
            new_password = '';
            error_detail = '';
        }
    }


    export function isOpen() {
        return isModalOpen;
    }

</script>


<div style="z-index: {modal_zIndex};" id="loginModal" class="modal" class:active={isModalOpen}>
    <div style="z-index: {modal_zIndex+5};" class="overlay" on:click={toggleModal}></div>
    <div style="z-index: {modal_zIndex+10};" class="modal_content">
        {#if $userInfoStore.isLogin }
            <div class="modal-header">
                <h1> 
                    שלום {$userInfoStore.me['first_name']}
                </h1>
            </div>

            <div class="modal-body">
                <!-- 2 accordions,
                    1 for edit profile info
                    and another for change password    
                -->
                                <div class="accordion">
                    <div class="accordion-header">
                        <h3>עריכת פרופיל</h3>
                    </div>
                    <div class="accordion-content">
                        <form action="/update-user-details">
                            <div class="row">
                                <div class="col-md-6">
                                    <label for="username">שם משתמש</label>
                                    <input type="text" class="form-control" id="username" placeholder="שם משתמש" bind:value={username}>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <label for="name">שם פרטי</label>
                                    <input type="text" class="form-control" id="name" placeholder="שם פרטי" bind:value={first_name}>
                                </div>
                            </div><div class="row">
                                <div class="col-md-6">
                                    <label for="last_name">שם משפחה</label>
                                    <input type="text" class="form-control" id="last_name" placeholder="שם משפחה" bind:value={last_name}>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <label for="old_password">סיסמה קיימת</label>
                                    <input type="password" class="form-control" id="old_password" placeholder="סיסמה קיימת" bind:value={old_password} >
                                </div>
                                </div><div class="row">
                                <div class="col-md-6">
                                    <label for="new_password">סיסמה חדשה</label>
                                    <input type="password" class="form-control" id="new_password" placeholder="סיסמה חדשה" bind:value={new_password}>
                                </div>

                                <div class="row">
                                        <div class="col-md-6">
                                            
                                            <button on:click|preventDefault={update_user_detail} class="btn btn-dark">
                                                עדכון פרטים
                                            </button>
                                        </div>
                            </div>

                            <!-- error display -->
                                                        <div class="row">
                                <div class="col-md-6">
                                    <p>{error_detail}</p>
                                </div>
                        </form>
            </div>
            </div>
            </div>

            <div class="modal-fotter">

            </div>
            <button title="Close" on:click={toggleModal} class="close_modal">x</button>
            <button title="Close" on:click={toggleModal} class="close_modal left">x</button>
        {/if}

    </div>
</div>

<style lang="scss">
    .modal-body {

    }
</style>