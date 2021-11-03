<script>    
    import {
userInfoStore,
        _modal_z_index_incrementor
    } from './../../stores/stores';
    import {Input}  from 'sveltestrap';
import { request_login, request_whoAmI } from './../../api/auth'
    let modal_zIndex = 0;
    let isModalOpen;
    let username, password;
    let error_detail = '';
    function login() {
        error_detail = '';
        let response = request_login(username, password);
        response.then(data=> {
            debugger;
            console.log("DATA:", data);
            if(data['detail']) {
                console.log('error');
                error_detail = data['detail']
            }else {
                console.log('success');
                //localStorage.setItem('refresh', data.refresh);
                $userInfoStore.access = data.access;
                $userInfoStore.refresh = data.refresh;
                
                let whoAmI = request_whoAmI();
                whoAmI.then(me=> {
                    console.log('me: ',me);
                    $userInfoStore.me=me;
                    $userInfoStore.isLogin=true;
                })
                toggleModal();
            }
        }).catch(error => console.log('error', error));

    }
    export function toggleModal() {
        isModalOpen = !isModalOpen;
        if (isModalOpen) {
            modal_zIndex = 1200 + (++$_modal_z_index_incrementor * 15);


        }
    }
    export function isOpen() {
        return isModalOpen;
    }

</script>


<div style="z-index: {modal_zIndex};" id="loginModal" class="modal" class:active={isModalOpen}>
    <div style="z-index: {modal_zIndex+5};" class="overlay" on:click={toggleModal}></div>
    <div style="z-index: {modal_zIndex+10};" class="modal_content">
        <div class="modal-header">
            <h1>התחברות</h1>
        </div>

        <div class="modal-body">
            <form action="" method="POST">
                <Input name="username" bind:value={username} placeholder="שם משתמש" type="text" />
                <Input name="password" data="current-password" bind:value={password} placeholder="סיסמא" type="password" />
                <button class="btn btn-dark" on:click|preventDefault={login}>התחבר</button>
                <div>{error_detail}</div>
            </form>
        </div>
            

        <div class="modal-fotter">

        </div>
        <button title="Close" on:click={toggleModal} class="close_modal">x</button>
        <button title="Close" on:click={toggleModal} class="close_modal left">x</button>


    </div>
</div>

<style lang="scss">
    #loginModal {
        .modal_content {
            width: auto;
            .modal-header {
                h1 {
                    margin: auto;
                }
            }
            .modal-body {
                width: auto;
                form {
                    width:100%;
                    min-width: 40vw;
                    display: flex;
                    flex-direction: column;
                    margin:auto;
                    :global(.form-control) { 
                        line-height: 2;
                        margin-bottom: 15px;
                    }
                    .btn {
                        line-height: 1;
                        font-size: xx-large;
                    }
                }
            }
        }
    }
</style>