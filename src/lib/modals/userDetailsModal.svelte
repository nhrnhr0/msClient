<script>    
    import {
        userInfoStore,
        _modal_z_index_incrementor
    } from './../../stores/stores';
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
import { request_logout, request_update_user_detail } from './../../api/auth'
import { onDestroy } from 'svelte';
    let modal_zIndex = 0;
    let isModalOpen;
    let error_detail = '';

    function update_user_detail() {
        request_update_user_detail(username,old_password,new_password).then((response) => {
            if (response.status == "success") {
                $userInfoStore.me = response;
                toggleModal();
            }else {
                error_detail = response.detail;
            }
        
        });
    }
    let businessName = '';
    let email = '';
    let username = '';
    let privateCompany = '';
    let old_password = '';
    let new_password = '';
    

    let unsub = userInfoStore.subscribe((newValue)=>{
        if(newValue) {
            username = newValue['username'];
            email = newValue['email'];
            privateCompany = newValue['privateCompany'];
            businessName = newValue['businessName'];
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
            email = $userInfoStore.me['email'];
            privateCompany = $userInfoStore.me['privateCompany'];
            businessName = $userInfoStore.me['businessName'];
            old_password = '';
            new_password = '';
            error_detail = '';
        }
    }

    function logout() {
            request_logout().then((response) => {
                if (response.status === "success") {
                    
                }else if(response.status === "warning"){
                    alert(response.detail);
                }
                toggleModal();
                $userInfoStore = {isLogin:false};
                //window.location.href=window.location.href;
                
            });
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
                    שלום {$userInfoStore.me['businessName']}
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
                                    <Card class="mb-3">
                                        <CardHeader>
                                        <CardTitle>פרטי עסק</CardTitle>
                                        </CardHeader>
                                        <CardBody>
                                        <CardText>
                                            <div class="info">
                                                <div class="info-title">שם עסק בחשבונית</div>
                                                <div class="info-res">
                                                    <input disabled value={businessName}/>
                                                </div>
                                            </div>
                                            <div class="info">
                                                <div class="info-title">מייל</div>
                                                <div class="info-res">
                                                    <input disabled value={email}/>
                                                </div>
                                            </div>
                                            <div class="info">
                                                <div class="info-title">ח.פ.</div>
                                                <div class="info-res">
                                                    <input disabled value={privateCompany}/>
                                                </div>
                                            </div>
                                        </CardText>
                                        </CardBody>
                                    </Card>
                                </div>
                                <div class="col-md-6">
                                    <Card class="mb-3">
                                        <CardHeader>
                                        <CardTitle>פרטי משתמש</CardTitle>
                                        </CardHeader>
                                        <CardBody>
                                        <CardText>
                                            <div class="info">
                                                <div class="info-title">שם משתמש</div>
                                                <div class="info-res">
                                                    <input type="text" class="form-control" id="username" placeholder="שם משתמש" bind:value={username}>
                                                    </div>
                                            </div>
                                            <div class="info">
                                                <div class="info-title">סיסמא קיימת</div>
                                                <div class="info-res">
                                                    <input type="password" class="form-control" id="old_password" placeholder="סיסמה קיימת" bind:value={old_password} >
                                                </div>
                                            </div>
                                            <div class="info">
                                                <div class="info-title">סיסמא חדשה</div>
                                                <div class="info-res">
                                                    <input type="password" class="form-control" id="new_password" placeholder="סיסמה חדשה" bind:value={new_password}>
                                                    </div>
                                            </div>
                                            <div class="info">
                                                <div class="info-title">
                                                    <div class="actions">
                                                        <button on:click|preventDefault={update_user_detail} class="btn btn-dark">
                                                            עדכון פרטים
                                                        </button>
                                                        <button on:click|preventDefault={logout} class="btn btn-danger">
                                                            התנתק
                                                        </button>
                                                    </div>
                                                    <p>{error_detail}</p>
                                                </div>
                                            </div>
                                        </CardText>
                                        </CardBody>
                                    </Card>
                                </div>
                            </div>  <!-- row -->
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
    .modal-header {
        h1 {
            margin:auto;
            padding:15px;
        }
    }
    .modal-body {
        
        :global(.card) {
            background-color: rgba(160, 158, 158, 0.4);
            padding:20px;
            border-radius: 15px;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
            height: 100%;
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
                flex:2;
                
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
    }
</style>