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
  import {activeModalsStore } from '$lib/modals/modalManager';
import { request_logout, request_update_user_detail } from './../../api/auth'
import { onDestroy } from 'svelte';
import { apiGetAllUsers } from './../../api/api';
    let modal_zIndex = 0;
    let isModalOpen;
    let error_detail = '';
    function refresh_all_users() {
        if ($userInfoStore.isLogin && $userInfoStore.me && $userInfoStore.me.is_superuser) {
                console.log('asking for apiGetAllUsers');
                apiGetAllUsers().then((response) => {
                    console.log(response);
                    all_users = response;
                });
            }
    }
    
    function update_admin_as_user() {
        if (admin_as_user) {
            $userInfoStore.actAs = all_users.find((user)=> {return user.id == parseInt(admin_as_user)});
        }
    }
    function remove_admin_as_user() {
        $userInfoStore.actAs = undefined;
    }

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
            if(newValue['me']) {
                username = newValue['me'].username;
                email = newValue['me'].email;
                privateCompany = newValue['me'].privateCompany;
                businessName = newValue['me'].businessName;
            }else{
                username = newValue['username'];
                email = newValue['email'];
                privateCompany = newValue['privateCompany'];
                businessName = newValue['businessName'];
            }
            old_password = '';
            new_password = '';
        }
    })

    onDestroy(()=> {
        unsub();
    })
    let all_users = undefined;
    export function toggleModal() {
        isModalOpen = !isModalOpen;
        activeModalsStore.modalToggle('userDetailsModal', isModalOpen);
        if (isModalOpen) {
            modal_zIndex = 1200 + (++$_modal_z_index_incrementor * 15);
            username = $userInfoStore.me['username'];
            email = $userInfoStore.me['email'];
            privateCompany = $userInfoStore.me['privateCompany'];
            businessName = $userInfoStore.me['businessName'];
            old_password = '';
            new_password = '';
            error_detail = '';
            refresh_all_users()
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
                window.location.reload();
                //window.location.href=window.location.href;
                
            });
        }
    export function isOpen() {
        return isModalOpen;
    }
    let admin_as_user;
</script>


<div style="z-index: {modal_zIndex};" id="loginModal" class="modal" class:active={isModalOpen}>
    <div style="z-index: {modal_zIndex+5};" class="overlay" on:click={toggleModal}></div>
    <div style="z-index: {modal_zIndex+10};" class="modal_content">
        {#if $userInfoStore.isLogin }
            <div class="modal-header">
                <button title="Close" on:click={toggleModal} class="close-btn right">x</button>
                <h1> 
                    שלום {$userInfoStore.me['businessName']}
                </h1>
                <button title="Close" on:click={toggleModal} class="close-btn left">x</button>
            </div>

            <div class="modal-body">
                <!-- 2 accordions,
                    1 for edit profile info
                    and another for change password    
                -->
                                <div class="accordion">
                    <div class="accordion-header">
                        
                    </div>
                    <div class="accordion-content">
                        <form action="/update-user-details">
                            <div class="card-row">
                                <div class="card-wraper">
                                    <Card class="">
                                        <CardHeader>
                                        <CardTitle>פרטי עסק</CardTitle>
                                        </CardHeader>
                                        <CardBody>
                                        <CardText>
                                            <div class="info">
                                                <div class="info-title">שם העסק</div>
                                                <div class="info-res">
                                                    <input disabled value={businessName}/>
                                                </div>
                                            </div>
                                            <div class="info">
                                                <div class="info-title">אימייל</div>
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
                                <div class="card-wraper">
                                    <Card class="">
                                        <CardHeader>
                                        <CardTitle>שינוי סיסמא</CardTitle>
                                        </CardHeader>
                                        <CardBody>
                                        <CardText>
                                            <div class="info">
                                                <div class="info-title">שם משתמש</div>
                                                <div class="info-res">
                                                    <input type="text" disabled={true} class="form-control" id="username" placeholder="שם משתמש" bind:value={username}>
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
                                {#if $userInfoStore && $userInfoStore.isLogin && $userInfoStore.me.is_superuser }
                                <div class="card-wraper">
                                    <Card class="">
                                        <CardHeader>
                                        <CardTitle>פרטי אדמין</CardTitle>
                                        </CardHeader>
                                        <CardBody>
                                        <CardText>
                                            <div class="info">
                                                <div class="info-title">בתור משתמש</div>
                                                <div class="info-res">
                                                    <input list="all_users" bind:value={admin_as_user}/>
                                                    <datalist id="all_users">
                                                        {#if all_users != undefined }
                                                            {#each all_users as user}
                                                                <option data-user="{JSON.stringify(user)}" value="{user.id}">{user.username} - {user.businessName}</option>
                                                            {/each}
                                                        {/if}
                                                    </datalist>
                                                    
                                                </div>
                                            </div>
                                                {#if userInfoStore && $userInfoStore.me && $userInfoStore.actAs }
                                                {#if all_users}
                                                    {#each Object.entries($userInfoStore.actAs) as [key, value]}
                                                    <div class="info">

                                                        <div class="info-title">
                                                            <div class="info-title">
                                                                <label for="{key}-field">{key}</label>
                                                            </div>
                                                        </div>
                                                        <div class="info-res">
                                                            <input disabled id="{key}-field" value={value}/>
                                                        </div>
                                                    </div>

                                                    {/each}
                                                {/if}
                                                {/if}
                                            <div class="info">
                                                <div class="info-res">
                                                    <button on:click|preventDefault|stopPropagation={refresh_all_users}>רענן משתמשים</button>
                                                    <button on:click|preventDefault|stopPropagation={update_admin_as_user}>פעל בתור מתשמש</button>
                                                    <button on:click|preventDefault|stopPropagation={remove_admin_as_user}>חזור לאדמין</button>
                                                </div>
                                            </div>
                                        </CardText>
                                        </CardBody>
                                    </Card>
                                </div>
                                {/if}
                            </div>  <!-- row -->
                        </form>
            </div>
            </div>
            </div>

            <div class="modal-fotter">

            </div>
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
    #loginModal {
        
        @media (max-width: 1200px) {
            
            :global(.modal_content) {
                max-height: 90%;
            }
        }
        @media screen and (max-width: 768px) {
            :global(.modal_content) {
                width: 90%;
            }
        }
    }
    
    .modal-body {
        // decrease font-size as screen max-width decreases
        @media screen and (max-width: 600px) {
            font-size: 0.8em;
        }

        .card-row {
            display: flex;
            @media screen and (max-width: 1200px) {
                flex-direction: column;
                
            }
            :global(.card-wraper) {
                flex:1;
                margin:10px;
                :global(.card) {
                    background-color: rgba(235, 235, 235, 0.7);
                    padding:5%;
                    border-radius: 15px;
                    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                    height: 100%;
                    :global(.card-title) {
                        font-size: 1.3em;
                        font-weight: bold;
                        text-decoration: underline;
                    }
                }
            }
        }
        .info {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin-bottom: 10px;
            @media screen and (max-width: 465px) {
                flex-direction: column;
            
                
            }
            .info-res {
                flex:2;
                
            }
            .info-title {
                flex:1;
                width: max-content;
                white-space: nowrap !important;
                padding-left: 10px;
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